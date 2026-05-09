import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Filter, Loader2, Package } from "lucide-react";
import React, { useState } from "react";
import { premiumProducts } from "../data/premiumProducts";
import { useAllTraditionalProducts } from "../hooks/useTraditionalProducts";
import PremiumProductCard from "./PremiumProductCard";

const CATEGORIES = [
  "All",
  "Textiles",
  "Céramiques",
  "Cuir",
  "Bois",
  "Bijoux",
  "Épices",
  "Huile d'argan",
  "Lanternes et luminaires",
];

export default function PremiumProductsScreen() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { data: traditionalProducts = [], isLoading } =
    useAllTraditionalProducts();

  const filteredTraditional =
    selectedCategory === "All"
      ? traditionalProducts
      : traditionalProducts.filter((p) => p.category === selectedCategory);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">
      <div className="flex items-center gap-2">
        <Package className="h-5 w-5 text-amber-500" />
        <h1 className="text-xl font-bold">Premium Products</h1>
      </div>

      {/* Field-photographed products */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">
            Produits photographiés sur le terrain
          </h2>
          <Badge variant="secondary" className="text-xs">
            {premiumProducts.length} articles
          </Badge>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {premiumProducts.map((product) => (
            <PremiumProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Traditional catalog */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Catalogue traditionnel</h2>
          <Badge variant="secondary" className="text-xs">
            {filteredTraditional.length} articles
          </Badge>
        </div>

        {/* Category filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="h-4 w-4 text-muted-foreground" />
          {CATEGORIES.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className="text-xs h-7"
            >
              {cat}
            </Button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={`skeleton-slot-${i + 1}`}
                className="border border-border rounded-xl p-4 space-y-3"
              >
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
                <div className="grid grid-cols-3 gap-2">
                  <Skeleton className="h-12 rounded-lg" />
                  <Skeleton className="h-12 rounded-lg" />
                  <Skeleton className="h-12 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredTraditional.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Package className="h-10 w-10 mx-auto mb-2 opacity-30" />
            <p>No products found for this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredTraditional.map((product, index) => (
              <div
                key={product.name ?? index}
                className="border border-border rounded-xl p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-sm">{product.name}</h3>
                  <Badge variant="outline" className="text-xs flex-shrink-0">
                    {product.category}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {product.description}
                </p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-muted rounded-lg p-2 text-center">
                    <div className="font-medium text-muted-foreground mb-1">
                      Marrakech
                    </div>
                    <div className="font-bold">
                      {product.priceRanges.marrakech.min.toString()}–
                      {product.priceRanges.marrakech.max.toString()} MAD
                    </div>
                  </div>
                  <div className="bg-muted rounded-lg p-2 text-center">
                    <div className="font-medium text-muted-foreground mb-1">
                      Fès
                    </div>
                    <div className="font-bold">
                      {product.priceRanges.fes.min.toString()}–
                      {product.priceRanges.fes.max.toString()} MAD
                    </div>
                  </div>
                  <div className="bg-muted rounded-lg p-2 text-center">
                    <div className="font-medium text-muted-foreground mb-1">
                      Casablanca
                    </div>
                    <div className="font-bold">
                      {product.priceRanges.casablanca.min.toString()}–
                      {product.priceRanges.casablanca.max.toString()} MAD
                    </div>
                  </div>
                </div>
                <div className="bg-amber-50 dark:bg-amber-950/20 rounded-lg p-2">
                  <p className="text-xs text-amber-700 dark:text-amber-300">
                    💡 {product.negotiationTips}
                  </p>
                </div>
                {Number(product.seasonalVariationPercent) > 0 && (
                  <p className="text-xs text-muted-foreground">
                    📅 Variation saisonnière : ±
                    {product.seasonalVariationPercent.toString()}%
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
