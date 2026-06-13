import express from "express";
import {
  getUserController,
  registerUserController,
  loginUserController,
} from "../controllers/userController.js";
const router = express.Router();

router.post("/register", registerUserController);
router.post("/login", loginUserController);
router.get("/:id", getUserController);

export default router;
