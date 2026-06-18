import express from "express";
import {
  getUserController,
  registerUserController,
  loginUserController,
  searchUsersController,
} from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/register", registerUserController);
router.post("/login", loginUserController);
router.get("/", authMiddleware, searchUsersController);
router.get("/:id", getUserController);

export default router;
