"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FiImage, FiPlus, FiX } from "react-icons/fi";
import { useCreateListingMutation } from "../hooks/useListingMutations";
import { getErrorMessage } from "../utils/getErrorMessage";
import {
  LISTING_CATEGORIES,
  LISTING_CONDITIONS,
  LISTING_TYPES,
} from "../constants";
import { compressImages } from "../lib/compressImage";

const LOCATION_SCOPES = [
  { value: "on-campus", label: "On Campus" },
  { value: "near-campus", label: "Near Campus" },
  { value: "city", label: "City-wide" },
];

export default function CreateListing() {
  const router = useRouter();
  const createMutation = useCreateListingMutation();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: LISTING_CATEGORIES[0],
    type: "sale",
    condition: "good",
    locationScope: "on-campus",
  });
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleImages = async (e) => {
    const files = Array.from(e.target.files || []).slice(0, 5);
    if (!files.length) return;
    const combined = [...images, ...files].slice(0, 5);
    setImages(combined);
    setPreviews(combined.map((f) => URL.createObjectURL(f)));
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title.trim() || form.description.trim().length < 10 || !form.price || !images.length) {
      const msg = "Fill all required fields and add at least one image.";
      setError(msg);
      toast.error(msg);
      return;
    }

    try {
      const compressed = await compressImages(images);
      const payload = new FormData();
      payload.append("title", form.title.trim());
      payload.append("description", form.description.trim());
      payload.append("price", form.price);
      payload.append("category", form.category);
      payload.append("type", form.type);
      payload.append("condition", form.condition);
      payload.append("locationScope", form.locationScope);
      compressed.forEach((file) => payload.append("images", file));

      const created = await createMutation.mutateAsync(payload);
      toast.success("Listing published!");
      router.replace(created?._id ? `/listings/${created._id}` : "/feed");
    } catch (err) {
      const msg = getErrorMessage(err, "Failed to create listing.");
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-6">
      <h1 className="font-display text-2xl font-bold mb-2">Sell something</h1>
      <p className="text-text-secondary text-sm mb-8">List an item for your campus community. Up to 5 photos.</p>

      <form onSubmit={handleSubmit} className="card p-6 space-y-5">
        <div>
          <label className="input-label">Photos *</label>
          <div className="flex flex-wrap gap-3 mb-3">
            {previews.map((src, i) => (
              <div key={src} className="relative w-20 h-20 rounded-lg overflow-hidden bg-surface-2">
                <img src={src} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 p-1 bg-surface rounded-full"
                >
                  <FiX size={12} />
                </button>
              </div>
            ))}
            {images.length < 5 && (
              <label className="w-20 h-20 rounded-lg border border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary text-text-muted text-xs gap-1">
                <FiPlus />
                Add
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleImages} />
              </label>
            )}
          </div>
        </div>

        <div>
          <label className="input-label">Title *</label>
          <input name="title" value={form.title} onChange={handleChange} maxLength={80} className="input-base" placeholder="e.g. MacBook Air M2" />
        </div>

        <div>
          <label className="input-label">Description *</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={4} maxLength={1000} className="input-base" placeholder="Describe condition, pickup location, etc." />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="input-label">Price (Rs.) *</label>
            <input name="price" type="number" min="0" value={form.price} onChange={handleChange} className="input-base" />
          </div>
          <div>
            <label className="input-label">Listing type</label>
            <select name="type" value={form.type} onChange={handleChange} className="input-base">
              {LISTING_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="input-label">Condition *</label>
            <select name="condition" value={form.condition} onChange={handleChange} className="input-base">
              {LISTING_CONDITIONS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label className="input-label">Category *</label>
            <select name="category" value={form.category} onChange={handleChange} className="input-base">
              {LISTING_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="input-label">Location scope</label>
          <select name="locationScope" value={form.locationScope} onChange={handleChange} className="input-base">
            {LOCATION_SCOPES.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
          </select>
        </div>

        {error && <p className="text-error text-sm">{error}</p>}

        <button type="submit" className="btn btn-primary btn-lg btn-full" disabled={createMutation.isPending}>
          {createMutation.isPending ? "Publishing..." : "Publish Listing"}
        </button>
      </form>
    </div>
  );
}
