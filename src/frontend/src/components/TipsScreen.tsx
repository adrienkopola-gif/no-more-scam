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
  Clock,
  Lightbulb,
  Loader2,
  MapPin,
  Plus,
  Shield,
  Tag,
  ThumbsUp,
} from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { type Tip, useCreateTip, useGetTips } from "../hooks/useQueries";

const LOCATION_OPTIONS = [
  "M\u00e9dina",
  "Souk",
  "Port",
  "Plage",
  "Restaurant",
  "H\u00f4tel",
  "A\u00e9roport",
];

interface OfficialTip {
  id: string;
  title: string;
  city: string;
  location: string;
  content: string;
}

const OFFICIAL_TIPS: OfficialTip[] = [
  {
    id: "official-1",
    title: "Guides officiels uniquement",
    city: "Marrakech",
    location: "M\u00e9dina",
    content:
      "Ne suivez jamais un inconnu qui propose de vous guider sans badge officiel ONMT. Un vrai guide porte toujours un badge avec photo et num\u00e9ro d'agr\u00e9ment d\u00e9livr\u00e9 par l'Office National Marocain du Tourisme.",
  },
  {
    id: "official-2",
    title: "Conna\u00eetre son adresse par c\u0153ur",
    city: "F\u00e8s",
    location: "M\u00e9dina",
    content:
      "M\u00e9morisez le num\u00e9ro de t\u00e9l\u00e9phone de votre h\u00e9bergement et appelez-les directement si quelqu'un remet en cause vos plans. Le riad ou l'h\u00f4tel peut envoyer quelqu'un vous chercher \u2014 c'est souvent gratuit.",
  },
  {
    id: "official-3",
    title: "N\u00e9gociez avant tout achat ou trajet",
    city: "Marrakech",
    location: "Souk",
    content:
      "N\u00e9gociez toujours le prix AVANT de monter dans un taxi et avant tout achat dans un souk. Une fois le service rendu ou l'article en main, vous perdez tout pouvoir de n\u00e9gociation. Commencez \u00e0 25-30% du prix annonc\u00e9.",
  },
  {
    id: "official-4",
    title: "Ne touchez pas les animaux sur Jemaa el-Fna",
    city: "Marrakech",
    location: "M\u00e9dina",
    content:
      "Ne touchez pas les animaux (serpents, singes) pr\u00e9sent\u00e9s par des dresseurs sur la place Jemaa el-Fna. D\u00e8s que l'animal vous touche ou qu'une photo est prise, une somme exorbitante vous est r\u00e9clam\u00e9e. Marchez sans regarder ces performeurs.",
  },
  {
    id: "official-5",
    title: "Refusez les th\u00e9s offerts par des inconnus",
    city: "F\u00e8s",
    location: "Souk",
    content:
      "Refusez les th\u00e9s et caf\u00e9s 'offerts' par des inconnus dans les boutiques. L'acceptation cr\u00e9e un sentiment d'obligation sociale d'achat. La v\u00e9ritable hospitalit\u00e9 marocaine existe, mais dans les zones touristiques c'est souvent une technique de vente.",
  },
  {
    id: "official-6",
    title: "Huile d'argan : coop\u00e9ratives certifi\u00e9es uniquement",
    city: "Marrakech",
    location: "Souk",
    content:
      "Achetez l'huile d'argan uniquement dans des coop\u00e9ratives certifi\u00e9es (label 'Argane' ou coop\u00e9rative f\u00e9minine officielle). Les herboristeries des souks vendent souvent des m\u00e9langes contenant moins de 2% de vrai argan, \u00e0 des prix 10 \u00e0 20 fois sup\u00e9rieurs au prix r\u00e9el.",
  },
  {
    id: "official-7",
    title: "Badge ONMT obligatoire pour les vrais guides",
    city: "Marrakech",
    location: "M\u00e9dina",
    content:
      "Un vrai guide touristique officiel porte toujours un badge ONMT visible avec photo et identit\u00e9. Les guides non officiels (faux guides ou 'faux amis') sont ill\u00e9gaux au Maroc. En cas de doute, demandez \u00e0 voir le badge \u2014 un guide l\u00e9gitime n'h\u00e9sitera pas.",
  },
  {
    id: "official-8",
    title: "Mentionner la police en cas de harc\u00e8lement",
    city: "Marrakech",
    location: "M\u00e9dina",
    content:
      "Si vous \u00eates harc\u00e9l\u00e9, dites clairement et fermement que vous allez appeler la police ('Ana ghadi ndiru chi chikaya f'l-police'). Cette phrase fonctionne dans la grande majorit\u00e9 des cas. Des brigades touristiques patrouillent en permanence dans les m\u00e9dinas de Marrakech et F\u00e8s.",
  },
];

