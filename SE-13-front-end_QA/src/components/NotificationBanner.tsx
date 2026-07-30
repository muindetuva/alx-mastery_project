import { useEffect, useState } from "react";

type Notification = { message: string; type: "info" | "error" };

export default function NotificationBanner() {
  const [notification, setNotification] = useState<Notification | null>(null);

  useEffect(() => {
    function handleNotification(event: Event) {
      setNotification((event as CustomEvent<Notification>).detail);
    }
    window.addEventListener("sentinel-notification", handleNotification);
    return () => window.removeEventListener("sentinel-notification", handleNotification);
  }, []);

  if (!notification) return null;
  return (
    <div className={`notification ${notification.type}`} role={notification.type === "error" ? "alert" : "status"}>
      <span>{notification.message}</span>
      <button type="button" aria-label="Dismiss notification" onClick={() => setNotification(null)}>×</button>
    </div>
  );
}
