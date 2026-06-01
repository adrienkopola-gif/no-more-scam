import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Award,
  Loader2,
  Plus,
  Search,
  Shield,
  ShieldCheck,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { Merchant } from "../backend";
import { PlaqueLevelType } from "../backend";
import MerchantCard from "../components/MerchantCard";
import MerchantSubmissionForm, {
  MERCHANT_CATEGORIES,
} from "../components/MerchantSubmissionForm";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetMerchants } from "../hooks/useQueries";

const MOROCCAN_CITIES = [
  "Marrakech",
  "Fès",
  "Casablanca",
  "Agadir",
  "Rabat",
  "Tanger",
  "Meknès",
  "Oujda",
  "Tétouan",
  "Chefchaouen",
  "Essaouira",
  "Safi",
  "El Jadida",
  "Béni Mellal",
  "Khénifra",
  "Errachidia",
  "Ouarzazate",
  "Zagora",
  "Taroudant",
  "Tiznit",
  "Dakhla",
  "Laâyoune",
];

const LEVEL_ORDER: Record<PlaqueLevelType, number> = {
  [PlaqueLevelType.gold]: 0,
  [PlaqueLevelType.argent]: 1,
  [PlaqueLevelType.pending]: 2,
  [PlaqueLevelType.revoked]: 3,
};

function sortMerchants(merchants: Merchant[]): Merchant[] {
  return [...merchants].sort(
    (a, b) => LEVEL_ORDER[a.plaqueLevel] - LEVEL_ORDER[b.plaqueLevel],
  );
}

function StatsBar({ merchants }: { merchants: Merchant[] }) {
  const goldCount = merchants.filter(
    (m) => m.plaqueLevel === PlaqueLevelType.gold,
  ).length;
  const argentCount = merchants.filter(
    (m) => m.plaqueLevel === PlaqueLevelType.argent,
  ).length;
  const pendingCount = merchants.filter(
    (m) => m.plaqueLevel === PlaqueLevelType.pending,
  ).length;
  return (
    <div className="flex flex-wrap gap-3 text-sm">
      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[oklch(0.74_0.12_55/0.15)] border border-[oklch(0.74_0.12_55/0.3)] text-[oklch(0.55_0.12_55)]">
        🏆 <strong>{goldCount}</strong> Or
      </span>
      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[oklch(0.78_0.05_260/0.15)] border border-[oklch(0.78_0.05_260/0.3)] text-muted-foreground">
        🥈 <strong>{argentCount}</strong> Argent
      </span>
      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted/50 border border-border text-muted-foreground">
        ⏳ <strong>{pendingCount}</strong> En attente
      </span>
    </div>
  );
}

