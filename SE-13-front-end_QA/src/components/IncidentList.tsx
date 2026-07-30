import IncidentActions from "./IncidentActions";
import type { Incident } from "../types/incident";

export default function IncidentList({ incidents }: { incidents: Incident[] }) {
  if (incidents.length === 0) {
    return <p className="empty-state">No incidents match the current filters.</p>;
  }

  return (
    <div className="incident-list" aria-label="Incident list">
      {incidents.map((incident) => (
        <article className={`incident-card severity-${incident.severity}`} key={incident.id}>
          <div className="incident-heading">
            <div><span className={`severity-badge ${incident.severity}`}>{incident.severity}</span><h2>{incident.title}</h2></div>
            <span className={`status-badge ${incident.status}`}>{incident.status}</span>
          </div>
          <p>{incident.description}</p>
          <div className="incident-meta"><time dateTime={incident.createdAt}>{new Date(incident.createdAt).toLocaleString()}</time><span>Updated {new Date(incident.updatedAt).toLocaleTimeString()}</span></div>
          <IncidentActions incident={incident} />
        </article>
      ))}
    </div>
  );
}
