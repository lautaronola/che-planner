import express from "express";
import {loginUserController, registerUserController } from "../controllers/userController.js";

const router = express.Router();


router.post("/register", registerUserController); 
router.post("/loggin", loginUserController);

export default router;