import type { PremiumProductEntry } from "../types/premiumProduct";

export const premiumProducts: PremiumProductEntry[] = [
  {
    id: 1,
    title: "Billet de 20 MAD",
    description:
      "Référence visuelle du billet de 20 dirhams marocains pour éviter les confusions.",
    localPrice: "20 MAD",
    touristPrice: "20 MAD",
    negotiationTip:
      "Familiarisez-vous avec les billets pour éviter les erreurs de change.",
    category: "Monnaie",
    image: "/assets/generated/moroccan-20dh-note.dim_600x400.png",
  },
  {
    id: 2,
    title: "Couverture Coran en cuir",
    description:
      "Couverture artisanale en cuir pour Coran, typique des souks de Fès.",
    localPrice: "150 MAD",
    touristPrice: "300 MAD",
    negotiationTip:
      "Négociez à 180-200 MAD, montrez que vous connaissez le prix local.",
    category: "Cuir",
    image: "/assets/20260223_161421.jpg",
  },
];
