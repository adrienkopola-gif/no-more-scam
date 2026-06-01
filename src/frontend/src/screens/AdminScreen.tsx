import { useNavigate } from "@tanstack/react-router";
import { ShieldX } from "lucide-react";
import React, { useEffect, useState } from "react";
import AdminMerchantPanel from "../components/AdminMerchantPanel";
import { useActor } from "../hooks/useActor";

export default function AdminScreen() {
  const { actor, isFetching } = useActor();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<"merchants">("merchants");

  useEffect(() => {
    if (!actor || isFetching) return;
    (async () => {
      try {
        const result = await (
          actor as unknown as { isCallerAdmin(): Promise<boolean> }
        ).isCallerAdmin();
        setIsAdmin(result);
      } catch {
        setIsAdmin(false);
      }
    })();
  }, [actor, isFetching]);

  // While checking
  if (isAdmin === null) {
    return (
      <div
        className="flex items-center justify-center min-h-[60vh] text-muted-foreground"
        data-ocid="admin.loading_state"
      >
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <span className="text-sm">Vérification des droits…</span>
        </div>
      </div>
    );
  }

  // Access denied
  if (!isAdmin) {
    return (
      <div
        className="flex items-center justify-center min-h-[60vh]"
        data-ocid="admin.access_denied"
      >
        <div className="text-center space-y-4 max-w-sm">
          <ShieldX className="h-16 w-16 mx-auto text-destructive/60" />
          <h1 className="text-2xl font-bold text-foreground">Accès refusé</h1>
          <p className="text-muted-foreground">
            Vous n'avez pas les droits d'accès à cette section.
          </p>
          <button
            type="button"
            onClick={() => navigate({ to: "/" })}
            className="mt-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            data-ocid="admin.go_home_button"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-6" data-ocid="admin.page">
      {/* Page header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground">Administration</h1>
        <p className="text-muted-foreground text-sm">
          Panneau d'administration No More Scam
        </p>
      </div>

      {/* Tab bar */}
      <div
        className="flex gap-1 border-b"
        role="tablist"
        aria-label="Sections admin"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "merchants"}
          onClick={() => setActiveTab("merchants")}
          data-ocid="admin.tab.merchants"
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "merchants"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
          }`}
        >
          Commerçants certifiés
        </button>
      </div>

      {/* Tab content */}
      <div role="tabpanel">
        {activeTab === "merchants" && <AdminMerchantPanel />}
      </div>
    </div>
  );
}
