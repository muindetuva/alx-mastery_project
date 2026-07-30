export function notify(message: string, type: "info" | "error" = "info") {
  window.dispatchEvent(new CustomEvent("sentinel-notification", {
    detail: { message, type },
  }));
}
