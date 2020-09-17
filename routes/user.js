import authGuard from "../middlewares/authGuard";
import express from "express";
import UserController from "../controllers/UserController";

const router = express.Router();

const userController = new UserController();

router.get("/user/:id", authGuard, userController.getUser);

router.put("/follow-user", authGuard, userController.followUser);

router.put("/unfollow-user", authGuard, userController.unfollowUser);

router.put("/update-picture", authGuard, (req, res) => {});

router.post("/search-users", (req, res) => {});

export default router;
