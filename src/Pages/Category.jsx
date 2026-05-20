import { useNavigate } from "react-router-dom";
import { LISTING_CATEGORIES } from "../constants";

export default function Category() {
  const navigate = useNavigate();

  return (
    <div className="py-6">
      <h1 className="font-display text-2xl font-bold mb-6">Browse by category</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {LISTING_CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => navigate(`/results?category=${encodeURIComponent(category)}`)}
            className="card p-5 text-left font-semibold hover:border-primary/30 transition-colors"
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
