"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { FaRegCommentDots, FaRegHeart } from "react-icons/fa";
import { FiLogIn, FiUserPlus } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import useProducts from "@/hooks/useProducts";

function Navbar() {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const suggestionsQuery = useProducts(
    { q: debouncedSearch, limit: 6, page: 1 },
    { enabled: debouncedSearch.length >= 2 }
  );

  const handleSubmit = (event) => {
    event.preventDefault();

    if (searchInput.trim()) {
      router.push(`/results?q=${encodeURIComponent(searchInput.trim())}`);
      setShowSuggestions(false);
      setMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully.");
    router.push("/login");
  };

  const isActive = (href) => pathname === href;

  const navLinkClass = (href) =>
    `text-sm font-medium transition-colors ${isActive(href) ? "text-primary" : "text-text-secondary hover:text-text-primary"}`;

  return (
    <header className="border-b border-border bg-surface/80 backdrop-blur-md px-4 sm:px-10 py-3 w-full sticky top-0 z-40">
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
        <Link href={isAuthenticated ? "/feed" : "/"} className="flex items-center gap-4">
          <Image src="/Logo.svg" width="100" height="40" alt="UNISALE logo" className="mb-2 brightness-0 invert opacity-90" />
        </Link>

        <div className="hidden sm:flex items-center gap-8 ml-10">
          <Link className={navLinkClass(isAuthenticated ? "/feed" : "/")} href={isAuthenticated ? "/feed" : "/"}>
            {isAuthenticated ? "Feed" : "Home"}
          </Link>
          <Link className={navLinkClass("/explore")} href="/explore">Explore</Link>
          {isAuthenticated && (
            <>
              <Link className={navLinkClass("/create-listing")} href="/create-listing">Sell</Link>
              <Link className={navLinkClass("/chat")} href="/chat">Chat</Link>
            </>
          )}
        </div>

        <div className="hidden sm:flex items-center gap-3">
          <div className="relative">
            <form
              onSubmit={handleSubmit}
              className="flex h-10 items-center rounded-xl bg-surface-2 border border-border overflow-hidden"
            >
              <div className="px-3 text-text-muted">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
                </svg>
              </div>
              <input
                value={searchInput}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                onChange={(event) => setSearchInput(event.target.value)}
                className="bg-transparent border-none outline-none px-2 text-sm text-text-primary w-[220px] placeholder:text-text-muted"
                placeholder="Search listings"
              />
            </form>

            {showSuggestions && debouncedSearch.length >= 2 && (
              <div className="absolute z-30 top-12 left-0 w-full bg-surface border border-border rounded-xl shadow-lg max-h-72 overflow-y-auto">
                {suggestionsQuery.loading ? (
                  <div className="px-3 py-2 text-sm text-text-muted">Searching...</div>
                ) : suggestionsQuery.products.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-text-muted">No listings found.</div>
                ) : (
                  suggestionsQuery.products.map((product) => (
                    <button
                      key={product._id}
                      type="button"
                      onClick={() => {
                        router.push(`/listings/${product._id}`);
                        setShowSuggestions(false);
                        setSearchInput("");
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-surface-2 transition-colors"
                    >
                      <p className="text-sm font-semibold text-text-primary line-clamp-1">{product.title}</p>
                      <p className="text-xs text-text-muted">Rs. {Number(product.price || 0).toLocaleString()}</p>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {isAuthenticated && (
            <>
              <Link
                href="/profile"
                className="rounded-full h-10 w-10 bg-surface-2 border border-border flex items-center justify-center text-text-secondary hover:text-primary transition-colors"
                title="Wishlist"
              >
                <FaRegHeart />
              </Link>
              <Link
                href="/chat"
                className="rounded-full h-10 w-10 bg-surface-2 border border-border flex items-center justify-center text-text-secondary hover:text-primary transition-colors"
                title="Chats"
              >
                <FaRegCommentDots />
              </Link>
            </>
          )}

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                href="/profile"
                className="rounded-full h-10 px-5 bg-surface-2 border border-border text-sm font-semibold flex items-center text-text-primary hover:border-primary/40 transition-colors"
              >
                {user?.name?.split(" ")[0] || "Profile"}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="btn btn-primary btn-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="btn btn-ghost btn-sm">
                <FiLogIn />
                Login
              </Link>
              <Link href="/register" className="btn btn-primary btn-sm">
                <FiUserPlus />
                Sign up
              </Link>
            </div>
          )}
        </div>

        <div className="sm:hidden flex items-center gap-3">
          <button type="button" onClick={() => setMenuOpen(!menuOpen)} className="text-text-primary">
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
        <div className="sm:hidden mt-3 px-4 space-y-4 pb-2">
          <Link className="block text-text-secondary text-sm font-medium" href={isAuthenticated ? "/feed" : "/"} onClick={() => setMenuOpen(false)}>
            {isAuthenticated ? "Feed" : "Home"}
          </Link>
          <Link className="block text-text-secondary text-sm font-medium" href="/category" onClick={() => setMenuOpen(false)}>
            Categories
          </Link>
          {isAuthenticated && (
            <>
              <Link className="block text-text-secondary text-sm font-medium" href="/create-listing" onClick={() => setMenuOpen(false)}>
                Sell
              </Link>
              <Link className="block text-text-secondary text-sm font-medium" href="/chat" onClick={() => setMenuOpen(false)}>
                Chat
              </Link>
            </>
          )}

          <form onSubmit={handleSubmit} className="flex h-10 items-center rounded-xl bg-surface-2 border border-border overflow-hidden">
            <div className="px-3 text-text-muted">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256">
                <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
              </svg>
            </div>
            <input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              className="bg-transparent border-none outline-none px-2 text-sm text-text-primary flex-1 placeholder:text-text-muted"
              placeholder="Search"
            />
          </form>

          {isAuthenticated ? (
            <button
              type="button"
              onClick={handleLogout}
              className="btn btn-primary btn-full"
            >
              Logout
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <Link href="/login" className="btn btn-secondary btn-full" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link href="/register" className="btn btn-primary btn-full" onClick={() => setMenuOpen(false)}>
                Sign up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;
