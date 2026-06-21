import express from "express";

import {
  createTripController,
  getTripByIdController,
  getUserTripsController,
  addMemberController,
  closeTripController,
  getDestinationTripsController,
  getTripSummaryController
} from "../controllers/tripController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createTripController);
router.get("/", authMiddleware, getUserTripsController);
router.get("/destination/:destination", authMiddleware, getDestinationTripsController);
router.patch("/:id/close", authMiddleware, closeTripController);
router.get("/:tripId/summary", authMiddleware, getTripSummaryController);
router.get("/:id", authMiddleware, getTripByIdController);
router.patch("/:tripId/members", authMiddleware, addMemberController);

export default router;