import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Merchant } from "../backend";
import { useEvaluateMerchant } from "../hooks/useQueries";

interface Props {
  merchant: Merchant;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MerchantEvaluationDialog({
  merchant,
  open,
  onOpenChange,
}: Props) {
  const evaluateMerchant = useEvaluateMerchant();
  const [honest, setHonest] = useState(false);
  const [comment, setComment] = useState("");
  const [alreadyEvaluated, setAlreadyEvaluated] = useState(false);

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setHonest(false);
      setComment("");
      setAlreadyEvaluated(false);
    }, 300);
  };

  const handleSubmit = async () => {
    if (!honest) return;
    try {
      await evaluateMerchant.mutateAsync({
        merchantId: merchant.id,
        comment: comment.trim() || null,
      });
      toast.success("Merci pour votre évaluation !");
      handleClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      if (
        msg.toLowerCase().includes("already") ||
        msg.toLowerCase().includes("déjà")
      ) {
        setAlreadyEvaluated(true);
      } else {
        toast.error("Erreur lors de l'évaluation.");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md" data-ocid="evaluation.dialog">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-[oklch(0.74_0.12_55)]" />
            Évaluer {merchant.name}
          </DialogTitle>
        </DialogHeader>

        {alreadyEvaluated ? (
          <div className="py-6 text-center space-y-3">
            <span className="text-4xl">🔒</span>
            <p className="font-semibold">Vous avez déjà évalué ce commerçant</p>
            <p className="text-sm text-muted-foreground">
              Chaque utilisateur ne peut évaluer un commerçant qu'une seule
              fois.
            </p>
            <Button
              onClick={handleClose}
              variant="outline"
              className="w-full"
              data-ocid="evaluation.close_button"
            >
              Fermer
            </Button>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="p-4 rounded-lg bg-[oklch(0.65_0.18_150/0.1)] border border-[oklch(0.65_0.18_150/0.25)]">
              <label
                htmlFor="eval-honest"
                className="flex items-start gap-3 cursor-pointer"
              >
                <Checkbox
                  id="eval-honest"
                  checked={honest}
                  onCheckedChange={(v) => setHonest(!!v)}
                  className="mt-0.5"
                  data-ocid="evaluation.honest_checkbox"
                />
                <span className="text-sm leading-relaxed">
                  ✅ <strong>Les prix étaient honnêtes</strong> — j'ai acheté
                  chez ce commerçant et il pratique des prix justes.
                </span>
              </label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="eval-comment">Commentaire (optionnel)</Label>
              <Textarea
                id="eval-comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Ex: Excellent accueil, tapis de qualité à prix raisonnable, très honnête sur la provenance..."
                rows={3}
                data-ocid="evaluation.comment_textarea"
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
                data-ocid="evaluation.cancel_button"
              >
                Annuler
              </Button>
              <Button
                type="button"
                disabled={!honest || evaluateMerchant.isPending}
                onClick={handleSubmit}
                className="flex-1"
                data-ocid="evaluation.submit_button"
              >
                {evaluateMerchant.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Envoi...
                  </>
                ) : (
                  "Soumettre mon évaluation"
                )}
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Une seule évaluation par commerçant — votre témoignage aide les
              autres voyageurs.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
