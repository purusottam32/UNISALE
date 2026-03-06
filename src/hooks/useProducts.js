import { useQuery } from "@tanstack/react-query";
import { getProductsRequest, searchProductsRequest } from "../api/products.api";
import { queryKeys } from "../api/queryKeys";
import { getErrorMessage } from "../utils/getErrorMessage";

const normalizeProductPayload = (payload, fallbackLimit) => {
  const products = payload?.products || [];

  if (payload?.pagination) {
    return {
      products,
      totalPages: payload.pagination.pages || 1,
      currentPage: payload.pagination.page || 1,
      totalItems: payload.pagination.total || products.length,
      limit: payload.pagination.limit || fallbackLimit || 10,
    };
  }

  return {
    products,
    totalPages: payload?.totalPages || 1,
    currentPage: payload?.currentPage || 1,
    totalItems: payload?.totalItems || products.length,
    limit: payload?.limit || fallbackLimit || 10,
  };
};

const useProducts = (params = {}, options = {}) => {
  const query = useQuery({
    queryKey: queryKeys.products.list(params),
    enabled: options.enabled ?? true,
    queryFn: async () => {
      const hasSearchTerm = Boolean(String(params.q || "").trim());
      const request = hasSearchTerm ? searchProductsRequest : getProductsRequest;
      const response = await request(params);

      return normalizeProductPayload(response.data?.data, params.limit);
    },
  });

  return {
    products: query.data?.products || [],
    totalPages: query.data?.totalPages || 1,
    currentPage: query.data?.currentPage || 1,
    totalItems: query.data?.totalItems || 0,
    limit: query.data?.limit || Number(params.limit) || 10,
    loading: query.isLoading,
    error: query.error ? getErrorMessage(query.error, "Failed to load products.") : "",
    refetch: query.refetch,
  };
};

export default useProducts;
