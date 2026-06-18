import express from "express";
import {
  addPaymentController,
  getTripPaymentsController,
  calculateDebtsController,
} from "../controllers/paymentController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, addPaymentController);
router.get("/:tripId", authMiddleware, getTripPaymentsController);
router.get("/:tripId/debts", authMiddleware, calculateDebtsController);

export default router;
