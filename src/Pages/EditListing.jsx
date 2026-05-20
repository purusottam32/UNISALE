import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import useProductDetails from "../hooks/useProductDetails";
import { useUpdateListingMutation } from "../hooks/useListingMutations";
import { getErrorMessage } from "../utils/getErrorMessage";
import {
  LISTING_CATEGORIES,
  LISTING_CONDITIONS,
  LISTING_TYPES,
} from "../constants";
import { compressImages } from "../lib/compressImage";

export default function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const listingQuery = useProductDetails(id);
  const updateMutation = useUpdateListingMutation();

  const [form, setForm] = useState(null);
  const [newImages, setNewImages] = useState([]);

  useEffect(() => {
    if (listingQuery.data) {
      const l = listingQuery.data;
      setForm({
        title: l.title,
        description: l.description,
        price: String(l.price),
        category: l.category,
        type: l.type || "sale",
        condition: l.condition || "good",
        locationScope: l.locationScope || "on-campus",
      });
    }
  }, [listingQuery.data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form) return;

    try {
      const payload = new FormData();
      payload.append("title", form.title.trim());
      payload.append("description", form.description.trim());
      payload.append("price", form.price);
      payload.append("category", form.category);
      payload.append("type", form.type);
      payload.append("condition", form.condition);
      payload.append("locationScope", form.locationScope);

      if (newImages.length) {
        const compressed = await compressImages(newImages);
        compressed.forEach((f) => payload.append("images", f));
      }

      await updateMutation.mutateAsync({ id, formData: payload });
      toast.success("Listing updated!");
      navigate(`/listings/${id}`);
    } catch (err) {
      toast.error(getErrorMessage(err, "Update failed."));
    }
  };

  if (listingQuery.isLoading || !form) {
    return <div className="py-16 text-center"><div className="spinner mx-auto" style={{ width: 32, height: 32 }} /></div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-6">
      <h1 className="font-display text-2xl font-bold mb-6">Edit listing</h1>
      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        <div>
          <label className="input-label">Replace photos (optional)</label>
          <input type="file" accept="image/*" multiple onChange={(e) => setNewImages(Array.from(e.target.files || []).slice(0, 5))} className="input-base" />
          <p className="text-xs text-text-muted mt-1">Leave empty to keep current photos</p>
        </div>
        <div>
          <label className="input-label">Title</label>
          <input name="title" value={form.title} onChange={handleChange} className="input-base" />
        </div>
        <div>
          <label className="input-label">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={4} className="input-base" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="input-label">Price</label>
            <input name="price" type="number" value={form.price} onChange={handleChange} className="input-base" />
          </div>
          <div>
            <label className="input-label">Type</label>
            <select name="type" value={form.type} onChange={handleChange} className="input-base">
              {LISTING_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="input-label">Condition</label>
            <select name="condition" value={form.condition} onChange={handleChange} className="input-base">
              {LISTING_CONDITIONS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label className="input-label">Category</label>
            <select name="category" value={form.category} onChange={handleChange} className="input-base">
              {LISTING_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <button type="submit" className="btn btn-primary btn-full" disabled={updateMutation.isPending}>
          {updateMutation.isPending ? "Saving..." : "Save changes"}
        </button>
      </form>
    </div>
  );
}
