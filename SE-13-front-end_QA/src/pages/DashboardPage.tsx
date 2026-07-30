import { useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import IncidentList from "../components/IncidentList";
import NotificationBanner from "../components/NotificationBanner";
import { useAuth } from "../context/AuthContext";
import { useIncidents, incidentKeys } from "../hooks/useIncidents";
import { useWebSocket } from "../hooks/useWebSocket";
import { startMockStream } from "../mocks/generator";
import { webSocketManager } from "../services/WebSocketManager";
import type { Incident, IncidentStatus, Severity } from "../types/incident";

type FilterValue<T extends string> = "all" | T;

export default function DashboardPage() {
  const [severity, setSeverity] = useState<FilterValue<Severity>>("all");
  const [incidentStatus, setIncidentStatus] = useState<FilterValue<IncidentStatus>>("all");
  const [streaming, setStreaming] = useState(false);
  const stopStreamRef = useRef<null | (() => void)>(null);
  const { user, logout } = useAuth();
  const incidentsQuery = useIncidents();
  const socket = useWebSocket();
  const queryClient = useQueryClient();

  useEffect(() => () => stopStreamRef.current?.(), []);

  const filteredIncidents = useMemo(() => (incidentsQuery.data || []).filter((incident) =>
    (severity === "all" || incident.severity === severity)
      && (incidentStatus === "all" || incident.status === incidentStatus),
  ), [incidentStatus, incidentsQuery.data, severity]);

  function toggleMockStream() {
    if (streaming) {
      stopStreamRef.current?.();
      stopStreamRef.current = null;
      setStreaming(false);
      return;
    }
    stopStreamRef.current = startMockStream((incident) => {
      webSocketManager.dispatchMock(incident);
    }, 1000);
    setStreaming(true);
  }

  function addImmediateMock() {
    const existing = queryClient.getQueryData<Incident[]>(incidentKeys.all) || [];
    queryClient.setQueryData(incidentKeys.all, [...existing]);
    toggleMockStream();
  }

  return (
    <div className="app-shell">
      <NotificationBanner />
      <header className="app-header">
        <a className="brand" href="#main"><span className="logo-mark">S</span>Sentinel</a>
        <nav aria-label="Dashboard navigation"><a href="#incidents">Incidents</a><a href="#status">System status</a></nav>
        <div className="user-controls"><span>{user?.name}</span><button type="button" onClick={logout}>Log out</button></div>
      </header>

      <main id="main">
        <section className="dashboard-hero">
          <div><p className="eyebrow">Real-time operations</p><h1>Incident intelligence</h1><p className="muted">Validated signals, optimistic response workflows, and a clear view of operational risk.</p></div>
          <button className={streaming ? "secondary-button" : "primary-button"} type="button" onClick={addImmediateMock}>{streaming ? "Stop Mock Stream" : "Start Mock Stream"}</button>
        </section>

        <section id="status" className={`connection-status ${socket.hasError ? "error" : socket.status}`} aria-live="polite">
          <span className="status-dot" aria-hidden="true" />
          WebSocket status: <strong>{socket.status}</strong>
          {socket.hasError && <span> — updates are temporarily unavailable</span>}
          {streaming && <span> — local mock stream active</span>}
        </section>

        <section id="incidents" className="incident-section">
          <div className="section-header"><div><p className="eyebrow">Response queue</p><h2>Active intelligence</h2></div><span className="incident-count">{filteredIncidents.length} incidents</span></div>
          <div className="filters" aria-label="Incident filters">
            <label htmlFor="severity">Severity<select id="severity" value={severity} onChange={(event) => setSeverity(event.target.value as FilterValue<Severity>)}><option value="all">All severities</option><option value="critical">Critical</option><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select></label>
            <label htmlFor="incident-status">Status<select id="incident-status" value={incidentStatus} onChange={(event) => setIncidentStatus(event.target.value as FilterValue<IncidentStatus>)}><option value="all">All statuses</option><option value="open">Open</option><option value="acknowledged">Acknowledged</option><option value="resolved">Resolved</option></select></label>
          </div>
          {incidentsQuery.isPending && <p className="loading-state">Loading validated incidents…</p>}
          {incidentsQuery.isError && <p className="form-error" role="alert">{incidentsQuery.error.message}</p>}
          {incidentsQuery.data && <IncidentList incidents={filteredIncidents} />}
        </section>
      </main>
    </div>
  );
}
