"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { compressImages } from "@/lib/compress-image";
import { cn } from "@/components/ui/cn";
import { CameraIcon, CloseIcon, PlusIcon } from "@/components/ui/icons";

const MAX_PHOTOS = 5;
const MAX_BYTES = 5 * 1024 * 1024;

/**
 * Photo picker for the sell flow.
 *
 * Photos come first because they are the commitment device: a seller who has
 * uploaded a picture finishes the listing. Files are compressed in the browser
 * before they ever hit the network, and the first slot is labelled as the cover
 * because that is the only image most buyers will ever see in the grid.
 */
export default function PhotoUploader({ photos, onChange, error }) {
  const inputRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragIndex, setDragIndex] = useState(null);

  const addFiles = async (fileList) => {
    const incoming = Array.from(fileList || []);
    if (incoming.length === 0) return;

    const room = MAX_PHOTOS - photos.length;
    if (room <= 0) {
      toast.error(`You can add up to ${MAX_PHOTOS} photos.`);
      return;
    }

    const accepted = incoming.slice(0, room).filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} isn't an image.`);
        return false;
      }
      if (file.size > MAX_BYTES * 4) {
        toast.error(`${file.name} is too large.`);
        return false;
      }
      return true;
    });

    if (accepted.length === 0) return;

    setIsProcessing(true);
    try {
      const compressed = await compressImages(accepted);
      onChange([
        ...photos,
        ...compressed.map((file) => ({ file, preview: URL.createObjectURL(file) })),
      ]);
    } catch {
      toast.error("Could not process those photos.");
    } finally {
      setIsProcessing(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const removeAt = (index) => {
    URL.revokeObjectURL(photos[index]?.preview);
    onChange(photos.filter((_, position) => position !== index));
  };

  /** Reorder by drag — the cover photo is worth letting people choose. */
  const dropOn = (targetIndex) => {
    if (dragIndex === null || dragIndex === targetIndex) return;
    const next = [...photos];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(targetIndex, 0, moved);
    onChange(next);
    setDragIndex(null);
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
        {photos.map((photo, index) => (
          <div
            key={photo.preview}
            draggable
            onDragStart={() => setDragIndex(index)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => dropOn(index)}
            className={cn(
              "group relative aspect-square overflow-hidden rounded-md border bg-surface-2",
              index === 0 ? "border-brand" : "border-line",
              dragIndex === index && "opacity-50"
            )}
          >
            <Image src={photo.preview} alt="" fill sizes="140px" className="object-cover" />

            {index === 0 && (
              <span className="absolute bottom-1 left-1 rounded bg-brand px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-brand-fg">
                Cover
              </span>
            )}

            <button
              type="button"
              onClick={() => removeAt(index)}
              aria-label={`Remove photo ${index + 1}`}
              className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/65 text-white"
            >
              <CloseIcon size={13} />
            </button>
          </div>
        ))}

        {photos.length < MAX_PHOTOS && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isProcessing}
            className={cn(
              "grid aspect-square place-items-center gap-1 rounded-md border-2 border-dashed",
              "border-line text-muted transition-colors hover:border-brand hover:text-brand",
              "disabled:opacity-60"
            )}
          >
            {photos.length === 0 ? <CameraIcon size={26} /> : <PlusIcon size={22} />}
            <span className="text-[10px] font-semibold">
              {isProcessing ? "Working…" : photos.length === 0 ? "Add photos" : "Add"}
            </span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="sr"
        onChange={(event) => addFiles(event.target.files)}
      />

      {error ? (
        <p className="mt-2 text-xs font-medium text-danger">{error}</p>
      ) : (
        <p className="mt-2 text-xs text-muted">
          {photos.length}/{MAX_PHOTOS} photos. Natural light and a plain background sell fastest —
          drag to reorder.
        </p>
      )}
    </div>
  );
}

export { MAX_PHOTOS };
