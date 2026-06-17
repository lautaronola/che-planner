import express from "express";
import {
  addExpenseController,
  getTripExpensesController,
  getExpenseDetailController,
} from "../controllers/expenseController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, addExpenseController);
router.get("/:tripId", authMiddleware, getTripExpensesController);
router.get("/:expenseId/detail", authMiddleware, getExpenseDetailController);

export default router;
