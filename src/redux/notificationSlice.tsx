import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Notification } from "../types/types";

interface Args {
  receiverId: number;
  type: string;
  postId?: number;
}

interface NotificationsCount {
  notifications_count: number;
}

interface InitialState {
  notifications: Notification[];
  notificationCount: number;
}

const initialState: InitialState = {
  notifications: [],
  notificationCount: 0,
};

export const createNotification = createAsyncThunk(
  "notification/createNotification",
  async ({ receiverId, type, postId }: Args) => {
    try {
      if (postId) {
        await axios.post(
          `http://localhost:7000/api/notification/createNotification/${receiverId}/${postId}`,
          { type }
        );
        return true;
      }

      if (!postId) {
        await axios.post(
          `http://localhost:7000/api/notification/createNotification/${receiverId}/${null}`,
          { type }
        );

        return true;
      }
    } catch (err) {
      console.log(err);
      return false;
    }
  }
);

export const getNotifications = createAsyncThunk(
  "notification/getNotifications",
  async () => {
    try {
      const response = await axios.get(
        "http://localhost:7000/api/notification/getNotifications"
      );

      return response.data;
    } catch (err) {}
  }
);

export const markNotificationAsRead = createAsyncThunk(
  "notification/markNotificationAsRead",
  async () => {
    try {
      await axios.put(
        "http://localhost:7000/api/notification/markNotificationAsRead"
      );
    } catch (err) {}
  }
);

export const getNotificationsCount = createAsyncThunk(
  "notification/getNotificationsCount",
  async () => {
    try {
      const response = await axios.get(
        "http://localhost:7000/api/notification/getNotificationsCount"
      );

      return response.data;
    } catch (err) {}
  }
);

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    saveReceivedNotifications(state, action) {
      state.notifications.unshift(action.payload);
    },
    markNotificationsAsRead(state) {
      state.notificationCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getNotifications.fulfilled, (state, action) => {
      state.notifications = action.payload;
    });
    builder.addCase(
      getNotificationsCount.fulfilled,
      (state, action: PayloadAction<NotificationsCount>) => {
        state.notificationCount = action.payload.notifications_count;
      }
    );
  },
});

export const notificationsActions = notificationSlice.actions;

export default notificationSlice.reducer;
