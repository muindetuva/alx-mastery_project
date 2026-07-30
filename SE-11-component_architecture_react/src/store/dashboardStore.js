import { create } from "zustand";

const initialActivities = [
  {
    id: "seed-1",
    message: "Published the launch readiness checklist",
    user: "Amara",
    time: "5 min ago",
    status: "complete",
  },
  {
    id: "seed-2",
    message: "Moved onboarding research into review",
    user: "Kwesi",
    time: "18 min ago",
    status: "review",
  },
];

export const useDashboardStore = create((set) => ({
  activities: initialActivities,
  status: "connecting",
  addActivity: (activity) => set((state) => ({
    activities: [
      {
        id: activity.id || `${Date.now()}-${Math.random()}`,
        message: activity.message || "New team activity",
        user: activity.user || "System",
        time: activity.time || "Just now",
        status: activity.status || "info",
      },
      ...state.activities,
    ],
  })),
  clearActivities: () => set({ activities: [] }),
  setStatus: (status) => set({ status }),
}));
