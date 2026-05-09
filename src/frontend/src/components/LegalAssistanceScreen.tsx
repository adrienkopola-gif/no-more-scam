import {
  AlertTriangle,
  Building,
  ChevronRight,
  MapPin,
  Phone,
  PhoneCall,
  Scale,
  Shield,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import {
  type LegalContact,
  emergencyNumbers,
  legalRegions,
} from "../data/legalAssistance";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const typeConfig = {
  police: {
    label: "Police",
    icon: Shield,
    bg: "bg-blue-50 border-blue-200",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-700",
    badgeClass: "bg-blue-100 text-blue-700 border-blue-200",
    btnClass: "bg-blue-600 hover:bg-blue-700 text-white",
  },
  gendarmerie: {
    label: "Gendarmerie",
    icon: Building,
    bg: "bg-green-50 border-green-200",
    iconBg: "bg-green-100",
    iconColor: "text-green-700",
    badgeClass: "bg-green-100 text-green-700 border-green-200",
    btnClass: "bg-green-600 hover:bg-green-700 text-white",
  },
  huissier: {
    label: "Huissier de Justice",
    icon: Scale,
    bg: "bg-purple-50 border-purple-200",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-700",
    badgeClass: "bg-purple-100 text-purple-700 border-purple-200",
    btnClass: "bg-purple-600 hover:bg-purple-700 text-white",
  },
} as const;

function ContactCard({ contact }: { contact: LegalContact }) {
  const cfg = typeConfig[contact.type];
  const Icon = cfg.icon;
  return (
    <div
      className={`rounded-xl border p-4 flex flex-col gap-3 ${cfg.bg}`}
      data-ocid="legal.contact_card"
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg shrink-0 ${cfg.iconBg}`}>
          <Icon className={`h-4 w-4 ${cfg.iconColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm text-foreground leading-tight">
              {contact.name}
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full border font-medium ${cfg.badgeClass}`}
            >
              {cfg.label}
            </span>
          </div>
          {contact.notes && (
            <p className="text-xs mt-1 text-amber-700 font-medium flex items-center gap-1">
              <AlertTriangle className="h-3 w-3 shrink-0" />
              {contact.notes}
            </p>
          )}
          {contact.address && (
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <MapPin className="h-3 w-3 shrink-0" />
              {contact.address}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono font-bold text-base text-foreground">
          {contact.phone}
        </span>
        <a
          href={`tel:${contact.phone.replace(/-/g, "")}`}
          data-ocid="legal.call_button"
        >
          <button
            type="button"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${cfg.btnClass}`}
          >
            <PhoneCall className="h-3.5 w-3.5" />
            Appeler
          </button>
        </a>
      </div>
      {contact.phone2 && (
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-current/10">
          <span className="font-mono font-bold text-sm text-foreground">
            {contact.phone2}
          </span>
          <a href={`tel:${contact.phone2.replace(/-/g, "")}`}>
            <button
              type="button"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${cfg.btnClass}`}
            >
              <Phone className="h-3.5 w-3.5" />
              Appeler
            </button>
          </a>
        </div>
      )}
    </div>
  );
}

export default function LegalAssistanceScreen() {
  const [selectedRegionId, setSelectedRegionId] = useState<string>("all");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const availableCities = useMemo(() => {
    if (selectedRegionId === "all") {
      return legalRegions.flatMap((r) => r.cities.map((c) => c.name));
    }
    const region = legalRegions.find((r) => r.id === selectedRegionId);
    return region ? region.cities.map((c) => c.name) : [];
  }, [selectedRegionId]);

  const filteredCities = useMemo(() => {
    const regions =
      selectedRegionId === "all"
        ? legalRegions
        : legalRegions.filter((r) => r.id === selectedRegionId);

    const allCities = regions.flatMap((r) => r.cities);

    return allCities
      .filter((city) => {
        if (selectedCity !== "all" && city.name !== selectedCity) return false;
        if (
          searchQuery &&
          !city.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !city.contacts.some(
            (c) =>
              c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              c.address?.toLowerCase().includes(searchQuery.toLowerCase()),
          )
        )
          return false;
        return true;
      })
      .map((city) => ({
        ...city,
        contacts: city.contacts.filter((c) => {
          if (!searchQuery) return true;
          return (
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            city.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }),
      }))
      .filter((city) => city.contacts.length > 0);
  }, [selectedRegionId, selectedCity, searchQuery]);

  const regionName = (id: string) =>
    legalRegions.find((r) => r.id === id)?.name ?? id;

  return (
    <div className="min-h-screen bg-background">
      {/* ── HERO HEADER ── */}
      <div className="bg-gradient-to-br from-red-600 via-red-500 to-orange-500 text-white px-4 py-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/20 mb-4">
            <Shield className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Assistance Juridique</h1>
          <p className="text-white/85 text-base">
            Trouvez rapidement l&apos;aide dont vous avez besoin
          </p>
          <p className="mt-3 text-sm text-white/70">
            Contacts officiels&nbsp;: Police &middot; Gendarmerie &middot;
            Huissiers de Justice
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* ── EMERGENCY NUMBERS ── */}
        <section data-ocid="legal.emergency_section">
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <PhoneCall className="h-5 w-5 text-red-500" />
            Numéros d&apos;urgence nationaux
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {emergencyNumbers.map((en) => (
              <a
                key={en.number}
                href={`tel:${en.number.replace(/-/g, "")}`}
                className="block group"
                data-ocid={`legal.emergency.${en.number.replace(/-/g, "_")}`}
              >
                <Card className="h-full hover:shadow-md transition-shadow border-2 hover:border-red-300 cursor-pointer">
                  <CardContent className="p-3 text-center flex flex-col items-center gap-1">
                    <span className="text-2xl">{en.icon}</span>
                    <span className="text-xl font-black text-red-600">
                      {en.number}
                    </span>
                    <span className="text-xs font-semibold text-foreground leading-tight">
                      {en.label}
                    </span>
                    <span className="text-xs text-muted-foreground leading-snug hidden sm:block">
                      {en.description}
                    </span>
                    <span className="mt-1 inline-flex items-center gap-1 text-xs text-red-600 font-medium group-hover:underline">
                      <Phone className="h-3 w-3" /> Appeler
                    </span>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </section>

        {/* ── IMPORTANT TIP ── */}
        <div
          className="flex gap-3 bg-amber-50 border border-amber-300 rounded-xl p-4"
          data-ocid="legal.tip_card"
        >
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">
            <strong>En cas d&apos;arnaque&nbsp;:</strong> restez calme, ne
            signez rien, notez le lieu et les descriptions. Appelez
            immédiatement le <strong>19</strong> (Police) ou le{" "}
            <strong>177</strong> (Gendarmerie).
          </p>
        </div>

        {/* ── FILTERS ── */}
        <section data-ocid="legal.filter_section">
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Contacts par ville
          </h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <Select
              value={selectedRegionId}
              onValueChange={(v) => {
                setSelectedRegionId(v);
                setSelectedCity("all");
              }}
            >
              <SelectTrigger
                className="w-full sm:w-64"
                data-ocid="legal.region_select"
              >
                <SelectValue placeholder="Toutes les régions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les régions</SelectItem>
                {legalRegions.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger
                className="w-full sm:w-52"
                data-ocid="legal.city_select"
              >
                <SelectValue placeholder="Toutes les villes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les villes</SelectItem>
                {availableCities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Rechercher une ville ou un contact…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-ocid="legal.search_input"
              />
            </div>
          </div>
        </section>

        {/* ── CONTACTS LIST ── */}
        <section className="space-y-8" data-ocid="legal.contacts_section">
          {filteredCities.length === 0 ? (
            <div
              className="text-center py-16 text-muted-foreground"
              data-ocid="legal.empty_state"
            >
              <Scale className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium">Aucun contact trouvé</p>
              <p className="text-sm mt-1">
                Modifiez vos filtres ou effectuez une autre recherche.
              </p>
            </div>
          ) : (
            filteredCities.map((city, cityIdx) => (
              <div
                key={`${city.region}-${city.name}`}
                data-ocid={`legal.city_group.${cityIdx + 1}`}
              >
                {/* City header */}
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-4 w-4 text-primary shrink-0" />
                  <h3 className="font-bold text-foreground text-base">
                    {city.name}
                  </h3>
                  <Badge variant="secondary" className="text-xs">
                    {regionName(city.region)}
                  </Badge>
                  <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto" />
                </div>

                {/* Contact cards grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {city.contacts.map((contact, i) => (
                    <ContactCard
                      key={`${contact.type}-${contact.name}-${i}`}
                      contact={contact}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </section>

        {/* ── FOOTER NOTE ── */}
        <div className="text-center border-t pt-6 pb-2">
          <p className="text-xs text-muted-foreground max-w-xl mx-auto">
            Ces informations sont fournies à titre indicatif. Les numéros
            nationaux (<strong>19</strong> et <strong>177</strong>) fonctionnent
            depuis n&apos;importe quelle ville du Maroc.
          </p>
        </div>
      </div>
    </div>
  );
}
