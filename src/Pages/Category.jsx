import React from "react";
import { useNavigate } from "react-router-dom";
import { MARKETPLACE_CATEGORIES } from "../constants";

function Category() {
  const navigate = useNavigate();

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold text-[#131712] mb-4">Browse Categories</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {MARKETPLACE_CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => navigate(`/results?cat=${encodeURIComponent(category)}`)}
            className="rounded-xl bg-[#f1f4f1] px-4 py-6 text-left font-semibold text-[#131712] hover:bg-[#e6ebe5]"
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Category;
