import { incidentSchema, type Incident } from "../types/incident";

export type ConnectionStatus = "connecting" | "open" | "closed" | "error";
type IncidentSubscriber = (incident: Incident) => void;
type StatusSubscriber = (status: ConnectionStatus) => void;

class WebSocketManager {
  private socket: WebSocket | null = null;
  private url = "";
  private reconnectAttempt = 0;
  private reconnectTimer: number | null = null;
  private manuallyClosed = false;
  private subscribers = new Set<IncidentSubscriber>();
  private statusSubscribers = new Set<StatusSubscriber>();

  connect(url: string) {
    this.disconnect();
    this.url = url;
    this.manuallyClosed = false;
    this.emitStatus("connecting");

    if (url.startsWith("mock://")) {
      window.setTimeout(() => {
        if (!this.manuallyClosed) this.emitStatus("open");
      }, 100);
      return;
    }

    try {
      this.socket = new WebSocket(url);
      this.socket.addEventListener("open", () => {
        this.reconnectAttempt = 0;
        this.emitStatus("open");
      });
      this.socket.addEventListener("message", (event) => this.handleMessage(event.data));
      this.socket.addEventListener("error", () => this.emitStatus("error"));
      this.socket.addEventListener("close", () => {
        this.emitStatus("closed");
        if (!this.manuallyClosed) this.scheduleReconnect();
      });
    } catch {
      this.emitStatus("error");
      this.scheduleReconnect();
    }
  }

  disconnect() {
    this.manuallyClosed = true;
    if (this.reconnectTimer !== null) window.clearTimeout(this.reconnectTimer);
    this.reconnectTimer = null;
    this.socket?.close();
    this.socket = null;
    this.emitStatus("closed");
  }

  onMessage(subscriber: IncidentSubscriber) {
    this.subscribers.add(subscriber);
    return () => this.subscribers.delete(subscriber);
  }

  onStatus(subscriber: StatusSubscriber) {
    this.statusSubscribers.add(subscriber);
    return () => this.statusSubscribers.delete(subscriber);
  }

  dispatchMock(incident: Incident) {
    this.handleMessage(JSON.stringify(incident));
  }

  private handleMessage(rawMessage: string) {
    try {
      const parsed: unknown = JSON.parse(rawMessage);
      const result = incidentSchema.safeParse(parsed);
      if (result.success) this.subscribers.forEach((subscriber) => subscriber(result.data));
    } catch {
      this.emitStatus("error");
    }
  }

  private emitStatus(status: ConnectionStatus) {
    this.statusSubscribers.forEach((subscriber) => subscriber(status));
  }

  private scheduleReconnect() {
    const delay = Math.min(1000 * 2 ** this.reconnectAttempt, 30000);
    this.reconnectAttempt += 1;
    this.reconnectTimer = window.setTimeout(() => this.connect(this.url), delay);
  }
}

export const webSocketManager = new WebSocketManager();
