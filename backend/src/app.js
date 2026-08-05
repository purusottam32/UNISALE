import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import config from "./config/index.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import listingRoutes from "./routes/listing.routes.js";
import wishlistRoutes from "./routes/wishlist.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import adminRoutes from "./routes/admin.routes.js";

import { errorHandler, notFoundHandler } from "./middleware/error.middleware.js";
import { optionalAuth } from "./middleware/auth.middleware.js";
import { validateQuery } from "./middleware/validation.middleware.js";
import { listingQuerySchema } from "./validators/listing.schema.js";
import { searchListings } from "./controllers/listing.controller.js";
import { setupSwagger } from "./docs/swagger.js";

const app = express();

// Behind a reverse proxy (Render/Vercel/Nginx) so rate limiting and secure
// cookies see the real client IP and protocol.
app.set("trust proxy", 1);

// ── CORS ───────────────────────────────────────────────────────────────
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || config.clientOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("Origin not allowed by CORS"));
    },
    credentials: true,
  })
);

// ── Security ───────────────────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

const globalLimiter = rateLimit({
  windowMs: config.limits.windowMs,
  max: config.limits.globalMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests. Please try again later." },
});

const authLimiter = rateLimit({
  windowMs: config.limits.windowMs,
  max: config.limits.authMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many auth attempts. Please try again later." },
});

app.use(globalLimiter);

// ── Parsers ────────────────────────────────────────────────────────────
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (config.env !== "test") app.use(morgan("dev"));

setupSwagger(app);

// ── Health ─────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "UniSale API is running",
    timestamp: new Date().toISOString(),
    env: config.env,
  });
});

// ── Routes ─────────────────────────────────────────────────────────────
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/admin", adminRoutes);

// Top-level search alias — `/api/listings/search` is the canonical route.
app.get("/api/search", optionalAuth, validateQuery(listingQuerySchema), searchListings);

// ── Errors ─────────────────────────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
