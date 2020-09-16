import authGuard from "../middlewares/authGuard";
import express from "express";
const router = express.Router();

router.get("/allpost", authGuard, (req, res) => {});

router.get("/getsubpost", authGuard, (req, res) => {});

router.post("/createpost", authGuard, (req, res) => {});

router.get("/mypost", authGuard, (req, res) => {});

router.put("/like", authGuard, (req, res) => {});

router.put("/unlike", authGuard, (req, res) => {});

router.put("/comment", authGuard, (req, res) => {});

router.delete("/deletepost/:postId", authGuard, (req, res) => {});

export default router;
