import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, Crown, MapPin, Package } from "lucide-react";
import React, { useState } from "react";
import PaymentModal from "./PaymentModal";

interface GetPremiumModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function GetPremiumModal({
  open,
  onOpenChange,
}: GetPremiumModalProps) {
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
    onOpenChange(false);
    setPaymentModal({ open: true, packName, priceInCents, description });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Crown className="h-6 w-6 text-amber-500" />
              Passer Premium
            </DialogTitle>
            <DialogDescription>
              Choisissez le pack qui correspond à vos besoins de voyage au
              Maroc.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
            {/* Pack Artisanat */}
            <div className="border border-border rounded-xl p-5 space-y-4 hover:border-amber-400 transition-colors">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-amber-500" />
                <h3 className="font-bold text-lg">Pack Artisanat</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                15 articles artisanaux marocains avec prix locaux et conseils de
                négociation.
              </p>
              <ul className="space-y-1 text-sm">
                {[
                  "Tapis berbères & kilims",
                  "Céramiques & poteries",
                  "Maroquinerie & babouches",
                  "Bijoux en argent",
                  "Épices & huile d'argan",
                  "Lanternes & luminaires",
                  "Bois sculpté & thuya",
                  "Textiles sabra",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-muted-foreground"
                  >
                    <Check className="h-3 w-3 text-green-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="pt-2">
                <div className="text-2xl font-bold text-amber-600 mb-3">
                  500 MAD
                </div>
                <Button
                  onClick={() =>
                    handleBuyPack(
                      "Pack Artisanat",
                      5000n,
                      "15 articles artisanaux marocains avec prix locaux et conseils de négociation",
                    )
                  }
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                >
                  <Crown className="h-4 w-4 mr-2" />
                  Acheter ce pack
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
                  "Tanger → Tétouan",
                  "Marrakech → Ouarzazate",
                  "Casablanca → Marrakech",
                ].map((route) => (
                  <li
                    key={route}
                    className="flex items-center gap-2 text-muted-foreground"
                  >
                    <Check className="h-3 w-3 text-green-500 flex-shrink-0" />
                    {route}
                  </li>
                ))}
              </ul>
              <div className="pt-2">
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
                  Acheter ce pack
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <PaymentModal
        open={paymentModal.open}
        onOpenChange={(o) => setPaymentModal((prev) => ({ ...prev, open: o }))}
        packName={paymentModal.packName}
        priceInCents={paymentModal.priceInCents}
        description={paymentModal.description}
      />
    </>
  );
}
