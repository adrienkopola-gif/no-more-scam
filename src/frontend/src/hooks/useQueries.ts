import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ExternalBlob } from "../backend";
import { useActor } from "./useActor";

// Backend types — bindings generated at deploy time; use local definitions for TypeScript
export interface Tip {
  id: bigint;
  author: { toString(): string };
  content: string;
  timestamp: bigint;
  helpfulCount: bigint;
  title?: string;
  city?: string;
  location?: string;
}

export interface Reclamation {
  id: bigint;
  description: string;
  whatTheySell: string;
  city: string;
  location: string;
  timestamp: bigint;
  author: { toString(): string };
  helpfulCount: bigint;
}

export interface Product {
  id: bigint;
  name: string;
  description: string;
  price: bigint;
  category: string;
  seller: { toString(): string };
  imageBlob?: ExternalBlob;
}

export interface Post {
  id: bigint;
  content: string;
  timestamp: bigint;
  author: { toString(): string };
  ville: string;
  titre: string;
  experience: string;
  categorie: string;
  scamVotes: { toString(): string }[];
  fairDealVotes: { toString(): string }[];
  imageBlob?: ExternalBlob;
}

export interface Comment {
  id: bigint;
  postId: bigint;
  author: { toString(): string };
  content: string;
  timestamp: bigint;
}

export interface UserProfile {
  name: string;
  username: string;
  country: string;
  email?: string;
  status: { "#free"?: null } | { "#premium"?: null };
  quizScore: bigint;
  earnedBadges: string[];
  tipsGiven: bigint;
  scamsReported: bigint;
  firstPostCreated: boolean;
  points: bigint;
}

export interface UserStatus {
  free: null;
  premium: null;
}

export interface ShoppingItem {
  name: string;
  price: bigint;
  quantity: bigint;
}

export interface TraditionalProduct {
  name: string;
  description: string;
  category: string;
  priceRanges: {
    marrakech: { min: bigint; max: bigint };
    fes: { min: bigint; max: bigint };
    casablanca: { min: bigint; max: bigint };
  };
  seasonalVariationPercent: bigint;
  negotiationTips: string;
}

export function useGetAllPosts() {
  const { actor, isFetching } = useActor();
  return useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPosts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPost(postId: bigint) {
  const { actor, isFetching } = useActor();
  return useQuery<Post | null>({
    queryKey: ["post", postId.toString()],
    queryFn: async () => {
      if (!actor) return null;
      const result = await actor.getPost(postId);
      return result ?? null;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetComments(postId: bigint) {
  const { actor, isFetching } = useActor();
  return useQuery<Comment[]>({
    queryKey: ["comments", postId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getComments(postId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreatePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      content: string;
      ville: string;
      titre: string;
      experience: string;
      categorie: string;
      imageBlob: import("../backend").ExternalBlob | null;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createPost(
        params.content,
        params.ville,
        params.titre,
        params.experience,
        params.categorie,
        params.imageBlob,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useAddComment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: { postId: bigint; content: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addComment(params.postId, params.content);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.postId.toString()],
      });
    },
  });
}

export function useGetTips() {
  const { actor, isFetching } = useActor();
  return useQuery<Tip[]>({
    queryKey: ["tips"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getAllTips();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateTip() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (content: string) => {
      if (!actor) throw new Error("Actor not available");
      return (actor as any).createTip(content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tips"] });
    },
  });
}

export function useGetProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getAllProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      name: string;
      description: string;
      price: bigint;
      category: string;
      imageBlob: ExternalBlob | null;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return (actor as any).createProduct(
        params.name,
        params.description,
        params.price,
        params.category,
        params.imageBlob,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useVoteScam() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (postId: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.voteScam(postId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useVoteFairDeal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (postId: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.voteFairDeal(postId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useDeletePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (postId: bigint) => {
      if (!actor) throw new Error("Actor not available");
      const result = await (
        actor as unknown as {
          deletePost(id: bigint): Promise<{ ok: null } | { err: string }>;
        }
      ).deletePost(postId);
      if ("err" in result) throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useUpdatePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      postId: bigint;
      newTitre: string;
      newContent: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      const result = await (
        actor as unknown as {
          updatePost(
            id: bigint,
            titre: string,
            content: string,
          ): Promise<{ ok: null } | { err: string }>;
        }
      ).updatePost(params.postId, params.newTitre, params.newContent);
      if ("err" in result) throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const query = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Actor not available");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

export function useUpdateUsername() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newUsername: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateUsername(newUsername);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

export function useUpdateCountry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newCountry: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateCountry(newCountry);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

export function useUpdateEmail() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (email: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateEmail(email);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

export function useGetAllReclamations() {
  const { actor, isFetching } = useActor();
  return useQuery<Reclamation[]>({
    queryKey: ["reclamations"],
    queryFn: async () => {
      if (!actor) return [];
      return (
        actor as unknown as { getAllReclamations(): Promise<Reclamation[]> }
      ).getAllReclamations();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateReclamation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      description: string;
      whatTheySell: string;
      city: string;
      location: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return (
        actor as unknown as {
          createReclamation(
            description: string,
            whatTheySell: string,
            city: string,
            location: string,
          ): Promise<Reclamation>;
        }
      ).createReclamation(
        params.description,
        params.whatTheySell,
        params.city,
        params.location,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reclamations"] });
    },
  });
}

export function useVoteReclamationHelpful() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return (
        actor as unknown as {
          voteReclamationHelpful(id: bigint): Promise<void>;
        }
      ).voteReclamationHelpful(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reclamations"] });
    },
  });
}
