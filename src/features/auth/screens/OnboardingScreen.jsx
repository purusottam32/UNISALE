"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { CATEGORY_META, LISTING_CATEGORIES } from "@/config/catalog";
import { compressImage } from "@/lib/compress-image";
import { getErrorMessage } from "@/lib/errors";
import { ICON_STROKE, iconSize } from "@/lib/design-tokens";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Field";
import { cn } from "@/lib/cn";
import { CameraIcon, CheckIcon } from "@/components/ui/icons";
import { useAuth } from "../auth-context";
import AuthLayout from "../components/AuthLayout";

const YEARS = [1, 2, 3, 4, 5, 6].map((year) => ({ value: year, label: `Year ${year}` }));
const MAX_INTERESTS = 6;

/**
 * Post-verification onboarding.
 *
 * Split into three small screens rather than one long form. Steps 1 and 2 are
 * doing real work — campus scoping and cold-start personalisation — while step
 * 3 is explicitly optional, so nobody is blocked from the marketplace by a
 * profile photo.
 */
export default function OnboardingScreen() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, isProfileComplete, completeProfile, pending } = useAuth();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ college: "", department: "", year: "", bio: "" });
  const [interests, setInterests] = useState([]);
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) router.replace("/login");
    else if (isProfileComplete) router.replace("/feed");
  }, [isLoading, isAuthenticated, isProfileComplete, router]);

  // Pre-fill from whatever Google or an earlier partial attempt already gave us.
  useEffect(() => {
    if (!user) return;
    setForm((current) => ({
      college: current.college || user.college || "",
      department: current.department || user.department || "",
      year: current.year || user.year || "",
      bio: current.bio || user.bio || "",
    }));
    setInterests((current) => (current.length ? current : user.interests || []));
  }, [user]);

  const set = (patch) => setForm((current) => ({ ...current, ...patch }));

  const toggleInterest = (category) =>
    setInterests((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : current.length >= MAX_INTERESTS
          ? current
          : [...current, category]
    );

  const pickAvatar = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const compressed = await compressImage(file, { maxEdge: 512 });
    setAvatar(compressed);
    setAvatarPreview(URL.createObjectURL(compressed));
  };

  const stepOneValid = form.college.trim().length >= 2 && form.department.trim().length >= 2 && form.year;

  const finish = async () => {
    const payload = new FormData();
    payload.append("college", form.college.trim());
    payload.append("department", form.department.trim());
    payload.append("year", String(form.year));
    if (form.bio.trim()) payload.append("bio", form.bio.trim());
    payload.append("interests", JSON.stringify(interests));
    if (avatar) payload.append("avatar", avatar);

    try {
      await completeProfile(payload);
      toast.success("You're all set. Welcome to UniSale.");
      router.replace("/feed");
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not save your profile."));
    }
  };

  if (isLoading || !isAuthenticated) return null;

  return (
    <AuthLayout
      title={
        step === 1
          ? "Which campus are you on?"
          : step === 2
            ? "What are you looking for?"
            : "Add a face to your name"
      }
      subtitle={
        step === 1
          ? "This scopes your feed to students you can actually meet."
          : step === 2
            ? "Pick a few categories and we'll put them at the top of your feed."
            : "Optional, but sellers reply faster to profiles with a photo."
      }
      step={{ current: step, total: 3, labels: ["Campus", "Interests", "Profile"] }}
    >
      {step === 1 && (
        <div className="space-y-4">
          <Input
            label="College"
            placeholder="e.g. IIT Bombay"
            required
            value={form.college}
            onChange={(event) => set({ college: event.target.value })}
            hint="Use the name your classmates would recognise."
          />
          <Input
            label="Department"
            placeholder="e.g. Computer Science"
            required
            value={form.department}
            onChange={(event) => set({ department: event.target.value })}
          />
          <Select
            label="Year of study"
            required
            placeholder="Select your year"
            options={YEARS}
            value={form.year}
            onChange={(event) => set({ year: event.target.value })}
          />

          <Button size="lg" block disabled={!stepOneValid} onClick={() => setStep(2)}>
            Continue
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-2.5">
            {LISTING_CATEGORIES.map((category) => {
              const selected = interests.includes(category);
              const atLimit = interests.length >= MAX_INTERESTS && !selected;
              const CategoryIcon = CATEGORY_META[category].Icon;

              return (
                <button
                  key={category}
                  type="button"
                  aria-pressed={selected}
                  disabled={atLimit}
                  onClick={() => toggleInterest(category)}
                  className={cn(
                    "relative rounded-md border p-3 text-left transition-colors duration-150",
                    selected
                      ? "border-brand bg-brand-tint"
                      : "border-line bg-surface hover:border-line-strong",
                    atLimit && "cursor-not-allowed opacity-45"
                  )}
                >
                  <CategoryIcon
                    size={iconSize.lg}
                    strokeWidth={ICON_STROKE}
                    aria-hidden
                    className={selected ? "text-brand" : "text-muted"}
                  />
                  <span
                    className={cn(
                      "mt-1.5 block text-[13px] font-semibold leading-tight",
                      selected ? "text-brand" : "text-ink"
                    )}
                  >
                    {category}
                  </span>
                  {selected && (
                    <span className="absolute right-2 top-2 grid h-5 w-5 place-items-center rounded-full bg-brand text-brand-fg">
                      <CheckIcon size={12} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <p className="text-center text-xs text-muted">
            {interests.length}/{MAX_INTERESTS} selected — you can change these any time.
          </p>

          <div className="flex gap-2">
            <Button variant="secondary" size="lg" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button size="lg" block onClick={() => setStep(3)}>
              Continue
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-5">
          <div className="flex flex-col items-center gap-3">
            <Avatar src={avatarPreview} name={user?.name} size="xl" />
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-surface-2">
              <CameraIcon size={17} />
              {avatarPreview ? "Change photo" : "Add a photo"}
              <input type="file" accept="image/*" className="sr" onChange={pickAvatar} />
            </label>
          </div>

          <Textarea
            label="Short bio"
            placeholder="Final-year mech student clearing out my hostel room."
            maxLength={160}
            value={form.bio}
            onChange={(event) => set({ bio: event.target.value })}
            hint="A line about you. Buyers read this before they message."
          />

          <Button size="lg" block loading={pending.completeProfile} onClick={finish}>
            Enter UniSale
          </Button>

          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => setStep(2)}>
              Back
            </Button>
            <button
              type="button"
              onClick={finish}
              disabled={pending.completeProfile}
              className="ml-auto text-sm font-medium text-muted hover:text-ink"
            >
              Skip for now
            </button>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}
