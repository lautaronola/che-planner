import express from "express";
import {
  getUser,
  registerUserController,
  loginUserController,
} from "../controllers/userController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUserController);
router.post("/login", authenticateToken, loginUserController);
router.get("/:id", getUser);

export default router;
