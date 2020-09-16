import express from "express";
import AuthController from "../controllers/AuthController";

const router = express.Router();
const authController = new AuthController();

router.post("/signup", authController.signup);

router.post("/signin", (req, res) => {});

router.post("/reset-password", (req, res) => {});

router.post("/new-password", (req, res) => {});

export default router;
