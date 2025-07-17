import React from "react";
import Homepage from "./Pages/Homepage";
import Searchpage from "./Pages/Searchpage";
import SignupForm from "./Pages/SignupForm";
import LoginForm from "./Pages/LoginForm";
import Category from "./Pages/Category";
import OfferZone from "./Pages/OfferZone";
import MainLayout from "./layout/MainLayout";
import { Routes, Route } from "react-router-dom";
import SellBenifits from "./Pages/SellBenifits";

function App() {
  return (
    <Routes>
      {/* Layout applied to these routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Homepage />} />
        <Route path="search" element={<Searchpage />} />
        <Route path="search/:query" element={<Searchpage />} />
        <Route path="category" element={<Category />} />
        <Route path="offer-zone" element={<OfferZone />} />
        <Route path="sell-benifits" element={<SellBenifits />} />
        <Route path="profile" element={<Searchpage />} />
        <Route path="signup" element={<SignupForm />} />
      <Route path="login" element={<LoginForm />} />
      </Route>
      
    </Routes>
  );
}

export default App;