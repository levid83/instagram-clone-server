import express from "express";
import AuthController from "../controllers/AuthController";

const router = express.Router();
const authController = new AuthController();

router.post("/signup", authController.signup);

router.post("/signin", authController.signin);

router.post("/reset-password", authController.resetPassword);

router.post("/new-password", authController.newPassword);

export default router;
