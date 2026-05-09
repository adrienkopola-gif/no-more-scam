import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tag } from "lucide-react";
import React, { useState } from "react";
import type { ExternalBlob } from "../backend";

// Local Product interface since it's not exported from backend
export interface LocalProduct {
  id: bigint;
  name: string;
  description: string;
  price: bigint;
  category: string;
  seller: string;
  imageBlob?: ExternalBlob;
}

interface ProductCardProps {
  product: LocalProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const imageUrl = product.imageBlob ? product.imageBlob.getDirectURL() : null;

  const categoryEmojis: Record<string, string> = {
    leather: "👜",
    ceramics: "🏺",
    textiles: "🧵",
    spices: "🌶️",
    jewelry: "💍",
    other: "🛍️",
  };

  return (
    <Card className="overflow-hidden">
      <div className="h-36 bg-muted flex items-center justify-center">
        {imageUrl && !imgError ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="text-4xl">
            {categoryEmojis[product.category] || "🛍️"}
          </span>
        )}
      </div>
      <CardContent className="p-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-sm">{product.name}</h3>
          <Badge variant="outline" className="text-xs flex-shrink-0">
            <Tag className="h-2 w-2 mr-1" />
            {product.price.toString()} MAD
          </Badge>
        </div>
        {product.description && (
          <p className="text-xs text-muted-foreground">{product.description}</p>
        )}
        <Badge variant="secondary" className="text-xs">
          {product.category}
        </Badge>
      </CardContent>
    </Card>
  );
}
