import { Badge } from "@/components/ui/badge";
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
import {
  AlertTriangle,
  Flag,
  Loader2,
  MapPin,
  Plus,
  ShieldAlert,
  ThumbsUp,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useCreateReclamation,
  useGetAllReclamations,
  useVoteReclamationHelpful,
} from "../hooks/useQueries";

const CITIES = [
  "Marrakech",
  "Fès",
  "Casablanca",
  "Agadir",
  "Rabat",
  "Tanger",
  "Essaouira",
  "Chefchaouen",
  "Autre",
];

const LOCATIONS = [
  "Médina",
  "Souk",
  "Port",
  "Plage",
  "Restaurant",
  "Hôtel",
  "Aéroport",
  "Rue principale",
  "Autre",
];

function timeAgo(timestamp: bigint): string {
  const ms = Number(timestamp / 1_000_000n);
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "À l'instant";
  if (mins < 60) return `Il y a ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  return `Il y a ${days}j`;
}

export default function ReclamationsScreen() {
  const { identity } = useInternetIdentity();
  const { data: reclamations = [], isLoading } = useGetAllReclamations();
  const createReclamation = useCreateReclamation();
  const voteHelpful = useVoteReclamationHelpful();

  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [whatTheySell, setWhatTheySell] = useState("");
  const [city, setCity] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !whatTheySell.trim() || !city || !location)
      return;
    try {
      await createReclamation.mutateAsync({
        description,
        whatTheySell,
        city,
        location,
      });
      setOpen(false);
      setDescription("");
      setWhatTheySell("");
      setCity("");
      setLocation("");
      toast.success("Réclamation soumise avec succès.");
    } catch {
      toast.error("Erreur lors de la soumission.");
    }
  };

  const handleVote = (id: bigint) => {
    voteHelpful.mutate(id);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-destructive" />
          <h1 className="text-xl font-bold">Réclamations vendeurs</h1>
        </div>
        {identity && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                variant="destructive"
                data-ocid="reclamations.open_modal_button"
              >
                <Plus className="h-4 w-4 mr-1" />
                Signaler un vendeur
              </Button>
            </DialogTrigger>
            <DialogContent
              className="sm:max-w-lg"
              data-ocid="reclamations.dialog"
            >
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Flag className="h-4 w-4 text-destructive" />
                  Signaler un vendeur
                </DialogTitle>
              </DialogHeader>

              {/* Warning notice */}
              <div className="flex gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
                <p>
                  Décrivez le vendeur de manière <strong>anonyme</strong> — ne
                  mentionnez pas son nom. Décrivez ses méthodes, son apparence,
                  et l'arnaque pratiquée.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="recl-description">
                    Description du vendeur *
                  </Label>
                  <Textarea
                    id="recl-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ex: Homme d'environ 40 ans près de Jemaa el-Fna, propose faussement de guider les touristes puis exige de l'argent..."
                    rows={4}
                    required
                    data-ocid="reclamations.description_textarea"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recl-sells">Ce qu'il vend *</Label>
                  <Input
                    id="recl-sells"
                    value={whatTheySell}
                    onChange={(e) => setWhatTheySell(e.target.value)}
                    placeholder="Ex: Épices, faux cuir, visites guidées..."
                    required
                    data-ocid="reclamations.sells_input"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="recl-city">Ville *</Label>
                    <Select value={city} onValueChange={setCity} required>
                      <SelectTrigger
                        id="recl-city"
                        data-ocid="reclamations.city_select"
                      >
                        <SelectValue placeholder="Choisir" />
                      </SelectTrigger>
                      <SelectContent>
                        {CITIES.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recl-location">Lieu *</Label>
                    <Select
                      value={location}
                      onValueChange={setLocation}
                      required
                    >
                      <SelectTrigger
                        id="recl-location"
                        data-ocid="reclamations.location_select"
                      >
                        <SelectValue placeholder="Choisir" />
                      </SelectTrigger>
                      <SelectContent>
                        {LOCATIONS.map((l) => (
                          <SelectItem key={l} value={l}>
                            {l}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                    data-ocid="reclamations.cancel_button"
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    variant="destructive"
                    disabled={
                      createReclamation.isPending ||
                      !description.trim() ||
                      !whatTheySell.trim() ||
                      !city ||
                      !location
                    }
                    data-ocid="reclamations.submit_button"
                  >
                    {createReclamation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Envoi...
                      </>
                    ) : (
                      "Soumettre"
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Info banner */}
      <div className="flex gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
        <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5 text-blue-600" />
        <p>
          Les réclamations sont publiques et anonymes — aucun nom ni photo de
          vendeur. Aidez la communauté à éviter les arnaques.
        </p>
      </div>

      {/* List */}
      {isLoading ? (
        <div
          className="flex items-center justify-center py-16"
          data-ocid="reclamations.loading_state"
        >
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : reclamations.length === 0 ? (
        <div
          className="text-center py-12 text-muted-foreground"
          data-ocid="reclamations.empty_state"
        >
          <ShieldAlert className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>Aucune réclamation pour l'instant.</p>
          {identity && (
            <p className="text-sm mt-2">
              Signalez un vendeur suspect pour aider les autres voyageurs.
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {reclamations.map((rec, idx) => (
            <div
              key={rec.id.toString()}
              className="bg-card border border-border rounded-xl p-4 space-y-3"
              data-ocid={`reclamations.item.${idx + 1}`}
            >
              {/* Badges: city + location */}
              <div className="flex flex-wrap gap-1.5">
                <Badge
                  variant="secondary"
                  className="text-xs gap-1 bg-primary/10 text-primary border-primary/20"
                >
                  <MapPin className="h-3 w-3" />
                  {rec.city}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {rec.location}
                </Badge>
                <Badge
                  variant="outline"
                  className="text-xs bg-amber-50 text-amber-700 border-amber-200"
                >
                  Vend: {rec.whatTheySell}
                </Badge>
              </div>

              {/* Description */}
              <p className="text-sm text-foreground/90">{rec.description}</p>

              {/* Footer: timestamp + helpful */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {timeAgo(rec.timestamp)}
                </span>
                <button
                  type="button"
                  onClick={() => handleVote(rec.id)}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors px-2 py-1 rounded-md hover:bg-primary/10"
                  data-ocid={`reclamations.helpful_button.${idx + 1}`}
                >
                  <ThumbsUp className="h-3.5 w-3.5" />
                  Utile ({rec.helpfulCount.toString()})
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
