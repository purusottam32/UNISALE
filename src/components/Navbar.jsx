import React from 'react';
import Logo from "../assets/Logo.svg"
import Heart from "../assets/Heart.svg"
import searchIcon from "../assets/searchIcon.svg"
import profileMale from "../assets/profileMale.svg"
import profileFemale from "../assets/profileFemale.svg"
import user from "../assets/user.svg"

const Navbar = () => {
  return (
    <div className="fixed w-full top-0 left-0 right-0 bg-white shadow-sm py-3 px-6">  
      <div className="flex items-center justify-between">
          {/* logo and menu */}
        <div className='flex items-center justify-between'>
            <div className="mb-2">
              <img src={Logo} width="120px" height="100px"alt="logo " />
            </div>
            <div className="space-x-6 mt-2.5">
              <navlink href="#" className=" text-xl text-black hover:text-gray-600">Home</navlink>
              <navlink href="#" className="text-xl text-black hover:text-gray-600">Sell Item</navlink>
              <navlink href="#" className="text-xl text-black hover:text-gray-600">My Account</navlink>
            </div>
        </div>
        {/* search + wishlist + profile */}
        <div className='flex items-center space-x-3 '>
            <div className="flex items-center bg-gray-200 pl-3 py-2 rounded-full shadow-sm">
              <img src={searchIcon} alt="search" className="w-5 h-5" />
              <input
                type="text"
                placeholder="Search"
                className="ml-2 bg-transparent outline-none text-xl placeholder-black"
              />
            </div>
            <div className='bg-gray-200 p-2 items-center justify-between rounded-full'>
              <img src={Heart} alt="wishllist" width="25px" height="25px"/>
            </div>
            <div className='bg-gray-200 p-2 items-center justify-between rounded-full'>
              <img src={user} alt="user" width="25px" height="25px" className=''/>
            </div>
          </div>
        </div>
    </div>
  );
};

export default Navbar;