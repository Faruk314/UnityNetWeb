import React, { useContext, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { authActions } from "./redux/authSlice";
import Profile from "./pages/Profile";
import { getLoggedUserInfo } from "./redux/authSlice";
import { getFriendRequests } from "./redux/friendRequestSlice";
import {
  getNotifications,
  getNotificationsCount,
  notificationsActions,
} from "./redux/notificationSlice";
import PreviewPost from "./pages/PreviewPost";
import { friendRequestActions } from "./redux/friendRequestSlice";
import EditProfile from "./pages/EditProfile";
import ChatBubble from "./cards/ChatBubble";
import Chat from "./modals/messenger/Chat";
import SearchPage from "./pages/SearchPage";
import { SocketContext } from "./context/SocketContext";
import ProtectedAuthPages from "./protection/ProtectedAuthPages";
import ProtectedRoutes from "./protection/ProtectedRoutes";
import { getFriends } from "./services/FriendServices";
import { chatActions } from "./redux/chatSlice";

axios.defaults.withCredentials = true;

function App() {
  const { socket } = useContext(SocketContext);
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const loggedUserInfo = useAppSelector((state) => state.auth.loggedUserInfo);
  const notifications = useAppSelector(
    (state) => state.notification.notifications
  );
  const chats = useAppSelector((state) => state.chat.chats);

  useEffect(() => {
    const getLoginStatus = async () => {
      try {
        const response = await axios.get(
          `http://localhost:7000/api/auth/getLoginStatus`
        );

        dispatch(authActions.setLogin(response.data.status));

        if (response.data.status) {
          await dispatch(getLoggedUserInfo());
        }
      } catch (err) {
        console.log(err);
      }
    };

    getLoginStatus();
  }, [dispatch, isLoggedIn]);

  useEffect(() => {
    const fetchFriends = async () => {
      const friends = await getFriends(loggedUserInfo.id);

      if (friends) dispatch(friendRequestActions.saveFriends(friends));
    };

    if (isLoggedIn) {
      fetchFriends();
    }
  }, [isLoggedIn, loggedUserInfo.id, dispatch]);

  useEffect(() => {
    if (isLoggedIn) dispatch(getFriendRequests());
  }, [isLoggedIn, dispatch]);

  useEffect(() => {
    if (isLoggedIn) dispatch(getNotifications());
  }, [dispatch, isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) dispatch(getNotificationsCount());
  }, [dispatch, notifications, isLoggedIn]);

  useEffect(() => {
    socket?.on("getFriendRequest", (userInfo) => {
      dispatch(friendRequestActions.saveReceivedRequest(userInfo));
    });

    return () => {
      socket?.off("getFriendRequest");
    };
  }, [socket, dispatch]);

  useEffect(() => {
    socket?.on("friendRequestAccepted", (userInfo) => {
      dispatch(friendRequestActions.updateFriends(userInfo));
    });

    return () => {
      socket?.off("friendRequestAccepted");
    };
  }, [socket, dispatch]);

  useEffect(() => {
    socket?.on("removedFromFriends", (userId) => {
      dispatch(friendRequestActions.removeFromFriends(userId));
    });

    return () => {
      socket?.off("removedFromFriends");
    };
  }, [socket, dispatch]);

  useEffect(() => {
    socket?.on("rejectedFriendRequest", (userId) => {
      dispatch(friendRequestActions.deleteFriendRequest(userId));
    });

    return () => {
      socket?.off("rejectedFriendRequest");
    };
  }, [socket, dispatch]);

  useEffect(() => {
    socket?.on("getMessage", (data) => {
      dispatch(chatActions.saveReceivedMessages(data));
    });

    return () => {
      socket?.off("getMessage");
    };
  }, [socket, dispatch]);

  useEffect(() => {
    socket?.on("getSeen", (data) => {
      dispatch(chatActions.markMessageAsSeen(data));
    });

    return () => {
      socket?.off("getSeen");
    };
  }, [socket, dispatch]);

  useEffect(() => {
    socket?.on("getNotification", (data) => {
      dispatch(notificationsActions.saveReceivedNotifications(data));
    });

    return () => {
      socket?.off("getNotification");
    };
  }, [socket, dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedAuthPages />}>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<ProtectedRoutes />}>
          <Route path="/home" element={<Home />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/previewPost/:postId" element={<PreviewPost />} />
          <Route path="/editProfile/:id" element={<EditProfile />} />
          <Route path="/search" element={<SearchPage />} />
        </Route>
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
