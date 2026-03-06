import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProductRequest, deleteProductRequest } from "../api/products.api";
import { queryKeys } from "../api/queryKeys";

export const useCreateProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData) => {
      const response = await createProductRequest(formData);
      return response.data?.data || null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useDeleteProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      await deleteProductRequest(id);
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.list });
      queryClient.removeQueries({ queryKey: queryKeys.products.detail(id) });
    },
  });
};
