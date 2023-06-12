import React, { ReactElement } from "react";
import { Navigate } from "react-router";

interface Props {
  isLoggedIn: boolean;
  children: ReactElement;
}

const AuthProtection = ({ isLoggedIn, children }: Props) => {
  if (isLoggedIn) {
    return <Navigate to="/home" />;
  }

  return <div>{children}</div>;
};

export default AuthProtection;
