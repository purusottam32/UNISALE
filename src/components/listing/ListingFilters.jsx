import {
  LISTING_CATEGORIES,
  LISTING_CONDITIONS,
  LISTING_TYPES,
  SORT_OPTIONS,
} from "../../constants";

export default function ListingFilters({
  filters,
  onChange,
  showCampusToggle = false,
  isAuthenticated = false,
}) {
  const update = (key, value) => onChange({ ...filters, [key]: value, page: 1 });

  const [sortBy, sortOrder] = (filters.sort || "createdAt:desc").split(":");

  return (
    <aside className="card p-4 h-fit space-y-5">
      <div>
        <h3 className="font-semibold text-text-primary mb-3">Filters</h3>
        {showCampusToggle && isAuthenticated && (
          <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer mb-3">
            <input
              type="checkbox"
              checked={filters.allColleges === true}
              onChange={(e) => update("allColleges", e.target.checked)}
              className="rounded"
            />
            Show all colleges
          </label>
        )}
      </div>

      <div>
        <p className="text-xs font-medium text-text-muted mb-2 uppercase tracking-wide">Category</p>
        <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
          <button
            type="button"
            onClick={() => update("category", "")}
            className={`text-left px-3 py-2 rounded-lg text-sm ${!filters.category ? "bg-primary text-white" : "text-text-secondary hover:bg-surface-2"}`}
          >
            All
          </button>
          {LISTING_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => update("category", cat)}
              className={`text-left px-3 py-2 rounded-lg text-sm ${
                filters.category === cat ? "bg-primary text-white" : "text-text-secondary hover:bg-surface-2"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-medium text-text-muted mb-2 uppercase tracking-wide">Type</p>
        <select
          value={filters.type || ""}
          onChange={(e) => update("type", e.target.value)}
          className="input-base text-sm"
        >
          <option value="">All types</option>
          {LISTING_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      <div>
        <p className="text-xs font-medium text-text-muted mb-2 uppercase tracking-wide">Condition</p>
        <select
          value={filters.condition || ""}
          onChange={(e) => update("condition", e.target.value)}
          className="input-base text-sm"
        >
          <option value="">Any condition</option>
          {LISTING_CONDITIONS.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>

      <div>
        <p className="text-xs font-medium text-text-muted mb-2 uppercase tracking-wide">Price range (Rs.)</p>
        <div className="flex gap-2">
          <input
            type="number"
            min="0"
            placeholder="Min"
            value={filters.minPrice ?? ""}
            onChange={(e) => update("minPrice", e.target.value)}
            className="input-base text-sm"
          />
          <input
            type="number"
            min="0"
            placeholder="Max"
            value={filters.maxPrice ?? ""}
            onChange={(e) => update("maxPrice", e.target.value)}
            className="input-base text-sm"
          />
        </div>
      </div>

      <div>
        <p className="text-xs font-medium text-text-muted mb-2 uppercase tracking-wide">Sort by</p>
        <select
          value={`${sortBy}:${sortOrder}`}
          onChange={(e) => {
            const [sb, so] = e.target.value.split(":");
            onChange({ ...filters, sortBy: sb, sortOrder: so, page: 1 });
          }}
          className="input-base text-sm"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    </aside>
  );
}
