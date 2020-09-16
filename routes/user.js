import authGuard from "../middlewares/authGuard";
import express from "express";
const router = express.Router();

router.get("/user/:id", authGuard, (req, res) => {});

router.put("/follow", authGuard, (req, res) => {});

router.put("/unfollow", authGuard, (req, res) => {});

router.put("/updatepic", authGuard, (req, res) => {});

router.post("/search-users", (req, res) => {});

export default router;
