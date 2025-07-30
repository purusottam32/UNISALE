import React from 'react'
import Navbar from '../components/Navbar'
import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
     <div
      className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden"
      style={{ fontFamily: 'Manrope, Noto Sans, sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <Navbar />
        <div className="px-4 sm:px-8 md:px-16 xl:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-full max-w-6xl">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainLayout