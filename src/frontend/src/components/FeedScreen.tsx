import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, MessageSquare, Plus, Users } from "lucide-react";
import type React from "react";
import { useState } from "react";
import type { ExternalBlob } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useCreatePost, useGetAllPosts } from "../hooks/useQueries";
import ImageUploader from "./ImageUploader";
import PostCard from "./PostCard";

export default function FeedScreen() {
  const { identity } = useInternetIdentity();
  const { data: posts = [], isLoading } = useGetAllPosts();
  const createPost = useCreatePost();

  const [open, setOpen] = useState(false);
  const [titre, setTitre] = useState("");
  const [content, setContent] = useState("");
  const [ville, setVille] = useState("");
  const [experience, setExperience] = useState("");
  const [categorie, setCategorie] = useState("");
  const [imageBlob, setImageBlob] = useState<ExternalBlob | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titre || !content || !ville || !experience || !categorie) return;
    try {
      await createPost.mutateAsync({
        content,
        ville,
        titre,
        experience,
        categorie,
        imageBlob,
      });
      setOpen(false);
      setTitre("");
      setContent("");
      setVille("");
      setExperience("");
      setCategorie("");
      setImageBlob(null);
    } catch {
      // error handled by mutation
    }
  };

  const sortedPosts = [...posts].sort(
    (a, b) => Number(b.timestamp) - Number(a.timestamp),
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-bold">Community Feed</h1>
        </div>
        {identity && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Share Experience
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Share Your Experience</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="titre">Title</Label>
                  <Input
                    id="titre"
                    value={titre}
                    onChange={(e) => setTitre(e.target.value)}
                    placeholder="Brief title of your experience"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ville">City</Label>
                  <Input
                    id="ville"
                    value={ville}
                    onChange={(e) => setVille(e.target.value)}
                    placeholder="e.g. Marrakech, Fès..."
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="categorie">Category</Label>
                  <Select
                    value={categorie}
                    onValueChange={setCategorie}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="shopping">Shopping</SelectItem>
                      <SelectItem value="transport">Transport</SelectItem>
                      <SelectItem value="restaurant">Restaurant</SelectItem>
                      <SelectItem value="accommodation">
                        Accommodation
                      </SelectItem>
                      <SelectItem value="tour">Tour / Guide</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience Type</Label>
                  <Select
                    value={experience}
                    onValueChange={setExperience}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Was it a scam or fair?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scam">
                        Scam / Bad Experience
                      </SelectItem>
                      <SelectItem value="fair">
                        Fair Deal / Good Experience
                      </SelectItem>
                      <SelectItem value="neutral">Neutral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Description</Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Describe your experience in detail..."
                    rows={4}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Photo (optional)</Label>
                  <ImageUploader
                    onUploadComplete={(blob) => setImageBlob(blob)}
                    onClear={() => setImageBlob(null)}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      createPost.isPending ||
                      !titre ||
                      !content ||
                      !ville ||
                      !experience ||
                      !categorie
                    }
                  >
                    {createPost.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Posting...
                      </>
                    ) : (
                      "Post"
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : sortedPosts.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>No posts yet. Be the first to share your experience!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedPosts.map((post) => (
            <PostCard key={post.id.toString()} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
