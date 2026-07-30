import { useMutation, useQueryClient } from "@tanstack/react-query";
import { acknowledgeIncident, resolveIncident } from "../services/api";
import { notify } from "../lib/notifications";
import { incidentKeys } from "./useIncidents";
import type { Incident, IncidentStatus } from "../types/incident";

type MutationContext = {
  previousList?: Incident[];
  previousDetail?: Incident;
};

function useOptimisticIncidentAction(
  mutationFn: (id: string) => Promise<Incident>,
  optimisticStatus: IncidentStatus,
) {
  const queryClient = useQueryClient();

  return useMutation<Incident, Error, string, MutationContext>({
    mutationFn,
    onMutate: async (id) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: incidentKeys.all }),
        queryClient.cancelQueries({ queryKey: incidentKeys.detail(id) }),
      ]);
      const previousList = queryClient.getQueryData<Incident[]>(incidentKeys.all);
      const previousDetail = queryClient.getQueryData<Incident>(incidentKeys.detail(id));
      const updatedAt = new Date().toISOString();

      queryClient.setQueryData<Incident[]>(incidentKeys.all, (current = []) =>
        current.map((incident) => incident.id === id
          ? { ...incident, status: optimisticStatus, updatedAt }
          : incident),
      );
      queryClient.setQueryData<Incident>(incidentKeys.detail(id), (current) =>
        current ? { ...current, status: optimisticStatus, updatedAt } : current,
      );
      return { previousList, previousDetail };
    },
    onError: (error, id, context) => {
      if (context?.previousList) queryClient.setQueryData(incidentKeys.all, context.previousList);
      if (context?.previousDetail) queryClient.setQueryData(incidentKeys.detail(id), context.previousDetail);
      notify(error.message || "The incident update failed and was rolled back.", "error");
    },
    onSettled: (_data, _error, id) => {
      queryClient.invalidateQueries({ queryKey: incidentKeys.all });
      queryClient.invalidateQueries({ queryKey: incidentKeys.detail(id) });
    },
  });
}

export function useAcknowledgeIncident() {
  return useOptimisticIncidentAction(acknowledgeIncident, "acknowledged");
}

export function useResolveIncident() {
  return useOptimisticIncidentAction(resolveIncident, "resolved");
}
