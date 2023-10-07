import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";

const ProtectedAuthPages = () => {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);

  return !isLoggedIn ? <Outlet /> : <Navigate to="/home" />;
};

export default ProtectedAuthPages;
