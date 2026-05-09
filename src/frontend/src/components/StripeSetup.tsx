import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Settings } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useActor } from "../hooks/useActor";

export default function StripeSetup() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [secretKey, setSecretKey] = useState("");
  const [countries, setCountries] = useState("US,CA,GB,FR,DE,ES,IT,MA");

  const { data: isConfigured } = useQuery({
    queryKey: ["stripeConfigured"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isStripeConfigured();
    },
    enabled: !!actor,
  });

  useEffect(() => {
    if (isConfigured === false) {
      setOpen(true);
    }
  }, [isConfigured]);

  const { mutate: saveConfig, isPending } = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not available");
      const allowedCountries = countries
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);
      await actor.setStripeConfiguration({ secretKey, allowedCountries });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stripeConfigured"] });
      setOpen(false);
    },
  });

  if (isConfigured) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuration Stripe
          </DialogTitle>
          <DialogDescription>
            Configurez Stripe pour activer les paiements dans l'application.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="secretKey">Clé secrète Stripe</Label>
            <Input
              id="secretKey"
              type="password"
              placeholder="sk_..."
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="countries">
              Pays autorisés (séparés par virgule)
            </Label>
            <Input
              id="countries"
              placeholder="US,CA,GB,FR"
              value={countries}
              onChange={(e) => setCountries(e.target.value)}
            />
          </div>
          <Button
            onClick={() => saveConfig()}
            disabled={isPending || !secretKey}
            className="w-full"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Enregistrement...
              </>
            ) : (
              "Enregistrer la configuration"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
