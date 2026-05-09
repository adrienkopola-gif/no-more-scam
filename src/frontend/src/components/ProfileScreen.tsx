import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Award,
  Check,
  Edit2,
  Globe,
  Loader2,
  Mail,
  MapPin,
  Star,
  User,
  X,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetCallerUserProfile,
  useUpdateCountry,
  useUpdateEmail,
  useUpdateUsername,
} from "../hooks/useQueries";
import PremiumBadge from "./PremiumBadge";

function isPremiumStatus(status: unknown): boolean {
  if (!status || typeof status !== "object") return false;
  return "#premium" in (status as Record<string, unknown>);
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const COUNTRY_FLAGS: Record<string, string> = {
  // Europe
  France: "🇫🇷",
  Espagne: "🇪🇸",
  Italie: "🇮🇹",
  Allemagne: "🇩🇪",
  Portugal: "🇵🇹",
  Belgique: "🇧🇪",
  Suisse: "🇨🇭",
  "Pays-Bas": "🇳🇱",
  UK: "🇬🇧",
  Suède: "🇸🇪",
  Norvège: "🇳🇴",
  Danemark: "🇩🇰",
  Finlande: "🇫🇮",
  Autriche: "🇦🇹",
  Grèce: "🇬🇷",
  Pologne: "🇵🇱",
  Russie: "🇷🇺",
  Roumanie: "🇷🇴",
  Turquie: "🇹🇷",
  // MENA
  Maroc: "🇲🇦",
  Algérie: "🇩🇿",
  Tunisie: "🇹🇳",
  Égypte: "🇪🇬",
  Libye: "🇱🇾",
  Mauritanie: "🇲🇷",
  "Arabie Saoudite": "🇸🇦",
  "Émirats Arabes Unis": "🇦🇪",
  Qatar: "🇶🇦",
  Koweït: "🇰🇼",
  Jordanie: "🇯🇴",
  Liban: "🇱🇧",
  Irak: "🇮🇶",
  Iran: "🇮🇷",
  Syrie: "🇸🇾",
  Palestine: "🇵🇸",
  // Africa
  Sénégal: "🇸🇳",
  "Côte d'Ivoire": "🇨🇮",
  Cameroun: "🇨🇲",
  Mali: "🇲🇱",
  Guinée: "🇬🇳",
  "Burkina Faso": "🇧🇫",
  Niger: "🇳🇪",
  Tchad: "🇹🇩",
  Nigeria: "🇳🇬",
  Ghana: "🇬🇭",
  Éthiopie: "🇪🇹",
  Kenya: "🇰🇪",
  "Afrique du Sud": "🇿🇦",
  Madagascar: "🇲🇬",
  // Americas
  USA: "🇺🇸",
  Canada: "🇨🇦",
  Mexique: "🇲🇽",
  Brésil: "🇧🇷",
  Argentine: "🇦🇷",
  Colombie: "🇨🇴",
  Venezuela: "🇻🇪",
  Chili: "🇨🇱",
  Pérou: "🇵🇪",
  // Asia
  Chine: "🇨🇳",
  Japon: "🇯🇵",
  "Corée du Sud": "🇰🇷",
  Inde: "🇮🇳",
  Pakistan: "🇵🇰",
  Bangladesh: "🇧🇩",
  Indonésie: "🇮🇩",
  Malaisie: "🇲🇾",
  Thaïlande: "🇹🇭",
  Vietnam: "🇻🇳",
  Philippines: "🇵🇭",
};

function getCountryFlag(input: string): string | null {
  if (!input.trim()) return null;
  const normalized = input.trim().toLowerCase();
  const match = Object.keys(COUNTRY_FLAGS).find(
    (key) =>
      key.toLowerCase().includes(normalized) ||
      normalized.includes(key.toLowerCase()),
  );
  return match ? COUNTRY_FLAGS[match] : null;
}

function countryDisplay(country: string): string {
  const flag = getCountryFlag(country);
  return flag ? `${flag} ${country}` : country;
}

type EditableField = "username" | "country" | "email" | null;

interface EditFieldRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  placeholder: string;
  fieldKey: EditableField;
  activeField: EditableField;
  inputValue: string;
  isPending: boolean;
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
  error,
  onStartEdit,
  onCancel,
  onSave,
  onInputChange,
}: EditFieldRowProps) {
  const isEditing = activeField === fieldKey;
  const isCountry = fieldKey === "country";
  const displayValue =
    fieldKey === "country" && value ? countryDisplay(value) : value;
  const liveFlag = isCountry && inputValue ? getCountryFlag(inputValue) : null;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        <span className="text-muted-foreground">{icon}</span>
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
      </div>
      {isEditing ? (
        <div className="space-y-1">
          <div className="relative flex gap-2">
            <div className="relative flex-1">
              {isCountry && liveFlag && (
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base pointer-events-none select-none">
                  {liveFlag}
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
                className={`h-9 text-sm${isCountry && liveFlag ? " pl-10" : ""}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onSave();
                  if (e.key === "Escape") onCancel();
                }}
                autoFocus
              />
            </div>
            <Button
              size="sm"
              type="button"
              onClick={onSave}
              disabled={isPending}
              className="h-9 px-3 bg-[#EA580C] hover:bg-[#c2410c] text-white shrink-0"
              data-ocid={`profile.${fieldKey}_save_button`}
            >
              {isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Check className="h-3.5 w-3.5" />
              )}
            </Button>
            <Button
              size="sm"
              type="button"
              variant="outline"
              onClick={onCancel}
              className="h-9 px-3 shrink-0"
              data-ocid={`profile.${fieldKey}_cancel_button`}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
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
          <span className="text-sm truncate">
            {displayValue ? (
              displayValue
            ) : (
              <span className="text-muted-foreground italic">
                {placeholder}
              </span>
            )}
          </span>
          <Button
            size="sm"
            type="button"
            variant="ghost"
            onClick={() => onStartEdit(fieldKey, value)}
            className="h-7 w-7 p-0 shrink-0 text-muted-foreground hover:text-[#EA580C]"
            data-ocid={`profile.${fieldKey}_edit_button`}
          >
            <Edit2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
}

export default function ProfileScreen() {
  const { identity } = useInternetIdentity();
  const { data: profile, isLoading } = useGetCallerUserProfile();
  const updateUsername = useUpdateUsername();
  const updateCountry = useUpdateCountry();
  const updateEmail = useUpdateEmail();

  const { language, setLanguage } = useLanguage();
  const [activeField, setActiveField] = useState<EditableField>(null);
  const [inputValue, setInputValue] = useState("");
  const [emailError, setEmailError] = useState("");

  if (!identity) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 text-center">
        <User className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-xl font-bold mb-2">Profil</h2>
        <p className="text-muted-foreground">
          Veuillez vous connecter pour voir votre profil.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center min-h-[300px]"
        data-ocid="profile.loading_state"
      >
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleStartEdit = (field: EditableField, current: string) => {
    setEmailError("");
    setInputValue(current);
    setActiveField(field);
  };

  const handleCancel = () => {
    setActiveField(null);
    setInputValue("");
    setEmailError("");
  };

  const handleSave = async () => {
    if (!inputValue.trim()) return;
    try {
      if (activeField === "username") {
        await updateUsername.mutateAsync(inputValue.trim());
      } else if (activeField === "country") {
        await updateCountry.mutateAsync(inputValue.trim());
      } else if (activeField === "email") {
        if (!EMAIL_REGEX.test(inputValue.trim())) {
          setEmailError("Format d'email invalide. Ex\u00a0: nom@exemple.com");
          return;
        }
        await updateEmail.mutateAsync(inputValue.trim());
      }
      handleCancel();
    } catch {
      // errors handled by React Query
    }
  };

  const isSaving =
    updateUsername.isPending ||
    updateCountry.isPending ||
    updateEmail.isPending;

  const isPremium = isPremiumStatus(profile?.status);
  const currentEmail = profile?.email ?? "";

  return (
    <div
      className="max-w-lg mx-auto px-4 py-6 space-y-6"
      data-ocid="profile.page"
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <User className="h-5 w-5 text-primary" />
        <h1 className="text-xl font-bold">Mon Profil</h1>
        {isPremium && <PremiumBadge />}
      </div>

      {/* Mon Identifiant */}
      <Card
        className="border-l-4 border-l-[#EA580C]"
        data-ocid="profile.identifiant.card"
      >
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <User className="h-4 w-4 text-[#EA580C]" />
            Mon Identifiant
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <EditFieldRow
            icon={<User className="h-3.5 w-3.5" />}
            label="Nom d'utilisateur"
            value={profile?.username ?? ""}
            placeholder="Ajouter un nom d'utilisateur"
            fieldKey="username"
            activeField={activeField}
            inputValue={inputValue}
            isPending={isSaving}
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
            isPending={isSaving}
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
            isPending={isSaving}
            error={activeField === "email" ? emailError : undefined}
            onStartEdit={handleStartEdit}
            onCancel={handleCancel}
            onSave={handleSave}
            onInputChange={(val) => {
              setInputValue(val);
              if (emailError) setEmailError("");
            }}
          />

          <div className="h-px bg-border" />

          {/* Language selector */}
          <div className="space-y-2" data-ocid="profile.language.section">
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground">
                <Globe className="h-3.5 w-3.5" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Langue
              </span>
            </div>
            <div
              className="flex gap-2 flex-wrap"
              aria-label="Sélection de la langue"
            >
              {(
                [
                  {
                    code: "ar",
                    flag: "\uD83C\uDDF8\uD83C\uDDE6",
                    label: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629",
                  },
                  {
                    code: "es",
                    flag: "\uD83C\uDDEA\uD83C\uDDF8",
                    label: "Espa\u00F1ol",
                  },
                  {
                    code: "fr",
                    flag: "\uD83C\uDDEB\uD83C\uDDF7",
                    label: "Fran\u00E7ais",
                  },
                ] as { code: "ar" | "es" | "fr"; flag: string; label: string }[]
              ).map(({ code, flag, label }) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLanguage(code)}
                  data-ocid={`profile.language.${code}`}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium border transition-colors duration-150 ${
                    language === code
                      ? "bg-[#EA580C] text-white border-[#EA580C]"
                      : "bg-background text-foreground border-border hover:border-[#EA580C] hover:text-[#EA580C]"
                  }`}
                  aria-pressed={language === code}
                >
                  <span>{flag}</span>
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Info */}
      <Card data-ocid="profile.account.card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Informations du compte</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide block">
              Principal ID
            </span>
            <p className="text-xs font-mono bg-muted rounded px-2 py-1.5 break-all">
              {identity.getPrincipal().toString()}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <Card data-ocid="profile.stats.card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            Statistiques &amp; Progression
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted rounded-lg p-3 text-center">
              <Star className="h-4 w-4 mx-auto mb-1 text-amber-500" />
              <div className="text-lg font-bold">
                {profile?.points?.toString() ?? "0"}
              </div>
              <div className="text-xs text-muted-foreground">Points</div>
            </div>
            <div className="bg-muted rounded-lg p-3 text-center">
              <Award className="h-4 w-4 mx-auto mb-1 text-primary" />
              <div className="text-lg font-bold">
                {profile?.quizScore?.toString() ?? "0"}
              </div>
              <div className="text-xs text-muted-foreground">Score Quiz</div>
            </div>
            <div className="bg-muted rounded-lg p-3 text-center">
              <div className="text-lg font-bold">
                {profile?.tipsGiven?.toString() ?? "0"}
              </div>
              <div className="text-xs text-muted-foreground">
                Conseils donnés
              </div>
            </div>
            <div className="bg-muted rounded-lg p-3 text-center">
              <div className="text-lg font-bold">
                {profile?.scamsReported?.toString() ?? "0"}
              </div>
              <div className="text-xs text-muted-foreground">
                Arnaques signalées
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Badges */}
      {profile?.earnedBadges && profile.earnedBadges.length > 0 && (
        <Card data-ocid="profile.badges.card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Badges obtenus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {profile.earnedBadges.map((badge) => (
                <Badge key={badge} variant="secondary" className="text-xs">
                  {badge}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