const CITY_OPTIONS = [
  "Marrakech",
  "F\u00e8s",
  "Casablanca",
  "Agadir",
  "Rabat",
  "Tanger",
  "Essaouira",
  "Chefchaouen",
];

export default function TipsScreen() {
  const { identity } = useInternetIdentity();
  const { data: tips = [] } = useGetTips();
  const createTip = useCreateTip();
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [tipTitle, setTipTitle] = useState("");
  const [tipCity, setTipCity] = useState("");
  const [tipLocation, setTipLocation] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "helpful">("recent");
  const [filterCity, setFilterCity] = useState<string>("all");
  const [filterLocation, setFilterLocation] = useState<string>("all");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      await createTip.mutateAsync(content);
      setOpen(false);
      setContent("");
      setTipTitle("");
      setTipCity("");
      setTipLocation("");
    } catch {
      // error handled by mutation
    }
  };

  const dynamicCities = useMemo(() => {
    const tipCities = (tips as Tip[]).map((t) => t.city ?? "").filter(Boolean);
    return Array.from(new Set([...CITY_OPTIONS, ...tipCities]));
  }, [tips]);

  const filteredOfficialTips = useMemo(() => {
    return OFFICIAL_TIPS.filter((t) => {
      if (filterCity !== "all" && t.city !== filterCity) return false;
      if (filterLocation !== "all" && t.location !== filterLocation)
        return false;
      return true;
    });
  }, [filterCity, filterLocation]);

  const filteredSortedTips = useMemo(() => {
    let result = [...(tips as Tip[])];
    if (filterCity !== "all")
      result = result.filter((t) => t.city === filterCity);
    if (filterLocation !== "all")
      result = result.filter((t) => t.location === filterLocation);
    result.sort((a, b) => {
      if (sortBy === "helpful")
        return Number(b.helpfulCount) - Number(a.helpfulCount);
      return Number(b.timestamp) - Number(a.timestamp);
    });
    return result;
  }, [tips, sortBy, filterCity, filterLocation]);

  const hasAnyResults =
    filteredOfficialTips.length > 0 || filteredSortedTips.length > 0;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-bold">Conseils</h1>
        </div>
        {identity && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" data-ocid="tips.add_button">
                <Plus className="h-4 w-4 mr-1" />
                Ajouter un conseil
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Partager un conseil</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tip-title">Titre</Label>
                  <Input
                    id="tip-title"
                    value={tipTitle}
                    onChange={(e) => setTipTitle(e.target.value)}
                    placeholder="Ex: Attention aux faux guides"
                    data-ocid="tips.title_input"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="tip-city">Ville</Label>
                    <Select value={tipCity} onValueChange={setTipCity}>
                      <SelectTrigger id="tip-city" data-ocid="tips.city_select">
                        <SelectValue placeholder="Choisir" />
                      </SelectTrigger>
                      <SelectContent>
                        {CITY_OPTIONS.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tip-location">Lieu</Label>
                    <Select value={tipLocation} onValueChange={setTipLocation}>
                      <SelectTrigger
                        id="tip-location"
                        data-ocid="tips.location_select"
                      >
                        <SelectValue placeholder="Choisir" />
                      </SelectTrigger>
                      <SelectContent>
                        {LOCATION_OPTIONS.map((l) => (
                          <SelectItem key={l} value={l}>
                            {l}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tip">Votre conseil *</Label>
                  <Textarea
                    id="tip"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Partagez un conseil utile pour les voyageurs au Maroc..."
                    rows={4}
                    required
                    data-ocid="tips.content_textarea"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                    data-ocid="tips.cancel_button"
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    disabled={createTip.isPending || !content.trim()}
                    data-ocid="tips.submit_button"
                  >
                    {createTip.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        En cours...
                      </>
                    ) : (
                      "Partager"
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Sort + Filters */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <Button
            variant={sortBy === "recent" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy("recent")}
            className="text-xs"
            data-ocid="tips.sort_recent"
          >
            <Clock className="h-3 w-3 mr-1" />
            R\u00e9cents
          </Button>
          <Button
            variant={sortBy === "helpful" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy("helpful")}
            className="text-xs"
            data-ocid="tips.sort_helpful"
          >
            <ThumbsUp className="h-3 w-3 mr-1" />
            Les plus utiles
          </Button>
        </div>

        {/* City filter */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
            <MapPin className="h-3.5 w-3.5" />
            Filtrer par ville
          </div>
          <div
            className="flex flex-wrap gap-1.5"
            data-ocid="tips.city_filter_group"
          >
            <button
              type="button"
              onClick={() => setFilterCity("all")}
              data-ocid="tips.city_filter.all"
              className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                filterCity === "all"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-muted-foreground border-border hover:border-primary hover:text-primary"
              }`}
            >
              Tous
            </button>
            {dynamicCities.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() =>
                  setFilterCity(filterCity === city ? "all" : city)
                }
                data-ocid={`tips.city_filter.${city.toLowerCase().replace(/[^a-z0-9]/g, "_")}`}
                className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                  filterCity === city
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground border-border hover:border-primary hover:text-primary"
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Location filter */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
            <Tag className="h-3.5 w-3.5" />
            Filtrer par lieu
          </div>
          <div
            className="flex flex-wrap gap-1.5"
            data-ocid="tips.location_filter_group"
          >
            <button
              type="button"
              onClick={() => setFilterLocation("all")}
              data-ocid="tips.location_filter.all"
              className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                filterLocation === "all"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-muted-foreground border-border hover:border-primary hover:text-primary"
              }`}
            >
              Tous
            </button>
            {LOCATION_OPTIONS.map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() =>
                  setFilterLocation(filterLocation === loc ? "all" : loc)
                }
                data-ocid={`tips.location_filter.${loc.toLowerCase().replace(/[^a-z0-9]/g, "_")}`}
                className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                  filterLocation === loc
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground border-border hover:border-primary hover:text-primary"
                }`}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tips list */}
      {!hasAnyResults ? (
        <div
          className="text-center py-12 text-muted-foreground"
          data-ocid="tips.empty_state"
        >
          <Lightbulb className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>
            Aucun conseil pour ces filtres. Soyez le premier \u00e0 partager !
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Official hardcoded tips */}
          {filteredOfficialTips.map((tip, idx) => (
            <div
              key={tip.id}
              className="bg-primary/5 border border-primary/20 rounded-xl p-4 space-y-3"
              data-ocid={`tips.official.item.${idx + 1}`}
            >
              <div className="flex flex-wrap items-start gap-2">
                <span className="font-semibold text-sm flex-1 min-w-0">
                  {tip.title}
                </span>
                <div className="flex flex-wrap gap-1.5 shrink-0">
                  <Badge className="text-xs gap-1 bg-primary text-primary-foreground border-0">
                    <Shield className="h-3 w-3" />
                    Conseil officiel
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="text-xs gap-1 bg-primary/10 text-primary border-primary/20"
                  >
                    <MapPin className="h-3 w-3" />
                    {tip.city}
                  </Badge>
                  <Badge variant="outline" className="text-xs gap-1">
                    <Tag className="h-3 w-3" />
                    {tip.location}
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-foreground/90">{tip.content}</p>
            </div>
          ))}

          {/* Backend tips */}
          {filteredSortedTips.map((tip, idx) => (
            <div
              key={tip.id.toString()}
              className="bg-card border border-border rounded-xl p-4 space-y-3"
              data-ocid={`tips.item.${idx + 1}`}
            >
              <div className="flex flex-wrap items-start gap-2">
                {tip.title ? (
                  <span className="font-semibold text-sm flex-1 min-w-0">
                    {tip.title}
                  </span>
                ) : null}
                <div className="flex flex-wrap gap-1.5 shrink-0">
                  {tip.city && (
                    <Badge
                      variant="secondary"
                      className="text-xs gap-1 bg-primary/10 text-primary border-primary/20"
                    >
                      <MapPin className="h-3 w-3" />
                      {tip.city}
                    </Badge>
                  )}
                  {tip.location && (
                    <Badge variant="outline" className="text-xs gap-1">
                      <Tag className="h-3 w-3" />
                      {tip.location}
                    </Badge>
                  )}
                </div>
              </div>
              <p className="text-sm text-foreground/90">{tip.content}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{tip.author.toString().slice(0, 8)}...</span>
                <div className="flex items-center gap-1">
                  <ThumbsUp className="h-3 w-3" />
                  <span>{tip.helpfulCount.toString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
