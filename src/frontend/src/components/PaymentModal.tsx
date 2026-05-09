import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertCircle, CreditCard, Loader2 } from "lucide-react";
import React, { useState } from "react";
import {
  type ShoppingItem,
  useCreateCheckoutSession,
} from "../hooks/useCreateCheckoutSession";

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  packName: string;
  priceInCents: bigint;
  description: string;
}

export default function PaymentModal({
  open,
  onOpenChange,
  packName,
  priceInCents,
  description,
}: PaymentModalProps) {
  const {
    mutateAsync: createCheckoutSession,
    isPending,
    error,
  } = useCreateCheckoutSession();
  const [localError, setLocalError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setLocalError(null);
    try {
      const items: ShoppingItem[] = [
        {
          productName: packName,
          productDescription: description,
          priceInCents,
          currency: "eur",
          quantity: 1n,
        },
      ];
      const session = await createCheckoutSession(items);
      if (!session?.url) {
        throw new Error("Session URL manquante");
      }
      window.location.href = session.url;
    } catch (err) {
      setLocalError(
        err instanceof Error ? err.message : "Une erreur est survenue",
      );
    }
  };

  const displayError =
    localError || (error instanceof Error ? error.message : null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-amber-500" />
            Paiement sécurisé
          </DialogTitle>
          <DialogDescription>
            Vous allez être redirigé vers Stripe pour finaliser votre achat.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="bg-muted rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">{packName}</span>
              <span className="font-bold text-amber-600">
                {(Number(priceInCents) / 100).toFixed(2)} €
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>

          {displayError && (
            <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 rounded-lg p-3">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{displayError}</span>
            </div>
          )}

          <Button
            onClick={handleCheckout}
            disabled={isPending}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Redirection...
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4 mr-2" />
                Payer maintenant
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
