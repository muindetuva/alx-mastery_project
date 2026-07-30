import { useCallback, useEffect, useRef, useState } from "react";

const INITIAL_DELAY = 1000;
const MAX_DELAY = 30000;

function useWebSocket(url) {
  const [status, setStatus] = useState("connecting");
  const [messages, setMessages] = useState([]);
  const [readyState, setReadyState] = useState(WebSocket.CONNECTING);
  const socketRef = useRef(null);
  const reconnectTimerRef = useRef(null);
  const reconnectAttemptRef = useRef(0);

  useEffect(() => {
    let active = true;

    function connect() {
      if (!active) {
        return;
      }

      setStatus("connecting");
      setReadyState(WebSocket.CONNECTING);

      try {
        const socket = new WebSocket(url);
        socketRef.current = socket;

        socket.addEventListener("open", () => {
          if (!active) return;
          reconnectAttemptRef.current = 0;
          setStatus("open");
          setReadyState(socket.readyState);
        });

        socket.addEventListener("message", (event) => {
          if (!active) return;
          let message;
          try {
            message = JSON.parse(event.data);
          } catch {
            message = { message: event.data, type: "raw" };
          }
          setMessages((current) => [...current, message]);
        });

        socket.addEventListener("error", () => {
          if (!active) return;
          setStatus("error");
          setReadyState(socket.readyState);
        });

        socket.addEventListener("close", () => {
          if (!active) return;
          setStatus("closed");
          setReadyState(WebSocket.CLOSED);
          const attempt = reconnectAttemptRef.current;
          const delay = Math.min(INITIAL_DELAY * 2 ** attempt, MAX_DELAY);
          reconnectAttemptRef.current += 1;
          reconnectTimerRef.current = window.setTimeout(connect, delay);
        });
      } catch {
        setStatus("error");
        setReadyState(WebSocket.CLOSED);
        const attempt = reconnectAttemptRef.current;
        const delay = Math.min(INITIAL_DELAY * 2 ** attempt, MAX_DELAY);
        reconnectAttemptRef.current += 1;
        reconnectTimerRef.current = window.setTimeout(connect, delay);
      }
    }

    connect();

    return () => {
      active = false;
      window.clearTimeout(reconnectTimerRef.current);
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [url]);

  const sendMessage = useCallback((payload) => {
    const socket = socketRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      return false;
    }
    socket.send(typeof payload === "string" ? payload : JSON.stringify(payload));
    return true;
  }, []);

  return { status, messages, sendMessage, readyState };
}

export default useWebSocket;
