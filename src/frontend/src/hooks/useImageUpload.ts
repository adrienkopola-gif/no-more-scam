import { useState } from "react";
import { ExternalBlob } from "../backend";

export interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  uploadedBlob: ExternalBlob | null;
}

export function useImageUpload() {
  const [state, setState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    uploadedBlob: null,
  });

  const upload = async (file: File): Promise<ExternalBlob | null> => {
    setState({
      isUploading: true,
      progress: 0,
      error: null,
      uploadedBlob: null,
    });
    try {
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      const blob = ExternalBlob.fromBytes(bytes).withUploadProgress(
        (percentage) => {
          setState((prev) => ({ ...prev, progress: percentage }));
        },
      );
      setState({
        isUploading: false,
        progress: 100,
        error: null,
        uploadedBlob: blob,
      });
      return blob;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Upload failed";
      setState({
        isUploading: false,
        progress: 0,
        error: errorMessage,
        uploadedBlob: null,
      });
      return null;
    }
  };

  const reset = () => {
    setState({
      isUploading: false,
      progress: 0,
      error: null,
      uploadedBlob: null,
    });
  };

  return { ...state, upload, reset };
}
