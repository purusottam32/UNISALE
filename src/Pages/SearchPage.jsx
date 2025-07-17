// App.jsx
import React from 'react';
import Navbar from "../components/Navbar";
import SearchBar from '../components/SearchBar';
// import CategoryFilters from '../components/CategoryFilters';
import PriceRange from '../components/PriceRange';
import SortFilters from '../components/sortFilters';
import Listings from '../components/Listings';

export default function App() {
  return (
    <>
     <SearchBar placeholder="Search for items" />
            {/* <CategoryFilters /> */}
            <h3 className="text-[#131712] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
              Filters
            </h3>
            <PriceRange />
            <SortFilters />
            <h3 className="text-[#131712] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
              Listings
            </h3>
            <Listings />
    </>
  );
}