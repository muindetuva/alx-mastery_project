import { useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import IncidentList from "../components/IncidentList";
import NotificationBanner from "../components/NotificationBanner";
import { useAuth } from "../contexts/AuthContext";
import { useIncidents, incidentKeys } from "../hooks/useIncidents";
import { useWebSocket } from "../hooks/useWebSocket";
import { generateIncidentStream } from "../mocks/incidentGenerator";
import { webSocketManager } from "../services/websocket";
import type { Incident, IncidentStatus, Severity } from "../types/incident";

type FilterValue<T extends string> = "all" | T;

export default function Dashboard() {
  const [severity, setSeverity] = useState<FilterValue<Severity>>("all");
  const [incidentStatus, setIncidentStatus] =
    useState<FilterValue<IncidentStatus>>("all");
  const [streaming, setStreaming] = useState(false);
  const stopStreamRef = useRef<null | (() => void)>(null);
  const { user, logout } = useAuth();
  const incidentsQuery = useIncidents();
  const socket = useWebSocket();
  const queryClient = useQueryClient();

  useEffect(() => () => stopStreamRef.current?.(), []);

  const filteredIncidents = useMemo(
    () => (incidentsQuery.data || []).filter((incident) =>
      (severity === "all" || incident.severity === severity)
      && (incidentStatus === "all" || incident.status === incidentStatus)),
    [incidentStatus, incidentsQuery.data, severity],
  );

  function toggleMockStream() {
    if (streaming) {
      stopStreamRef.current?.();
      stopStreamRef.current = null;
      setStreaming(false);
      return;
    }

    stopStreamRef.current = generateIncidentStream((incident) => {
      webSocketManager.dispatchMock(incident);
    }, 1000);
    setStreaming(true);
  }

  function startMockStream() {
    const existing = queryClient.getQueryData<Incident[]>(incidentKeys.all) || [];
    queryClient.setQueryData(incidentKeys.all, [...existing]);
    toggleMockStream();
  }

  return (
    <div className="app-shell">
      <NotificationBanner />
      <header className="app-header">
        <a className="brand" href="#main">Sentinel</a>
        <div className="user-controls">
          <span>{user?.name}</span>
          <button type="button" onClick={logout}>Log out</button>
        </div>
      </header>
      <main id="main">
        <section className="dashboard-hero">
          <div>
            <p className="eyebrow">Real-time operations</p>
            <h1>Incident intelligence</h1>
          </div>
          <button type="button" onClick={startMockStream}>
            {streaming ? "Stop Mock Stream" : "Start Mock Stream"}
          </button>
        </section>
        <section className={`connection-status ${socket.connectionStatus}`}>
          WebSocket status: <strong>{socket.connectionStatus}</strong>
        </section>
        <section id="incidents" className="incident-section">
          <div className="filters" aria-label="Incident filters">
            <label htmlFor="severity">
              Severity
              <select
                id="severity"
                value={severity}
                onChange={(event) => {
                  setSeverity(event.target.value as FilterValue<Severity>);
                }}
              >
                <option value="all">All severities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </label>
            <label htmlFor="incident-status">
              Status
              <select
                id="incident-status"
                value={incidentStatus}
                onChange={(event) => {
                  setIncidentStatus(
                    event.target.value as FilterValue<IncidentStatus>,
                  );
                }}
              >
                <option value="all">All statuses</option>
                <option value="open">Open</option>
                <option value="acknowledged">Acknowledged</option>
                <option value="resolved">Resolved</option>
              </select>
            </label>
          </div>
          {incidentsQuery.isPending && <p>Loading validated incidents…</p>}
          {incidentsQuery.isError && (
            <p className="form-error" role="alert">
              {incidentsQuery.error.message}
            </p>
          )}
          {incidentsQuery.data && (
            <IncidentList incidents={filteredIncidents} />
          )}
        </section>
      </main>
    </div>
  );
}
