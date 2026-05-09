import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Crown,
  Edit2,
  Globe,
  Loader2,
  Mail,
  MapPin,
  User,
  X,
} from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetCallerUserProfile,
  useUpdateCountry,
  useUpdateEmail,
  useUpdateUsername,
} from "../hooks/useQueries";
import GetPremiumModal from "./GetPremiumModal";
import PremiumBadge from "./PremiumBadge";

function isPremiumStatus(status: unknown): boolean {
  if (!status || typeof status !== "object") return false;
  return "#premium" in (status as Record<string, unknown>);
}

// ---------------------------------------------------------------------------
// ISO code resolution — maps free-text country input → 2-letter ISO code
// ---------------------------------------------------------------------------

const NAME_TO_ISO: Record<string, string> = {
  // France
  france: "fr",
  fr: "fr",
  // Maroc
  maroc: "ma",
  morocco: "ma",
  ma: "ma",
  // Espagne
  espagne: "es",
  spain: "es",
  espana: "es",
  españa: "es",
  es: "es",
  // USA
  usa: "us",
  "états-unis": "us",
  "etats-unis": "us",
  "united states": "us",
  "united states of america": "us",
  us: "us",
  // UK
  "royaume-uni": "gb",
  uk: "gb",
  "united kingdom": "gb",
  angleterre: "gb",
  england: "gb",
  gb: "gb",
  // Canada
  canada: "ca",
  ca: "ca",
  // Algérie
  algerie: "dz",
  algérie: "dz",
  algeria: "dz",
  dz: "dz",
  // Tunisie
  tunisie: "tn",
  tunisia: "tn",
  tn: "tn",
  // Italie
  italie: "it",
  italy: "it",
  it: "it",
  // Allemagne
  allemagne: "de",
  germany: "de",
  de: "de",
  // Sénégal
  senegal: "sn",
  sénégal: "sn",
  sn: "sn",
  // Belgique
  belgique: "be",
  belgium: "be",
  be: "be",
  // Suisse
  suisse: "ch",
  switzerland: "ch",
  ch: "ch",
  // Portugal
  portugal: "pt",
  pt: "pt",
  // Pays-Bas
  "pays-bas": "nl",
  netherlands: "nl",
  nl: "nl",
  // More common countries
  "arabie saoudite": "sa",
  "saudi arabia": "sa",
  sa: "sa",
  "émirats arabes unis": "ae",
  uae: "ae",
  ae: "ae",
  qatar: "qa",
  qa: "qa",
  egypte: "eg",
  égypte: "eg",
  egypt: "eg",
  eg: "eg",
  "côte d'ivoire": "ci",
  ci: "ci",
  cameroun: "cm",
  cameroon: "cm",
  cm: "cm",
  nigeria: "ng",
  ng: "ng",
  ghana: "gh",
  gh: "gh",
  kenya: "ke",
  ke: "ke",
  chine: "cn",
  china: "cn",
  cn: "cn",
  japon: "jp",
  japan: "jp",
  jp: "jp",
  inde: "in",
  india: "in",
  bresil: "br",
  brésil: "br",
  brazil: "br",
  br: "br",
  mexique: "mx",
  mexico: "mx",
  mx: "mx",
  argentine: "ar",
  argentina: "ar",
  // Note: "ar" clashes with Arabic ISO lang code; country wins here
  russie: "ru",
  russia: "ru",
  ru: "ru",
  turquie: "tr",
  turkey: "tr",
  tr: "tr",
  pologne: "pl",
  poland: "pl",
  pl: "pl",
  roumanie: "ro",
  romania: "ro",
  ro: "ro",
  grece: "gr",
  grèce: "gr",
  greece: "gr",
  gr: "gr",
  suede: "se",
  suède: "se",
  sweden: "se",
  se: "se",
  norvege: "no",
  norvège: "no",
  norway: "no",
  no: "no",
  danemark: "dk",
  denmark: "dk",
  dk: "dk",
  finlande: "fi",
  finland: "fi",
  fi: "fi",
  autriche: "at",
  austria: "at",
  at: "at",
  liban: "lb",
  lebanon: "lb",
  lb: "lb",
  jordanie: "jo",
  jordan: "jo",
  jo: "jo",
  irak: "iq",
  iraq: "iq",
  iq: "iq",
  iran: "ir",
  ir: "ir",
  syrie: "sy",
  syria: "sy",
  sy: "sy",
  palestine: "ps",
  ps: "ps",
  libye: "ly",
  libya: "ly",
  ly: "ly",
  mauritanie: "mr",
  mauritania: "mr",
  mr: "mr",
  koweit: "kw",
  koweït: "kw",
  kuwait: "kw",
  kw: "kw",
  mali: "ml",
  ml: "ml",
  guinee: "gn",
  guinée: "gn",
  guinea: "gn",
  gn: "gn",
  "burkina faso": "bf",
  bf: "bf",
  niger: "ne",
  ne: "ne",
  tchad: "td",
  chad: "td",
  td: "td",
  ethiopie: "et",
  éthiopie: "et",
  ethiopia: "et",
  et: "et",
  "afrique du sud": "za",
  "south africa": "za",
  za: "za",
  madagascar: "mg",
  mg: "mg",
  coree: "kr",
  "corée du sud": "kr",
  "south korea": "kr",
  kr: "kr",
  pakistan: "pk",
  pk: "pk",
  bangladesh: "bd",
  bd: "bd",
  indonesie: "id",
  indonésie: "id",
  indonesia: "id",
  id: "id",
  malaisie: "my",
  malaysia: "my",
  my: "my",
  thailande: "th",
  thaïlande: "th",
  thailand: "th",
  th: "th",
  vietnam: "vn",
  vn: "vn",
  philippines: "ph",
  ph: "ph",
  colombie: "co",
  colombia: "co",
  co: "co",
  venezuela: "ve",
  ve: "ve",
  chili: "cl",
  chile: "cl",
  cl: "cl",
  perou: "pe",
  pérou: "pe",
  peru: "pe",
  pe: "pe",
};

