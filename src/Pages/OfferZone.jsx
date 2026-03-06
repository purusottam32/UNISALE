import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import InputBox from "../components/InputBox";
import AuthButton from "../components/AuthButton";
import { useCreateProductMutation } from "../hooks/useProductMutations";
import { getErrorMessage } from "../utils/getErrorMessage";
import { MARKETPLACE_CATEGORIES } from "../constants";

const OfferZone = () => {
  const navigate = useNavigate();
  const createProductMutation = useCreateProductMutation();

  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: MARKETPLACE_CATEGORIES[0],
  });
  const [image, setImage] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.title || !form.description || !form.price || !form.category || !image) {
      const message = "Please fill all fields and select an image.";
      setError(message);
      toast.error(message);
      return;
    }

    const payload = new FormData();
    payload.append("title", form.title);
    payload.append("description", form.description);
    payload.append("price", form.price);
    payload.append("category", form.category);
    payload.append("images", image);

    try {
      const createdProduct = await createProductMutation.mutateAsync(payload);
      const productId = createdProduct?._id;

      toast.success("Product listed successfully.");
      navigate(productId ? `/products/${productId}` : "/", { replace: true });
    } catch (requestError) {
      const message = getErrorMessage(requestError, "Failed to create product.");
      setError(message);
      toast.error(message);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-[640px] py-5 mx-auto">
      <h2 className="text-[#131712] text-[28px] font-bold text-center pb-3 pt-5">Add Product</h2>

      <form onSubmit={handleSubmit}>
        <InputBox
          label="Title"
          name="title"
          placeholder="Enter product title"
          value={form.title}
          onChange={handleChange}
        />

        <div className="w-full px-4 py-3">
          <p className="pb-2 font-medium text-[#131712]">Description</p>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            placeholder="Describe your product"
            className="form-input w-full rounded-xl p-4 bg-[#f1f4f1] text-[#131712] placeholder:text-[#6d8566] focus:outline-0"
          />
        </div>

        <InputBox
          label="Price"
          name="price"
          type="number"
          placeholder="Enter price"
          value={form.price}
          onChange={handleChange}
        />

        <div className="w-full px-4 py-3">
          <p className="pb-2 font-medium text-[#131712]">Category</p>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="form-input w-full rounded-xl h-14 p-4 bg-[#f1f4f1] text-[#131712]"
          >
            {MARKETPLACE_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full px-4 py-3">
          <p className="pb-2 font-medium text-[#131712]">Product Image</p>
          <input
            type="file"
            accept="image/*"
            onChange={(event) => setImage(event.target.files?.[0] || null)}
            className="form-input w-full rounded-xl h-14 p-4 bg-[#f1f4f1] text-[#131712]"
          />
        </div>

        {error && <p className="text-red-500 text-sm px-4">{error}</p>}

        <div className="px-4 py-3">
          <AuthButton
            label={createProductMutation.isPending ? "Publishing..." : "Publish Product"}
            type="submit"
            variant="primary"
            disabled={createProductMutation.isPending}
          />
        </div>
      </form>
    </div>
  );
};

export default OfferZone;
