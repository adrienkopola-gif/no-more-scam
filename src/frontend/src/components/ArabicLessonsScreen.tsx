import {
  AlertCircle,
  BookOpen,
  ChevronDown,
  Languages,
  Play,
  Search,
  User,
  Users,
  Volume2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ArabicLesson, LessonTab } from "../data/arabicLessons";
import { lessons, tabLabels } from "../data/arabicLessons";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

// ─── Voice priority & gender detection ──────────────────────────────────────
const LANG_PRIORITY = ["ar-MA", "ar-DZ", "ar-TN", "ar-SA", "ar-EG", "ar"];

const FEMALE_KEYWORDS = [
  "female",
  "femme",
  "samira",
  "hana",
  "layla",
  "nora",
  "amira",
  "fatima",
  "zara",
  "yasmin",
];
const MALE_KEYWORDS = [
  "male",
  "homme",
  "omar",
  "yousef",
  "majed",
  "naayf",
  "hamed",
  "tarik",
];

type VoiceGender = "female" | "male";

interface RankedVoice {
  voice: SpeechSynthesisVoice;
  gender: VoiceGender;
  priority: number; // lower = better
  label: string;
}

function detectGender(name: string): VoiceGender {
  const lower = name.toLowerCase();
  if (FEMALE_KEYWORDS.some((k) => lower.includes(k))) return "female";
  if (MALE_KEYWORDS.some((k) => lower.includes(k))) return "male";
  return "male"; // default
}

function getVoicePriority(lang: string): number {
  for (let i = 0; i < LANG_PRIORITY.length; i++) {
    if (lang === LANG_PRIORITY[i]) return i;
    // e.g. "ar-MA-x-something" starts with "ar-MA"
    if (lang.startsWith(LANG_PRIORITY[i])) return i;
  }
  // any other ar-* still better than nothing
  if (lang.startsWith("ar")) return LANG_PRIORITY.length;
  return 99;
}

function buildVoiceShortName(voice: SpeechSynthesisVoice): string {
  // Strip language suffixes and common noise from the name for display
  return voice.name
    .replace(/\(.*?\)/g, "")
    .replace(/Microsoft/gi, "")
    .replace(/Online \(Natural\)/gi, "")
    .replace(/- Arabic.*$/i, "")
    .trim()
    .replace(/\s+/g, " ");
}

function selectTopVoices(allVoices: SpeechSynthesisVoice[]): RankedVoice[] {
  // Only keep Arabic voices (any priority < 99 or starts with 'ar')
  const arabicVoices = allVoices.filter((v) => v.lang.startsWith("ar"));
  if (arabicVoices.length === 0) return [];

  const ranked: RankedVoice[] = arabicVoices.map((v) => ({
    voice: v,
    gender: detectGender(v.name),
    priority: getVoicePriority(v.lang),
    label: buildVoiceShortName(v),
  }));

  // Sort by priority (ascending)
  ranked.sort(
    (a, b) =>
      a.priority - b.priority || a.voice.name.localeCompare(b.voice.name),
  );

  const females: RankedVoice[] = [];
  const males: RankedVoice[] = [];

  for (const rv of ranked) {
    if (rv.gender === "female" && females.length < 3) females.push(rv);
    else if (rv.gender === "male" && males.length < 3) males.push(rv);
    if (females.length === 3 && males.length === 3) break;
  }

  // If not enough gendered voices, fill from remaining ranked list
  const selected = new Set([...females, ...males]);
  if (selected.size < 6) {
    for (const rv of ranked) {
      if (!selected.has(rv) && selected.size < 6) selected.add(rv);
    }
  }

  // Return maintaining gender grouping: females first, then males
  return [...females, ...males.filter((m) => !females.includes(m))];
}

// ─── AudioContext pre-warm ────────────────────────────────────────────────────
// Plays a 1ms silent buffer to unlock the audio policy in Edge/Chrome before
// calling speechSynthesis. Does NOT produce any sound.
function prewarmAudio(): void {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const buf = ctx.createBuffer(1, 1, 22050);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(ctx.destination);
    src.start(0);
    setTimeout(() => ctx.close(), 100);
  } catch {
    // Silently ignore — this is just a pre-warm
  }
}

