/**
 * Hand-rolled icon set.
 *
 * A curated 24px stroke set keeps the navigation visually consistent and costs
 * a couple of kilobytes, versus pulling whole icon packs for a dozen glyphs.
 * Every icon inherits `currentColor` and sizes from the `size` prop.
 */

const base = (size) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false,
});

export const HomeIcon = ({ size = 22, filled = false }) => (
  <svg {...base(size)} fill={filled ? "currentColor" : "none"}>
    <path d="M3 10.2 12 3l9 7.2V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
  </svg>
);

export const CompassIcon = ({ size = 22, filled = false }) => (
  <svg {...base(size)}>
    <circle cx="12" cy="12" r="9" fill={filled ? "currentColor" : "none"} />
    <path d="m15.5 8.5-2.1 5-5 2.1 2.1-5z" fill={filled ? "var(--color-surface)" : "none"} stroke={filled ? "var(--color-surface)" : "currentColor"} />
  </svg>
);

export const PlusIcon = ({ size = 22 }) => (
  <svg {...base(size)} strokeWidth={2.1}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const ChatIcon = ({ size = 22, filled = false }) => (
  <svg {...base(size)} fill={filled ? "currentColor" : "none"}>
    <path d="M20 12a7.5 7.5 0 0 1-7.5 7.5H8l-4 2.5v-4.3A7.5 7.5 0 0 1 12.5 4.5 7.5 7.5 0 0 1 20 12Z" />
  </svg>
);

export const UserIcon = ({ size = 22, filled = false }) => (
  <svg {...base(size)} fill={filled ? "currentColor" : "none"}>
    <circle cx="12" cy="8" r="3.6" />
    <path d="M4.8 20a7.2 7.2 0 0 1 14.4 0" />
  </svg>
);

export const SearchIcon = ({ size = 20 }) => (
  <svg {...base(size)}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4.5 4.5" />
  </svg>
);

export const HeartIcon = ({ size = 20, filled = false }) => (
  <svg {...base(size)} fill={filled ? "currentColor" : "none"}>
    <path d="M12 20s-7.5-4.4-7.5-9.4A4.1 4.1 0 0 1 12 8a4.1 4.1 0 0 1 7.5 2.6c0 5-7.5 9.4-7.5 9.4Z" />
  </svg>
);

export const BellIcon = ({ size = 20 }) => (
  <svg {...base(size)}>
    <path d="M18 9a6 6 0 1 0-12 0c0 5-2 6-2 6h16s-2-1-2-6" />
    <path d="M13.7 19a2 2 0 0 1-3.4 0" />
  </svg>
);

export const CloseIcon = ({ size = 20 }) => (
  <svg {...base(size)} strokeWidth={2}>
    <path d="M6 6 18 18M18 6 6 18" />
  </svg>
);

export const ChevronLeftIcon = ({ size = 20 }) => (
  <svg {...base(size)}>
    <path d="m14.5 5-7 7 7 7" />
  </svg>
);

export const ChevronRightIcon = ({ size = 20 }) => (
  <svg {...base(size)}>
    <path d="m9.5 5 7 7-7 7" />
  </svg>
);

export const ChevronDownIcon = ({ size = 18 }) => (
  <svg {...base(size)}>
    <path d="m5 9 7 7 7-7" />
  </svg>
);

export const ArrowRightIcon = ({ size = 18 }) => (
  <svg {...base(size)}>
    <path d="M4 12h15m0 0-6-6m6 6-6 6" />
  </svg>
);

export const SlidersIcon = ({ size = 18 }) => (
  <svg {...base(size)}>
    <path d="M4 7h11M19 7h1M4 17h4M12 17h8" />
    <circle cx="17" cy="7" r="2" />
    <circle cx="10" cy="17" r="2" />
  </svg>
);

export const SortIcon = ({ size = 18 }) => (
  <svg {...base(size)}>
    <path d="M7 4v16m0 0-3-3m3 3 3-3M17 20V4m0 0-3 3m3-3 3 3" />
  </svg>
);

export const CheckIcon = ({ size = 18 }) => (
  <svg {...base(size)} strokeWidth={2.2}>
    <path d="m4.5 12.5 5 5 10-11" />
  </svg>
);

export const StarIcon = ({ size = 16, filled = false }) => (
  <svg {...base(size)} fill={filled ? "currentColor" : "none"} strokeWidth={1.5}>
    <path d="m12 3.6 2.6 5.4 5.9.8-4.3 4.1 1.1 5.9-5.3-2.9-5.3 2.9 1.1-5.9L3.5 9.8l5.9-.8z" />
  </svg>
);

export const ShieldIcon = ({ size = 18 }) => (
  <svg {...base(size)}>
    <path d="M12 3 5 6v6c0 4.4 3 8 7 9 4-1 7-4.6 7-9V6z" />
    <path d="m9 12 2 2 4-4.5" />
  </svg>
);

export const VerifiedIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable="false">
    <path d="M12 1.8 14.6 4l3-.2.9 2.9 2.6 1.6-1.2 2.8 1.2 2.8-2.6 1.6-.9 2.9-3-.2L12 22.2 9.4 20l-3 .2-.9-2.9L2.9 15.7l1.2-2.8L2.9 10l2.6-1.6.9-2.9 3 .2z" />
    <path
      d="m8.6 12.2 2.3 2.3 4.5-5"
      fill="none"
      stroke="var(--color-surface)"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const MapPinIcon = ({ size = 15 }) => (
  <svg {...base(size)} strokeWidth={1.6}>
    <path d="M12 21s6.5-5.7 6.5-10.2A6.5 6.5 0 0 0 5.5 10.8C5.5 15.3 12 21 12 21Z" />
    <circle cx="12" cy="10.5" r="2.3" />
  </svg>
);

export const EyeIcon = ({ size = 15 }) => (
  <svg {...base(size)} strokeWidth={1.6}>
    <path d="M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12Z" />
    <circle cx="12" cy="12" r="2.8" />
  </svg>
);

export const CameraIcon = ({ size = 22 }) => (
  <svg {...base(size)}>
    <path d="M4 8h3l1.5-2.2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
    <circle cx="12" cy="13.3" r="3.4" />
  </svg>
);

export const SendIcon = ({ size = 20 }) => (
  <svg {...base(size)}>
    <path d="M21 3 10.5 13.5M21 3l-6.7 18-3.8-7.5L3 9.7z" />
  </svg>
);

export const MoreIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable="false">
    <circle cx="5" cy="12" r="1.7" />
    <circle cx="12" cy="12" r="1.7" />
    <circle cx="19" cy="12" r="1.7" />
  </svg>
);

