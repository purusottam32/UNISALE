/**
 * Central runtime configuration.
 *
 * Every `process.env` read in the application should happen here so that
 * missing/invalid configuration fails loudly at boot instead of at request time.
 */

const required = (key, { allowEmptyInDev = false } = {}) => {
  const value = process.env[key];
  if (!value) {
    if (allowEmptyInDev && process.env.NODE_ENV !== "production") return "";
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

const list = (key, fallback = "") =>
  (process.env[key] || fallback)
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);

const config = {
  env: process.env.NODE_ENV || "development",
  isProduction: process.env.NODE_ENV === "production",
  port: Number(process.env.PORT) || 5000,

  /** Comma-separated list of allowed browser origins. */
  clientOrigins: list("CLIENT_URL", "http://localhost:3000,http://localhost:5173"),
  get primaryClientOrigin() {
    return this.clientOrigins[0];
  },

  db: {
    uri: required("MONGO_URI", { allowEmptyInDev: true }),
  },

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  },

  mail: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.EMAIL_FROM || "UniSale <noreply@unisale.in>",
  },

  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackUrl: process.env.GOOGLE_CALLBACK_URL,
  },

  r2: {
    accountId: process.env.R2_ACCOUNT_ID,
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    bucket: process.env.R2_BUCKET_NAME,
    publicUrl: process.env.R2_PUBLIC_URL,
  },

  limits: {
    /** Requests per window for general API traffic. */
    globalMax: 300,
    /** Requests per window for auth endpoints (OTP abuse protection). */
    authMax: 20,
    windowMs: 15 * 60 * 1000,
    maxListingImages: 5,
    maxImageBytes: 5 * 1024 * 1024,
  },
};

export default config;
