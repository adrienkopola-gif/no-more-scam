import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, CheckCircle, Crown } from "lucide-react";
import React from "react";

export default function PaymentSuccess() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleContinue = () => {
    queryClient.invalidateQueries({ queryKey: ["premiumStatus"] });
    queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="relative inline-flex">
          <CheckCircle className="h-20 w-20 text-green-500" />
          <Crown className="h-8 w-8 text-amber-400 absolute -top-2 -right-2" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            Paiement réussi !
          </h1>
          <p className="text-muted-foreground">
            Félicitations ! Vous êtes maintenant membre Premium. Profitez de
            tous les avantages exclusifs.
          </p>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/20 rounded-xl p-4 space-y-2">
          <h3 className="font-semibold text-amber-700 dark:text-amber-400">
            Vos avantages Premium :
          </h3>
          <ul className="text-sm text-amber-600 dark:text-amber-300 space-y-1 text-left">
            <li>✓ Prix locaux des produits artisanaux</li>
            <li>✓ Itinéraires de transport détaillés</li>
            <li>✓ Conseils de négociation exclusifs</li>
          </ul>
        </div>

        <Button
          onClick={handleContinue}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white"
        >
          Accéder au contenu Premium
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
