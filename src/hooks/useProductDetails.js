import { useQuery } from "@tanstack/react-query";
import { getProductByIdRequest } from "../api/products.api";
import { queryKeys } from "../api/queryKeys";

const useProductDetails = (id, options = {}) => {
  return useQuery({
    queryKey: queryKeys.listings.detail(id),
    enabled: Boolean(id),
    initialData: options.initialData,
    queryFn: async () => {
      const response = await getProductByIdRequest(id);
      return response.data?.data || null;
    },
  });
};

export default useProductDetails;
