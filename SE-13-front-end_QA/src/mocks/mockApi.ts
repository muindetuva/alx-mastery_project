import { generateIncidents } from "./generator";
import { incidentSchema, type Incident } from "../types/incident";

let incidents: Incident[] = generateIncidents(12);
let installed = false;

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function updateIncident(id: string, status: Incident["status"]) {
  const index = incidents.findIndex((incident) => incident.id === id);
  if (index < 0) return null;
  incidents[index] = incidentSchema.parse({
    ...incidents[index],
    status,
    updatedAt: new Date().toISOString(),
  });
  return incidents[index];
}

export function installMockApi() {
  if (installed) return;
  installed = true;
  const nativeFetch = window.fetch.bind(window);

  window.fetch = async (input: RequestInfo | URL, init: RequestInit = {}) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
    const parsed = new URL(url, window.location.origin);
    if (!parsed.pathname.startsWith("/api/")) return nativeFetch(input, init);

    await new Promise((resolve) => window.setTimeout(resolve, 80));
    const method = (init.method || "GET").toUpperCase();

    if (parsed.pathname === "/api/login" && method === "POST") {
      const body = JSON.parse(String(init.body || "{}")) as { email?: string; password?: string };
      if (!body.email || body.email.includes("invalid") || !body.password || body.password.length < 6) {
        return jsonResponse({ message: "Invalid email or password." }, 401);
      }
      return jsonResponse({
        user: { id: "10000000-0000-4000-8000-000000000001", name: "Incident Commander", email: body.email },
        tokens: { accessToken: "mock-access-token", refreshToken: "mock-refresh-token" },
      });
    }

    if (parsed.pathname === "/api/incidents" && method === "GET") {
      return jsonResponse(incidents);
    }

    const match = parsed.pathname.match(/^\/api\/incidents\/([0-9a-f-]+)(?:\/(acknowledge|resolve))?$/i);
    if (match && method === "GET") {
      const incident = incidents.find((item) => item.id === match[1]);
      return incident ? jsonResponse(incident) : jsonResponse({ message: "Incident not found." }, 404);
    }
    if (match && method === "POST" && match[2]) {
      const status = match[2] === "acknowledge" ? "acknowledged" : "resolved";
      const incident = updateIncident(match[1], status);
      return incident ? jsonResponse(incident) : jsonResponse({ message: "Incident not found." }, 404);
    }

    return jsonResponse({ message: "Mock endpoint not found." }, 404);
  };
}
