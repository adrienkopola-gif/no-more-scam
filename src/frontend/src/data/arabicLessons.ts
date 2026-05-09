// ─── Arabic lesson data with phonetic pronunciations ───
// phonetic: French-style transliteration shown in the pronunciation guide
// transliteration: Latin-script romanization shown on the card

export interface ArabicLesson {
  arabic: string;
  transliteration: string;
  french: string;
  phonetic: string; // syllable-split pronunciation guide, e.g. "Mar-ha-ba"
  pronunciationTip?: string; // optional hint on tricky sounds
}

export type LessonTab =
  | "greetings"
  | "numbers"
  | "negotiation"
  | "directions"
  | "emergency";

export const lessons: Record<LessonTab, ArabicLesson[]> = {
  greetings: [
    {
      arabic: "مرحبا",
      transliteration: "Marhaba",
      french: "Bonjour / Salut",
      phonetic: "Mar-ha-ba",
      pronunciationTip: "Le 'h' est soufflé comme un souffle chaud",
    },
    {
      arabic: "السلام عليكم",
      transliteration: "As-salamu alaykum",
      french: "La paix sur vous (salutation formelle)",
      phonetic: "As-sa-la-mou a-lay-koum",
      pronunciationTip: "Réponse : Wa alaykum as-salam",
    },
    {
      arabic: "صباح الخير",
      transliteration: "Sbah lkhir",
      french: "Bonjour (le matin)",
      phonetic: "S-bah el-khir",
      pronunciationTip: "'kh' comme le 'j' espagnol de 'jota'",
    },
    {
      arabic: "مساء الخير",
      transliteration: "Msa lkhir",
      french: "Bonsoir",
      phonetic: "M-sa el-khir",
      pronunciationTip: "Même terminaison que le bonjour du matin",
    },
    {
      arabic: "شكرا",
      transliteration: "Shukran",
      french: "Merci",
      phonetic: "Chouk-ran",
      pronunciationTip: "Le 'ou' est bref, accentuez 'chouk'",
    },
    {
      arabic: "لا شكرا",
      transliteration: "La shukran",
      french: "Non merci",
      phonetic: "La chouk-ran",
      pronunciationTip: "Indispensable dans les souks !",
    },
    {
      arabic: "عفوا",
      transliteration: "Afwan",
      french: "De rien / Excusez-moi",
      phonetic: "A-f-wan",
      pronunciationTip: "'A' guttural, vient du fond de la gorge",
    },
    {
      arabic: "بسلامة",
      transliteration: "Bslama",
      french: "Au revoir",
      phonetic: "Bs-la-ma",
      pronunciationTip: "Littéralement 'en sécurité'",
    },
    {
      arabic: "كيف حالك",
      transliteration: "Kif dayr / dayra",
      french: "Comment ça va ?",
      phonetic: "Kif day-r",
      pronunciationTip: "'dayra' pour une femme, 'dayr' pour un homme",
    },
    {
      arabic: "بخير شكرا",
      transliteration: "Bkhir shukran",
      french: "Bien merci",
      phonetic: "B-khir chouk-ran",
      pronunciationTip: "Réponse naturelle à 'kif dayr'",
    },
  ],

  numbers: [
    {
      arabic: "واحد",
      transliteration: "Wahid",
      french: "Un",
      phonetic: "wa-hed",
    },
    {
      arabic: "جوج",
      transliteration: "Jouj",
      french: "Deux (darija)",
      phonetic: "jouj",
      pronunciationTip: "Mot darija, différent de l'arabe classique (ithnayn)",
    },
    {
      arabic: "تلاتة",
      transliteration: "Tlata",
      french: "Trois",
      phonetic: "tla-ta",
    },
    {
      arabic: "ربعة",
      transliteration: "Rb'a",
      french: "Quatre",
      phonetic: "rb-a",
      pronunciationTip: "'r' roulé marocain",
    },
    {
      arabic: "خمسة",
      transliteration: "Khamsa",
      french: "Cinq",
      phonetic: "kham-sa",
      pronunciationTip: "Aussi le symbole porte-bonheur (main de Fatima)",
    },
    {
      arabic: "ستة",
      transliteration: "Setta",
      french: "Six",
      phonetic: "set-ta",
    },
    {
      arabic: "سبعة",
      transliteration: "Seb'a",
      french: "Sept",
      phonetic: "seb-a",
    },
    {
      arabic: "تمنية",
      transliteration: "Tmenya",
      french: "Huit",
      phonetic: "tmen-ya",
    },
    {
      arabic: "تسعود",
      transliteration: "Ts'oud",
      french: "Neuf",
      phonetic: "ts-oud",
    },
    {
      arabic: "عشرة",
      transliteration: "'Ashra",
      french: "Dix",
      phonetic: "a-shra",
      pronunciationTip: "Commencez avec un léger 'a' guttural",
    },
    {
      arabic: "عشرين",
      transliteration: "'Ashrin",
      french: "Vingt",
      phonetic: "a-chrin",
    },
    {
      arabic: "خمسين",
      transliteration: "Khamsin",
      french: "Cinquante",
      phonetic: "kham-sin",
    },
    {
      arabic: "مية",
      transliteration: "Miya",
      french: "Cent",
      phonetic: "mi-ya",
      pronunciationTip: "Utile pour négocier les prix",
    },
  ],

  negotiation: [
    {
      arabic: "بشحال هاد؟",
      transliteration: "Bsh-hal had?",
      french: "Combien ça coûte ?",
      phonetic: "bsh-hal had",
      pronunciationTip: "La phrase magique dans tous les souks",
    },
    {
      arabic: "غالي بزاف",
      transliteration: "Ghali bzaf",
      french: "C'est trop cher",
      phonetic: "gha-li b-zaf",
      pronunciationTip: "Dites-le avec un sourire, pas agressif",
    },
    {
      arabic: "عطيني سعر أحسن",
      transliteration: "Atini si'r ahsan",
      french: "Donnez-moi un meilleur prix",
      phonetic: "a-ti-ni si-r ah-san",
    },
    {
      arabic: "لا شكرا",
      transliteration: "La shukran",
      french: "Non merci",
      phonetic: "la chouk-ran",
      pronunciationTip:
        "Et partez — souvent le vendeur rappelle avec un prix bas",
    },
    {
      arabic: "سومه أقل",
      transliteration: "Soumou aql",
      french: "Baisse le prix",
      phonetic: "sou-mou a-ql",
    },
    {
      arabic: "مزيان",
      transliteration: "Mzyan",
      french: "Bien / D'accord",
      phonetic: "mz-yan",
      pronunciationTip: "Signifie aussi 'c'est bon' ou 'sympa'",
    },
    {
      arabic: "وكها",
      transliteration: "Wakha",
      french: "OK / C'est bon",
      phonetic: "wa-kha",
      pronunciationTip: "Mot très utilisé pour conclure un accord",
    },
  ],

  directions: [
    {
      arabic: "فين هو؟",
      transliteration: "Fin hwa?",
      french: "Où est-il ?",
      phonetic: "fin hwa",
      pronunciationTip: "Pointez du doigt pour mieux vous faire comprendre",
    },
    {
      arabic: "على اليمين",
      transliteration: "'Ala lymin",
      french: "À droite",
      phonetic: "a-la l-ymin",
    },
    {
      arabic: "على اليسار",
      transliteration: "'Ala lysar",
      french: "À gauche",
      phonetic: "a-la l-ysar",
    },
    {
      arabic: "نيشان",
      transliteration: "Nishan",
      french: "Tout droit",
      phonetic: "ni-chan",
      pronunciationTip: "Mot darija très courant",
    },
    {
      arabic: "قريب",
      transliteration: "Qrib",
      french: "Près / C'est proche",
      phonetic: "q-rib",
    },
    {
      arabic: "بعيد",
      transliteration: "B'id",
      french: "Loin",
      phonetic: "b-id",
      pronunciationTip: "Si on dit 'machi b'id' = pas loin (méfiance !)",
    },
  ],

  emergency: [
    {
      arabic: "عاونني",
      transliteration: "'Awenni",
      french: "Aidez-moi !",
      phonetic: "a-wen-ni",
      pronunciationTip: "Cri d'urgence — prononcez fort",
    },
    {
      arabic: "شرطة",
      transliteration: "Shorta",
      french: "Police",
      phonetic: "chor-ta",
    },
    {
      arabic: "طبيب",
      transliteration: "Tbib",
      french: "Médecin",
      phonetic: "t-bib",
    },
    {
      arabic: "مستشفى",
      transliteration: "Mustashfa",
      french: "Hôpital",
      phonetic: "mous-tach-fa",
    },
    {
      arabic: "سمعت فيا",
      transliteration: "Sma'fiya",
      french: "Laissez-moi tranquille",
      phonetic: "s-ma-fi-ya",
      pronunciationTip: "Très utile si vous êtes harcelé dans les souks",
    },
    {
      arabic: "مشيت",
      transliteration: "Mchit",
      french: "Je m'en vais",
      phonetic: "mchit",
    },
  ],
};

export const tabLabels: Record<LessonTab, string> = {
  greetings: "Salutations",
  numbers: "Nombres",
  negotiation: "Négociation",
  directions: "Directions",
  emergency: "Urgence",
};
