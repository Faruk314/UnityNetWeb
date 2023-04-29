import React, { useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { addUser, authActions } from "./redux/authSlice";
import Profile from "./pages/Profile";
import { getLoggedUserInfo } from "./redux/authSlice";
import {
  getFriendRequests,
  onRemovedFromFriends,
  subscribeToFriendRequests,
  unsubscribeFromFriendRequests,
} from "./redux/friendRequestSlice";

import {
  getSeen,
  subscribeToMessages,
  unsubscribeFromMessages,
  unsubscribeFromSeen,
} from "./redux/chatSlice";
import socket, { onLoginSuccess } from "./services/socket";
import {
  getNotifications,
  getNotificationsCount,
  subscribeToNotifications,
  unsubscribeFromNotifications,
} from "./redux/notificationSlice";
import PreviewPost from "./pages/PreviewPost";
import { friendRequestActions } from "./redux/friendRequestSlice";
import EditProfile from "./pages/EditProfile";

axios.defaults.withCredentials = true;

function App() {
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const loggedUserInfo = useAppSelector((state) => state.auth.loggedUserInfo);
  const messages = useAppSelector((state) => state.chat.messages);
  const notifications = useAppSelector(
    (state) => state.notification.notifications
  );
  const requests = useAppSelector((state) => state.request.requests);
  const isRemovedFromFriends = useAppSelector(
    (state) => state.request.isRemovedFromFriends
  );

  useEffect(() => {
    // dispatch(onRemovedFromFriends());

    socket.on("removedFromFriends", (data) => {
      dispatch(friendRequestActions.removeFromFriends(data));
    });

    return () => {
      socket.off("removedFromFriends");
    };
  }, [isRemovedFromFriends, dispatch]);

  // useEffect(() => {
  //   dispatch(getSeen());

  //   return () => dispatch(unsubscribeFromSeen());
  // }, [dispatch]);

  useEffect(() => {
    isLoggedIn && dispatch(getFriendRequests());
  }, [dispatch, isLoggedIn]);

  useEffect(() => {
    isLoggedIn && dispatch(getNotifications());
  }, [dispatch, isLoggedIn]);

  useEffect(() => {
    isLoggedIn && dispatch(getNotificationsCount());
  }, [dispatch, notifications, isLoggedIn]);

  useEffect(() => {
    isLoggedIn && dispatch(addUser(loggedUserInfo.id));
  }, [dispatch, loggedUserInfo, isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(getSeen());
      dispatch(subscribeToNotifications());
      dispatch(subscribeToMessages());
      dispatch(subscribeToFriendRequests());
    }
    return () => {
      dispatch(unsubscribeFromMessages());
      dispatch(unsubscribeFromFriendRequests());
      dispatch(unsubscribeFromNotifications());
      socket.disconnect();
    };
  }, [dispatch, isLoggedIn]);

  useEffect(() => {
    const getLoginStatus = async () => {
      try {
        const response = await axios.get(
          `http://localhost:7000/api/auth/getLoginStatus`
        );

        dispatch(authActions.setLogin(response.data.status));

        if (response.data.status) {
          onLoginSuccess(response.data.token);
          dispatch(getLoggedUserInfo());
        }
      } catch (err) {}
    };

    getLoginStatus();
  }, [dispatch, isLoggedIn]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/previewPost/:postId" element={<PreviewPost />} />
        <Route path="/editProfile/:id" element={<EditProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
