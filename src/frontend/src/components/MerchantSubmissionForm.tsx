import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { Camera, Loader2, Store } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { useSubmitMerchant } from "../hooks/useQueries";

export const MERCHANT_CATEGORIES = [
  "Artisanat & Décoration",
  "Tapis & Tissus",
  "Épices & Herbes",
  "Cuir & Maroquinerie",
  "Céramique & Poterie",
  "Bijoux & Accessoires",
  "Vêtements & Mode",
  "Alimentation & Cuisine",
  "Huiles & Cosmétiques",
  "Bois & Sculpture",
  "Musique & Instruments",
  "Autre",
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MerchantSubmissionForm({ open, onOpenChange }: Props) {
  const submitMerchant = useSubmitMerchant();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [quartier, setQuartier] = useState("");
  const [mapsLink, setMapsLink] = useState("");
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const canSubmit =
    name.trim() &&
    category &&
    city.trim() &&
    quartier.trim() &&
    mapsLink.trim() &&
    isValidUrl(mapsLink);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    try {
      const merchant = await submitMerchant.mutateAsync({
        name: name.trim(),
        category,
        city: city.trim(),
        quartier: quartier.trim(),
        mapsLink: mapsLink.trim(),
      });
      setSubmittedCode(merchant.code);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Erreur lors de la soumission.",
      );
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setName("");
      setCategory("");
      setCity("");
      setQuartier("");
      setMapsLink("");
      setSubmittedCode(null);
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg" data-ocid="submit_merchant.dialog">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Store className="h-5 w-5 text-primary" />
            Soumettre une boutique
          </DialogTitle>
        </DialogHeader>

        {submittedCode ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[oklch(0.65_0.18_150/0.15)] flex items-center justify-center mx-auto">
              <span className="text-3xl">✅</span>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-lg">Boutique soumise !</h3>
              <p className="text-muted-foreground text-sm">
                Votre boutique a été soumise avec succès. Code attribué :
              </p>
              <div className="font-mono font-bold text-xl text-primary bg-primary/10 rounded-lg px-4 py-2 inline-block">
                {submittedCode}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Conservez ce code — les touristes pourront l'utiliser pour
                retrouver votre boutique.
              </p>
            </div>
            <Button
              onClick={handleClose}
              className="w-full"
              data-ocid="submit_merchant.close_button"
            >
              Fermer
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sm-name">Nom de la boutique *</Label>
              <Input
                id="sm-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Maison des Épices El Koutoubia"
                required
                data-ocid="submit_merchant.name_input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sm-category">Catégorie *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger
                  id="sm-category"
                  data-ocid="submit_merchant.category_select"
                >
                  <SelectValue placeholder="Choisir une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {MERCHANT_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="sm-city">Ville *</Label>
                <Input
                  id="sm-city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Ex: Marrakech"
                  required
                  data-ocid="submit_merchant.city_input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sm-quartier">Quartier *</Label>
                <Input
                  id="sm-quartier"
                  value={quartier}
                  onChange={(e) => setQuartier(e.target.value)}
                  placeholder="Ex: Médina"
                  required
                  data-ocid="submit_merchant.quartier_input"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sm-maps">Lien Google Maps *</Label>
              <Input
                id="sm-maps"
                type="url"
                value={mapsLink}
                onChange={(e) => setMapsLink(e.target.value)}
                placeholder="https://maps.google.com/..."
                required
                data-ocid="submit_merchant.maps_input"
              />
              {mapsLink && !isValidUrl(mapsLink) && (
                <p
                  className="text-xs text-destructive"
                  data-ocid="submit_merchant.maps_field_error"
                >
                  URL invalide. Copiez le lien directement depuis Google Maps.
                </p>
              )}
            </div>

            {/* Photo note */}
            <div className="flex items-start gap-2 p-3 bg-muted/40 rounded-lg text-xs text-muted-foreground">
              <Camera className="h-4 w-4 shrink-0 mt-0.5" />
              <span>
                Les photos de la devanture seront ajoutées par notre équipe lors
                de la distribution des affiches.
              </span>
            </div>

            <div className="flex gap-2 justify-end pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                data-ocid="submit_merchant.cancel_button"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={!canSubmit || submitMerchant.isPending}
                data-ocid="submit_merchant.submit_button"
              >
                {submitMerchant.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Soumission...
                  </>
                ) : (
                  "Soumettre la boutique"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
