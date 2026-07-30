import { installMockApi } from "./mockApi";

export const handlers = {
  incidents: {
    list: { method: "GET", path: "/api/incidents" },
    acknowledge: { method: "POST", path: "/api/incidents/:id/acknowledge" },
    resolve: { method: "POST", path: "/api/incidents/:id/resolve" },
  },
  login: {
    method: "POST",
    path: "/api/auth/login",
    token: "mock-access-token",
  },
};

export { installMockApi };
