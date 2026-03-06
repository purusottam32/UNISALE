import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addToWishlistRequest,
  getWishlistRequest,
  removeFromWishlistRequest,
} from "../api/wishlist.api";
import { queryKeys } from "../api/queryKeys";
import { useAuth } from "../context/AuthContext";

const extractProductId = (item) => item?.productId?._id || item?.productId;

const useWishlist = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  const wishlistQuery = useQuery({
    queryKey: queryKeys.wishlist.list,
    enabled: isAuthenticated,
    queryFn: async () => {
      const response = await getWishlistRequest();
      return response.data?.data || [];
    },
  });

  const addMutation = useMutation({
    mutationFn: async (productId) => {
      const response = await addToWishlistRequest(productId);
      return response.data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.list });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (productId) => removeFromWishlistRequest(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.list });
    },
  });

  const wishlistItems = wishlistQuery.data || [];
  const wishlistProductIds = wishlistItems
    .map((item) => extractProductId(item)?.toString())
    .filter(Boolean);

  const toggleWishlist = async (productId) => {
    const targetId = productId?.toString();

    if (!targetId) {
      return;
    }

    if (wishlistProductIds.includes(targetId)) {
      await removeMutation.mutateAsync(targetId);
      return;
    }

    await addMutation.mutateAsync(targetId);
  };

  return {
    wishlistItems,
    wishlistProductIds,
    loading: wishlistQuery.isLoading,
    error: wishlistQuery.error,
    toggleWishlist,
    isToggling: addMutation.isPending || removeMutation.isPending,
  };
};

export default useWishlist;