export const EditIcon = ({ size = 18 }) => (
  <svg {...base(size)}>
    <path d="M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17z" />
  </svg>
);

export const TrashIcon = ({ size = 18 }) => (
  <svg {...base(size)}>
    <path d="M4 7h16M9.5 7V5h5v2M6.5 7l.9 12.1a1 1 0 0 0 1 .9h7.2a1 1 0 0 0 1-.9L17.5 7" />
  </svg>
);

export const ShareIcon = ({ size = 18 }) => (
  <svg {...base(size)}>
    <path d="M12 15V4m0 0L8.5 7.5M12 4l3.5 3.5" />
    <path d="M5 13v5.5a1.5 1.5 0 0 0 1.5 1.5h11a1.5 1.5 0 0 0 1.5-1.5V13" />
  </svg>
);

export const FlagIcon = ({ size = 18 }) => (
  <svg {...base(size)}>
    <path d="M5.5 21V4m0 0 6.5 1.8L18.5 4v9.6L12 15.4 5.5 13.6" />
  </svg>
);

export const SunIcon = ({ size = 18 }) => (
  <svg {...base(size)}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4" />
  </svg>
);

export const MoonIcon = ({ size = 18 }) => (
  <svg {...base(size)}>
    <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
  </svg>
);

export const SettingsIcon = ({ size = 18 }) => (
  <svg {...base(size)}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2.8v2.4M12 18.8v2.4M4.3 7.4l2 1.2M17.7 15.4l2 1.2M4.3 16.6l2-1.2M17.7 8.6l2-1.2" />
  </svg>
);

export const LogoutIcon = ({ size = 18 }) => (
  <svg {...base(size)}>
    <path d="M14.5 8V5.5A1.5 1.5 0 0 0 13 4H6a1.5 1.5 0 0 0-1.5 1.5v13A1.5 1.5 0 0 0 6 20h7a1.5 1.5 0 0 0 1.5-1.5V16" />
    <path d="M10 12h10m0 0-3-3m3 3-3 3" />
  </svg>
);

export const TagIcon = ({ size = 16 }) => (
  <svg {...base(size)} strokeWidth={1.6}>
    <path d="M3.5 11.3V4.5a1 1 0 0 1 1-1h6.8a1 1 0 0 1 .7.3l8 8a1 1 0 0 1 0 1.4l-6.8 6.8a1 1 0 0 1-1.4 0l-8-8a1 1 0 0 1-.3-.7Z" />
    <circle cx="7.8" cy="7.8" r="1.3" fill="currentColor" />
  </svg>
);

export const SparkleIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable="false">
    <path d="M12 2.5 13.9 8 19.5 10 13.9 12 12 17.5 10.1 12 4.5 10 10.1 8z" />
    <path d="M18.5 15.5 19.4 18l2.6.9-2.6.9-.9 2.5-.9-2.5-2.6-.9 2.6-.9z" />
  </svg>
);

/** Maps the string names used in `config/navigation.js` to components. */
export const NAV_ICONS = {
  home: HomeIcon,
  compass: CompassIcon,
  plus: PlusIcon,
  chat: ChatIcon,
  user: UserIcon,
};
