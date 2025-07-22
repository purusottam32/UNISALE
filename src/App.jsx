import React from "react";
import Homepage from "./Pages/Homepage";
import SearchPage from "./Pages/SearchPage";
import SignupForm from "./Pages/SignupForm";
import LoginForm from "./Pages/LoginForm";
import Category from "./Pages/Category";
import OfferZone from "./Pages/OfferZone";
import MainLayout from "./layout/MainLayout";
import { Routes, Route } from "react-router-dom";
import SellBenifits from "./Pages/SellBenifits";
import Profile from "./Pages/Profile";

function App() {
  return (

    <Routes>
        {/* Layout applied to these routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Homepage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="search/:query" element={<SearchPage />} />
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