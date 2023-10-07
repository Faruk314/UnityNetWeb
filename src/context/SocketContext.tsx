import React, { createContext, ReactNode, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAppSelector } from "../redux/hooks";

type SocketContextData = {
  socket: Socket | null;
};

const initialSocketContextData: SocketContextData = {
  socket: null,
};

export const SocketContext = createContext<SocketContextData>(
  initialSocketContextData
);

type SocketContextProviderProps = {
  children: ReactNode;
};

export const SocketContextProvider = ({
  children,
}: SocketContextProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);

  const getCookie = (name: string) => {
    const cookieString = document.cookie;
    const cookies = cookieString.split(";");

    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(name + "=")) {
        const value = cookie.substring(name.length + 1);

        return decodeURIComponent(value);
      }
    }

    return null;
  };

  useEffect(() => {
    let newSocket: any;

    if (isLoggedIn) {
      newSocket = io("http://localhost:8000", {
        transports: ["websocket"],
        auth: {
          token: getCookie("access_token"),
        },
      });
    }

    setSocket(newSocket);

    return () => {
      socket?.disconnect();
    };
  }, [isLoggedIn]);

  const contextValue: SocketContextData = {
    socket,
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};
