import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

// Routes
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import listingRoutes from "./routes/listing.routes.js";
import productRoutes from "./routes/product.routes.js";
import wishlistRoutes from "./routes/wishlist.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import adminRoutes from "./routes/admin.routes.js";

// Error handling
import { errorHandler, notFoundHandler } from "./middleware/error.middleware.js";
import { optionalAuth } from "./middleware/auth.middleware.js";
import { validateQuery } from "./middleware/validation.middleware.js";
import { listingQuerySchema } from "./validators/listing.schema.js";
import { searchListings } from "./controllers/listing.controller.js";
import { setupSwagger } from "./docs/swagger.js";

const app = express();

// ---------------------
// CORS
// ---------------------
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("Origin not allowed by CORS"));
    },
    credentials: true,
  })
);

// ---------------------
// Security
// ---------------------
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // allow CDN images
  })
);

// ---------------------
// Rate Limiting
// ---------------------
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests. Please try again later." },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // stricter for auth endpoints
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many auth attempts. Please try again later." },
});

app.use(globalLimiter);

// ---------------------
// Body Parsers
// ---------------------
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// ---------------------
// Swagger Docs
// ---------------------
setupSwagger(app);

// ---------------------
// Health Check
// ---------------------
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "UNISALE API is running",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || "development",
  });
});

// ---------------------
// Routes
// ---------------------
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/products", productRoutes);
app.get("/api/search", optionalAuth, validateQuery(listingQuerySchema), searchListings);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/admin", adminRoutes);

// ---------------------
// Error Handlers
// ---------------------
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
