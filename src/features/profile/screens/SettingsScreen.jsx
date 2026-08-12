"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { CATEGORY_META, LISTING_CATEGORIES } from "@/config/catalog";
import { useAuth } from "@/features/auth/auth-context";
import {
  deleteAccountRequest,
  updateInterestsRequest,
  updateNotificationPrefsRequest,
} from "@/features/auth/api";
import { compressImage } from "@/lib/compress-image";
import { getErrorMessage } from "@/lib/errors";
import { ICON_STROKE, iconSize } from "@/lib/design-tokens";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import Sheet from "@/components/ui/Sheet";
import Tabs from "@/components/ui/Tabs";
import { Input, Select, Textarea, Toggle } from "@/components/ui/Field";
import Chip from "@/components/ui/Chip";
import { CameraIcon } from "@/components/ui/icons";
import ThemeToggle from "@/components/layout/ThemeToggle";

const YEARS = [1, 2, 3, 4, 5, 6].map((year) => ({ value: year, label: `Year ${year}` }));
const MAX_INTERESTS = 6;

const NOTIFICATION_ROWS = [
  { key: "messagePush", label: "New messages", description: "In-app alerts when someone replies." },
  { key: "messageEmail", label: "Message emails", description: "Email me if I miss a message." },
  {
    key: "priceDropEmail",
    label: "Price drops",
    description: "Tell me when something I saved gets cheaper.",
  },
  { key: "reviewEmail", label: "New ratings", description: "When a student rates me after a deal." },
  {
    key: "campusDigest",
    label: "Weekly campus digest",
    description: "A summary of what's new at my college.",
  },
];

