"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  CATEGORY_META,
  LISTING_CATEGORIES,
  LISTING_CONDITIONS,
  LISTING_TYPES,
  LOCATION_SCOPES,
} from "@/config/catalog";
import { useAuth } from "@/features/auth/auth-context";
import { formatPrice, getDiscountPercent } from "@/lib/format";
import { applyFieldErrors, getErrorMessage } from "@/lib/errors";
import { ICON_STROKE, iconSize } from "@/lib/design-tokens";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { ChoiceGroup, Input, Textarea } from "@/components/ui/Field";
import Chip from "@/components/ui/Chip";
import { cn } from "@/lib/cn";
import { CheckIcon, ChevronLeftIcon } from "@/components/ui/icons";
import { ImageOff } from "lucide-react";
import { useCreateListing } from "../hooks";
import PhotoUploader from "../components/PhotoUploader";

const DRAFT_KEY = "unisale.sellDraft";

const STEPS = [
  { key: "photos", label: "Photos" },
  { key: "details", label: "Details" },
  { key: "price", label: "Price" },
  { key: "review", label: "Review" },
];

const BLANK = {
  title: "",
  description: "",
  category: "",
  condition: "",
  type: "sale",
  price: "",
  originalPrice: "",
  isNegotiable: true,
  locationScope: "on-campus",
  meetupHint: "",
};

/**
 * Four-step sell wizard.
 *
 * Photos come first, then details, then price — the same order sellers think
 * in, and it front-loads the step that commits them to finishing. Text fields
 * are drafted to localStorage between steps so a mistap or a dead battery
 * doesn't cost the whole listing. Photos are not persisted: File objects don't
 * survive serialisation, and re-picking them is quicker than a broken restore.
 */
