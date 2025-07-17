// components/CategoryFilters.jsx
import React, { useState } from 'react';

export default function CategoryFilters({ categories = [], onSelect }) {
  const [selected, setSelected] = useState('All Categories');

  const handleSelect = (category) => {
    setSelected(category);
    if (onSelect) onSelect(category);
  };

  return (
    <div className="flex gap-3 p-3 flex-wrap pr-4">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => handleSelect(cat)}
          className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg px-4 pr-4 transition-colors duration-200 ${
            selected === cat ? 'bg-[#131712] text-white' : 'bg-[#f1f4f1] text-[#131712]'
          } text-sm font-medium leading-normal`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
} 