import type { PlaqueLevelType } from "../backend";

interface PlaqueBadgeProps {
  plaqueLevel: PlaqueLevelType;
  size?: "sm" | "md" | "lg";
}

export default function PlaqueBadge({
  plaqueLevel,
  size = "md",
}: PlaqueBadgeProps) {
  if (plaqueLevel === "gold") {
    return (
      <div
        className={`inline-flex items-center gap-2 rounded-md font-bold tracking-wide border-2 shadow-lg ${
          size === "sm"
            ? "px-3 py-1.5 text-xs"
            : size === "lg"
              ? "px-5 py-3 text-base"
              : "px-4 py-2 text-sm"
        }`}
        style={{
          background:
            "linear-gradient(135deg, #b8860b 0%, #ffd700 30%, #fffacd 50%, #ffd700 70%, #b8860b 100%)",
          borderColor: "#b8860b",
          color: "#3a2200",
          textShadow: "0 1px 2px rgba(255,255,255,0.4)",
          boxShadow:
            "0 2px 12px rgba(255,215,0,0.35), inset 0 1px 0 rgba(255,255,255,0.3)",
        }}
        data-ocid="merchant.plaque_badge"
      >
        <span
          className={
            size === "sm" ? "text-base" : size === "lg" ? "text-2xl" : "text-xl"
          }
        >
          🏆
        </span>
        <span className="flex flex-col leading-tight">
          <span
            className="uppercase tracking-widest"
            style={{ fontSize: size === "sm" ? "0.6rem" : "0.65rem" }}
          >
            Commerçant
          </span>
          <span>Certifié ⭐ Or</span>
        </span>
      </div>
    );
  }

  if (plaqueLevel === "argent") {
    return (
      <div
        className={`inline-flex items-center gap-2 rounded-md font-bold tracking-wide border-2 shadow-md ${
          size === "sm"
            ? "px-3 py-1.5 text-xs"
            : size === "lg"
              ? "px-5 py-3 text-base"
              : "px-4 py-2 text-sm"
        }`}
        style={{
          background:
            "linear-gradient(135deg, #708090 0%, #c0c0c0 30%, #f0f0f0 50%, #c0c0c0 70%, #708090 100%)",
          borderColor: "#9aa0a6",
          color: "#1a1a2e",
          textShadow: "0 1px 1px rgba(255,255,255,0.3)",
          boxShadow:
            "0 2px 10px rgba(192,192,192,0.3), inset 0 1px 0 rgba(255,255,255,0.3)",
        }}
        data-ocid="merchant.plaque_badge"
      >
        <span
          className={
            size === "sm" ? "text-base" : size === "lg" ? "text-2xl" : "text-xl"
          }
        >
          🥈
        </span>
        <span className="flex flex-col leading-tight">
          <span
            className="uppercase tracking-widest"
            style={{ fontSize: size === "sm" ? "0.6rem" : "0.65rem" }}
          >
            Commerçant
          </span>
          <span>Certifié ⭐ Argent</span>
        </span>
      </div>
    );
  }

  if (plaqueLevel === "revoked") {
    return (
      <div
        className={`inline-flex items-center gap-2 rounded-md font-semibold border ${
          size === "sm" ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-sm"
        } bg-destructive/10 border-destructive/40 text-destructive`}
        data-ocid="merchant.plaque_badge"
      >
        <span>⚠️</span>
        <span>Plaque retirée</span>
      </div>
    );
  }

  // pending
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-md font-medium border ${
        size === "sm" ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-sm"
      } bg-muted/50 border-border text-muted-foreground`}
      data-ocid="merchant.plaque_badge"
    >
      <span>⏳</span>
      <span>En attente de certification</span>
    </div>
  );
}
