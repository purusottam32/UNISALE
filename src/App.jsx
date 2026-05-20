import React, { lazy, Suspense } from "react";
import { Route, Routes, Navigate, useParams } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import OAuthTokenHandler from "./components/OAuthTokenHandler";

import Landing from "./Pages/Landing";
import Register from "./Pages/auth/Register";
import Login from "./Pages/auth/Login";
import VerifyOTP from "./Pages/auth/VerifyOTP";
import CompleteProfile from "./Pages/auth/CompleteProfile";

const Feed = lazy(() => import("./Pages/Feed"));
const Explore = lazy(() => import("./Pages/Explore"));
const SearchResults = lazy(() => import("./Pages/SearchResults"));
const SearchPage = lazy(() => import("./Pages/SearchPage"));
const Category = lazy(() => import("./Pages/Category"));
const CreateListing = lazy(() => import("./Pages/CreateListing"));
const EditListing = lazy(() => import("./Pages/EditListing"));
const ListingDetail = lazy(() => import("./Pages/ListingDetail"));
const Profile = lazy(() => import("./Pages/Profile"));
const ChatPage = lazy(() => import("./Pages/ChatPage"));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="spinner" style={{ width: 32, height: 32 }} />
  </div>
);

const RedirectProductToListing = () => {
  const { id } = useParams();
  return <Navigate to={`/listings/${id}`} replace />;
};

function App() {
  return (
    <>
      <OAuthTokenHandler />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Landing />} />

          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route
            path="/complete-profile"
            element={
              <ProtectedRoute>
                <CompleteProfile />
              </ProtectedRoute>
            }
          />

          <Route element={<MainLayout />}>
            <Route path="search" element={<SearchPage />} />
            <Route path="search/:query" element={<SearchPage />} />
            <Route path="results" element={<SearchResults />} />
            <Route path="explore" element={<Explore />} />
            <Route path="category" element={<Category />} />

            <Route path="listings/:id" element={<ListingDetail />} />
            <Route path="products/:id" element={<RedirectProductToListing />} />

            <Route
              path="feed"
              element={
                <ProtectedRoute>
                  <Feed />
                </ProtectedRoute>
              }
            />

            <Route
              path="create-listing"
              element={
                <ProtectedRoute>
                  <CreateListing />
                </ProtectedRoute>
              }
            />
            <Route path="offer-zone" element={<Navigate to="/create-listing" replace />} />

            <Route
              path="listings/:id/edit"
              element={
                <ProtectedRoute>
                  <EditListing />
                </ProtectedRoute>
              }
            />

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

            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
