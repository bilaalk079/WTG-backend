import express from "express";
import {
  searchBusinesses,
  createBusiness,
  getMyBusiness,
  updateBusiness,
  deleteAccount,
  getBusinessBySlug
} from "../controllers/business.controllers.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

// PUBLIC ROUTES
router.get("/search", searchBusinesses);         // Search with filters (state, lga, town, category)

// PROTECTED ROUTES (require token)
router.post("/", authenticate, createBusiness);   // Add business
router.get("/me", authenticate, getMyBusiness);   // Get current user's business
router.put("/me", authenticate, updateBusiness);  // Update current user's business
router.delete("/me", authenticate, deleteAccount);// Delete account & business

// Public route with slug param (last)
router.get("/:slug", getBusinessBySlug);         // View full business profile by slug

export default router;