const SAMPLE_MERCHANTS: Merchant[] = [
  {
    id: 1n,
    name: "Maison des Épices El Bahja",
    category: "Épices & Herbes",
    city: "Marrakech",
    quartier: "Médina",
    code: "NMS-MAR-0001",
    mapsLink: "https://maps.google.com/maps?q=Jemaa+el-Fna+Marrakech",
    positiveEvaluations: 52n,
    reclamationCount: 0n,
    plaqueLevel: PlaqueLevelType.gold,
    submittedBy: {
      toText: () => "",
      compareTo: () => 0,
      isAnonymous: () => false,
    } as unknown as import("@icp-sdk/core/principal").Principal,
    timestamp: BigInt(Date.now()) * 1_000_000n,
    photoBlob: undefined,
  },
  {
    id: 2n,
    name: "Tapis Artisanat Berbère",
    category: "Tapis & Tissus",
    city: "Fès",
    quartier: "Médina",
    code: "NMS-FES-0042",
    mapsLink: "https://maps.google.com/maps?q=Medina+Fes",
    positiveEvaluations: 31n,
    reclamationCount: 0n,
    plaqueLevel: PlaqueLevelType.argent,
    submittedBy: {
      toText: () => "",
      compareTo: () => 0,
      isAnonymous: () => false,
    } as unknown as import("@icp-sdk/core/principal").Principal,
    timestamp: BigInt(Date.now()) * 1_000_000n,
    photoBlob: undefined,
  },
  {
    id: 3n,
    name: "Cuir Artisanal de la Médina",
    category: "Cuir & Maroquinerie",
    city: "Fès",
    quartier: "Souk Seffarine",
    code: "NMS-FES-0017",
    mapsLink: "https://maps.google.com/maps?q=Souk+Seffarine+Fes",
    positiveEvaluations: 18n,
    reclamationCount: 1n,
    plaqueLevel: PlaqueLevelType.argent,
    submittedBy: {
      toText: () => "",
      compareTo: () => 0,
      isAnonymous: () => false,
    } as unknown as import("@icp-sdk/core/principal").Principal,
    timestamp: BigInt(Date.now()) * 1_000_000n,
    photoBlob: undefined,
  },
  {
    id: 4n,
    name: "Céramique Traditionnelle Safi",
    category: "Céramique & Poterie",
    city: "Safi",
    quartier: "Medina",
    code: "NMS-SAF-0003",
    mapsLink: "https://maps.google.com/maps?q=Medina+Safi",
    positiveEvaluations: 9n,
    reclamationCount: 0n,
    plaqueLevel: PlaqueLevelType.pending,
    submittedBy: {
      toText: () => "",
      compareTo: () => 0,
      isAnonymous: () => false,
    } as unknown as import("@icp-sdk/core/principal").Principal,
    timestamp: BigInt(Date.now()) * 1_000_000n,
    photoBlob: undefined,
  },
  {
    id: 5n,
    name: "Argan Bio Souss",
    category: "Huiles & Cosmétiques",
    city: "Agadir",
    quartier: "Centre-Ville",
    code: "NMS-AGA-0008",
    mapsLink: "https://maps.google.com/maps?q=Agadir+Centre",
    positiveEvaluations: 67n,
    reclamationCount: 0n,
    plaqueLevel: PlaqueLevelType.gold,
    submittedBy: {
      toText: () => "",
      compareTo: () => 0,
      isAnonymous: () => false,
    } as unknown as import("@icp-sdk/core/principal").Principal,
    timestamp: BigInt(Date.now()) * 1_000_000n,
    photoBlob: undefined,
  },
  {
    id: 6n,
    name: "Bijoux Amazigh Tafraoute",
    category: "Bijoux & Accessoires",
    city: "Taroudant",
    quartier: "Médina",
    code: "NMS-TAR-0005",
    mapsLink: "https://maps.google.com/maps?q=Taroudant+Medina",
    positiveEvaluations: 26n,
    reclamationCount: 0n,
    plaqueLevel: PlaqueLevelType.argent,
    submittedBy: {
      toText: () => "",
      compareTo: () => 0,
      isAnonymous: () => false,
    } as unknown as import("@icp-sdk/core/principal").Principal,
    timestamp: BigInt(Date.now()) * 1_000_000n,
    photoBlob: undefined,
  },
];

