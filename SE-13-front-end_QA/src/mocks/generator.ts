import { incidentSchema, type Incident, type Severity } from "../types/incident";

const severityWeights: Array<{ severity: Severity; threshold: number }> = [
  { severity: "critical", threshold: 0.1 },
  { severity: "high", threshold: 0.3 },
  { severity: "medium", threshold: 0.7 },
  { severity: "low", threshold: 1 },
];

const scenarios = [
  ["Elevated API error rate", "Checkout requests are returning more 5xx responses than the rolling baseline."],
  ["Database replica lag", "The reporting replica is behind the primary and read latency is increasing."],
  ["Authentication latency", "Sign-in requests in the west region are exceeding the response-time objective."],
  ["Queue depth warning", "Background export jobs are arriving faster than available workers can process them."],
  ["Certificate renewal due", "A public edge certificate is approaching its configured renewal threshold."],
];

function weightedSeverity(randomValue: number): Severity {
  return severityWeights.find(({ threshold }) => randomValue < threshold)?.severity ?? "low";
}

export function generateIncident(randomValue = Math.random()): Incident {
  const scenario = scenarios[Math.floor(randomValue * scenarios.length) % scenarios.length];
  const now = new Date().toISOString();
  return incidentSchema.parse({
    id: crypto.randomUUID(),
    title: scenario[0],
    description: scenario[1],
    severity: weightedSeverity(randomValue),
    status: "open",
    createdAt: now,
    updatedAt: now,
  });
}

export function generateIncidents(count: number): Incident[] {
  return Array.from({ length: count }, (_, index) => generateIncident((index + 0.5) / count));
}

export function startMockStream(
  onIncident: (incident: Incident) => void,
  intervalMs = 2500,
) {
  const timer = window.setInterval(() => onIncident(generateIncident()), intervalMs);
  return () => window.clearInterval(timer);
}
