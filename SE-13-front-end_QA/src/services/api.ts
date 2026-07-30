import {
  authResponseSchema,
  incidentListSchema,
  incidentSchema,
  type AuthResponse,
  type Incident,
} from "../types/incident";

const API_BASE_URL = "/api";

async function request(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data: unknown = await response.json();
  if (!response.ok) {
    const message = typeof data === "object" && data && "message" in data
      ? String(data.message)
      : `Request failed with status ${response.status}.`;
    throw new Error(message);
  }
  return data;
}

export async function loginRequest(email: string, password: string): Promise<AuthResponse> {
  const data = await request("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  return authResponseSchema.parse(data);
}

export async function getIncidents(): Promise<Incident[]> {
  return incidentListSchema.parse(await request("/incidents"));
}

export async function getIncidentById(id: string): Promise<Incident> {
  return incidentSchema.parse(await request(`/incidents/${id}`));
}

export async function acknowledgeIncident(id: string): Promise<Incident> {
  return incidentSchema.parse(await request(`/incidents/${id}/acknowledge`, { method: "POST" }));
}

export async function resolveIncident(id: string): Promise<Incident> {
  return incidentSchema.parse(await request(`/incidents/${id}/resolve`, { method: "POST" }));
}
