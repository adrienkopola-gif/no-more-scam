import { Button } from "@/components/ui/button";
import { Crown, Lock, Star } from "lucide-react";
import type React from "react";
import { useCheckPremium } from "../hooks/useCheckPremium";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface PremiumGateProps {
  children: React.ReactNode;
  onUpgrade?: () => void;
  featureName?: string;
}

export default function PremiumGate({
  children,
  onUpgrade,
  featureName = "cette fonctionnalité",
}: PremiumGateProps) {
  const { identity } = useInternetIdentity();
  const { data: isPremium, isLoading } = useCheckPremium();

  if (!identity) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] p-8 text-center">
        <Lock className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Connexion requise</h3>
        <p className="text-muted-foreground text-sm">
          Connectez-vous pour accéder à {featureName}.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (isPremium) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-8 text-center space-y-4">
      <div className="relative">
        <Lock className="h-16 w-16 text-amber-500" />
        <Crown className="h-6 w-6 text-amber-400 absolute -top-2 -right-2" />
      </div>
      <h3 className="text-xl font-bold">Contenu Premium</h3>
      <p className="text-muted-foreground max-w-sm">
        Débloquez {featureName} avec un abonnement Premium et accédez à tous les
        avantages exclusifs.
      </p>
      <ul className="text-sm text-left space-y-1 text-muted-foreground">
        <li className="flex items-center gap-2">
          <Star className="h-3 w-3 text-amber-500" /> Prix locaux des produits
          artisanaux
        </li>
        <li className="flex items-center gap-2">
          <Star className="h-3 w-3 text-amber-500" /> Itinéraires de transport
          détaillés
        </li>
        <li className="flex items-center gap-2">
          <Star className="h-3 w-3 text-amber-500" /> Conseils de négociation
          exclusifs
        </li>
      </ul>
      {onUpgrade && (
        <Button
          onClick={onUpgrade}
          className="bg-amber-500 hover:bg-amber-600 text-white"
        >
          <Crown className="h-4 w-4 mr-2" />
          Passer Premium
        </Button>
      )}
    </div>
  );
}
