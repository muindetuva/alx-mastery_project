import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { incidentKeys } from "./useIncidents";
import {
  webSocketManager,
  type ConnectionStatus,
} from "../services/WebSocketManager";
import type { Incident } from "../types/incident";

export function useWebSocket(url = "mock://incidents") {
  const [status, setStatus] = useState<ConnectionStatus>("connecting");
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribeMessage = webSocketManager.onMessage((incident) => {
      queryClient.setQueryData<Incident[]>(incidentKeys.all, (current = []) => {
        const withoutDuplicate = current.filter((item) => item.id !== incident.id);
        return [incident, ...withoutDuplicate];
      });
      queryClient.setQueryData(incidentKeys.detail(incident.id), incident);
    });
    const unsubscribeStatus = webSocketManager.onStatus(setStatus);
    webSocketManager.connect(url);

    return () => {
      unsubscribeMessage();
      unsubscribeStatus();
      webSocketManager.disconnect();
    };
  }, [queryClient, url]);

  return {
    status,
    hasError: status === "error" || status === "closed",
  };
}
