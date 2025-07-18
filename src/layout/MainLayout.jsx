import React from 'react'
import Navbar from '../components/Navbar'
import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <div className='relative flex size-full min-h-screen flex-col group/design-root bg-white overflow-x-hidden' style={{fontFamily : 'Monorepo, "Noto Sans", sans-serif'}}>
        <div className='layout-container flex h-full grow flex-col'>
          <Navbar />
          <div className="px-40 flex flex-1 justify-center py-5">
            <div className="layout-content-container flex flex-col max-w-5xl flex-1">
              <Outlet />
            </div>
          </div>
        </div>
    </div>
  )
}

export default MainLayout