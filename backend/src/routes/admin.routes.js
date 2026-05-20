import express from "express";
import mongoose from "mongoose";
import User from "../models/user.model.js";
import Listing from "../models/listing.model.js";
import Report from "../models/report.model.js";
import AllowedDomain from "../models/allowedDomain.model.js";
import { protect, requireAdmin } from "../middleware/auth.middleware.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/apiError.js";

const router = express.Router();

// All admin routes require auth + admin role
router.use(protect, requireAdmin);

// ──────────────────────────────────────────────
// METRICS
// ──────────────────────────────────────────────
router.get(
  "/metrics",
  asyncHandler(async (req, res) => {
    const [totalUsers, totalListings, activeListings, pendingReports] = await Promise.all([
      User.countDocuments({ isBanned: false }),
      Listing.countDocuments({ status: { $ne: "deleted" } }),
      Listing.countDocuments({ status: "active" }),
      Report.countDocuments({ status: "pending" }),
    ]);

    res.status(200).json({
      success: true,
      data: { totalUsers, totalListings, activeListings, pendingReports },
    });
  })
);

// ──────────────────────────────────────────────
// USER MODERATION
// ──────────────────────────────────────────────
router.get(
  "/users",
  asyncHandler(async (req, res) => {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.search) {
      const re = new RegExp(req.query.search.trim(), "i");
      filter.$or = [{ name: re }, { email: re }, { college: re }];
    }
    if (req.query.role) filter.role = req.query.role;
    if (req.query.banned === "true") filter.isBanned = true;
    if (req.query.banned === "false") filter.isBanned = false;

    const [users, total] = await Promise.all([
      User.find(filter)
        .select("name email avatar college role isBanned isEmailVerified isProfileComplete createdAt")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: {
        users,
        totalPages: Math.ceil(total / limit) || 1,
        currentPage: page,
        totalItems: total,
      },
    });
  })
);

router.patch(
  "/users/:id/ban",
  asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new AppError("Invalid user id.", 400);
    }
    if (req.params.id === req.user._id.toString()) {
      throw new AppError("Cannot ban yourself.", 400);
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBanned: true },
      { new: true }
    ).select("name email isBanned");

    if (!user) throw new AppError("User not found.", 404);

    res.status(200).json({ success: true, message: "User banned.", data: user });
  })
);

router.patch(
  "/users/:id/unban",
  asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new AppError("Invalid user id.", 400);
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBanned: false },
      { new: true }
    ).select("name email isBanned");

    if (!user) throw new AppError("User not found.", 404);

    res.status(200).json({ success: true, message: "User unbanned.", data: user });
  })
);

router.patch(
  "/users/:id/role",
  asyncHandler(async (req, res) => {
    const { role } = req.body;
    if (!["user", "admin"].includes(role)) {
      throw new AppError("Role must be 'user' or 'admin'.", 400);
    }
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new AppError("Invalid user id.", 400);
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("name email role");

    if (!user) throw new AppError("User not found.", 404);

    res.status(200).json({ success: true, message: `Role set to ${role}.`, data: user });
  })
);

// ──────────────────────────────────────────────
// LISTING MODERATION
// ──────────────────────────────────────────────
router.get(
  "/listings",
  asyncHandler(async (req, res) => {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    else filter.status = { $ne: "deleted" };
    if (req.query.college) filter.college = new RegExp(req.query.college, "i");

    const [listings, total] = await Promise.all([
      Listing.find(filter)
        .populate("seller", "name email college")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Listing.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: {
        listings,
        totalPages: Math.ceil(total / limit) || 1,
        currentPage: page,
        totalItems: total,
      },
    });
  })
);

router.delete(
  "/listings/:id",
  asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new AppError("Invalid listing id.", 400);
    }

    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      { status: "deleted" },
      { new: true }
    ).select("title status");

    if (!listing) throw new AppError("Listing not found.", 404);

    res.status(200).json({ success: true, message: "Listing removed.", data: listing });
  })
);

router.patch(
  "/listings/:id/spam",
  asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new AppError("Invalid listing id.", 400);
    }

    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      { status: "deleted" },
      { new: true }
    ).select("title status");

    if (!listing) throw new AppError("Listing not found.", 404);

    res.status(200).json({ success: true, message: "Listing marked as spam and removed.", data: listing });
  })
);

// ──────────────────────────────────────────────
// REPORTS
// ──────────────────────────────────────────────
router.get(
  "/reports",
  asyncHandler(async (req, res) => {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = 20;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const [reports, total] = await Promise.all([
      Report.find(filter)
        .populate("reporter", "name email college")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Report.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: {
        reports,
        totalPages: Math.ceil(total / limit) || 1,
        currentPage: page,
        totalItems: total,
      },
    });
  })
);

router.patch(
  "/reports/:id/resolve",
  asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new AppError("Invalid report id.", 400);
    }

    const report = await Report.findByIdAndUpdate(
      req.params.id,
      {
        status: "resolved",
        resolvedBy: req.user._id,
        resolvedAt: new Date(),
        adminNote: req.body.adminNote || "",
      },
      { new: true }
    );

    if (!report) throw new AppError("Report not found.", 404);

    res.status(200).json({ success: true, message: "Report resolved.", data: report });
  })
);

// ──────────────────────────────────────────────
// ALLOWED DOMAINS
// ──────────────────────────────────────────────
router.get(
  "/domains",
  asyncHandler(async (req, res) => {
    const domains = await AllowedDomain.find().sort({ collegeName: 1 });
    res.status(200).json({ success: true, data: domains });
  })
);

router.post(
  "/domains",
  asyncHandler(async (req, res) => {
    const { domain, collegeName } = req.body;
    if (!domain || !collegeName) {
      throw new AppError("Both 'domain' and 'collegeName' are required.", 400);
    }

    const created = await AllowedDomain.create({
      domain: domain.toLowerCase().trim(),
      collegeName: collegeName.trim(),
      isActive: true,
    });

    res.status(201).json({ success: true, message: "Domain added.", data: created });
  })
);

router.patch(
  "/domains/:id/toggle",
  asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new AppError("Invalid domain id.", 400);
    }

    const domain = await AllowedDomain.findById(req.params.id);
    if (!domain) throw new AppError("Domain not found.", 404);

    domain.isActive = !domain.isActive;
    await domain.save();

    res.status(200).json({
      success: true,
      message: `Domain ${domain.isActive ? "enabled" : "disabled"}.`,
      data: domain,
    });
  })
);

router.delete(
  "/domains/:id",
  asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new AppError("Invalid domain id.", 400);
    }

    const domain = await AllowedDomain.findByIdAndDelete(req.params.id);
    if (!domain) throw new AppError("Domain not found.", 404);

    res.status(200).json({ success: true, message: "Domain deleted." });
  })
);

export default router;
