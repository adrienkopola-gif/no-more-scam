import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { Home, RefreshCw, XCircle } from "lucide-react";
import React from "react";

export default function PaymentFailure() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <XCircle className="h-20 w-20 text-destructive mx-auto" />

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            Paiement échoué
          </h1>
          <p className="text-muted-foreground">
            Votre paiement n'a pas pu être traité. Aucun montant n'a été débité.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={() => navigate({ to: "/premium-shop" })}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Réessayer
          </Button>
          <Button variant="outline" onClick={() => navigate({ to: "/" })}>
            <Home className="h-4 w-4 mr-2" />
            Retour à l'accueil
          </Button>
        </div>
      </div>
    </div>
  );
}
