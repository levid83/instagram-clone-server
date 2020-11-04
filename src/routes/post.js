import authGuard from "../middlewares/authGuard";
import PostController from "../controllers/PostController";

import express from "express";
const router = express.Router();

const postController = new PostController();

router.get("/all-posts", authGuard, postController.allPosts);

router.get("/subposts", authGuard, postController.subPosts);

router.post("/create-post", authGuard, postController.createPost);

router.get("/my-posts", authGuard, postController.myPosts);

router.put("/like-post", authGuard, postController.likePost);

router.put("/unlike-post", authGuard, postController.unlikePost);

router.put("/add-post-comment", authGuard, postController.addPostComment);

router.delete("/delete-post/:postId", authGuard, postController.deletePost);

export default router;
