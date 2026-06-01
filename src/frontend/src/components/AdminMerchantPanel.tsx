import {
  AlertTriangle,
  CheckCircle2,
  ImageOff,
  ImagePlus,
  MapPin,
  ShieldAlert,
  ShieldCheck,
  ShieldOff,
  Store,
} from "lucide-react";
import type React from "react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { PlaqueLevelType } from "../backend";
import type { Merchant } from "../backend";
import { useImageUpload } from "../hooks/useImageUpload";
import {
  useAdminUploadMerchantPhoto,
  useAdminValidateReclamation,
  useGetMerchants,
} from "../hooks/useQueries";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

const _PLAQUE_LABELS: Record<PlaqueLevelType, string> = {
  [PlaqueLevelType.pending]: "En attente",
  [PlaqueLevelType.argent]: "Argent",
  [PlaqueLevelType.gold]: "Or",
  [PlaqueLevelType.revoked]: "Révoquée",
};

function PlaqueBadge({ level }: { level: PlaqueLevelType }) {
  if (level === PlaqueLevelType.argent)
    return (
      <Badge className="bg-muted text-muted-foreground border-border font-semibold gap-1">
        <ShieldCheck className="h-3 w-3" /> Argent
      </Badge>
    );
  if (level === PlaqueLevelType.gold)
    return (
      <Badge className="bg-amber-500/20 text-amber-700 border-amber-400 font-semibold gap-1">
        <ShieldCheck className="h-3 w-3" /> Or
      </Badge>
    );
  if (level === PlaqueLevelType.revoked)
    return (
      <Badge variant="destructive" className="gap-1">
        <ShieldOff className="h-3 w-3" /> Révoquée
      </Badge>
    );
  return (
    <Badge variant="outline" className="gap-1 text-muted-foreground">
      <ShieldAlert className="h-3 w-3" /> En attente
    </Badge>
  );
}

function ReclamationBadge({ count }: { count: bigint }) {
  const n = Number(count);
  if (n === 0)
    return (
      <span className="flex items-center gap-1 text-sm text-muted-foreground">
        <CheckCircle2 className="h-3.5 w-3.5 text-green-500" /> 0 réclamation
      </span>
    );
  if (n < 3)
    return (
      <Badge
        variant="outline"
        className="gap-1 text-orange-600 border-orange-400"
      >
        <AlertTriangle className="h-3 w-3" /> {n} réclamation{n > 1 ? "s" : ""}
      </Badge>
    );
  return (
    <Badge variant="destructive" className="gap-1 animate-pulse">
      <AlertTriangle className="h-3 w-3" /> {n}/5 — CRITIQUE
    </Badge>
  );
}

function PhotoUploadButton({ merchant }: { merchant: Merchant }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const imageUpload = useImageUpload();
  const uploadPhoto = useAdminUploadMerchantPhoto();

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const blob = await imageUpload.upload(file);
    if (!blob) {
      toast.error("Impossible de charger l'image");
      return;
    }
    try {
      await uploadPhoto.mutateAsync({ merchantId: merchant.id, blob });
      toast.success("Photo ajoutée avec succès");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur d'upload");
    }
    // reset file input
    if (fileRef.current) fileRef.current.value = "";
  };

  const busy = imageUpload.isUploading || uploadPhoto.isPending;

  return (
    <>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
        data-ocid={`admin.merchant.photo_input.${merchant.id}`}
      />
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="gap-1.5"
        disabled={busy}
        onClick={() => fileRef.current?.click()}
        data-ocid={`admin.merchant.photo_button.${merchant.id}`}
      >
        <ImagePlus className="h-3.5 w-3.5" />
        {busy
          ? imageUpload.isUploading
            ? `${imageUpload.progress}%`
            : "Envoi..."
          : merchant.photoBlob
            ? "Changer la photo"
            : "Ajouter une photo"}
      </Button>
    </>
  );
}

