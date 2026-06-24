"use client";

import React, { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import SearchBar from "../components/SearchBar";
import ResultsPage from "./ResultsPage";

const SearchPage = () => {
  const params = useParams();
  const query = params?.query;
  const router = useRouter();

  useEffect(() => {
    if (query) {
      router.replace(`/results?q=${encodeURIComponent(query)}`);
    }
  }, [router, query]);

  if (query) {
    return <div className="py-16 text-center text-[#6d8566]">Redirecting search...</div>;
  }

  return (
    <>
      <SearchBar placeholder="Search for items" />
      <ResultsPage />
    </>
  );
};

export default SearchPage;
