import { useQuery } from "@tanstack/react-query";
import { getListingsRequest, searchListingsRequest } from "../api/listings.api";
import { queryKeys } from "../api/queryKeys";
import { getErrorMessage } from "../utils/getErrorMessage";

const normalizePayload = (payload, fallbackLimit) => {
  const listings = payload?.listings || payload?.products || [];

  return {
    listings,
    products: listings,
    totalPages: payload?.totalPages || 1,
    currentPage: payload?.currentPage || 1,
    totalItems: payload?.totalItems || listings.length,
    limit: payload?.limit || fallbackLimit || 12,
  };
};

const useListings = (params = {}, options = {}) => {
  const query = useQuery({
    queryKey: queryKeys.listings.list(params),
    enabled: options.enabled ?? true,
    initialData: options.initialData ? normalizePayload(options.initialData, params.limit) : undefined,
    queryFn: async () => {
      const hasSearch = Boolean(String(params.q || "").trim());
      const request = hasSearch ? searchListingsRequest : getListingsRequest;
      const response = await request(params);
      return normalizePayload(response.data?.data, params.limit);
    },
  });

  return {
    listings: query.data?.listings || [],
    products: query.data?.products || [],
    totalPages: query.data?.totalPages || 1,
    currentPage: query.data?.currentPage || 1,
    totalItems: query.data?.totalItems || 0,
    limit: query.data?.limit || Number(params.limit) || 12,
    loading: query.isLoading,
    error: query.error ? getErrorMessage(query.error, "Failed to load listings.") : "",
    refetch: query.refetch,
  };
};

export default useListings;
