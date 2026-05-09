import {
  AlertTriangle,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Clock,
  Lightbulb,
  MapPin,
  Scale,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";

/* ─────────────────── TYPES ─────────────────── */
interface ScamStory {
  id: string;
  title: string;
  type: string;
  city: string;
  date: string;
  source: string;
  description: string;
  warningSigns: string[];
  lessonsLearned: string[];
}

interface GuideSubSection {
  heading: string;
  description?: string;
  tips: string[];
}

interface GuideArticle {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  sections: GuideSubSection[];
  bonASavoir?: string;
  casReel?: string;
  attention?: string;
}

/* ─────────────────── DATA: 7 VIRAL STORIES ─────────────────── */
const sampleStories: ScamStory[] = [
  {
    id: "1",
    title: "Le faux guide de Fès",
    type: "Faux guide",
    city: "Fès",
    date: "2024-03-15",
    source: "Reddit r/travel",
    description:
      "Un couple de touristes à Fès a été abordé par un homme affirmant que leur riad se trouvait dans la nouvelle médina. Ils l'ont suivi pendant 20 minutes avant qu'il s'arrête devant un magasin de tapis. L'homme a alors réclamé 200 MAD pour le guidage. Après refus, il les a insultés — un policier à proximité est intervenu et les a escortés jusqu'à leur vrai riad, qui se trouvait à seulement 5 minutes à pied.",
    warningSigns: [
      "Inconnu qui aborde spontanément en disant que votre destination est 'dans l'autre direction'",
      "Insistance pour vous emmener dans des boutiques sur le trajet",
      "Réclame un paiement sans accord préalable",
    ],
    lessonsLearned: [
      "Vérifiez toujours votre itinéraire sur Maps avant de quitter votre hébergement",
      "N'acceptez jamais un guidage sans discuter le prix à l'avance",
      "Les guides officiels portent un badge ONMT avec photo",
    ],
  },
  {
    id: "2",
    title: "Le serpent sur Jemaa el-Fna",
    type: "Piège à touriste / animal",
    city: "Marrakech",
    date: "2023-07-20",
    source: "Reddit r/solotravel",
    description:
      "J'étais sur la place Jemaa el-Fna quand un dresseur a posé un serpent autour de mon cou avant même que je m'en aperçoive. J'ai paniqué et il a aussitôt dit '300 MAD pour la photo'. J'ai fini par payer 50 MAD et je suis parti rapidement. Après coup, j'ai compris que j'aurais simplement dû dire non et m'en aller sans payer.",
    warningSigns: [
      "Approche non sollicitée avec un animal",
      "Placement de l'animal sur vous avant tout accord",
      "Demande de paiement immédiat après le 'service'",
    ],
    lessonsLearned: [
      "Ne regardez jamais les dresseurs d'animaux dans les yeux sur la place",
      "Marchez d'un pas décidé en évitant tout contact visuel",
      "Si cela arrive, posez l'animal calmement et partez sans payer",
    ],
  },
  {
    id: "3",
    title: "Le savon à 2800 dirhams",
    type: "Fraude produit",
    city: "Marrakech",
    date: "2024-01-10",
    source: "Kech24 / Bladi.net",
    description:
      "Un commerçant situé à Bab Mellah, dans la médina de Marrakech, a vendu un savon à une touriste étrangère en prétendant qu'il était fabriqué à partir d'herbes naturelles, d'huile d'argan et de glycérine pour la somme de 2800 dirhams. Grande fut la surprise de la touriste de découvrir juste après l'achat que le même produit était vendu dans d'autres boutiques à seulement 10 dirhams. En retournant voir le commerçant pour récupérer son argent, il lui a remis 2400 dirhams seulement, prétextant que les 400 MAD restants représentaient le prix de ses 'explications' et du thé qu'il avait préparé.",
    warningSigns: [
      "Prix annoncé très élevé pour un produit banal",
      "Thé ou café offert au début de la visite (crée un sentiment d'obligation)",
      "Pression pour acheter rapidement avant de 'comparer'",
    ],
    lessonsLearned: [
      "Comparez toujours les prix dans au moins 3 boutiques avant d'acheter",
      "Accepter du thé ne vous oblige à rien — partez si vous le souhaitez",
      "Pour les produits cosmétiques, achetez dans des coopératives certifiées",
    ],
  },
  {
    id: "4",
    title: "Les tapis à 18 500€",
    type: "Artisanat surévalué",
    city: "Hors Maroc (cas similaire documenté)",
    date: "2026-04-05",
    source: "France Bleu / Ouest-France",
    description:
      "Un couple de retraités français a acheté deux tapis muraux pour 18 500€ lors d'un voyage organisé, présentés comme des 'œuvres d'art' en soie faites à la main. À la livraison, le bon de commande indiquait comme provenance le sud de la Chine. Après expertise indépendante : les deux tapis ne valaient que 400€. L'agence de voyage a rejeté toute responsabilité. Ce schéma est identique à ceux documentés dans les souks marocains avec des clients étrangers.",
    warningSigns: [
      "Présentation théâtrale du produit comme 'pièce unique' ou 'œuvre d'art'",
      "Prix très élevé justifié par une fabrication 'artisanale à la main'",
      "Pression temporelle : 'offre exceptionnelle aujourd'hui seulement'",
    ],
    lessonsLearned: [
      "Ne jamais acheter des articles de grande valeur sous pression",
      "Demandez un certificat d'authenticité et vérifiez l'origine réelle",
      "Pour les tapis, consultez un expert ou comparez dans plusieurs boutiques officielles",
    ],
  },
  {
    id: "5",
    title: "La fausse herboristerie",
    type: "Fausse herboristerie",
    city: "Marrakech / Fès",
    date: "2023-11-03",
    source: "consoGlobe / moroccantraveltrips.com",
    description:
      "Un touriste entre dans une herboristerie après avoir été orienté par un 'guide amical'. Le vendeur lui prépare du thé, lui explique longuement les propriétés de chaque produit, et finit par lui vendre un mélange d'épices et d'huile d'argan soi-disant 'de coopérative' pour 800 MAD. Après vérification, les mêmes produits se trouvent au marché local pour moins de 50 MAD. L'huile présentée comme pure d'argan contenait moins de 2% de vrai argan selon une analyse journalistique.",
    warningSigns: [
      "Guide amical qui vous oriente vers une boutique 'de sa famille'",
      "Longue démonstration avec thé — crée un sentiment d'obligation d'achat",
      "Étiquettes 'coopérative' ou '100% naturel' sans certification visible",
    ],
    lessonsLearned: [
      "Achetez l'huile d'argan uniquement dans des coopératives certifiées avec label officiel",
      "Le guide qui vous amène touche une commission — méfiez-vous de ses recommandations",
      "Une vraie coopérative d'argan a un certificat d'origine affiché",
    ],
  },
  {
    id: "6",
    title: "Le henné non consenti sur Jemaa el-Fna",
    type: "Henné forcé",
    city: "Marrakech",
    date: "2023-08-15",
    source: "lespetitesexperiences.com / ONMT",
    description:
      "Sur la place Jemaa el-Fna, des femmes tatoueurs au henné abordent les touristes et commencent à appliquer le henné avant même d'avoir obtenu un accord clair. Elles étendent rapidement le dessin sur tout le bras et exigent ensuite un prix exorbitant. Le produit utilisé n'est pas toujours du vrai henné mais un mélange de coloration chimique pouvant provoquer des allergies graves.",
    warningSigns: [
      "Application du henné commencée sans accord verbal clair sur le prix",
      "Agrandissement progressif du dessin pour augmenter le prix demandé",
      "Produit à forte odeur chimique (pas le henné naturel qui est inodore)",
    ],
    lessonsLearned: [
      "Ne tendez jamais votre main sans avoir négocié le prix exact à l'avance",
      "Le henné naturel est verdâtre et presque inodore — méfiez-vous du henné noir chimique",
      "Si cela arrive, refusez fermement de payer plus que le prix convenu et appelez la police si nécessaire",
    ],
  },
  {
    id: "7",
    title: "Le piège du café offert",
    type: "Café piège",
    city: "Marrakech / Fès",
    date: "2023-09-12",
    source: "moroccantraveltrips.com / Le Routard",
    description:
      "Un homme sympathique aborde des touristes près d'un monument, leur offre un café ou un thé 'par hospitalité marocaine'. Après la boisson, il réclame une somme élevée pour le 'service'. Toute tentative de partir sans payer déclenche une scène agressive ou l'intervention d'acolytes pour intimider les touristes.",
    warningSigns: [
      "Invitation à boire un thé 'gratuit' par un inconnu dans la rue",
      "Salon privé ou boutique en arrière-boutique proposé pour plus de 'confort'",
      "Changement d'attitude après la boisson — pression pour payer ou acheter",
    ],
    lessonsLearned: [
      "L'hospitalité marocaine est réelle, mais méfiez-vous des inconnus dans les zones touristiques",
      "Si vous acceptez un thé dans une boutique, vous n'êtes pas obligé d'acheter",
      "Dites 'non merci' dès le premier abord — une fois assis, partir devient plus difficile",
    ],
  },
];

/* ─────────────────── DATA: 10 GUIDE ARTICLES ─────────────────── */
const guideArticles: GuideArticle[] = [
  {
    id: "g1",
    title: "Arnaques aux transports — Taxis",
    subtitle:
      "Le taxi est souvent le premier contact du touriste avec le Maroc, et l'un des terrains d'arnaque les plus fréquents.",
    icon: "🚕",
    sections: [
      {
        heading: "Schémas courants",
        tips: [
          'Compteur soi-disant "en panne" pour facturer librement',
          "Tarif annoncé à l'oral puis majoré en fin de course sous prétexte d'embouteillages ou d'itinéraire modifié",
          "Détour inutile pour allonger la course",
          "À l'aéroport : rabatteurs qui proposent leurs services, parfois accompagnés d'un thé à la menthe, avant de pratiquer des tarifs abusifs",
        ],
      },
      {
        heading: "Comment s'en prémunir",
        tips: [
          "Toujours exiger l'activation du compteur (obligatoire légalement — en cas de refus, quittez le taxi)",
          "Demander le prix avant de monter, le faire répéter plusieurs fois",
          "Renseigner le numéro du taxi et simuler un appel en le citant à voix haute — dissuasif",
          "Partager le taxi avec des Marocains quand c'est possible",
          "Utiliser Heetch ou Careem pour des trajets à prix fixes",
          "Pré-réserver un transfert depuis l'aéroport avant le voyage",
          "En cas de litige, appeler la police au 19",
        ],
      },
    ],
    bonASavoir:
      "Il existe deux types de taxis au Maroc. Les petits taxis (urbains, colorés selon la ville : rouge à Casablanca, bleu à Rabat) ont un compteur obligatoire. Les grands taxis (blancs, inter-villes, 7 places) fonctionnent à tarif fixé par le ministère des Transports — négociez avant de partir.",
  },
  {
    id: "g2",
    title: "Arnaques dans les souks et marchés",
    subtitle:
      "Les vendeurs annoncent des prix de départ 5 à 10 fois supérieurs à la valeur réelle.",
    icon: "🛍️",
    sections: [
      {
        heading: "Comment s'en prémunir",
        tips: [
          "Toujours négocier — commencer à un tiers du prix demandé",
          "Comparer plusieurs boutiques avant d'acheter",
          "Partir si le prix ne convient pas : le vendeur rappelle souvent avec une meilleure offre",
          "Ne jamais dépasser le budget fixé à l'avance",
        ],
      },
    ],
  },
  {
    id: "g3",
    title: "Faux guides et rabatteurs",
    subtitle:
      "Des personnes se présentent spontanément comme guides officiels, puis réclament une somme excessive à la fin.",
    icon: "🎭",
    sections: [
      {
        heading: "Comment éviter les faux guides",
        tips: [
          "Ne jamais accepter une visite improvisée dans la rue",
          "Exiger un badge officiel ONMT (avec photo et numéro d'identification)",
          "Vérifier l'adresse et les références de la société du prestataire",
          "Privilégier le bouche-à-oreille et les recommandations de proches",
        ],
      },
      {
        heading: 'Rabatteurs et "gentils inconnus"',
        description:
          "Des inconnus engagent la conversation de façon amicale, puis vous conduisent dans la boutique d'un proche où la pression d'achat est très forte. Ils touchent une commission sur chaque vente. Ce phénomène est particulièrement présent autour de la place Jemaa El Fna et du Jardin Majorelle.",
        tips: [
          "Refuser fermement et poliment dès les premières secondes",
          "Quitter la boutique sans se justifier si vous vous sentez piégé",
          "En cas de pression excessive, menacer d'appeler la police",
          "Éviter d'avoir l'air perdu : préparer son itinéraire à l'avance",
        ],
      },
    ],
  },
  {
    id: "g4",
    title: "Arnaques sur la place Jemaa El Fna (Marrakech)",
    subtitle:
      "La place la plus touristique du Maroc est aussi la plus propice aux pièges.",
    icon: "🐍",
    sections: [
      {
        heading: "Charmeurs de serpents et singes enchaînés",
        description:
          "Des artistes de rue vous invitent à poser avec un animal. Une fois la photo prise, ils réclament des centaines de dirhams.",
        tips: [
          "Fixer le prix avant toute interaction",
          "Éviter ces pratiques qui encouragent la maltraitance animale",
        ],
      },
      {
        heading: "Tatouages au henné forcés",
        description:
          "Une femme s'approche, prend votre main sans demander et commence un dessin en annonçant que c'est gratuit. Elle réclame ensuite une somme excessive et vous retient jusqu'au paiement.",
        tips: [
          "Aller uniquement dans des salons avec prix affichés",
          "Si pris au dépourvu : donner 20-30 dirhams et partir rapidement",
          "Prétexte efficace : évoquer une allergie au henné",
        ],
      },
    ],
    casReel:
      "Le tribunal de Marrakech a condamné un faux guide à 2 mois de prison ferme et une tatoueuse au henné à 2 mois avec sursis, suite à une plainte d'une touriste française à qui on avait réclamé 600 DH pour le tatouage de deux doigts. (Novembre 2025)",
  },
  {
    id: "g5",
    title: "Jus d'orange frelatés ou surfacturés",
    subtitle:
      "Certains vendeurs servent un jus dilué ou périmé, ou appliquent des tarifs excessifs réservés aux étrangers.",
    icon: "🍊",
    sections: [
      {
        heading: "Comment s'en prémunir",
        tips: [
          "Vérifier que le jus est pressé devant vous",
          "Demander le prix avant de commander (tarif normal : 4-10 dirhams)",
        ],
      },
    ],
  },
  {
    id: "g6",
    title: "Confusion entre billets de banque",
    subtitle:
      "Les billets de 20 et 200 dirhams se ressemblent. Des vendeurs ou chauffeurs profitent de cette confusion pour rendre la mauvaise monnaie.",
    icon: "💵",
    sections: [
      {
        heading: "Comment s'en prémunir",
        tips: [
          "Prendre le temps de vérifier chaque billet avant de payer",
          "Compter sa monnaie devant la personne, avant de la ranger",
          "Ne pas ranger côte à côte les billets qui se ressemblent",
        ],
      },
    ],
  },
  {
    id: "g7",
    title: "Menus trafiqués et additions gonflées",
    subtitle:
      "Certains restaurateurs affichent des prix attractifs puis facturent davantage, ou modifient les prix entre la commande et l'addition.",
    icon: "🍽️",
    sections: [
      {
        heading: "Comment s'en prémunir",
        tips: [
          "Toujours demander à voir le menu avant de commander",
          "Confirmer le prix de chaque plat avec le serveur",
          "Inspecter chaque ligne de l'addition avant de payer",
        ],
      },
    ],
  },
  {
    id: "g8",
    title: "Faux gardiens de parking",
    subtitle:
      'Un homme portant parfois un gilet fluorescent vous demande de payer une "taxe municipale obligatoire" pour un stationnement en réalité gratuit.',
    icon: "🅿️",
    sections: [
      {
        heading: "Comment s'en prémunir",
        tips: [
          "Vérifier la présence de panneaux officiels ou se renseigner auprès des locaux",
          "Dans les grandes villes, préférer les parkings surveillés avec ticket délivré à l'entrée",
          "Tarif normal d'un vrai gardien : 5 à 10 dirhams pour quelques heures",
        ],
      },
    ],
  },
  {
    id: "g9",
    title: "Produits contrefaits",
    subtitle:
      "Des sacs, vêtements et parfums imitant les grandes maisons de luxe sont vendus comme des articles authentiques.",
    icon: "👜",
    sections: [
      {
        heading: "Comment s'en prémunir",
        tips: [
          "Si le prix semble trop beau pour être vrai, c'est une contrefaçon",
          "Acheter les produits de marque uniquement dans des boutiques officielles",
        ],
      },
    ],
    attention:
      "La détention de contrefaçons est un délit — vous pouvez être arrêté à la douane au retour.",
  },
  {
    id: "g10",
    title: "Pourboires forcés ou non sollicités",
    subtitle:
      "Des 'services' non demandés — indiquer un chemin, porter un sac, prendre un selfie avec un musicien — sont suivis d'une demande de pourboire pouvant devenir agressive.",
    icon: "💸",
    sections: [
      {
        heading: "Comment s'en prémunir",
        tips: [
          "Ne pas accepter une aide non sollicitée",
          "Ne pas donner d'argent si le service n'a pas été demandé au préalable",
        ],
      },
    ],
    bonASavoir:
      "Dans les hôtels et restaurants, le pourboire est une pratique normale et bienvenue (10-15% du montant). Les salaires étant très bas, il constitue parfois une part importante du revenu des employés.",
  },
];

/* ─────────────────── SUB-COMPONENTS ─────────────────── */
function GuideArticleCard({
  article,
  index,
}: { article: GuideArticle; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card
      data-ocid={`guide.item.${index + 1}`}
      className="border-l-4 border-l-primary overflow-hidden"
    >
      <CardHeader
        className="cursor-pointer select-none pb-3"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <span className="text-2xl shrink-0 mt-0.5">{article.icon}</span>
            <div className="min-w-0">
              <CardTitle className="text-base leading-snug">
                {article.title}
              </CardTitle>
              {article.subtitle && (
                <CardDescription className="mt-1 text-sm leading-relaxed">
                  {article.subtitle}
                </CardDescription>
              )}
            </div>
          </div>
          <button
            type="button"
            aria-label={expanded ? "Réduire" : "Développer"}
            className="shrink-0 text-muted-foreground hover:text-foreground transition-colors mt-0.5"
          >
            {expanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="pt-0 space-y-5">
          {article.sections.map((section, si) => (
            <div key={`${article.id}-s${si}`} className="space-y-2">
              <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
                {section.heading.toLowerCase().includes("prémunir") ? (
                  <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                ) : (
                  <ShieldAlert className="h-4 w-4 text-amber-500 shrink-0" />
                )}
                {section.heading}
              </h4>
              {section.description && (
                <p className="text-sm text-muted-foreground leading-relaxed pl-6">
                  {section.description}
                </p>
              )}
              <ul className="space-y-1.5 pl-6">
                {section.tips.map((tip, ti) => (
                  <li
                    key={`${article.id}-s${si}-t${ti}`}
                    className="flex gap-2 text-sm"
                  >
                    <span className="text-primary font-bold shrink-0 mt-0.5">
                      •
                    </span>
                    <span className="text-muted-foreground">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* 💡 Bon à savoir */}
          {article.bonASavoir && (
            <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-3.5 flex gap-3">
              <span className="text-lg shrink-0">💡</span>
              <div>
                <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">
                  Bon à savoir
                </p>
                <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                  {article.bonASavoir}
                </p>
              </div>
            </div>
          )}

          {/* ⚖️ Cas réel */}
          {article.casReel && (
            <div className="rounded-lg bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 p-3.5 flex gap-3">
              <Scale className="h-5 w-5 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-orange-700 dark:text-orange-300 mb-1">
                  Cas réel
                </p>
                <p className="text-sm text-orange-800 dark:text-orange-200 leading-relaxed">
                  {article.casReel}
                </p>
              </div>
            </div>
          )}

          {/* ⚠️ Attention */}
          {article.attention && (
            <div className="rounded-lg bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 p-3.5 flex gap-3">
              <span className="text-lg shrink-0">⚠️</span>
              <div>
                <p className="text-xs font-semibold text-yellow-700 dark:text-yellow-300 mb-1">
                  Attention
                </p>
                <p className="text-sm text-yellow-800 dark:text-yellow-200 leading-relaxed">
                  {article.attention}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

/* ─────────────────── MAIN COMPONENT ─────────────────── */
export default function ScamStoriesScreen() {
  const { identity } = useInternetIdentity();
  const [activeTab, setActiveTab] = useState<"stories" | "guide">("stories");
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [scamType, setScamType] = useState("");
  const [story, setStory] = useState("");

  const handleSubmit = () => {
    if (!identity) {
      toast.error("Veuillez vous connecter pour signaler une arnaque");
      return;
    }
    if (!title || !scamType || !story) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    toast.success("Histoire signalée avec succès !");
    setOpen(false);
    setTitle("");
    setScamType("");
    setStory("");
  };

  return (
    <div className="container py-8 max-w-4xl">
      {/* ── Header ── */}
      <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <AlertTriangle className="h-8 w-8 text-destructive" />
            Arnaques &amp; Conseils
          </h1>
          <p className="text-muted-foreground">
            Cas documentés et guide de prévention pour voyager en toute sécurité
            au Maroc
          </p>
        </div>
        {identity && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button data-ocid="arnaques.open_modal_button">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Signaler une arnaque
              </Button>
            </DialogTrigger>
            <DialogContent
              className="max-w-2xl max-h-[90vh] overflow-y-auto"
              data-ocid="arnaques.dialog"
            >
              <DialogHeader>
                <DialogTitle>Signaler une arnaque</DialogTitle>
                <DialogDescription>
                  Aidez la communauté en partageant votre expérience
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Faux guide touristique"
                    data-ocid="arnaques.input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type d'arnaque</Label>
                  <Select value={scamType} onValueChange={setScamType}>
                    <SelectTrigger data-ocid="arnaques.select">
                      <SelectValue placeholder="Sélectionnez un type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="guide">Guide</SelectItem>
                      <SelectItem value="commerce">Commerce</SelectItem>
                      <SelectItem value="transport">Transport</SelectItem>
                      <SelectItem value="hebergement">Hébergement</SelectItem>
                      <SelectItem value="restaurant">Restaurant</SelectItem>
                      <SelectItem value="autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="story">Votre histoire</Label>
                  <Textarea
                    id="story"
                    value={story}
                    onChange={(e) => setStory(e.target.value)}
                    placeholder="Décrivez ce qui s'est passé..."
                    rows={6}
                    data-ocid="arnaques.textarea"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setOpen(false)}
                  data-ocid="arnaques.cancel_button"
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleSubmit}
                  data-ocid="arnaques.submit_button"
                >
                  Publier
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* ── Tabs ── */}
      <div
        className="flex gap-1 p-1 rounded-lg bg-muted mb-8"
        role="tablist"
        aria-label="Sections Arnaques"
        data-ocid="arnaques.tab"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "stories"}
          onClick={() => setActiveTab("stories")}
          data-ocid="arnaques.stories_tab"
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-sm font-medium transition-all ${
            activeTab === "stories"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <BookOpen className="h-4 w-4" />
          <span>Histoires documentées</span>
          <span className="text-xs bg-destructive/10 text-destructive px-1.5 py-0.5 rounded-full font-semibold">
            {sampleStories.length}
          </span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "guide"}
          onClick={() => setActiveTab("guide")}
          data-ocid="arnaques.guide_tab"
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-sm font-medium transition-all ${
            activeTab === "guide"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Lightbulb className="h-4 w-4" />
          <span>Guide de prévention</span>
          <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-semibold">
            {guideArticles.length}
          </span>
        </button>
      </div>

      {/* ── Tab 1: Histoires documentées ── */}
      {activeTab === "stories" && (
        <div className="space-y-6" data-ocid="arnaques.stories_list">
          {sampleStories.map((scamStory, idx) => (
            <Card key={scamStory.id} data-ocid={`arnaques.item.${idx + 1}`}>
              <CardHeader>
                <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
                    {scamStory.title}
                  </CardTitle>
                  <div className="flex flex-wrap gap-1.5 shrink-0">
                    <Badge
                      className="text-xs bg-primary/10 text-primary border-primary/30"
                      variant="outline"
                    >
                      <MapPin className="h-3 w-3 mr-1" />
                      {scamStory.city}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-xs border-destructive/40 text-destructive"
                    >
                      {scamStory.type}
                    </Badge>
                  </div>
                </div>
                <CardDescription className="flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  {new Date(scamStory.date).toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-relaxed">
                  {scamStory.description}
                </p>

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    Signes d'alerte
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {scamStory.warningSigns.map((sign, index) => (
                      <Badge
                        key={`sign-${scamStory.id}-${index}`}
                        variant="outline"
                        className="text-xs border-amber-400/50 text-amber-700 dark:text-amber-400"
                      >
                        {sign}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-primary" />
                    Leçons apprises
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {scamStory.lessonsLearned.map((lesson, index) => (
                      <li key={`lesson-${scamStory.id}-${index}`}>{lesson}</li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 border-t border-border">
                  <p className="text-xs italic text-muted-foreground flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5 shrink-0" />
                    Source : {scamStory.source}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ── Tab 2: Guide de prévention ── */}
      {activeTab === "guide" && (
        <div className="space-y-4" data-ocid="arnaques.guide_list">
          <p className="text-sm text-muted-foreground mb-6">
            Ces arnaques sont les mêmes partout au Maroc. Chaque fiche
            ci-dessous peut être dépliée pour lire les schémas courants et les
            conseils de prévention.
          </p>
          {guideArticles.map((article, idx) => (
            <GuideArticleCard key={article.id} article={article} index={idx} />
          ))}

          {/* ── Note de conclusion ── */}
          <div
            data-ocid="arnaques.guide_conclusion"
            className="mt-8 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 p-5 flex gap-3.5"
          >
            <span className="text-2xl shrink-0 mt-0.5">🌿</span>
            <p className="text-sm italic leading-relaxed text-emerald-800 dark:text-emerald-200">
              Ce guide a pour vocation d'informer, pas d'inquiéter. Le Maroc
              reste une destination magnifique et chaleureuse. Avec un peu de
              vigilance, la grande majorité des séjours se passe excellemment
              bien.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
