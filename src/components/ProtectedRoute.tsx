import React, { ReactElement } from "react";
import { Navigate } from "react-router";

interface Props {
  isLoggedIn: boolean;
  children: ReactElement;
}

const ProtectedRoute = ({ isLoggedIn, children }: Props) => {
  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }

  return <div>{children}</div>;
};

export default ProtectedRoute;
