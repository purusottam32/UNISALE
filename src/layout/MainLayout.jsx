import React from "react";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <div className="relative flex min-h-screen flex-col bg-bg text-text-primary overflow-x-hidden">
      <div className="flex h-full grow flex-col">
        <Navbar />
        <div className="px-4 sm:px-8 md:px-16 xl:px-40 flex flex-1 justify-center py-5">
          <div className="flex flex-col w-full max-w-6xl">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
