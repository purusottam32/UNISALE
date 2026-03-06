import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaRegCommentDots, FaRegHeart } from "react-icons/fa";
import Logo from "../assets/Logo.svg";
import { useAuth } from "../context/AuthContext";
import useProducts from "../hooks/useProducts";

function Navbar() {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const suggestionsQuery = useProducts(
    {
      q: debouncedSearch,
      limit: 6,
      page: 1,
    },
    {
      enabled: debouncedSearch.length >= 2,
    }
  );

  const handleSubmit = (event) => {
    event.preventDefault();

    if (searchInput.trim()) {
      navigate(`/results?q=${encodeURIComponent(searchInput.trim())}`);
      setShowSuggestions(false);
      setMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully.");
    navigate("/login");
  };

  return (
    <header className="border-b border-b-[#f1f4f1] px-4 sm:px-10 py-3 w-full">
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
        <NavLink to="/" className="flex items-center gap-4 text-[#131712]">
          <img src={Logo} width="100" height="40" alt="UNISALE logo" className="mb-2" />
        </NavLink>

        <div className="hidden sm:flex items-center gap-10 ml-10">
          <NavLink className="text-sm font-medium text-[#131712]" to="/">Home</NavLink>
          <NavLink className="text-sm font-medium text-[#131712]" to="/category">Categories</NavLink>
          <NavLink className="text-sm font-medium text-[#131712]" to="/offer-zone">Sell</NavLink>
          {isAuthenticated && (
            <NavLink className="text-sm font-medium text-[#131712]" to="/chat">Chat</NavLink>
          )}
        </div>

        <div className="hidden sm:flex items-center gap-4">
          <div className="relative">
            <form
              onSubmit={handleSubmit}
              className="flex h-10 items-center rounded-xl bg-[#f1f4f1] overflow-hidden"
            >
              <div className="px-3 text-[#6d8566]">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
                </svg>
              </div>
              <input
                value={searchInput}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                onChange={(event) => setSearchInput(event.target.value)}
                className="bg-[#f1f4f1] border-none outline-none px-2 text-sm text-[#131712] w-[240px]"
                placeholder="Search products"
              />
            </form>

            {showSuggestions && debouncedSearch.length >= 2 && (
              <div className="absolute z-30 top-12 left-0 w-full bg-white border border-[#e8efe8] rounded-xl shadow-md max-h-72 overflow-y-auto">
                {suggestionsQuery.loading ? (
                  <div className="px-3 py-2 text-sm text-[#6d8566]">Searching...</div>
                ) : suggestionsQuery.products.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-[#6d8566]">No products found.</div>
                ) : (
                  suggestionsQuery.products.map((product) => (
                    <button
                      key={product._id}
                      type="button"
                      onClick={() => {
                        navigate(`/products/${product._id}`);
                        setShowSuggestions(false);
                        setSearchInput("");
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-[#f1f4f1]"
                    >
                      <p className="text-sm font-semibold text-[#131712] line-clamp-1">{product.title}</p>
                      <p className="text-xs text-[#6d8566]">Rs. {Number(product.price || 0).toLocaleString()}</p>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          <NavLink
            to="/profile"
            className="rounded-full h-10 w-10 bg-[#f1f4f1] flex items-center justify-center"
            title="Wishlist"
          >
            <FaRegHeart />
          </NavLink>

          {isAuthenticated && (
            <NavLink
              to="/chat"
              className="rounded-full h-10 w-10 bg-[#f1f4f1] flex items-center justify-center"
              title="Chats"
            >
              <FaRegCommentDots />
            </NavLink>
          )}

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <NavLink
                to="/profile"
                className="rounded-full h-10 px-5 bg-[#f1f4f1] text-sm font-bold flex items-center"
              >
                {user?.name || "Profile"}
              </NavLink>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full h-10 px-5 bg-[#50d22c] text-sm font-bold text-[#131712]"
              >
                Logout
              </button>
            </div>
          ) : (
            <button type="button" className="rounded-full h-10 px-5 bg-[#50d22c] text-sm font-bold">
              <NavLink to="/login" className="text-[#131712]">Login</NavLink>
            </button>
          )}
        </div>

        <div className="sm:hidden flex items-center gap-3">
          <NavLink to={isAuthenticated ? "/profile" : "/login"}>
            <button type="button" className="rounded-full h-10 w-10 bg-[#f1f4f1] flex items-center justify-center">
              {isAuthenticated ? "U" : "L"}
            </button>
          </NavLink>

          <button type="button" onClick={() => setMenuOpen(!menuOpen)} className="text-[#131712]">
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

      {menuOpen && (
        <div className="sm:hidden mt-3 px-4 space-y-4">
          <NavLink className="block text-[#131712] text-sm font-medium" to="/" onClick={() => setMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink className="block text-[#131712] text-sm font-medium" to="/category" onClick={() => setMenuOpen(false)}>
            Categories
          </NavLink>
          <NavLink className="block text-[#131712] text-sm font-medium" to="/offer-zone" onClick={() => setMenuOpen(false)}>
            Sell
          </NavLink>
          {isAuthenticated && (
            <NavLink className="block text-[#131712] text-sm font-medium" to="/chat" onClick={() => setMenuOpen(false)}>
              Chat
            </NavLink>
          )}

          <form onSubmit={handleSubmit} className="flex h-10 items-center rounded-xl bg-[#f1f4f1] overflow-hidden">
            <div className="px-3 text-[#6d8566]">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
              </svg>
            </div>
            <input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              className="bg-[#f1f4f1] border-none outline-none px-2 text-sm text-[#131712] flex-1"
              placeholder="Search"
            />
          </form>

          {isAuthenticated ? (
            <button
              type="button"
              onClick={handleLogout}
              className="w-full rounded-full h-10 bg-[#50d22c] text-sm font-bold text-[#131712]"
            >
              Logout
            </button>
          ) : (
            <button type="button" className="w-full rounded-full h-10 bg-[#50d22c] text-sm font-bold">
              <NavLink to="/login" className="text-[#131712] block w-full text-center" onClick={() => setMenuOpen(false)}>
                Login
              </NavLink>
            </button>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;
