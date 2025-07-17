import React, { useState } from 'react';
import { useNavigate,NavLink } from 'react-router-dom';


function Navbar() {
    const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();

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
              <div className="size-4">
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </div>
              <h2 className="text-[#131712] text-lg font-bold leading-tight tracking-[-0.015em]">Uni<span className='text-[#50d22c]'>Sell</span></h2>
            </div>
            <div className="flex items-center gap-9">
              <NavLink  className="text-[#131712] text-sm font-medium leading-normal" to={"/"}>Home</NavLink>
              <NavLink className="text-[#131712] text-sm font-medium leading-normal" to={"/Category"}>Categories</NavLink>
              <NavLink className="text-[#131712] text-sm font-medium leading-normal" to={"/offer-zone"}>Offer Zone</NavLink>
            </div>
          </div>
          <div className="flex flex-1 justify-end gap-8">
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
            <button
              className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 bg-[#f1f4f1] text-[#131712] gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5"
            >
              <div className="text-[#131712]" data-icon="Heart" data-size="20px" data-weight="regular">
                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                  <path
                    d="M178,32c-20.65,0-38.73,8.88-50,23.89C116.73,40.88,98.65,32,78,32A62.07,62.07,0,0,0,16,94c0,70,103.79,126.66,108.21,129a8,8,0,0,0,7.58,0C136.21,220.66,240,164,240,94A62.07,62.07,0,0,0,178,32ZM128,206.8C109.74,196.16,32,147.69,32,94A46.06,46.06,0,0,1,78,48c19.45,0,35.78,10.36,42.6,27a8,8,0,0,0,14.8,0c6.82-16.67,23.15-27,42.6-27a46.06,46.06,0,0,1,46,46C224,147.61,146.24,196.15,128,206.8Z"
                  ></path>
                </svg>
              </div>
            </button>
           <div className='flex items-center gap-2'>
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
        </header>
  )
}

export default Navbar