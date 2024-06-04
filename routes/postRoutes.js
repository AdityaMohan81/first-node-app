import express from "express";
import { createPost, deletePost, getPost, listPosts } from "../controllers/postController.js";
import multer from "multer";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer();

router
    .route("/create")
    .post(authenticateUser, upload.single("file"), createPost);
router.route("/list").get(authenticateUser, listPosts);
router.route("/get").post(authenticateUser, upload.none(), getPost);
router.route("/delete").post(authenticateUser, upload.none(), deletePost);

// router.put('/update', auth, admin, postController.updatePost);

export default router;
