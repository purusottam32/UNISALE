import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { FaRegHeart } from "react-icons/fa";
import Logo from '../assets/Logo.svg';

function Navbar() {
  const [searchInput, setSearchInput] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/search/${encodeURIComponent(searchInput.trim())}`);
      setSearchInput('');
      setMenuOpen(false); // close menu after search
    }
  };

  return (
    <header className="border-b border-b-[#f1f4f1] px-4 sm:px-10 py-3 w-full">
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
        {/* Left: Logo */}
        <div className="flex items-center gap-4 text-[#131712]">
          
          <div className="mb-2">
              <img src={Logo} width="100px" height="40px" alt="logo " />
          </div>
          
          
        </div>

        {/* Center nav links (desktop) */}
        <div className="hidden sm:flex items-center gap-10 ml-10">
          <NavLink className="text-sm font-medium text-[#131712]" to="/">Home</NavLink>
          <NavLink className="text-sm font-medium text-[#131712]" to="/Category">Categories</NavLink>
          <NavLink className="text-sm font-medium text-[#131712]" to="/offer-zone">Offer Zone</NavLink>
        </div>

        {/* Right section desktop */}
        <div className="hidden sm:flex items-center gap-4">
          {/* Search bar */}
          <form onSubmit={handleSubmit} className="flex h-10 items-center rounded-xl bg-[#f1f4f1] overflow-hidden">
            <div className="px-3 text-[#6d8566]">
              <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
              </svg>
            </div>
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="bg-[#f1f4f1] border-none outline-none px-2 text-sm text-[#131712]"
              placeholder="Search"
            />
          </form>

          {/* Wishlist Icon */}
          <button className="rounded-full h-10 w-10 bg-[#f1f4f1] flex items-center justify-center">
<FaRegHeart />
          </button>

          {/* Buttons */}
          <button className="rounded-full h-10 px-6 bg-[#f1f4f1] text-sm font-bold">
            <NavLink to="/sell-benifits" className="text-[#131712]">Sell</NavLink>
          </button>
          <button className="rounded-full h-10 px-5 bg-[#50d22c] text-sm font-bold">
            <NavLink to="/login" className="text-[#131712]">Login</NavLink>
          </button>
        </div>

        {/* Right mobile icons */}
        <div className="sm:hidden flex items-center gap-3">
          {/* Wishlist for mobile */}
          <button className="rounded-full h-10 w-10 bg-[#f1f4f1] flex items-center justify-center">
            <FaRegHeart />
          </button>

          {/* Hamburger icon with correct color */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-[#131712]">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden mt-3 px-4 space-y-4">
          <NavLink className="block text-[#131712] text-sm font-medium" to="/" onClick={() => setMenuOpen(false)}>Home</NavLink>
          <NavLink className="block text-[#131712] text-sm font-medium" to="/Category" onClick={() => setMenuOpen(false)}>Categories</NavLink>
          <NavLink className="block text-[#131712] text-sm font-medium" to="/offer-zone" onClick={() => setMenuOpen(false)}>Offer Zone</NavLink>

          <form onSubmit={handleSubmit} className="flex h-10 items-center rounded-xl bg-[#f1f4f1] overflow-hidden">
            <div className="px-3 text-[#6d8566]">
              <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
              </svg>
            </div>
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="bg-[#f1f4f1] border-none outline-none px-2 text-sm text-[#131712] flex-1"
              placeholder="Search"
            />
          </form>

          <div className="flex gap-2">
            <button className="flex-1 rounded-full h-10 bg-[#f1f4f1] text-sm font-bold">
              <NavLink to="/sell-benifits" className="text-[#131712] block w-full text-center">Sell</NavLink>
            </button>
            <button className="flex-1 rounded-full h-10 bg-[#50d22c] text-sm font-bold">
              <NavLink to="/login" className="text-[#131712] block w-full text-center">Login</NavLink>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;