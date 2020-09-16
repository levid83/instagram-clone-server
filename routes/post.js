import authGuard from "../middlewares/authGuard";
import PostController from "../controllers/PostController";

import express from "express";
const router = express.Router();

const postController = new PostController();

router.get("/all-posts", authGuard, postController.allPosts);

router.get("/subposts", authGuard, postController.subPosts);

router.post("/create-post", authGuard, postController.createPost);

router.get("/my-posts", authGuard, postController.myPosts);

router.put("/like", authGuard, (req, res) => {});

router.put("/unlike", authGuard, (req, res) => {});

router.put("/add-comment", authGuard, postController.addComment);

router.delete("/delete-post/:postId", authGuard, (req, res) => {});

export default router;