export default function SellScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const createListing = useCreateListing();

  const [step, setStep] = useState(0);
  const [photos, setPhotos] = useState([]);
  const [form, setForm] = useState(BLANK);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    try {
      const draft = JSON.parse(window.localStorage.getItem(DRAFT_KEY) || "null");
      if (draft) setForm({ ...BLANK, ...draft });
    } catch {
      // Corrupted draft — start clean rather than blocking the flow.
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
  }, [form]);

  const set = (patch) => {
    setForm((current) => ({ ...current, ...patch }));
    setErrors((current) => {
      const next = { ...current };
      Object.keys(patch).forEach((key) => delete next[key]);
      return next;
    });
  };

  const validateStep = () => {
    const found = {};

    if (step === 0 && photos.length === 0) {
      found.photos = "Add at least one photo — listings without photos rarely sell.";
    }

    if (step === 1) {
      if (form.title.trim().length < 3) found.title = "Give it a title buyers would search for.";
      if (form.description.trim().length < 10) {
        found.description = "Add a sentence or two — condition, age, what's included.";
      }
      if (!form.category) found.category = "Pick a category.";
      if (!form.condition) found.condition = "Buyers always ask. Pick the honest one.";
    }

    if (step === 2 && form.type !== "giveaway") {
      if (form.price === "" || Number(form.price) < 0) found.price = "Set a price.";
    }

    setErrors(found);
    return Object.keys(found).length === 0;
  };

  const next = () => {
    if (!validateStep()) return;
    setStep((current) => Math.min(current + 1, STEPS.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const back = () => {
    setStep((current) => Math.max(current - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const publish = async () => {
    const payload = new FormData();
    payload.append("title", form.title.trim());
    payload.append("description", form.description.trim());
    payload.append("price", form.type === "giveaway" ? "0" : String(form.price));
    if (form.originalPrice) payload.append("originalPrice", String(form.originalPrice));
    payload.append("isNegotiable", String(form.isNegotiable));
    payload.append("type", form.type);
    payload.append("condition", form.condition);
    payload.append("category", form.category);
    payload.append("locationScope", form.locationScope);
    if (form.meetupHint.trim()) payload.append("meetupHint", form.meetupHint.trim());
    photos.forEach((photo) => payload.append("images", photo.file));

    try {
      const listing = await createListing.mutateAsync(payload);
      window.localStorage.removeItem(DRAFT_KEY);
      toast.success("Your listing is live.");
      router.push(`/listings/${listing._id}`);
    } catch (error) {
      if (!applyFieldErrors(error, (field, issue) => setErrors((c) => ({ ...c, [field]: issue.message })))) {
        toast.error(getErrorMessage(error, "Could not publish your listing."));
      }
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <header className="mb-6">
        <button
          type="button"
          onClick={() => (step === 0 ? router.back() : back())}
          className="-ml-1 mb-3 inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-ink"
        >
          <ChevronLeftIcon size={17} /> {step === 0 ? "Cancel" : "Back"}
        </button>

        <div className="flex items-center gap-1.5">
          {STEPS.map((item, index) => (
            <span
              key={item.key}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors duration-300",
                index <= step ? "bg-brand" : "bg-surface-3"
              )}
            />
          ))}
        </div>
        <p className="mt-2 text-xs font-medium text-muted">
          Step {step + 1} of {STEPS.length} · {STEPS[step].label}
        </p>
      </header>

      {step === 0 && (
        <Section
          title="Show it off"
          subtitle="The first photo is what everyone sees in the grid. Listings with three or more photos get roughly twice the messages."
        >
          <PhotoUploader photos={photos} onChange={setPhotos} error={errors.photos} />
        </Section>
      )}

      {step === 1 && (
        <Section title="What are you selling?" subtitle="Be specific — buyers search in plain words.">
          <div className="space-y-5">
            <Input
              label="Title"
              placeholder="Hero Sprint cycle, 26 inch"
              maxLength={80}
              required
              value={form.title}
              error={errors.title}
              onChange={(event) => set({ title: event.target.value })}
            />

            <Textarea
              label="Description"
              placeholder="Two years old, recently serviced, new tyres. Selling because I'm graduating."
              maxLength={1000}
              required
              value={form.description}
              error={errors.description}
              onChange={(event) => set({ description: event.target.value })}
              hint="Mention age, condition, what's included, and why you're selling."
            />

            <div>
              <p className="mb-2 text-[13px] font-medium text-ink-2">
                Category <span className="text-danger">*</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {LISTING_CATEGORIES.map((category) => {
                  const CategoryIcon = CATEGORY_META[category].Icon;
                  return (
                    <Chip
                      key={category}
                      active={form.category === category}
                      icon={
                        <CategoryIcon size={iconSize.xs} strokeWidth={ICON_STROKE} aria-hidden />
                      }
                      onClick={() => set({ category })}
                    >
                      {category}
                    </Chip>
                  );
                })}
              </div>
              {errors.category && (
                <p className="mt-1.5 text-xs font-medium text-danger">{errors.category}</p>
              )}
            </div>

            <ChoiceGroup
              label="Condition"
              error={errors.condition}
              options={LISTING_CONDITIONS}
              value={form.condition}
              onChange={(condition) => set({ condition })}
              columns={2}
            />
          </div>
        </Section>
      )}

      {step === 2 && (
        <Section title="Set your price" subtitle="Students compare hard. Price it like you're the buyer.">
          <div className="space-y-5">
            <ChoiceGroup
              label="Listing type"
              options={LISTING_TYPES}
              value={form.type}
              onChange={(type) => set({ type })}
              columns={2}
            />

            {form.type !== "giveaway" && (
              <>
                <Input
                  label={form.type === "rent" ? "Rent per week" : "Asking price"}
                  type="number"
                  min="0"
                  inputMode="numeric"
                  leading="₹"
                  required
                  placeholder="0"
                  value={form.price}
                  error={errors.price}
                  onChange={(event) => set({ price: event.target.value })}
                />

                <Input
                  label="Original price"
                  type="number"
                  min="0"
                  inputMode="numeric"
                  leading="₹"
                  placeholder="What you paid"
                  value={form.originalPrice}
                  onChange={(event) => set({ originalPrice: event.target.value })}
                  hint="Optional. Shows buyers the discount they're getting."
                />

                {form.originalPrice > form.price && form.price !== "" && (
                  <p className="rounded-md bg-success-tint p-2.5 text-xs font-medium text-success">
                    Buyers will see a {getDiscountPercent(Number(form.price), Number(form.originalPrice))}%
                    saving.
                  </p>
                )}

                <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink-2">
                  <input
                    type="checkbox"
                    checked={form.isNegotiable}
                    onChange={(event) => set({ isNegotiable: event.target.checked })}
                    className="h-4 w-4 accent-[var(--color-brand)]"
                  />
                  Price is negotiable
                </label>
              </>
            )}

            <ChoiceGroup
              label="Where will you meet?"
              options={LOCATION_SCOPES}
              value={form.locationScope}
              onChange={(locationScope) => set({ locationScope })}
            />

            <Input
              label="Meet-up hint"
              placeholder="Near Hostel C gate, evenings"
              maxLength={80}
              value={form.meetupHint}
              onChange={(event) => set({ meetupHint: event.target.value })}
              hint="A public, busy spot. Never share your room number here."
            />
          </div>
        </Section>
      )}

      {step === 3 && (
        <Section
          title="Look it over"
          subtitle="This is exactly what students on your campus will see."
        >
          <div className="space-y-4">
            <PreviewCard form={form} photos={photos} user={user} />

            <ul className="space-y-1.5 rounded-lg border border-line bg-surface p-4">
              {[
                `${photos.length} photo${photos.length === 1 ? "" : "s"} uploaded`,
                `Listed under ${form.category}`,
                `Meeting ${LOCATION_SCOPES.find((s) => s.value === form.locationScope)?.label.toLowerCase()}`,
                `Visible to students at ${user?.college || "your college"}`,
              ].map((line) => (
                <li key={line} className="flex items-center gap-2 text-sm text-ink-2">
                  <span className="text-brand">
                    <CheckIcon size={15} />
                  </span>
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </Section>
      )}

      <div className="mt-7 flex gap-2">
        {step > 0 && (
          <Button variant="secondary" size="lg" onClick={back}>
            Back
          </Button>
        )}

        {step < STEPS.length - 1 ? (
          <Button size="lg" block onClick={next}>
            Continue
          </Button>
        ) : (
          <Button size="lg" block loading={createListing.isPending} onClick={publish}>
            Publish listing
          </Button>
        )}
      </div>
    </div>
  );
}

function Section({ title, subtitle, children }) {
  return (
    <section className="">
      <h1 className="text-xl font-extrabold tracking-[-0.02em] text-ink">{title}</h1>
      {subtitle && <p className="mt-1.5 text-sm leading-relaxed text-muted">{subtitle}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

/** Renders the draft in the same shape as a real card in the grid. */
function PreviewCard({ form, photos, user }) {
  const condition = LISTING_CONDITIONS.find((item) => item.value === form.condition);

  return (
    <article className="overflow-hidden rounded-lg border border-line bg-surface">
      <div className="relative aspect-[4/3] bg-surface-2">
        {photos[0] ? (
          // A plain <img> on purpose: next/image cannot optimise a blob: URL,
          // and these previews never leave the browser.
          <img src={photos[0].preview} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full place-items-center text-faint">
            <ImageOff size={iconSize["2xl"]} strokeWidth={ICON_STROKE} aria-hidden />
          </div>
        )}
        {condition && (
          <span className="absolute left-2 top-2">
            <Badge tone="overlay">{condition.label}</Badge>
          </span>
        )}
      </div>

      <div className="space-y-1.5 p-4">
        <p className="text-2xl font-extrabold tracking-[-0.02em] text-ink">
          {form.type === "giveaway" ? "Free" : formatPrice(form.price || 0)}
        </p>
        <h2 className="font-semibold text-ink">{form.title || "Your title appears here"}</h2>
        <p className="clamp-3 text-sm leading-relaxed text-muted">
          {form.description || "Your description appears here."}
        </p>
        <p className="pt-1 text-xs text-muted">
          {user?.name} · {user?.college || "Your campus"}
        </p>
      </div>
    </article>
  );
}
