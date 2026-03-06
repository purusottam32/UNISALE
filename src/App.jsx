// src/App.jsx
import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";

import Homepage from "./Pages/Homepage";
import SearchPage from "./Pages/SearchPage";
import SignupForm from "./Pages/SignupForm";
import LoginForm from "./Pages/LoginForm";
import Category from "./Pages/Category";
import OfferZone from "./Pages/OfferZone";
import SellBenifits from "./Pages/SellBenifits";
import Profile from "./Pages/Profile";
import ResultsPage from "./Pages/ResultsPage";
import MainLayout from "./layout/MainLayout";

import { setUser, clearUser } from "./redux/authSlice";
// import authService from "./appwrite/auth";

function App() {
  const dispatch = useDispatch();

  // useEffect(() => {
  //   const loadUser = async () => {
  //     try {
  //       const user = await authService.getCurrentUser();
  //       if (user) {
  //         dispatch(setUser(user));   // Store user in Redux
  //       } else {
  //         dispatch(clearUser());     // Clear if no session
  //       }
  //     } catch (error) {
  //       console.error("Error fetching current user:", error);
  //       dispatch(clearUser());
  //     }
  //   };

  //   loadUser();
  // }, [dispatch]);

  return (
    <Routes>
      {/* All routes wrapped with MainLayout */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Homepage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="search/:query" element={<SearchPage />} />
        <Route path="results" element={<ResultsPage />} />
        <Route path="category" element={<Category />} />
        <Route path="offer-zone" element={<OfferZone />} />
        <Route path="sell-benifits" element={<SellBenifits />} />
        <Route path="profile" element={<Profile />} />
        <Route path="signup" element={<SignupForm />} />
        <Route path="login" element={<LoginForm />} />
      </Route>
    </Routes>
  );
}

export default App;
