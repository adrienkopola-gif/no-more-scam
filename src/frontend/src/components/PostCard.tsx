import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  MessageSquare,
  Pencil,
  Send,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  User,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  type Post,
  useAddComment,
  useDeletePost,
  useGetComments,
  useUpdatePost,
  useVoteFairDeal,
  useVoteScam,
} from "../hooks/useQueries";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const { identity } = useInternetIdentity();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitre, setEditTitre] = useState(post.titre);
  const [editContent, setEditContent] = useState(post.content);

  const { data: comments = [] } = useGetComments(post.id);
  const addComment = useAddComment();
  const voteScam = useVoteScam();
  const voteFairDeal = useVoteFairDeal();
  const deletePost = useDeletePost();
  const updatePost = useUpdatePost();

  const currentPrincipal = identity?.getPrincipal().toString();
  const isAuthor = currentPrincipal
    ? post.author.toString() === currentPrincipal
    : false;
  const hasVotedScam = currentPrincipal
    ? post.scamVotes.some((p) => p.toString() === currentPrincipal)
    : false;
  const hasVotedFair = currentPrincipal
    ? post.fairDealVotes.some((p) => p.toString() === currentPrincipal)
    : false;

  const handleVoteScam = async () => {
    if (!identity || hasVotedScam) return;
    try {
      await voteScam.mutateAsync(post.id);
    } catch {
      // ignore
    }
  };

  const handleVoteFair = async () => {
    if (!identity || hasVotedFair) return;
    try {
      await voteFairDeal.mutateAsync(post.id);
    } catch {
      // ignore
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !identity) return;
    try {
      await addComment.mutateAsync({
        postId: post.id,
        content: commentText.trim(),
      });
      setCommentText("");
    } catch {
      // ignore
    }
  };

  const handleDelete = async () => {
    try {
      await deletePost.mutateAsync(post.id);
    } catch {
      // ignore
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitre.trim() || !editContent.trim()) return;
    try {
      await updatePost.mutateAsync({
        postId: post.id,
        newTitre: editTitre.trim(),
        newContent: editContent.trim(),
      });
      setIsEditing(false);
    } catch {
      // ignore
    }
  };

  const imageUrl = post.imageBlob ? post.imageBlob.getDirectURL() : null;

  const experienceBadgeVariant =
    post.experience === "scam"
      ? "destructive"
      : post.experience === "fair"
        ? "default"
        : "secondary";

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
      {imageUrl && (
        <img src={imageUrl} alt="Post" className="w-full h-48 object-cover" />
      )}
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground">{post.titre}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-muted-foreground">
                {post.ville}
              </span>
              <Badge variant={experienceBadgeVariant} className="text-xs">
                {post.categorie}
              </Badge>
              {post.experience && (
                <Badge
                  variant={
                    post.experience === "scam" ? "destructive" : "outline"
                  }
                  className="text-xs"
                >
                  {post.experience === "scam"
                    ? "⚠️ Scam"
                    : post.experience === "fair"
                      ? "✅ Fair Deal"
                      : post.experience}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            {isAuthor && (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-muted-foreground hover:text-primary"
                  aria-label="Modifier"
                  data-ocid="post.edit_button"
                  onClick={() => {
                    setEditTitre(post.titre);
                    setEditContent(post.content);
                    setIsEditing(true);
                  }}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                  aria-label="Supprimer"
                  data-ocid="post.delete_button"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </>
            )}
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <User className="h-3 w-3" />
              <span>{post.author.toString().slice(0, 8)}...</span>
            </div>
          </div>
        </div>

        {/* Delete confirmation */}
        {showDeleteConfirm && (
          <div
            className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 space-y-2"
            data-ocid="post.dialog"
          >
            <p className="text-sm font-medium text-destructive">
              Supprimer cette publication ?
            </p>
            <p className="text-xs text-muted-foreground">
              Cette action est irréversible.
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="text-xs h-7"
                data-ocid="post.confirm_button"
                onClick={handleDelete}
                disabled={deletePost.isPending}
              >
                {deletePost.isPending ? (
                  <Loader2 className="h-3 w-3 animate-spin mr-1" />
                ) : null}
                Supprimer
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs h-7"
                data-ocid="post.cancel_button"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Annuler
              </Button>
            </div>
          </div>
        )}

        {/* Edit form */}
        {isEditing ? (
          <form
            onSubmit={handleEditSave}
            className="space-y-2 pt-1"
            data-ocid="post.editor"
          >
            <Input
              value={editTitre}
              onChange={(e) => setEditTitre(e.target.value)}
              placeholder="Titre"
              className="text-sm h-8"
              data-ocid="post.input"
            />
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="Contenu"
              rows={3}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
            />
            <div className="flex gap-2">
              <Button
                type="submit"
                size="sm"
                className="text-xs h-7"
                data-ocid="post.save_button"
                disabled={updatePost.isPending}
              >
                {updatePost.isPending ? (
                  <Loader2 className="h-3 w-3 animate-spin mr-1" />
                ) : null}
                Enregistrer
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs h-7"
                data-ocid="post.cancel_button"
                onClick={() => setIsEditing(false)}
              >
                Annuler
              </Button>
            </div>
          </form>
        ) : (
          <p className="text-sm text-foreground/80">{post.content}</p>
        )}

        <div className="flex items-center gap-2 pt-1">
          <Button
            variant={hasVotedScam ? "destructive" : "outline"}
            size="sm"
            onClick={handleVoteScam}
            disabled={!identity || voteScam.isPending}
            className="flex items-center gap-1 text-xs"
          >
            {voteScam.isPending ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <ThumbsDown className="h-3 w-3" />
            )}
            Scam ({post.scamVotes.length})
          </Button>
          <Button
            variant={hasVotedFair ? "default" : "outline"}
            size="sm"
            onClick={handleVoteFair}
            disabled={!identity || voteFairDeal.isPending}
            className="flex items-center gap-1 text-xs"
          >
            {voteFairDeal.isPending ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <ThumbsUp className="h-3 w-3" />
            )}
            Fair Deal ({post.fairDealVotes.length})
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1 text-xs ml-auto"
          >
            <MessageSquare className="h-3 w-3" />
            {comments.length} Commentaires
          </Button>
        </div>

        {showComments && (
          <div className="space-y-3 pt-2 border-t border-border">
            {comments.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-2">
                Aucun commentaire.
              </p>
            ) : (
              <div className="space-y-2">
                {comments.map((comment) => (
                  <div
                    key={comment.id.toString()}
                    className="bg-muted rounded-lg p-2"
                  >
                    <div className="flex items-center gap-1 mb-1">
                      <User className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {comment.author.toString().slice(0, 8)}...
                      </span>
                    </div>
                    <p className="text-xs text-foreground">{comment.content}</p>
                  </div>
                ))}
              </div>
            )}
            {identity && (
              <form onSubmit={handleAddComment} className="flex gap-2">
                <Input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Ajouter un commentaire..."
                  className="text-xs h-8"
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={addComment.isPending || !commentText.trim()}
                >
                  {addComment.isPending ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Send className="h-3 w-3" />
                  )}
                </Button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
