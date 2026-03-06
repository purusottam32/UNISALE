import { useQuery } from "@tanstack/react-query";
import { getUserProductsRequest } from "../api/users.api";
import { queryKeys } from "../api/queryKeys";
import { getErrorMessage } from "../utils/getErrorMessage";

const useUserProducts = (userId, params = {}, options = {}) => {
  const query = useQuery({
    queryKey: queryKeys.users.products(userId, params),
    enabled: Boolean(userId) && (options.enabled ?? true),
    queryFn: async () => {
      const response = await getUserProductsRequest(userId, params);
      return response.data?.data || { products: [], totalPages: 1, currentPage: 1 };
    },
  });

  return {
    user: query.data?.user || null,
    products: query.data?.products || [],
    totalPages: query.data?.totalPages || 1,
    currentPage: query.data?.currentPage || 1,
    totalItems: query.data?.totalItems || 0,
    loading: query.isLoading,
    error: query.error ? getErrorMessage(query.error, "Failed to load user products.") : "",
    refetch: query.refetch,
  };
};

export default useUserProducts;
