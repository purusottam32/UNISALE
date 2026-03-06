import React from "react";
import { Route, Routes } from "react-router-dom";
import Homepage from "./Pages/Homepage";
import SearchPage from "./Pages/SearchPage";
import SignupForm from "./Pages/SignupForm";
import LoginForm from "./Pages/LoginForm";
import Category from "./Pages/Category";
import OfferZone from "./Pages/OfferZone";
import SellBenifits from "./Pages/SellBenifits";
import Profile from "./Pages/Profile";
import ResultsPage from "./Pages/ResultsPage";
import ProductDetails from "./Pages/ProductDetails";
import ChatPage from "./Pages/ChatPage";
import MainLayout from "./layout/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Homepage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="search/:query" element={<SearchPage />} />
        <Route path="results" element={<ResultsPage />} />
        <Route path="products/:id" element={<ProductDetails />} />
        <Route path="category" element={<Category />} />
        <Route
          path="offer-zone"
          element={
            <ProtectedRoute>
              <OfferZone />
            </ProtectedRoute>
          }
        />
        <Route path="sell-benifits" element={<SellBenifits />} />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="chat"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="chat/:conversationId"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
        <Route path="signup" element={<SignupForm />} />
        <Route path="login" element={<LoginForm />} />
      </Route>
    </Routes>
  );
}

export default App;
