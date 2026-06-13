import express from "express";
import {
  createTripController,
  getTripByIdController,
  getUserTripsController,
  addMemberController,
  closeTripController,
} from "../controllers/tripController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createTripController);
router.get("/", authMiddleware, getUserTripsController);
router.get("/:id", authMiddleware, getTripByIdController);
router.patch("/:tripId/members", authMiddleware, addMemberController);
router.patch("/:id/close", authMiddleware, closeTripController);

export default router;