import authGuard from "../middlewares/authGuard";
import PostController from "../controllers/PostController";

import express from "express";
const router = express.Router();

const postController = new PostController();

router.get("/allpost", authGuard, (req, res) => {});

router.get("/getsubpost", authGuard, (req, res) => {});

router.post("/createpost", authGuard, postController.createPost);

router.get("/mypost", authGuard, (req, res) => {});

router.put("/like", authGuard, (req, res) => {});

router.put("/unlike", authGuard, (req, res) => {});

router.put("/comment", authGuard, (req, res) => {});

router.delete("/deletepost/:postId", authGuard, (req, res) => {});

export default router;
