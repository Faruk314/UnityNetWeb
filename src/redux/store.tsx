import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/authSlice";
import postReducer from "../redux/postSlice";
import chatReducer from "../redux/chatSlice";
import socketReducer from "../redux/socketSlice";
import friendRequestReducer from "../redux/friendRequestSlice";
import notificationReducer from "../redux/notificationSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    post: postReducer,
    chat: chatReducer,
    socket: socketReducer,
    request: friendRequestReducer,
    notification: notificationReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