// Valid 2-letter ISO 3166-1 alpha-2 codes (used for direct-code fallback)
const VALID_ISO_CODES = new Set(Object.values(NAME_TO_ISO));

/**
 * Returns lowercase ISO 3166-1 alpha-2 code from any country name / code input.
 * Returns null if no match found.
 */
function getCountryIsoCode(input: string): string | null {
  if (!input || !input.trim()) return null;
  const normalized = input.trim().toLowerCase();

  // 1. Direct lookup in the map
  const direct = NAME_TO_ISO[normalized];
  if (direct) return direct;

  // 2. If it's already a valid 2-letter ISO code not in the map
  if (normalized.length === 2 && VALID_ISO_CODES.has(normalized)) {
    return normalized;
  }

  // 3. Starts-with match for longer inputs (>= 3 chars to avoid false positives)
  if (normalized.length >= 3) {
    const startsKey = Object.keys(NAME_TO_ISO).find((k) =>
      k.startsWith(normalized),
    );
    if (startsKey) return NAME_TO_ISO[startsKey];

    // 4. Any key that starts with what the user typed
    const reverseKey = Object.keys(NAME_TO_ISO).find(
      (k) => normalized.startsWith(k) && k.length >= 4,
    );
    if (reverseKey) return NAME_TO_ISO[reverseKey];
  }

  return null;
}

// ---------------------------------------------------------------------------
// CountryFlag — renders a flagcdn.com image, hides gracefully on error
// ---------------------------------------------------------------------------

interface CountryFlagProps {
  countryInput: string;
  className?: string;
}

