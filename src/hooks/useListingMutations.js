import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createListingRequest,
  deleteListingRequest,
  updateListingRequest,
  updateListingStatusRequest,
} from "../api/listings.api";
import { queryKeys } from "../api/queryKeys";

export const useCreateListingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData) => createListingRequest(formData).then((r) => r.data?.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.listings.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useUpdateListingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }) => updateListingRequest(id, formData).then((r) => r.data?.data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.listings.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.listings.detail(id) });
    },
  });
};

export const useUpdateListingStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => updateListingStatusRequest(id, status).then((r) => r.data?.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.listings.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useDeleteListingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteListingRequest(id).then(() => id),
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.listings.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.list });
      queryClient.removeQueries({ queryKey: queryKeys.listings.detail(id) });
    },
  });
};

/** @deprecated */
export const useCreateProductMutation = useCreateListingMutation;
export const useDeleteProductMutation = useDeleteListingMutation;
