import express from "express";

import {
  createTripController,
  getTripByIdController,
  getUserTripsController,
  addMemberController,
  closeTripController,
  getDestinationTripsController
} from "../controllers/tripController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createTripController);
router.get("/", authMiddleware, getUserTripsController);
router.get("/destination/:destination", authMiddleware, getDestinationTripsController);
router.get("/:id", authMiddleware, getTripByIdController);
router.patch("/:tripId/members", authMiddleware, addMemberController);
router.patch("/:id/close", authMiddleware, closeTripController);

export default router;