function CountryFlag({ countryInput, className }: CountryFlagProps) {
  const isoCode = getCountryIsoCode(countryInput);
  if (!isoCode) return null;
  return (
    <img
      src={`https://flagcdn.com/24x18/${isoCode}.png`}
      alt={countryInput}
      width={24}
      height={18}
      className={
        className ?? "inline-block w-6 h-4 object-cover rounded-sm align-middle"
      }
      onError={(e) => {
        (e.target as HTMLImageElement).style.display = "none";
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type EditableField = "username" | "country" | "email" | null;

type Language = "fr" | "ar" | "es";

const LANGUAGE_LABELS: Record<Language, string> = {
  fr: "Français",
  ar: "العربية",
  es: "Español",
};

// ---------------------------------------------------------------------------
// EditFieldRow
// ---------------------------------------------------------------------------

interface EditFieldRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  placeholder: string;
  fieldKey: EditableField;
  activeField: EditableField;
  inputValue: string;
  isPending: boolean;
  saveConfirmed?: boolean;
  error?: string;
  onStartEdit: (field: EditableField, current: string) => void;
  onCancel: () => void;
  onSave: () => void;
  onInputChange: (val: string) => void;
}

function EditFieldRow({
  icon,
  label,
  value,
  placeholder,
  fieldKey,
  activeField,
  inputValue,
  isPending,
  saveConfirmed,
  error,
  onStartEdit,
  onCancel,
  onSave,
  onInputChange,
}: EditFieldRowProps) {
  const isEditing = activeField === fieldKey;
  const isCountry = fieldKey === "country";

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        <span className="text-muted-foreground">{icon}</span>
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
      </div>

      {isEditing ? (
        <div className="space-y-2">
          {/* Input row with live flag */}
          <div className="relative">
            {isCountry && (
              <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none select-none flex items-center">
                <CountryFlag countryInput={inputValue} />
              </span>
            )}
            <Input
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
              placeholder={
                isCountry
                  ? "Ex\u00a0: France, Maroc, Espagne\u2026"
                  : placeholder
              }
              className={`border-2 border-primary bg-background text-sm rounded-lg${
                isCountry && getCountryIsoCode(inputValue) ? " pl-10" : ""
              }`}
              onKeyDown={(e) => {
                if (e.key === "Enter") onSave();
                if (e.key === "Escape") onCancel();
              }}
              autoFocus
              data-ocid={`profile.${fieldKey}_input`}
            />
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onSave}
              disabled={isPending}
              className="flex-1 bg-orange-600 hover:bg-orange-700 disabled:opacity-60 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors"
              data-ocid={`profile.${fieldKey}_save_button`}
            >
              {isPending ? "..." : "Enregistrer"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={isPending}
              className="flex-1 border border-border bg-background hover:bg-accent px-3 py-1.5 rounded text-sm font-medium transition-colors"
              data-ocid={`profile.${fieldKey}_cancel_button`}
            >
              Annuler
            </button>
          </div>

          {/* Error */}
          {error && (
            <p
              className="text-xs text-destructive"
              data-ocid={`profile.${fieldKey}_field_error`}
            >
              {error}
            </p>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-between gap-2 min-w-0">
          <span className="flex items-center gap-1.5 text-sm min-w-0">
            {/* Flag in display mode */}
            {isCountry && value && <CountryFlag countryInput={value} />}
            {value ? (
              <span className="truncate">{value}</span>
            ) : (
              <span className="text-muted-foreground italic truncate">
                {placeholder}
              </span>
            )}
            {/* Confirmed checkmark */}
            {saveConfirmed && (
              <span className="text-green-600 text-xs font-semibold shrink-0">
                ✓ Enregistré
              </span>
            )}
          </span>
          <Button
            size="sm"
            type="button"
            variant="ghost"
            onClick={() => onStartEdit(fieldKey, value)}
            className="h-7 w-7 p-0 shrink-0 text-muted-foreground hover:text-primary"
            data-ocid={`profile.${fieldKey}_edit_button`}
          >
            <Edit2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ProfileDrawer
// ---------------------------------------------------------------------------

interface ProfileDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function ProfileDrawer({ open, onClose }: ProfileDrawerProps) {
  const { identity } = useInternetIdentity();
  const { data: profile, isLoading } = useGetCallerUserProfile();
  const updateUsername = useUpdateUsername();
  const updateCountry = useUpdateCountry();
  const updateEmail = useUpdateEmail();

  const [premiumModalOpen, setPremiumModalOpen] = useState(false);

  // One active field at a time (which field is in edit mode)
  const [activeField, setActiveField] = useState<EditableField>(null);

  // Isolated input value per field — all reset when edit starts
  const [inputValue, setInputValue] = useState("");

  // Per-field errors
  const [fieldError, setFieldError] = useState("");

  // Per-field save confirmation flash
  const [confirmedField, setConfirmedField] = useState<EditableField>(null);

  const [language, setLanguage] = useState<Language>(
    () => (localStorage.getItem("appLanguage") as Language | null) ?? "fr",
  );

  const drawerRef = useRef<HTMLDivElement>(null);
  const confirmTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (confirmTimerRef.current) clearTimeout(confirmTimerRef.current);
    };
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("appLanguage", lang);
  };

  const handleStartEdit = (field: EditableField, current: string) => {
    setFieldError("");
    setInputValue(current);
    setActiveField(field);
    setConfirmedField(null);
  };

  const handleCancel = () => {
    setActiveField(null);
    setInputValue("");
    setFieldError("");
  };

  const showConfirmation = (field: EditableField) => {
    setConfirmedField(field);
    if (confirmTimerRef.current) clearTimeout(confirmTimerRef.current);
    confirmTimerRef.current = setTimeout(() => setConfirmedField(null), 3000);
  };

  const handleSave = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    // Prevent double-submit if already saving this field
    const alreadySaving =
      (activeField === "username" && updateUsername.isPending) ||
      (activeField === "country" && updateCountry.isPending) ||
      (activeField === "email" && updateEmail.isPending);
    if (alreadySaving) return;

    setFieldError("");

    try {
      if (activeField === "username") {
        await updateUsername.mutateAsync(trimmed);
        handleCancel();
        showConfirmation("username");
      } else if (activeField === "country") {
        await updateCountry.mutateAsync(trimmed);
        handleCancel();
        showConfirmation("country");
      } else if (activeField === "email") {
        if (!EMAIL_REGEX.test(trimmed)) {
          setFieldError("Format d'email invalide. Ex\u00a0: nom@exemple.com");
          return;
        }
        await updateEmail.mutateAsync(trimmed);
        handleCancel();
        showConfirmation("email");
      }
    } catch (err) {
      console.error("[ProfileDrawer] save failed:", err);
      setFieldError("Erreur lors de l'enregistrement. Réessayez.");
    }
  };

  const isFieldPending = (field: EditableField): boolean => {
    if (field === "username") return updateUsername.isPending;
    if (field === "country") return updateCountry.isPending;
    if (field === "email") return updateEmail.isPending;
    return false;
  };

  const isPremium = isPremiumStatus(profile?.status);
  const currentEmail = profile?.email ?? "";

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        onKeyUp={(e) => e.key === "Escape" && onClose()}
        aria-hidden="true"
        data-ocid="profile.drawer_backdrop"
      />

      {/* Drawer panel */}
      <div
        ref={drawerRef}
        aria-label="Mon Profil"
        data-ocid="profile.drawer"
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-background border-l border-border shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-card shrink-0">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <h2 className="text-base font-bold">Mon Profil</h2>
            {isPremium && <PremiumBadge />}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            aria-label="Fermer"
            data-ocid="profile.close_button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-5">
          {!identity ? (
            <div className="text-center py-12">
              <User className="h-14 w-14 mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Veuillez vous connecter pour voir votre profil.
              </p>
            </div>
          ) : isLoading ? (
            <div
              className="flex items-center justify-center py-16"
              data-ocid="profile.loading_state"
            >
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* Language selector */}
              <Card data-ocid="profile.language.card">
                <CardHeader className="pb-2 pt-4">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Globe className="h-4 w-4 text-primary" />
                    Langue de l&apos;application
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-4">
                  <Select
                    value={language}
                    onValueChange={(v) => handleLanguageChange(v as Language)}
                  >
                    <SelectTrigger
                      className="w-full"
                      data-ocid="profile.language_select"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(
                        Object.entries(LANGUAGE_LABELS) as [Language, string][]
                      ).map(([code, label]) => (
                        <SelectItem key={code} value={code}>
                          <span className="flex items-center gap-2">
                            <CountryFlag
                              countryInput={
                                code === "fr"
                                  ? "fr"
                                  : code === "es"
                                    ? "es"
                                    : "ma"
                              }
                              className="inline-block w-5 h-3.5 object-cover rounded-sm align-middle"
                            />
                            {label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Mon Identifiant */}
              <Card
                className="border-l-4 border-l-primary"
                data-ocid="profile.identifiant.card"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    Mon Identifiant
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <EditFieldRow
                    icon={<User className="h-3.5 w-3.5" />}
                    label="Nom d'utilisateur"
                    value={profile?.username ?? ""}
                    placeholder="Ajouter un nom d'utilisateur"
                    fieldKey="username"
                    activeField={activeField}
                    inputValue={inputValue}
                    isPending={isFieldPending("username")}
                    saveConfirmed={confirmedField === "username"}
                    error={activeField === "username" ? fieldError : undefined}
                    onStartEdit={handleStartEdit}
                    onCancel={handleCancel}
                    onSave={handleSave}
                    onInputChange={setInputValue}
                  />
                  <div className="h-px bg-border" />
                  <EditFieldRow
                    icon={<MapPin className="h-3.5 w-3.5" />}
                    label="Pays"
                    value={profile?.country ?? ""}
                    placeholder="Ajouter votre pays"
                    fieldKey="country"
                    activeField={activeField}
                    inputValue={inputValue}
                    isPending={isFieldPending("country")}
                    saveConfirmed={confirmedField === "country"}
                    error={activeField === "country" ? fieldError : undefined}
                    onStartEdit={handleStartEdit}
                    onCancel={handleCancel}
                    onSave={handleSave}
                    onInputChange={setInputValue}
                  />
                  <div className="h-px bg-border" />
                  <EditFieldRow
                    icon={<Mail className="h-3.5 w-3.5" />}
                    label="Email"
                    value={currentEmail}
                    placeholder="Ajouter votre email"
                    fieldKey="email"
                    activeField={activeField}
                    inputValue={inputValue}
                    isPending={isFieldPending("email")}
                    saveConfirmed={confirmedField === "email"}
                    error={activeField === "email" ? fieldError : undefined}
                    onStartEdit={handleStartEdit}
                    onCancel={handleCancel}
                    onSave={handleSave}
                    onInputChange={(val) => {
                      setInputValue(val);
                      if (fieldError) setFieldError("");
                    }}
                  />
                </CardContent>
              </Card>

              {/* Badges */}
              {profile?.earnedBadges && profile.earnedBadges.length > 0 && (
                <Card data-ocid="profile.badges.card">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Badges obtenus</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {profile.earnedBadges.map((badge) => (
                        <Badge
                          key={badge}
                          variant="secondary"
                          className="text-xs"
                        >
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Get Premium button — bottom of drawer */}
              {!isPremium && (
                <button
                  type="button"
                  onClick={() => setPremiumModalOpen(true)}
                  data-ocid="profile.get_premium_button"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-amber-900 transition-all hover:brightness-105 active:scale-95"
                  style={{
                    background: "#FFD700",
                    boxShadow: "0 2px 12px rgba(255,215,0,0.4)",
                  }}
                >
                  <Crown className="h-5 w-5" />
                  Obtenir Premium
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Get Premium Modal */}
      <GetPremiumModal
        open={premiumModalOpen}
        onOpenChange={setPremiumModalOpen}
      />
    </>
  );
}