// ─── Primary: Web Speech Synthesis — definitive Edge fix ─────────────────────
function speakArabic(
  text: string,
  selectedVoice: SpeechSynthesisVoice | null,
  onStart: () => void,
  onEnd: () => void,
  onError: (err: string) => void,
): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    onError("Web Speech Synthesis non disponible sur ce navigateur.");
    return;
  }

  prewarmAudio();
  window.speechSynthesis.cancel();
  window.speechSynthesis.resume();

  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = selectedVoice?.lang ?? "ar-SA";
  utt.rate = 0.8;
  utt.volume = 1.0;

  if (selectedVoice) {
    utt.voice = selectedVoice;
  } else {
    // Fallback: pick best available arabic voice
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      utt.voice =
        voices.find((v) => v.lang === "ar-MA") ??
        voices.find((v) => v.lang === "ar-SA") ??
        voices.find((v) => v.lang.startsWith("ar")) ??
        voices[0];
    }
  }

  utt.onstart = () => onStart();
  utt.onend = () => onEnd();
  utt.onerror = (e) => onError(`Erreur vocale : ${e.error}`);

  try {
    window.speechSynthesis.speak(utt);
  } catch (err) {
    onError(
      `Erreur speechSynthesis.speak() : ${err instanceof Error ? err.message : String(err)}`,
    );
  }
}

// ─── Voice selector component ─────────────────────────────────────────────────
interface VoiceSelectorProps {
  voices: RankedVoice[];
  selected: RankedVoice | null;
  onSelect: (rv: RankedVoice) => void;
}

