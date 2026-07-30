import { configureStore } from "@reduxjs/toolkit";
import notificationsReducer from "./notificationSlice";

export const reduxStore = configureStore({
  reducer: {
    notifications: notificationsReducer,
  },
});
