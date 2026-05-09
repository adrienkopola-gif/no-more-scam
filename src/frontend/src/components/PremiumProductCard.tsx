import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Tag, TrendingUp } from "lucide-react";
import React, { useState } from "react";
import type { PremiumProductEntry } from "../types/premiumProduct";

interface PremiumProductCardProps {
  product: PremiumProductEntry;
}

export default function PremiumProductCard({
  product,
}: PremiumProductCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 bg-muted">
        {!imgError ? (
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            🛍️
          </div>
        )}
        <Badge className="absolute top-2 left-2 text-xs" variant="secondary">
          {product.category}
        </Badge>
      </div>
      <CardContent className="p-4 space-y-3">
        <h3 className="font-semibold text-foreground">{product.title}</h3>
        <p className="text-sm text-muted-foreground">{product.description}</p>

        <div className="grid grid-cols-2 gap-2">
          <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-2 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Tag className="h-3 w-3 text-green-600" />
              <span className="text-xs text-green-600 font-medium">
                Prix local
              </span>
            </div>
            <span className="text-sm font-bold text-green-700 dark:text-green-400">
              {product.localPrice}
            </span>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950/20 rounded-lg p-2 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="h-3 w-3 text-amber-600" />
              <span className="text-xs text-amber-600 font-medium">
                Prix touriste
              </span>
            </div>
            <span className="text-sm font-bold text-amber-700 dark:text-amber-400">
              {product.touristPrice}
            </span>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3">
          <div className="flex items-center gap-1 mb-1">
            <MessageSquare className="h-3 w-3 text-blue-600" />
            <span className="text-xs text-blue-600 font-medium">
              Conseil de négociation
            </span>
          </div>
          <p className="text-xs text-blue-700 dark:text-blue-300">
            {product.negotiationTip}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