function MerchantRow({ merchant }: { merchant: Merchant }) {
  const validateReclamation = useAdminValidateReclamation();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleValidate = async () => {
    setConfirmOpen(false);
    try {
      await validateReclamation.mutateAsync(merchant.id);
      toast.success(`Réclamation validée contre ${merchant.name}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur");
    }
  };

  return (
    <Card
      className="overflow-hidden"
      data-ocid={`admin.merchant.card.${merchant.id}`}
    >
      <CardHeader className="p-4 pb-2">
        <div className="flex flex-wrap items-start gap-2 justify-between">
          <div className="flex items-center gap-2 min-w-0">
            {/* Photo thumbnail or placeholder */}
            <div className="h-12 w-12 rounded-md shrink-0 bg-muted flex items-center justify-center overflow-hidden border">
              {merchant.photoBlob ? (
                <img
                  src={merchant.photoBlob.getDirectURL()}
                  alt={merchant.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <ImageOff
                  className="h-5 w-5 text-muted-foreground"
                  aria-label="Pas de photo"
                />
              )}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-foreground truncate">
                {merchant.name}
              </p>
              <p className="text-xs text-muted-foreground">{merchant.code}</p>
            </div>
          </div>
          <PlaqueBadge level={merchant.plaqueLevel} />
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-4 flex flex-col gap-3">
        {/* Meta row */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {merchant.city}
            {merchant.quartier ? `, ${merchant.quartier}` : ""}
          </span>
          <span className="flex items-center gap-1">
            <Store className="h-3.5 w-3.5" />
            {merchant.category}
          </span>
          <span>
            {Number(merchant.positiveEvaluations)} évaluation
            {Number(merchant.positiveEvaluations) !== 1 ? "s" : ""} positives
          </span>
        </div>

        {/* Reclamation status */}
        <ReclamationBadge count={merchant.reclamationCount} />

        {/* Action row */}
        <div className="flex flex-wrap gap-2 pt-1">
          <PhotoUploadButton merchant={merchant} />

          {!confirmOpen ? (
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="gap-1.5 border-destructive/40 text-destructive hover:bg-destructive/10"
              onClick={() => setConfirmOpen(true)}
              data-ocid={`admin.merchant.validate_reclamation_button.${merchant.id}`}
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              Valider réclamation (+1)
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Confirmer ?</span>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                disabled={validateReclamation.isPending}
                onClick={handleValidate}
                data-ocid={`admin.merchant.confirm_reclamation_button.${merchant.id}`}
              >
                {validateReclamation.isPending ? "..." : "Confirmer"}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => setConfirmOpen(false)}
                data-ocid={`admin.merchant.cancel_reclamation_button.${merchant.id}`}
              >
                Annuler
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminMerchantPanel() {
  const { data: merchants, isLoading, isError } = useGetMerchants();
  const [filter, setFilter] = useState<"all" | "no_photo" | "reclamations">(
    "all",
  );

  const filtered = (merchants ?? []).filter((m) => {
    if (filter === "no_photo") return !m.photoBlob;
    if (filter === "reclamations") return Number(m.reclamationCount) > 0;
    return true;
  });

  if (isLoading)
    return (
      <div
        className="grid gap-4 md:grid-cols-2"
        data-ocid="admin.merchant.loading_state"
      >
        {["sk0", "sk1", "sk2", "sk3"].map((k) => (
          <Skeleton key={k} className="h-48 rounded-xl" />
        ))}
      </div>
    );

  if (isError)
    return (
      <div
        className="text-center py-12 text-destructive"
        data-ocid="admin.merchant.error_state"
      >
        Impossible de charger les commerçants.
      </div>
    );

  return (
    <div className="space-y-5" data-ocid="admin.merchant.panel">
      {/* Stats bar */}
      <div className="flex flex-wrap gap-4 text-sm">
        <span className="text-muted-foreground">
          <strong className="text-foreground">{merchants?.length ?? 0}</strong>{" "}
          commerçant{(merchants?.length ?? 0) !== 1 ? "s" : ""} au total
        </span>
        <span className="text-muted-foreground">
          <strong className="text-foreground">
            {merchants?.filter((m) => !m.photoBlob).length ?? 0}
          </strong>{" "}
          sans photo
        </span>
        <span className="text-muted-foreground">
          <strong className="text-destructive">
            {merchants?.filter((m) => Number(m.reclamationCount) > 0).length ??
              0}
          </strong>{" "}
          avec réclamations
        </span>
      </div>

      {/* Filter tabs */}
      <fieldset
        className="flex gap-2 flex-wrap border-0 p-0 m-0"
        aria-label="Filtrer les commerçants"
      >
        {(
          [
            ["all", "Tous"],
            ["no_photo", "Sans photo"],
            ["reclamations", "Avec réclamations"],
          ] as const
        ).map(([val, label]) => (
          <button
            key={val}
            type="button"
            onClick={() => setFilter(val)}
            data-ocid={`admin.merchant.filter.${val}`}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === val
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </fieldset>

      {/* Merchant grid */}
      {filtered.length === 0 ? (
        <div
          className="text-center py-12 text-muted-foreground"
          data-ocid="admin.merchant.empty_state"
        >
          Aucun commerçant dans cette catégorie.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((merchant) => (
            <MerchantRow key={merchant.id.toString()} merchant={merchant} />
          ))}
        </div>
      )}
    </div>
  );
}
