import express from "express";
import { createPost, deletePost, getPost, listPosts } from "../controllers/postController.js";
import multer from "multer";
import { admin, auth, authRole, authenticateUser, protect } from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer();

router
    .route("/create")
    .post(authenticateUser, authRole('admin'), upload.single("file"), createPost);
router.route("/list").get(authenticateUser, authRole('admin'), listPosts);
router.route("/get").post(authenticateUser, authRole('admin'), upload.none(), getPost);
router.route("/delete").post(authenticateUser, authRole('admin'), upload.none(), deletePost);

// router.put('/update', auth, admin, postController.updatePost);

export default router;
