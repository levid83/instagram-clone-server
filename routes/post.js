import authGuard from "../middlewares/authGuard";
import PostController from "../controllers/PostController";

import express from "express";
const router = express.Router();

const postController = new PostController();

router.get("/all", authGuard, (req, res) => {});

router.get("/subpost", authGuard, (req, res) => {});

router.post("/create-post", authGuard, postController.createPost);

router.get("/my-posts", authGuard, postController.myPosts);

router.put("/like", authGuard, (req, res) => {});

router.put("/unlike", authGuard, (req, res) => {});

router.put("/comment", authGuard, (req, res) => {});

router.delete("/delete-post/:postId", authGuard, (req, res) => {});

export default router;
