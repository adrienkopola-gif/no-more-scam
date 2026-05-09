import { useQuery } from "@tanstack/react-query";
import { useActor } from "./useActor";
import type { TraditionalProduct } from "./useQueries";

export function useAllTraditionalProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<TraditionalProduct[]>({
    queryKey: ["traditionalProducts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTraditionalProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useTraditionalProductsByCategory(category: string) {
  const { actor, isFetching } = useActor();
  return useQuery<TraditionalProduct[]>({
    queryKey: ["traditionalProducts", "category", category],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTraditionalProductsByCategory(category);
    },
    enabled: !!actor && !isFetching && !!category,
  });
}

export function useTraditionalProductsByRegion(region: string) {
  const { actor, isFetching } = useActor();
  return useQuery<TraditionalProduct[]>({
    queryKey: ["traditionalProducts", "region", region],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTraditionalProductsByRegion(region);
    },
    enabled: !!actor && !isFetching && !!region,
  });
}

export function useFilterTraditionalProducts(
  category: string | null,
  minPrice: bigint | null,
  maxPrice: bigint | null,
  region: string | null,
) {
  const { actor, isFetching } = useActor();
  return useQuery<TraditionalProduct[]>({
    queryKey: [
      "traditionalProducts",
      "filter",
      category,
      minPrice?.toString(),
      maxPrice?.toString(),
      region,
    ],
    queryFn: async () => {
      if (!actor) return [];
      return actor.filterTraditionalProducts(
        category,
        minPrice,
        maxPrice,
        region,
      );
    },
    enabled: !!actor && !isFetching,
  });
}