function VoiceSelector({ voices, selected, onSelect }: VoiceSelectorProps) {
  if (voices.length === 0) return null;

  const females = voices.filter((v) => v.gender === "female");
  const males = voices.filter((v) => v.gender === "male");

  const renderGroup = (
    group: RankedVoice[],
    icon: React.ReactNode,
    label: string,
  ) => {
    if (group.length === 0) return null;
    return (
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
          {icon}
          {label}
        </p>
        <div className="flex flex-col gap-1.5">
          {group.map((rv) => {
            const isActive = selected?.voice.name === rv.voice.name;
            return (
              <button
                key={rv.voice.name}
                type="button"
                data-ocid={`arabic.voice_chip.${rv.voice.name.replace(/\s+/g, "-").toLowerCase()}`}
                onClick={() => onSelect(rv)}
                className={[
                  "w-full text-left px-3 py-2 rounded-xl border text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  isActive
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-background text-foreground border-border hover:bg-muted/60 hover:border-primary/40",
                ].join(" ")}
                aria-pressed={isActive}
              >
                <span className="truncate block">{rv.label}</span>
                <span
                  className={`text-xs mt-0.5 block ${isActive ? "text-primary-foreground/70" : "text-muted-foreground"}`}
                >
                  {rv.voice.lang}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div
      data-ocid="arabic.voice_selector"
      className="rounded-2xl border border-border bg-card px-5 py-4 mb-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Volume2 className="h-4 w-4 text-primary" />
        <p className="text-sm font-semibold text-foreground">Choisir la voix</p>
        <span className="ml-auto text-xs text-muted-foreground">
          Accent proche du marocain
        </span>
      </div>
      <div className="flex gap-4">
        {renderGroup(
          females,
          <User className="h-3.5 w-3.5 text-pink-500" />,
          "Voix féminines",
        )}
        {females.length > 0 && males.length > 0 && (
          <div className="w-px bg-border self-stretch" />
        )}
        {renderGroup(
          males,
          <Users className="h-3.5 w-3.5 text-blue-500" />,
          "Voix masculines",
        )}
      </div>
    </div>
  );
}

// ─── Pronunciation guide card ─────────────────────────────────────────────────
interface PronunciationPanelProps {
  lesson: ArabicLesson;
  onClose: () => void;
}

function PronunciationPanel({ lesson, onClose }: PronunciationPanelProps) {
  return (
    <section
      aria-label="Guide de prononciation"
      className="rounded-xl border border-primary/25 bg-primary/5 p-4 mt-1 animate-in slide-in-from-top-1 duration-200"
    >
      {/* Arabic word large */}
      <div className="text-center mb-3">
        <span
          className="text-4xl font-bold text-foreground"
          dir="rtl"
          lang="ar"
        >
          {lesson.arabic}
        </span>
      </div>

      {/* Phonetic grid */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-background rounded-lg p-3 border border-border">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">
            Phonétique
          </p>
          <p className="text-lg font-bold text-primary">{lesson.phonetic}</p>
        </div>
        <div className="bg-background rounded-lg p-3 border border-border">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">
            Traduction
          </p>
          <p className="text-sm font-medium text-foreground">{lesson.french}</p>
        </div>
      </div>

      {/* Pronunciation tip */}
      {lesson.pronunciationTip && (
        <div className="flex items-start gap-2 rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-2 mb-3">
          <BookOpen className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-700 dark:text-amber-300">
            {lesson.pronunciationTip}
          </p>
        </div>
      )}

      {/* Syllable breakdown */}
      <div className="flex flex-wrap gap-2 justify-center mb-3">
        {lesson.phonetic.split("-").map((syllable) => (
          <span
            key={syllable}
            className="inline-flex items-center px-3 py-1 rounded-full bg-primary/15 text-primary text-sm font-semibold border border-primary/25"
          >
            {syllable}
          </span>
        ))}
      </div>

      <button
        type="button"
        onClick={onClose}
        className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors py-1"
      >
        Fermer le guide
      </button>
    </section>
  );
}

// ─── Lesson card ──────────────────────────────────────────────────────────────
interface LessonCardProps {
  lesson: ArabicLesson;
  index: number;
  isExpanded: boolean;
  isSpeaking: boolean;
  onToggleGuide: () => void;
  onListen: () => void;
}

function LessonCard({
  lesson,
  index,
  isExpanded,
  isSpeaking,
  onToggleGuide,
  onListen,
}: LessonCardProps) {
  return (
    <div data-ocid={`arabic.item.${index + 1}`}>
      <Card className="transition-shadow hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-3">
            {/* Arabic word — right-aligned */}
            <div className="flex-1 min-w-0">
              <p className="text-2xl font-bold text-right" dir="rtl" lang="ar">
                {lesson.arabic}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Listen button */}
              <button
                type="button"
                onClick={onListen}
                aria-label="Écouter la prononciation"
                data-ocid={`arabic.listen_button.${index + 1}`}
                className={[
                  "rounded-full p-2 border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  isSpeaking
                    ? "bg-primary text-primary-foreground border-primary shadow-md scale-110"
                    : "bg-primary/10 text-primary border-primary/30 hover:bg-primary/20 hover:border-primary/60",
                ].join(" ")}
              >
                <Volume2 className="h-4 w-4" />
              </button>

              {/* Pronunciation guide toggle */}
              <button
                type="button"
                onClick={onToggleGuide}
                aria-label="Voir la prononciation"
                aria-expanded={isExpanded}
                data-ocid={`arabic.guide_button.${index + 1}`}
                className={[
                  "rounded-full p-2 border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  isExpanded
                    ? "bg-secondary text-secondary-foreground border-secondary/60"
                    : "bg-secondary/10 text-secondary-foreground border-secondary/30 hover:bg-secondary/20",
                ].join(" ")}
              >
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pb-3">
          <p className="text-base font-semibold text-foreground">
            {lesson.transliteration}
          </p>
          <p className="text-sm text-muted-foreground mt-0.5">
            {lesson.french}
          </p>
        </CardContent>
      </Card>

      {/* Inline pronunciation guide expansion */}
      {isExpanded && (
        <PronunciationPanel lesson={lesson} onClose={onToggleGuide} />
      )}
    </div>
  );
}

// ─── Placeholder video data ───────────────────────────────────────────────────
const placeholderVideos = [
  {
    title: "Leçon 1 — Les salutations",
    gradient: "from-primary/20 to-primary/5",
  },
  {
    title: "Leçon 2 — Les chiffres",
    gradient: "from-secondary/20 to-secondary/5",
  },
  {
    title: "Leçon 3 — Au marché",
    gradient: "from-accent/20 to-accent/5",
  },
];

// ─── Main component ───────────────────────────────────────────────────────────
export default function ArabicLessonsScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [rankedVoices, setRankedVoices] = useState<RankedVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<RankedVoice | null>(null);
  const speakingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Pre-load voices on mount and build the ranked list
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const load = () => {
      const all = window.speechSynthesis.getVoices();
      const top = selectTopVoices(all);
      setRankedVoices(top);
      setSelectedVoice((prev) => prev ?? (top.length > 0 ? top[0] : null));
    };
    load();
    window.speechSynthesis.addEventListener("voiceschanged", load);
    return () =>
      window.speechSynthesis.removeEventListener("voiceschanged", load);
  }, []);

  const filterLessons = useCallback(
    (lessonList: ArabicLesson[]) => {
      if (!searchQuery.trim()) return lessonList;
      const q = searchQuery.toLowerCase();
      return lessonList.filter(
        (l) =>
          l.french.toLowerCase().includes(q) ||
          l.transliteration.toLowerCase().includes(q) ||
          l.arabic.includes(q),
      );
    },
    [searchQuery],
  );

  // CRITICAL: speakArabic() MUST be called synchronously inside the click handler.
  // No async/await before speak() — Edge will block it as non-user-initiated.
  const handleListen = useCallback(
    (lesson: ArabicLesson) => {
      setAudioError(null);
      setSpeakingId(lesson.arabic);
      if (speakingTimerRef.current) clearTimeout(speakingTimerRef.current);

      speakArabic(
        lesson.arabic,
        selectedVoice?.voice ?? null,
        () => {
          /* onstart — visual state already set above */
        },
        () => {
          setSpeakingId(null);
          if (speakingTimerRef.current) clearTimeout(speakingTimerRef.current);
        },
        (err) => {
          setSpeakingId(null);
          setAudioError(err);
          if (speakingTimerRef.current) clearTimeout(speakingTimerRef.current);
        },
      );

      speakingTimerRef.current = setTimeout(() => setSpeakingId(null), 6000);
    },
    [selectedVoice],
  );

  const handleToggleGuide = useCallback(
    (id: string) => setExpandedId((prev) => (prev === id ? null : id)),
    [],
  );

  return (
    <div className="container py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Languages className="h-8 w-8 text-primary" />
          Leçons d'Arabe Marocain
        </h1>
        <p className="text-muted-foreground mb-4">
          Apprenez les phrases essentielles du darija pour votre voyage au Maroc
        </p>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une phrase..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-ocid="arabic.search_input"
          />
        </div>
      </div>

      {/* Voice selector */}
      <VoiceSelector
        voices={rankedVoices}
        selected={selectedVoice}
        onSelect={setSelectedVoice}
      />

      {/* Audio error banner */}
      {audioError && (
        <div
          data-ocid="arabic.error_state"
          className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 mb-4 text-sm"
        >
          <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-destructive mb-0.5">
              Problème audio
            </p>
            <p className="text-xs text-destructive/80 break-words">
              {audioError}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setAudioError(null)}
            aria-label="Fermer l'erreur"
            className="flex-shrink-0 text-destructive/60 hover:text-destructive transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Audio info banner */}
      <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 mb-6 text-sm">
        <Volume2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="font-medium text-foreground mb-0.5">
            Prononciation interactive
          </p>
          <p className="text-muted-foreground text-xs leading-relaxed">
            Cliquez sur{" "}
            <Volume2 className="inline h-3.5 w-3.5 mx-0.5 text-primary" /> pour
            écouter la prononciation du mot en arabe. Cliquez sur{" "}
            <ChevronDown className="inline h-3.5 w-3.5 mx-0.5" /> pour voir le
            guide phonétique complet.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="greetings" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          {(Object.keys(tabLabels) as LessonTab[]).map((tab) => (
            <TabsTrigger key={tab} value={tab} data-ocid={`arabic.${tab}_tab`}>
              {tabLabels[tab]}
            </TabsTrigger>
          ))}
          <TabsTrigger value="videos" data-ocid="arabic.videos_tab">
            Vidéos
          </TabsTrigger>
        </TabsList>

        {(Object.keys(lessons) as LessonTab[]).map((tab) => (
          <TabsContent key={tab} value={tab} className="space-y-3 mt-4">
            {filterLessons(lessons[tab]).length === 0 ? (
              <div
                data-ocid="arabic.empty_state"
                className="text-center py-12 text-muted-foreground"
              >
                <Search className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p>Aucun résultat pour « {searchQuery} »</p>
              </div>
            ) : (
              filterLessons(lessons[tab]).map((lesson, index) => (
                <LessonCard
                  key={lesson.arabic}
                  lesson={lesson}
                  index={index}
                  isExpanded={expandedId === lesson.arabic}
                  isSpeaking={speakingId === lesson.arabic}
                  onToggleGuide={() => handleToggleGuide(lesson.arabic)}
                  onListen={() => handleListen(lesson)}
                />
              ))
            )}
          </TabsContent>
        ))}

        {/* Videos tab */}
        <TabsContent value="videos" className="space-y-6 mt-4">
          <div className="text-center pt-4 pb-2">
            <h2 className="text-2xl font-bold mb-2">Vidéos pédagogiques</h2>
            <p className="text-muted-foreground mb-3">
              Des courtes vidéos pour apprendre le darija marocain avec un
              enseignant natif.
            </p>
            <Badge
              data-ocid="arabic.videos_coming_soon_badge"
              className="bg-primary/15 text-primary border-primary/30 hover:bg-primary/20"
              variant="outline"
            >
              Bientôt disponible
            </Badge>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {placeholderVideos.map((video, i) => (
              <Card
                key={video.title}
                data-ocid={`arabic.video_card.${i + 1}`}
                className="overflow-hidden"
              >
                <div
                  className={`relative flex items-center justify-center bg-gradient-to-br ${
                    video.gradient
                  } h-36 border-b border-border`}
                >
                  <div className="flex items-center justify-center w-14 h-14 rounded-full bg-background/70 border border-border shadow-sm">
                    <Play className="h-6 w-6 text-primary fill-primary/30" />
                  </div>
                </div>
                <CardContent className="pt-3 pb-4">
                  <p className="font-medium text-sm leading-snug">
                    {video.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Disponible prochainement
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <p
            data-ocid="arabic.videos_note"
            className="text-center text-sm text-muted-foreground pb-2"
          >
            Vos vidéos seront intégrées ici prochainement.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
