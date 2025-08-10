// src/AuthLoader.jsx
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import authService from "./appwrite/auth";
import { setUser, clearUser } from "./redux/authSlice";

const AuthLoader = ({ children }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      try {
        const u = await authService.getUser();
        if (u) dispatch(setUser(u));
        else dispatch(clearUser());
      } catch (e) {
        dispatch(clearUser());
      }
    })();
  }, [dispatch]);

  return <>{children}</>;
};

export default AuthLoader;
