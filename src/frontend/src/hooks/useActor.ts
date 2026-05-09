import { useActor as useActorFromInfra } from "@caffeineai/core-infrastructure";
import { createActor } from "../backend";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useActor(): { actor: any; isFetching: boolean } {
  return useActorFromInfra(createActor) as { actor: any; isFetching: boolean };
}
