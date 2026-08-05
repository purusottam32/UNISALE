const MAX_EDGE = 1600;
const QUALITY = 0.82;

/**
 * Downscales and re-encodes an image in the browser before upload.
 *
 * Students photograph items on phones that produce 4-8MB files; on campus wifi
 * that is the difference between a listing that publishes and one that times
 * out. Shrinking client-side also keeps us under the server's 5MB limit.
 */
export async function compressImage(file, { maxEdge = MAX_EDGE, quality = QUALITY } = {}) {
  if (!file?.type?.startsWith("image/")) return file;
  if (typeof document === "undefined") return file;

  const bitmap = await loadBitmap(file);
  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));

  // Already small enough — re-encoding would only lose quality.
  if (scale === 1 && file.size < 900_000) return file;

  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  context.imageSmoothingQuality = "high";
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close?.();

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
  if (!blob) return file;

  const name = `${file.name.replace(/\.[^.]+$/, "")}.jpg`;
  return new File([blob], name, { type: "image/jpeg", lastModified: Date.now() });
}

export const compressImages = (files, options) =>
  Promise.all(Array.from(files).map((file) => compressImage(file, options)));

async function loadBitmap(file) {
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(file);
    } catch {
      // Safari can reject some HEIC-derived JPEGs — fall through to <img>.
    }
  }

  const url = URL.createObjectURL(file);
  try {
    return await new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("Could not read that image."));
      image.src = url;
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}
