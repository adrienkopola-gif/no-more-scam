import { useQuery } from "@tanstack/react-query";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

function isPremiumStatus(status: unknown): boolean {
  if (!status || typeof status !== "object") return false;
  return "#premium" in (status as Record<string, unknown>);
}

export function useCheckPremium() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<boolean>({
    queryKey: ["premiumStatus", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return false;
      try {
        const profile = await actor.getCallerUserProfile();
        if (!profile) return false;
        return isPremiumStatus(profile.status);
      } catch {
        return false;
      }
    },
    enabled: !!actor && !actorFetching && !!identity,
    staleTime: 1000 * 60 * 5,
  });
}
