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
  onRejectedFriendRequest,
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
import ChatBubble from "./cards/ChatBubble";
import Chat from "./modals/messenger/Chat";
import SearchPage from "./pages/SearchPage";

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
  const chats = useAppSelector((state) => state.chat.chats);
  const isFriendRequestRejected = useAppSelector(
    (state) => state.request.isFriendRequestRejected
  );

  useEffect(() => {
    // dispatch(onRemovedFromFriends());

    isLoggedIn &&
      socket.on("removedFromFriends", (data) => {
        dispatch(friendRequestActions.removeFromFriends(data));
      });

    return () => {
      socket.off("removedFromFriends");
    };
  }, [isRemovedFromFriends, dispatch, isLoggedIn]);

  useEffect(() => {
    isLoggedIn &&
      socket.on("rejectedFriendRequest", (data) => {
        dispatch(friendRequestActions.rejectFriendRequest(data));
      });

    return () => {
      socket.off("rejectedFriendRequest");
    };
  }, [dispatch, isFriendRequestRejected, isLoggedIn]);

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
        <Route path="/login" element={!isLoggedIn && <Login />} />
        <Route path="/register" element={!isLoggedIn && <Register />} />
        <Route path="/home" element={isLoggedIn && <Home />} />
        <Route path="/profile/:id" element={isLoggedIn && <Profile />} />
        <Route
          path="/previewPost/:postId"
          element={isLoggedIn && <PreviewPost />}
        />
        <Route
          path="/editProfile/:id"
          element={isLoggedIn && <EditProfile />}
        />
        <Route path="/search" element={isLoggedIn && <SearchPage />} />
      </Routes>
      {isLoggedIn && (
        <div>
          {chats.map(
            (chat) => chat.open && <Chat key={chat.userId} chatInfo={chat} />
          )}
          <div className="fixed bottom-0 right-0 w-[3rem] h-[50%]  my-4">
            <div className="absolute bottom-0">
              {chats.map(
                (chat) =>
                  chat.open === false && (
                    <ChatBubble
                      key={chat.userId}
                      userId={chat.userId}
                      firstName={chat.firstName}
                      lastName={chat.lastName}
                      image={chat.image}
                      conversationId={chat.conversationId}
                    />
                  )
              )}
            </div>
          </div>
        </div>
      )}
    </BrowserRouter>
  );
}

export default App;
