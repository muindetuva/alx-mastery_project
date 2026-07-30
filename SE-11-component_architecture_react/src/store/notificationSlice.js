import { createSlice } from "@reduxjs/toolkit";

const allowedTypes = new Set(["info", "success", "warning", "error"]);

const notificationSlice = createSlice({
  name: "notifications",
  initialState: [],
  reducers: {
    addNotification: {
      reducer(state, action) {
        state.push(action.payload);
      },
      prepare(notification = {}) {
        const type = allowedTypes.has(notification.type)
          ? notification.type
          : "info";
        return {
          payload: {
            id: notification.id || `${Date.now()}-${Math.random()}`,
            type,
            message: String(notification.message || "New notification"),
            timestamp: notification.timestamp || new Date().toISOString(),
          },
        };
      },
    },
    dismissNotification(state, action) {
      return state.filter((notification) => notification.id !== action.payload);
    },
    clearNotifications() {
      return [];
    },
  },
});

export const {
  addNotification,
  dismissNotification,
  clearNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;
