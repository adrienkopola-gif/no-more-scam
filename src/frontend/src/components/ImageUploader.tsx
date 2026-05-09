import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Image as ImageIcon, Upload, X } from "lucide-react";
import type React from "react";
import { useRef, useState } from "react";
import { ExternalBlob } from "../backend";

interface ImageUploaderProps {
  onUploadComplete: (blob: ExternalBlob) => void;
  onClear?: () => void;
  maxSizeMB?: number;
}

export default function ImageUploader({
  onUploadComplete,
  onClear,
  maxSizeMB = 5,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = async (file: File) => {
    setError(null);

    if (!file.type.match(/^image\/(jpeg|png)$/)) {
      setError("Only PNG and JPG files are allowed.");
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size must be under ${maxSizeMB}MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    setIsUploading(true);
    setProgress(0);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      const blob = ExternalBlob.fromBytes(bytes).withUploadProgress(
        (percentage) => {
          setProgress(percentage);
        },
      );
      setIsUploading(false);
      setProgress(100);
      onUploadComplete(blob);
    } catch (err) {
      setIsUploading(false);
      setError(err instanceof Error ? err.message : "Upload failed");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleClear = () => {
    setPreview(null);
    setProgress(0);
    setError(null);
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onClear?.();
  };

  return (
    <div className="space-y-2">
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-40 object-cover rounded-lg border border-border"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-6 w-6"
            onClick={handleClear}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          }`}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ")
              fileInputRef.current?.click();
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <ImageIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Drag & drop or{" "}
            <span className="text-primary font-medium">browse</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            PNG, JPG up to {maxSizeMB}MB
          </p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg"
        className="hidden"
        onChange={handleInputChange}
      />

      {isUploading && (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Upload className="h-3 w-3 animate-pulse" />
            <span>Uploading... {progress}%</span>
          </div>
          <Progress value={progress} className="h-1" />
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
