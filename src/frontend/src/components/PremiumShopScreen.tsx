import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Crown, MapPin, Package, Star } from "lucide-react";
import React, { useState } from "react";
import PaymentModal from "./PaymentModal";

export default function PremiumShopScreen() {
  const [paymentModal, setPaymentModal] = useState<{
    open: boolean;
    packName: string;
    priceInCents: bigint;
    description: string;
  }>({
    open: false,
    packName: "",
    priceInCents: 0n,
    description: "",
  });

  const handleBuyPack = (
    packName: string,
    priceInCents: bigint,
    description: string,
  ) => {
    setPaymentModal({ open: true, packName, priceInCents, description });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">
      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden">
        <img
          src="/assets/generated/hero-premium.dim_1200x600.png"
          alt="Premium"
          className="w-full h-48 sm:h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center p-6">
          <div className="text-white space-y-2">
            <div className="flex items-center gap-2">
              <Crown className="h-6 w-6 text-amber-400" />
              <Badge className="bg-amber-500 text-white border-0">
                Premium
              </Badge>
            </div>
            <h1 className="text-2xl font-bold">Voyagez malin au Maroc</h1>
            <p className="text-sm text-white/80">
              Accédez aux prix locaux et aux itinéraires secrets
            </p>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold">Pourquoi Premium ?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              icon: "💰",
              title: "Prix locaux",
              desc: "Connaissez les vrais prix avant de négocier",
            },
            {
              icon: "🗺️",
              title: "Trajets secrets",
              desc: "Itinéraires utilisés par les locaux",
            },
            {
              icon: "🤝",
              title: "Conseils négociation",
              desc: "Techniques éprouvées pour les souks",
            },
          ].map((benefit) => (
            <div
              key={benefit.title}
              className="bg-muted rounded-xl p-4 space-y-2"
            >
              <span className="text-2xl">{benefit.icon}</span>
              <h3 className="font-semibold text-sm">{benefit.title}</h3>
              <p className="text-xs text-muted-foreground">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Category images */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold">Ce que vous débloquez</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { src: "/assets/generated/leather.dim_400x400.png", label: "Cuir" },
            {
              src: "/assets/generated/ceramics.dim_400x400.png",
              label: "Céramiques",
            },
            {
              src: "/assets/generated/spices.dim_400x400.png",
              label: "Épices",
            },
            {
              src: "/assets/generated/jewelry.dim_400x400.png",
              label: "Bijoux",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="relative rounded-xl overflow-hidden aspect-square"
            >
              <img
                src={item.src}
                alt={item.label}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-end p-2">
                <span className="text-white text-xs font-semibold">
                  {item.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Packs */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold">Choisissez votre pack</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Pack Artisanat */}
          <div className="border border-border rounded-xl p-5 space-y-4 hover:border-amber-400 transition-colors">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-amber-500" />
              <h3 className="font-bold text-lg">Pack Artisanat</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              15 articles artisanaux avec prix locaux et conseils de
              négociation.
            </p>
            <ul className="space-y-1 text-sm">
              {[
                "Tapis & kilims",
                "Céramiques",
                "Maroquinerie",
                "Bijoux argent",
                "Épices & argan",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-muted-foreground"
                >
                  <Check className="h-3 w-3 text-green-500" />
                  {item}
                </li>
              ))}
            </ul>
            <div>
              <div className="text-2xl font-bold text-amber-600 mb-3">
                500 MAD
              </div>
              <Button
                onClick={() =>
                  handleBuyPack(
                    "Pack Artisanat",
                    5000n,
                    "15 articles artisanaux marocains avec prix locaux",
                  )
                }
                className="w-full bg-amber-500 hover:bg-amber-600 text-white"
              >
                <Crown className="h-4 w-4 mr-2" />
                Acheter
              </Button>
            </div>
          </div>

          {/* Pack Trajets */}
          <div className="border border-border rounded-xl p-5 space-y-4 hover:border-amber-400 transition-colors">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-amber-500" />
              <h3 className="font-bold text-lg">Pack Trajets</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              8 itinéraires de transport avec modes, durées et prix réels.
            </p>
            <ul className="space-y-1 text-sm">
              {[
                "Marrakech → Essaouira",
                "Fès → Chefchaouen",
                "Casablanca → Rabat",
                "Marrakech → Agadir",
                "Fès → Meknès",
              ].map((route) => (
                <li
                  key={route}
                  className="flex items-center gap-2 text-muted-foreground"
                >
                  <Check className="h-3 w-3 text-green-500" />
                  {route}
                </li>
              ))}
            </ul>
            <div>
              <div className="text-2xl font-bold text-amber-600 mb-3">
                500 MAD
              </div>
              <Button
                onClick={() =>
                  handleBuyPack(
                    "Pack Trajets",
                    5000n,
                    "8 itinéraires de transport avec modes, durées et prix réels",
                  )
                }
                className="w-full bg-amber-500 hover:bg-amber-600 text-white"
              >
                <Crown className="h-4 w-4 mr-2" />
                Acheter
              </Button>
            </div>
          </div>
        </div>
      </section>

      <PaymentModal
        open={paymentModal.open}
        onOpenChange={(o) => setPaymentModal((prev) => ({ ...prev, open: o }))}
        packName={paymentModal.packName}
        priceInCents={paymentModal.priceInCents}
        description={paymentModal.description}
      />
    </div>
  );
}