export default function SettingsScreen() {
  const router = useRouter();
  const { user, updateMe, logout, refreshProfile, pending } = useAuth();

  const [tab, setTab] = useState("profile");
  const [form, setForm] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [interests, setInterests] = useState([]);
  const [prefs, setPrefs] = useState({});
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!user || form) return;
    setForm({
      name: user.name || "",
      college: user.college || "",
      department: user.department || "",
      year: user.year || "",
      bio: user.bio || "",
    });
    setInterests(user.interests || []);
    setPrefs(user.notificationPrefs || {});
  }, [user, form]);

  if (!form) return null;

  const set = (patch) => setForm((current) => ({ ...current, ...patch }));

  const pickAvatar = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const compressed = await compressImage(file, { maxEdge: 512 });
    setAvatar(compressed);
    setAvatarPreview(URL.createObjectURL(compressed));
  };

  const saveProfile = async () => {
    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== "" && value !== null) payload.append(key, String(value));
    });
    if (avatar) payload.append("avatar", avatar);

    try {
      await updateMe(payload);
      toast.success("Profile saved.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not save your profile."));
    }
  };

  const saveInterests = async () => {
    try {
      await updateInterestsRequest(interests);
      await refreshProfile();
      toast.success("Interests updated — your feed will follow.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not save your interests."));
    }
  };

  const savePref = async (key, value) => {
    const next = { ...prefs, [key]: value };
    setPrefs(next);
    try {
      await updateNotificationPrefsRequest({ [key]: value });
    } catch (error) {
      // Roll back so the switch never lies about what is stored.
      setPrefs(prefs);
      toast.error(getErrorMessage(error, "Could not save that setting."));
    }
  };

  const deleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteAccountRequest();
      await logout();
      toast.success("Your account has been deleted.");
      router.push("/");
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not delete your account."));
      setIsDeleting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-extrabold tracking-[-0.02em] text-ink">Settings</h1>

      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { value: "profile", label: "Profile" },
          { value: "interests", label: "Interests" },
          { value: "notifications", label: "Notifications" },
          { value: "account", label: "Account" },
        ]}
      />

      {tab === "profile" && (
        <section className="space-y-5">
          <div className="flex items-center gap-4">
            <Avatar src={avatarPreview || user?.avatar} name={user?.name} size="xl" />
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-surface-2">
              <CameraIcon size={17} /> Change photo
              <input type="file" accept="image/*" className="sr" onChange={pickAvatar} />
            </label>
          </div>

          <Input
            label="Full name"
            value={form.name}
            onChange={(event) => set({ name: event.target.value })}
          />
          <Input
            label="College"
            value={form.college}
            onChange={(event) => set({ college: event.target.value })}
            hint="Changing this moves your feed to a different campus."
          />
          <Input
            label="Department"
            value={form.department}
            onChange={(event) => set({ department: event.target.value })}
          />
          <Select
            label="Year of study"
            options={YEARS}
            placeholder="Select your year"
            value={form.year}
            onChange={(event) => set({ year: event.target.value })}
          />
          <Textarea
            label="Bio"
            maxLength={160}
            value={form.bio}
            onChange={(event) => set({ bio: event.target.value })}
          />

          <Button size="lg" loading={pending.updateMe} onClick={saveProfile}>
            Save changes
          </Button>
        </section>
      )}

      {tab === "interests" && (
        <section className="space-y-4">
          <p className="text-sm text-muted">
            Pick up to {MAX_INTERESTS} categories. These move to the top of your campus feed.
          </p>

          <div className="flex flex-wrap gap-2">
            {LISTING_CATEGORIES.map((category) => {
              const selected = interests.includes(category);
              const CategoryIcon = CATEGORY_META[category].Icon;
              return (
                <Chip
                  key={category}
                  active={selected}
                  icon={<CategoryIcon size={iconSize.xs} strokeWidth={ICON_STROKE} aria-hidden />}
                  onClick={() =>
                    setInterests((current) =>
                      selected
                        ? current.filter((item) => item !== category)
                        : current.length >= MAX_INTERESTS
                          ? current
                          : [...current, category]
                    )
                  }
                >
                  {category}
                </Chip>
              );
            })}
          </div>

          <Button onClick={saveInterests}>Save interests</Button>
        </section>
      )}

      {tab === "notifications" && (
        <section className="divide-y divide-line rounded-lg border border-line bg-surface px-4">
          {NOTIFICATION_ROWS.map((row) => (
            <Toggle
              key={row.key}
              label={row.label}
              description={row.description}
              checked={Boolean(prefs[row.key])}
              onChange={(value) => savePref(row.key, value)}
            />
          ))}
        </section>
      )}

      {tab === "account" && (
        <section className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-line bg-surface p-4">
            <div>
              <p className="text-sm font-semibold text-ink">Appearance</p>
              <p className="mt-0.5 text-xs text-muted">Follows your device unless you pick one.</p>
            </div>
            <ThemeToggle />
          </div>

          <div className="rounded-lg border border-line bg-surface p-4">
            <p className="text-sm font-semibold text-ink">Signed in as</p>
            <p className="mt-0.5 text-sm text-muted">{user?.email}</p>
            <p className="mt-2 text-xs text-muted">
              Your email is never shown to other students — buyers reach you through chat.
            </p>
          </div>

          <Button
            variant="secondary"
            block
            onClick={async () => {
              await logout();
              router.push("/");
            }}
          >
            Sign out
          </Button>

          <div className="rounded-lg border border-danger/30 bg-danger-tint p-4">
            <p className="text-sm font-semibold text-ink">Delete account</p>
            <p className="mt-1 text-xs leading-relaxed text-ink-2">
              Removes your listings and hides your profile. Past conversations stay visible to the
              other student so their history stays intact.
            </p>
            <Button variant="dangerSolid" size="sm" className="mt-3" onClick={() => setDeleteOpen(true)}>
              Delete my account
            </Button>
          </div>
        </section>
      )}

      <Sheet
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete your account?"
        description="This cannot be undone."
        size="sm"
        footer={
          <>
            <Button variant="secondary" block onClick={() => setDeleteOpen(false)}>
              Keep my account
            </Button>
            <Button variant="dangerSolid" block loading={isDeleting} onClick={deleteAccount}>
              Delete
            </Button>
          </>
        }
      >
        <p className="py-2 text-sm text-muted">
          All your listings are removed immediately and your profile stops appearing anywhere on
          UniSale.
        </p>
      </Sheet>
    </div>
  );
}
