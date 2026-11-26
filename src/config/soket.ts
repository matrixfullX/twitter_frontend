const apiBaseUrl = process.env.REACT_APP_API_BASE_URL?.trim();

export const urlWebSocketNotification = (() => {
  if (!apiBaseUrl) return "";

  try {
    const apiUrl = new URL(apiBaseUrl);
    apiUrl.protocol = apiUrl.protocol === "https:" ? "wss:" : "ws:";
    apiUrl.pathname = "/ws/notification/";
    apiUrl.search = "";
    apiUrl.hash = "";
    return apiUrl.toString();
  } catch {
    return "";
  }
})();

export const pushNotification = (ws: WebSocket | null | undefined, msg: string) => {
  // Notifications are best-effort; a disconnected socket must not break the action.
  if (!ws || ws.readyState !== WebSocket.OPEN) return false;

  try {
    ws.send(JSON.stringify({ message: msg }));
    return true;
  } catch {
    return false;
  }
};
