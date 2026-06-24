const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function fetchFromApi(endpoint, options = {}) {
  try {
    const url = `${API_URL}${endpoint}`;
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json", ...options.headers },
      next: { revalidate: options.revalidate ?? 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data || null;
  } catch {
    return null;
  }
}

export function fetchListingById(id) {
  return fetchFromApi(`/listings/${id}`);
}

export function fetchListings(params = {}) {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "")
  ).toString();
  return fetchFromApi(`/listings${query ? `?${query}` : ""}`);
}

export function fetchSearchResults(params = {}) {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "")
  ).toString();
  return fetchFromApi(`/search?${query}`);
}
