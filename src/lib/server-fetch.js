const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

/**
 * Unauthenticated server-side fetch helpers.
 *
 * Used by public pages (listing detail, seller profiles) so crawlers and
 * first-time visitors get real HTML instead of a spinner. These never carry
 * credentials — anything user-specific is fetched on the client after
 * hydration.
 */
async function fetchPublic(endpoint, { revalidate = 60 } = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: { "Content-Type": "application/json" },
      next: { revalidate },
    });
    if (!response.ok) return null;
    const json = await response.json();
    return json?.data ?? null;
  } catch {
    // The API being unreachable at build time must not fail the page — the
    // client retries and renders its own error state.
    return null;
  }
}

const toQuery = (params = {}) => {
  const entries = Object.entries(params).filter(
    ([, value]) => value !== undefined && value !== null && value !== ""
  );
  const query = new URLSearchParams(entries.map(([key, value]) => [key, String(value)])).toString();
  return query ? `?${query}` : "";
};

export const fetchListing = (id) => fetchPublic(`/listings/${id}`, { revalidate: 30 });

export const fetchListings = (params = {}) => fetchPublic(`/listings${toQuery(params)}`);

export const fetchPublicProfile = (userId) => fetchPublic(`/users/${userId}`, { revalidate: 120 });
