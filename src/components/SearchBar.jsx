"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function SearchBar({ placeholder = "Search" }) {
  const params = useParams();
  const query = params?.query;
  const [searchInput, setSearchInput] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (query) {
      setSearchInput(decodeURIComponent(query));
    }
  }, [query]);

  const handleSearchFromHere = (event) => {
    event.preventDefault();

    if (searchInput.trim()) {
      router.push(`/results?q=${encodeURIComponent(searchInput.trim())}`);
      return;
    }

    router.push("/results");
  };

  return (
    <form className="px-4 py-3" onSubmit={handleSearchFromHere}>
      <label className="flex flex-col min-w-40 h-12 w-full">
        <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
          <div className="text-[#6d8566] flex border-none bg-[#f1f4f1] items-center justify-center pl-4 rounded-l-lg border-r-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
              <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
            </svg>
          </div>
          <input
            placeholder={placeholder}
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            type="text"
            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#131712] focus:outline-0 focus:ring-0 border-none bg-[#f1f4f1] focus:border-none h-full placeholder:text-[#6d8566] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
          />
        </div>
      </label>
    </form>
  );
}
