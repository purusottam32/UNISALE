import type { LISTING_CATEGORIES } from "@/config/catalog";

export type ListingCategory = (typeof LISTING_CATEGORIES)[number];

export interface TrustTier {
  key: "trusted" | "verified" | "new";
  label: string;
  min: number;
}

/**
 * The signed-in user, as returned by `GET /auth/me`.
 *
 * This is the *own-user* view — it carries `email` and `role`, which the
 * public profile shape deliberately withholds from other students.
 *
 * Declared here rather than inferred from the API client so that TypeScript
 * consumers get a real type across the JS/TS boundary; `auth-context.jsx` is
 * still JavaScript and would otherwise infer `never`.
 */
export interface CurrentUser {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  college: string;
  department: string;
  year: number | null;
  bio: string;
  interests: ListingCategory[];
  role: "user" | "admin";
  ratingAverage: number;
  ratingCount: number;
  completedDeals: number;
  isEmailVerified: boolean;
  isProfileComplete: boolean;
  isIdVerified: boolean;
  trustScore: number;
  trustTier: TrustTier;
  notificationPrefs: Record<string, boolean>;
  createdAt: string;
}

/**
 * What `useAuth()` returns.
 *
 * `auth-context.jsx` annotates its `createContext` call with this type — the
 * context is created with `null`, so without the annotation TypeScript infers
 * `Context<null>` and every `.tsx` consumer sees `never`.
 */
export interface AuthContextValue {
  user: CurrentUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  isProfileComplete: boolean;
  isAdmin: boolean;

  register: (payload: unknown) => Promise<{ user?: CurrentUser; accessToken?: string }>;
  verifyOtp: (payload: unknown) => Promise<{ user?: CurrentUser; accessToken?: string }>;
  resendOtp: (payload: unknown) => Promise<unknown>;
  login: (payload: unknown) => Promise<{ user?: CurrentUser; accessToken?: string }>;
  logout: () => Promise<unknown>;
  completeProfile: (formData: FormData) => Promise<CurrentUser | undefined>;
  updateMe: (formData: FormData) => Promise<CurrentUser | undefined>;
  adoptSession: (payload: { user?: CurrentUser; accessToken?: string }) => void;
  refreshProfile: () => Promise<unknown>;

  pending: {
    register: boolean;
    verifyOtp: boolean;
    login: boolean;
    completeProfile: boolean;
    updateMe: boolean;
    logout: boolean;
  };
}