export default function CertifiedMerchantsScreen() {
  const { identity } = useInternetIdentity();
  const { data: allMerchants = [], isLoading } = useGetMerchants();
  const [search, setSearch] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [submitOpen, setSubmitOpen] = useState(false);

  const filteredMerchants = useMemo(() => {
    const q = search.toLowerCase().trim();
    let result = allMerchants;
    if (q) {
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.code.toLowerCase().includes(q) ||
          m.city.toLowerCase().includes(q),
      );
    }
    if (filterCity)
      result = result.filter(
        (m) => m.city.toLowerCase() === filterCity.toLowerCase(),
      );
    if (filterCategory)
      result = result.filter((m) => m.category === filterCategory);
    return sortMerchants(result);
  }, [allMerchants, search, filterCity, filterCategory]);

  const displayMerchants =
    allMerchants.length > 0
      ? filteredMerchants
      : sortMerchants(SAMPLE_MERCHANTS);
  const isUsingFallback = allMerchants.length === 0 && !isLoading;

  return (
    <div className="min-h-screen">
      {/* Hero header */}
      <div className="bg-card border-b">
        <div className="container py-10 text-center space-y-3">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Award className="h-8 w-8 text-[oklch(0.74_0.12_55)]" />
            <h1 className="text-3xl md:text-4xl font-bold">
              Commerçants Certifiés
            </h1>
            <Award className="h-8 w-8 text-[oklch(0.74_0.12_55)]" />
          </div>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Notre engagement pour l'excellence.
          </p>
          <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
            Critères : Transparence, Prix honnêtes, Validés par la Communauté.
          </p>
          {/* Certification levels */}
          <div className="flex flex-wrap justify-center gap-4 pt-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[oklch(0.74_0.12_55/0.1)] border border-[oklch(0.74_0.12_55/0.3)] text-sm">
              <ShieldCheck className="h-4 w-4 text-[oklch(0.65_0.12_55)]" />
              <span>
                <strong>Argent</strong> : 25 évaluations positives
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[oklch(0.74_0.12_55/0.15)] border border-[oklch(0.74_0.12_55/0.4)] text-sm">
              <Shield className="h-4 w-4 text-[oklch(0.55_0.12_55)]" />
              <span>
                <strong>Or</strong> : 50 évaluations + zéro réclamation
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-6 space-y-6">
        {/* Search + Filters + Submit button */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par nom ou code (NMS-FES-0042)…"
              className="pl-9"
              data-ocid="certified_merchants.search_input"
            />
          </div>

          <Select
            value={filterCity || "__all__"}
            onValueChange={(v) => setFilterCity(v === "__all__" ? "" : v)}
          >
            <SelectTrigger
              className="w-full sm:w-48"
              data-ocid="certified_merchants.city_select"
            >
              <SelectValue placeholder="Filtrer par ville" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">Toutes les villes</SelectItem>
              {MOROCCAN_CITIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filterCategory || "__all__"}
            onValueChange={(v) => setFilterCategory(v === "__all__" ? "" : v)}
          >
            <SelectTrigger
              className="w-full sm:w-52"
              data-ocid="certified_merchants.category_select"
            >
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">Toutes catégories</SelectItem>
              {MERCHANT_CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {identity && (
            <Button
              onClick={() => setSubmitOpen(true)}
              className="shrink-0"
              data-ocid="certified_merchants.submit_open_modal_button"
            >
              <Plus className="h-4 w-4 mr-2" />
              Soumettre une boutique
            </Button>
          )}
        </div>

        {/* Stats bar */}
        {!isLoading && allMerchants.length > 0 && (
          <StatsBar merchants={allMerchants} />
        )}

        {/* Fallback sample notice */}
        {isUsingFallback && (
          <div className="flex items-center gap-2 p-3 bg-muted/30 border border-border rounded-lg text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Connexion au backend… Exemples affichés en attendant.</span>
          </div>
        )}

        {/* Merchant grid */}
        {isLoading ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            data-ocid="certified_merchants.loading_state"
          >
            {["sk0", "sk1", "sk2", "sk3", "sk4", "sk5"].map((k) => (
              <div
                key={k}
                className="rounded-lg border border-border p-4 space-y-3"
              >
                <Skeleton className="h-8 w-2/3" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-full" />
              </div>
            ))}
          </div>
        ) : displayMerchants.length === 0 ? (
          <div
            className="text-center py-16 space-y-4 text-muted-foreground"
            data-ocid="certified_merchants.empty_state"
          >
            <Award className="h-16 w-16 mx-auto opacity-25" />
            <div>
              <p className="font-semibold text-lg">Aucun commerçant trouvé</p>
              <p className="text-sm mt-1">
                {search || filterCity || filterCategory
                  ? "Essayez d'autres filtres."
                  : "Soyez le premier à soumettre une boutique de confiance !"}
              </p>
            </div>
            {identity && !search && !filterCity && !filterCategory && (
              <Button
                onClick={() => setSubmitOpen(true)}
                data-ocid="certified_merchants.empty_submit_button"
              >
                <Plus className="h-4 w-4 mr-2" />
                Soumettre une boutique
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayMerchants.map((merchant, idx) => (
              <MerchantCard
                key={merchant.id.toString()}
                merchant={merchant}
                index={idx + 1}
                isAuthenticated={!!identity}
              />
            ))}
          </div>
        )}

        {/* Non-authenticated CTA */}
        {!identity && (
          <div className="text-center py-4 text-sm text-muted-foreground border-t border-border pt-6">
            <p>
              Connectez-vous pour soumettre une boutique ou évaluer un
              commerçant.
            </p>
          </div>
        )}
      </div>

      <MerchantSubmissionForm open={submitOpen} onOpenChange={setSubmitOpen} />
    </div>
  );
}
