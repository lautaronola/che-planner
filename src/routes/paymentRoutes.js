import express from "express";
import {
  addPaymentController,
  getTripPaymentsController,
  calculateDebtsController,
  settlePaymentController,
} from "../controllers/paymentController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, addPaymentController);
router.get("/:tripId", authMiddleware, getTripPaymentsController);
router.get("/:tripId/debts", authMiddleware, calculateDebtsController);
router.patch("/:paymentId/settle", authMiddleware, settlePaymentController);

export default router;