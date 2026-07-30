import { useAcknowledgeIncident, useResolveIncident } from "../hooks/useIncidentActions";
import type { Incident } from "../types/incident";

export default function IncidentActions({ incident }: { incident: Incident }) {
  const acknowledge = useAcknowledgeIncident();
  const resolve = useResolveIncident();
  const loading = acknowledge.isPending || resolve.isPending;
  const error = acknowledge.error || resolve.error;

  return (
    <div className="incident-actions">
      <button type="button" disabled={loading || incident.status !== "open"} onClick={() => acknowledge.mutate(incident.id)}>{acknowledge.isPending ? "Acknowledging…" : "Acknowledge"}</button>
      <button type="button" disabled={loading || incident.status === "resolved"} onClick={() => resolve.mutate(incident.id)}>{resolve.isPending ? "Resolving…" : "Resolve"}</button>
      {error && <p className="action-error" role="alert">{error.message}</p>}
    </div>
  );
}
