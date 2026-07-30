import { useQuery } from "@tanstack/react-query";
import { getIncidentById, getIncidents } from "../services/api";

export const incidentKeys = {
  all: ["incidents"] as const,
  detail: (id: string) => ["incidents", id] as const,
};

export function useIncidents() {
  return useQuery({
    queryKey: incidentKeys.all,
    queryFn: getIncidents,
    staleTime: 30000,
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
  });
}

export function useIncident(id: string) {
  return useQuery({
    queryKey: incidentKeys.detail(id),
    queryFn: () => getIncidentById(id),
    enabled: Boolean(id),
    staleTime: 30000,
  });
}
