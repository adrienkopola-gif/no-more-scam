import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle, ExternalLink, MapPin, Star } from "lucide-react";
import { useState } from "react";
import type { Merchant } from "../backend";
import MerchantEvaluationDialog from "./MerchantEvaluationDialog";
import PlaqueBadge from "./PlaqueBadge";

interface MerchantCardProps {
  merchant: Merchant;
  index: number;
  isAuthenticated: boolean;
}

export default function MerchantCard({
  merchant,
  index,
  isAuthenticated,
}: MerchantCardProps) {
  const [detailOpen, setDetailOpen] = useState(false);
  const [evaluateOpen, setEvaluateOpen] = useState(false);

  const hasReclamations = merchant.reclamationCount > 0n;
  const isRevoked = merchant.plaqueLevel === "revoked";

  return (
    <>
      <button
        type="button"
        className="merchant-card cursor-pointer flex flex-col group text-left w-full"
        onClick={() => setDetailOpen(true)}
        data-ocid={`certified_merchants.item.${index}`}
      >
        {/* Reclamation warning banner */}
        {hasReclamations && (
          <div className="flex items-center gap-2 px-4 py-2 bg-[oklch(0.75_0.15_85/0.15)] border-b border-[oklch(0.75_0.15_85/0.3)] text-[oklch(0.65_0.15_55)] text-xs font-medium">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
            {merchant.reclamationCount.toString()} réclamation
            {merchant.reclamationCount > 1n ? "s" : ""} signalée
            {merchant.reclamationCount > 1n ? "s" : ""}
          </div>
        )}

        <div className="p-4 flex flex-col gap-3 flex-1">
          {/* Plaque */}
          <PlaqueBadge plaqueLevel={merchant.plaqueLevel} size="sm" />

          {/* Name + category */}
          <div>
            <h3 className="font-bold text-foreground text-base leading-tight group-hover:text-primary transition-colors">
              {merchant.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              {merchant.category}
            </p>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span>
              {merchant.city}, {merchant.quartier}
            </span>
          </div>

          {/* Code */}
          <div className="font-mono text-xs text-primary/80 bg-primary/10 px-2 py-1 rounded w-fit">
            {merchant.code}
          </div>

          {/* Evaluations + reclamations */}
          <div className="flex items-center gap-3 text-sm flex-wrap">
            <span className="flex items-center gap-1 text-[oklch(0.65_0.18_150)]">
              <Star className="h-3.5 w-3.5 fill-current" />
              {merchant.positiveEvaluations.toString()} évaluations
            </span>
            {isRevoked ? (
              <span className="text-destructive font-medium text-xs">
                ❌ Plaque retirée
              </span>
            ) : hasReclamations ? (
              <span className="text-[oklch(0.65_0.15_55)] font-medium text-xs">
                ⚠️ {merchant.reclamationCount.toString()} réclamation
                {merchant.reclamationCount > 1n ? "s" : ""}
              </span>
            ) : (
              <span className="text-[oklch(0.65_0.18_150)] text-xs">
                ✅ Zéro réclamation
              </span>
            )}
          </div>

          {/* Map button */}
          <Button
            variant="outline"
            size="sm"
            className="mt-auto w-full"
            asChild
            onClick={(e) => e.stopPropagation()}
            data-ocid={`certified_merchants.map_button.${index}`}
          >
            <a
              href={merchant.mapsLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
              Voir sur la carte
            </a>
          </Button>
        </div>
      </button>

      {/* Detail dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent
          className="sm:max-w-md"
          data-ocid="certified_merchants.dialog"
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 flex-wrap">
              {merchant.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <PlaqueBadge plaqueLevel={merchant.plaqueLevel} size="md" />

            {hasReclamations && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-[oklch(0.75_0.15_85/0.12)] border border-[oklch(0.75_0.15_85/0.3)] text-sm text-[oklch(0.55_0.15_55)]">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>
                  Ce commerçant a {merchant.reclamationCount.toString()}{" "}
                  réclamation{merchant.reclamationCount > 1n ? "s" : ""} déposée
                  {merchant.reclamationCount > 1n ? "s" : ""}.
                </span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">
                  Catégorie
                </p>
                <p className="font-medium">{merchant.category}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">
                  Ville
                </p>
                <p className="font-medium">{merchant.city}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">
                  Quartier
                </p>
                <p className="font-medium">{merchant.quartier}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">
                  Code
                </p>
                <p className="font-mono text-primary font-semibold">
                  {merchant.code}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg text-sm">
              <span className="text-[oklch(0.65_0.18_150)] font-semibold">
                ✅ {merchant.positiveEvaluations.toString()} évaluations
                positives
              </span>
              {!hasReclamations && (
                <span className="text-[oklch(0.65_0.18_150)] text-xs">
                  Zéro réclamation
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                asChild
                data-ocid="certified_merchants.map_link"
              >
                <a
                  href={merchant.mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Voir sur Google Maps
                </a>
              </Button>
              {isAuthenticated && merchant.plaqueLevel !== "revoked" && (
                <Button
                  className="flex-1"
                  onClick={() => {
                    setDetailOpen(false);
                    setEvaluateOpen(true);
                  }}
                  data-ocid="certified_merchants.evaluate_button"
                >
                  ⭐ Évaluer
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Evaluation dialog */}
      <MerchantEvaluationDialog
        merchant={merchant}
        open={evaluateOpen}
        onOpenChange={setEvaluateOpen}
      />
    </>
  );
}
