import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import ResultsPage from "./ResultsPage";

const SearchPage = () => {
  const { query } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (query) {
      navigate(`/results?q=${encodeURIComponent(query)}`, { replace: true });
    }
  }, [navigate, query]);

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
