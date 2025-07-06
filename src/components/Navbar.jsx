import React from 'react';
import Logo from "../assets/Logo.svg"
import Heart from "../assets/Heart.svg"
import searchIcon from "../assets/searchIcon.svg"

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md py-4 px-6">  
      <div className="mx-auto flex justify-between items-center">
        <div className="">
          <img src={Logo} width="100px" height="100px"alt="logo " />
        </div>
        <div className="hidden md:flex space-x-6">
          <a href="#" className="text-gray-700 hover:text-blue-600">Home</a>
          <a href="#" className="text-gray-700 hover:text-blue-600">Sell Item</a>
          <a href="#" className="text-gray-700 hover:text-blue-600">My Account</a>
        </div>
        <button className="md:hidden text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;