const express = require("express");
const router = express.Router();

router.get("/allpost", (req, res) => {});

router.get("/getsubpost", (req, res) => {});

router.post("/createpost", (req, res) => {});

router.get("/mypost", (req, res) => {});

router.put("/like", (req, res) => {});

router.put("/unlike", (req, res) => {});

router.put("/comment", (req, res) => {});

router.delete("/deletepost/:postId", (req, res) => {});

export default router;
