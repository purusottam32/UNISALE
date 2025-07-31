import React, { useState } from 'react';
import { useNavigate,NavLink } from 'react-router-dom';
import { FaRegHeart } from 'react-icons/fa';
import Logo from '../assets/Logo.svg'; // Adjust the path as necessary



function Navbar() {
    const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);  

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/search/${encodeURIComponent(searchInput.trim())}`);
      setSearchInput('');
    }
    
  };

  return (
   <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f1f4f1] px-10 py-3">
          <div className="flex items-center gap-8 container">
            <div className="flex items-center gap-4 text-[#131712]">
            <div className="mb-2 ">
              <img src={Logo} width="120px" height="100px" alt="logo " />
            </div>

            </div>
            {/* Desktop Navigation - Hidden on mobile */}
            <div className="hidden md:flex items-center gap-9">
              <NavLink  className="text-[#131712] text-sm font-medium leading-normal" to={"/"}>Home</NavLink>
              <NavLink className="text-[#131712] text-sm font-medium leading-normal" to={"/Category"}>Categories</NavLink>
              <NavLink className="text-[#131712] text-sm font-medium leading-normal" to={"/offer-zone"}>Offer Zone</NavLink>
            </div>
          </div>
          {/* Desktop elements - Hidden on mobile */}
          <div className="hidden md:flex flex-1 justify-end gap-8">
            <label className="flex flex-col min-w-40 !h-10 max-w-64">
              <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
                <div
                  className="text-[#6d8566] flex border-none bg-[#f1f4f1] items-center justify-center pl-4 rounded-l-xl border-r-0"
                  data-icon="MagnifyingGlass"
                  data-size="24px"
                  data-weight="regular"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                    <path
                      d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"
                    ></path>
                  </svg>
                </div>
                <form onSubmit={handleSubmit}>
                  <input
                  placeholder="Search"
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#131712] focus:outline-0 focus:ring-0 border-none bg-[#f1f4f1] focus:border-none h-full placeholder:text-[#6d8566] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                </form>
              </div>
            </label>
            
             
            
           <div className='flex items-center gap-2'>
             <button className="rounded-full h-10 w-10 bg-[#f1f4f1] flex items-center justify-center">
                  <FaRegHeart />
              </button>
             <button className="rounded-full h-10 px-6 bg-[#f1f4f1] text-sm font-bold">
                  <NavLink to="/sell-benifits" className="text-[#131712]">sell</NavLink>
              </button>
              <button className="rounded-full h-10 px-5 bg-[#50d22c] text-sm font-bold">
                  <NavLink to="/login" className="text-[#131712]">Login</NavLink>
              </button>
           </div>

            {/* <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
              style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAMnu-D4RSgIxhsmnAe23kH9RD5QJ5AAHsdrQcSbJgHJvlP5NmaF-O5GV3F27tkwjqCXKj-f7nLsjh2fO7biGST85d-9PS5AqEmpJKwexjaPQeS_h2NMtqTSz-IKcXWDsCACp_i0KN9Te9zkGbEZVhTM-M47KD-WFVMba__fgqc_N_xrc47HrH4L_QblZdpDaFBnnRyphXNU4kW49K1kE9d170LUe6zvtV1SziIMobbmGNdcdi3WPH5_YcUGhQK5d-rVFvDBdqKqA")' }}

            ></div> */}
            
          </div>

            {/* Right side mobile icons */}
          <div className="flex md:hidden items-center gap-3">
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
         {/* Mobile menu */}
            {menuOpen && (
              <div className=" md:hidden mt-3 px-4 space-y-4">
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
  )
}

export default Navbar