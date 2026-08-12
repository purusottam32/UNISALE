"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons";
import { ImageOff } from "lucide-react";
import { ICON_STROKE, iconSize } from "@/lib/design-tokens";

/**
 * Listing photo gallery.
 *
 * Swipeable on touch and arrow-driven on desktop, sharing one index so the dot
 * counter, thumbnails and main frame never disagree. Scroll position is the
 * source of truth on mobile — fighting native momentum scrolling with JS
 * animation always feels worse than letting the browser do it.
 */
export default function ListingGallery({ images = [], title = "" }) {
  const [index, setIndex] = useState(0);
  const trackRef = useRef(null);
  const count = images.length;

  const goTo = (next) => {
    const clamped = Math.max(0, Math.min(next, count - 1));
    setIndex(clamped);
    const track = trackRef.current;
    if (track) track.scrollTo({ left: clamped * track.clientWidth, behavior: "smooth" });
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "ArrowLeft") goTo(index - 1);
      if (event.key === "ArrowRight") goTo(index + 1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  if (count === 0) {
    return (
      <div className="grid aspect-[4/3] place-items-center rounded-lg bg-surface-2 text-faint">
        <ImageOff size={iconSize["2xl"]} strokeWidth={ICON_STROKE} aria-hidden />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-lg bg-surface-2">
        <div
          ref={trackRef}
          onScroll={(event) => {
            const { scrollLeft, clientWidth } = event.currentTarget;
            setIndex(Math.round(scrollLeft / clientWidth));
          }}
          className="flex snap-x snap-mandatory overflow-x-auto"
          style={{ scrollbarWidth: "none" }}
        >
          {images.map((image, position) => (
            <div key={image.url} className="relative aspect-[4/3] w-full shrink-0 snap-center">
              <Image
                src={image.url}
                alt={`${title} — photo ${position + 1} of ${count}`}
                fill
                sizes="(max-width: 1024px) 100vw, 620px"
                priority={position === 0}
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {count > 1 && (
          <>
            <GalleryArrow side="left" disabled={index === 0} onClick={() => goTo(index - 1)} />
            <GalleryArrow
              side="right"
              disabled={index === count - 1}
              onClick={() => goTo(index + 1)}
            />
            <span className="absolute bottom-3 right-3 rounded-full bg-black/62 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
              {index + 1} / {count}
            </span>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="rail">
          {images.map((image, position) => (
            <button
              key={image.url}
              type="button"
              onClick={() => goTo(position)}
              aria-label={`View photo ${position + 1}`}
              aria-current={position === index}
              className={cn(
                "relative h-16 w-16 overflow-hidden rounded-md border-2 transition-colors",
                position === index ? "border-brand" : "border-transparent opacity-65 hover:opacity-100"
              )}
            >
              <Image src={image.url} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function GalleryArrow({ side, disabled, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={side === "left" ? "Previous photo" : "Next photo"}
      className={cn(
        "absolute top-1/2 hidden h-9 w-9 -translate-y-1/2 place-items-center rounded-full",
        "bg-surface/92 text-ink shadow-sm backdrop-blur-sm transition-opacity md:grid",
        "disabled:pointer-events-none disabled:opacity-0",
        side === "left" ? "left-3" : "right-3"
      )}
    >
      {side === "left" ? <ChevronLeftIcon /> : <ChevronRightIcon />}
    </button>
  );
}
