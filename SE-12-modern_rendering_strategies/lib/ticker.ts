export type TickerItem = {
  id: string;
  label: string;
  value: string;
  change: string;
  direction: "up" | "down";
};

const tickerItems: TickerItem[] = [
  { id: "build", label: "Build speed", value: "1.8s", change: "12%", direction: "up" },
  { id: "edge", label: "Edge uptime", value: "99.99%", change: "0.03%", direction: "up" },
  { id: "latency", label: "Global latency", value: "84ms", change: "8ms", direction: "down" },
  { id: "readers", label: "Readers online", value: "2,418", change: "6.4%", direction: "up" },
];

export function getTickerData() {
  return {
    items: tickerItems,
    generatedAt: new Date().toISOString(),
  };
}
