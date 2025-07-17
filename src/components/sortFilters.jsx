import React from 'react';

const filters = ['Newest', 'Oldest', 'Price: Low to High', 'Price: High to Low'];

export default function SortFilters() {
  return (
    <div className="flex flex-wrap gap-3 p-4">
      {filters.map((filter, idx) => (
        <label
          key={idx}
          className="text-sm font-medium leading-normal flex items-center justify-center rounded-lg border border-[#dee4dc] px-4 h-11 text-[#131712] has-[:checked]:border-[3px] has-[:checked]:px-3.5 has-[:checked]:border-[#53d22c] relative cursor-pointer"
        >
          {filter}
          <input type="radio" className="invisible absolute" name="sort" />
        </label>
      ))}
    </div>
  );
}