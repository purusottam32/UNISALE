import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import { randomUUID } from "crypto";
import AppError from "./apiError.js";

const getR2Client = () => {
  const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY } = process.env;

  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
    throw new AppError("Cloudflare R2 credentials are missing. Check environment variables.", 500);
  }

  return new S3Client({
    region: "auto",
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
  });
};

/**
 * Resizes image buffer to max 800px wide (maintains aspect ratio),
 * converts to WebP, then uploads to R2.
 * Returns { url, key }
 */
export const uploadImageToR2 = async (buffer, folder = "uploads") => {
  const bucket = process.env.R2_BUCKET_NAME;
  const publicUrl = process.env.R2_PUBLIC_URL;

  if (!bucket || !publicUrl) {
    throw new AppError("R2 bucket configuration is missing.", 500);
  }

  // Resize + convert to webp
  const optimized = await sharp(buffer)
    .resize({ width: 800, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();

  const key = `${folder}/${randomUUID()}.webp`;

  const client = getR2Client();
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: optimized,
      ContentType: "image/webp",
      CacheControl: "public, max-age=31536000, immutable",
    })
  );

  return { url: `${publicUrl}/${key}`, key };
};

export const deleteImageFromR2 = async (key) => {
  if (!key) return;

  const bucket = process.env.R2_BUCKET_NAME;
  if (!bucket) return;

  try {
    const client = getR2Client();
    await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
  } catch {
    // Fire-and-forget — don't crash request if cleanup fails
  }
};
