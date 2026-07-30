import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { incidentKeys } from "./useIncidents";
import {
  webSocketManager,
  type ConnectionStatus,
} from "../services/websocket";
import {
  incidentSchema,
  type Incident,
} from "../schemas/incident.schema";

export function useWebSocket(url = "mock://incidents") {
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("connecting");
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribeMessage = webSocketManager.onMessage((incoming) => {
      const result = incidentSchema.safeParse(incoming);
      if (!result.success) return;
      const incident = result.data;
      queryClient.setQueryData<Incident[]>(incidentKeys.all, (current = []) => {
        const withoutDuplicate = current.filter((item) => item.id !== incident.id);
        return [incident, ...withoutDuplicate];
      });
      queryClient.setQueryData(incidentKeys.detail(incident.id), incident);
    });
    const unsubscribeStatus = webSocketManager.onStatus(setConnectionStatus);
    webSocketManager.connect(url);

    return () => {
      unsubscribeMessage();
      unsubscribeStatus();
      webSocketManager.disconnect();
    };
  }, [queryClient, url]);

  return {
    connectionStatus,
    status: connectionStatus,
    hasError: connectionStatus === "error" || connectionStatus === "closed",
  };
}
