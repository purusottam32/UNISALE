/**
 * Design-system primitives. Import from `@/components/ui`.
 *
 * Everything here is presentational and domain-agnostic — a primitive must not
 * know what a listing or a seller is. Anything that does belongs in
 * `src/features/<domain>/components/`.
 */

export { cn } from "@/lib/cn";

/* ── Atoms ────────────────────────────────────────────────────────────────*/
export { default as Button, buttonVariants, type ButtonProps } from "./Button";
export { default as Badge, badgeVariants, type BadgeProps } from "./Badge";
export { default as Chip, chipVariants, type ChipProps } from "./Chip";
export { default as Avatar, AvatarGroup, type AvatarProps } from "./Avatar";
export { default as Spinner } from "./Spinner";
export {
  default as Skeleton,
  ProductCardSkeleton,
  ProductGridSkeleton,
  ConversationRowSkeleton,
  TextSkeleton,
} from "./Skeleton";

/* ── Form ─────────────────────────────────────────────────────────────────*/
export {
  Field,
  Input,
  Textarea,
  Select,
  Toggle,
  Checkbox,
  ChoiceGroup,
  controlVariants,
  type InputProps,
  type TextareaProps,
  type SelectProps,
  type Choice,
} from "./Field";

/* ── Overlays ─────────────────────────────────────────────────────────────*/
export { default as Modal, ConfirmModal, type ModalProps } from "./Modal";
export { default as Drawer, type DrawerProps } from "./Drawer";
export { default as Tooltip, TooltipProvider } from "./Tooltip";
export {
  DropdownRoot,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownCheckItem,
  DropdownLabel,
  DropdownSeparator,
  dropdownIconProps,
} from "./Dropdown";
export { notify, ToastViewport } from "./Toast";

/* ── Navigation ───────────────────────────────────────────────────────────*/
export { default as Tabs, ChipRow, type TabItem } from "./Tabs";
export { default as Pagination, LoadMore } from "./Pagination";

/* ── States ───────────────────────────────────────────────────────────────*/
export {
  EmptyState,
  LoadingState,
  ErrorState,
  InlineError,
  type EmptyStateProps,
  type ErrorStateProps,
} from "./States";

/* ── Domain-flavoured, pending relocation to features/ ────────────────────*/
export { default as Sheet } from "./Sheet";
export { default as TrustBadge } from "./TrustBadge";
export { RatingStars, RatingInput, RatingBreakdown } from "./Rating";
