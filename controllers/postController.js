import Post from "../models/post.js";
import User from "../models/user.js";
// import { AddPostRequest } from "../requests/post/addPostRequest.js";
import uploadFile from "../utils/uploadFile.js";

/**
 *
 * Create post
 * 
 * @swagger
 * /post/create:
 *   post:
 *     tags:
 *       - Posts
 *     summary: Create a new post
 *     operationId: createPost
 *     consumes:
 *       - multipart/form-data
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File associated with the post
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               date_modified:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Success
 *       422:
 *         description: Unprocessable Entity
 *       401:
 *         description: Unauthenticated
 */

const createPost = async (req, res) => {
  try {
    const { name, description, date, date_modified } = req.body;
    // console.log("req.body:", req.body);
    // console.log("req.file:", req.file);

    // const folderName = 'posts'
    // const uploadedFile = await uploadFile(req.file, folderName)

    let file = null;
    if (req.file) {
      file = req.file.filename;
    }

    // check if the logged in user is admin
    const user = await User.findById(req.session.user.id);
    if (user.guard == 'admin') {
      const newPost = new Post({
        name,
        description,
        file,
        date,
        date_modified,
      });

      await newPost.save();
      res.status(201).json(newPost);
    } else {
      res.status(500).json({ error: 'Only admin has permission to create post' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 *
 * List posts
 * 
 * @swagger
 * /post/list:
 *   get:
 *     tags:
 *       - Posts
 *     summary: List posts
 *     operationId: listPosts
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Success
 *       422:
 *         description: Unprocessable Entity
 *       401:
 *         description: Unauthenticated
 */
const listPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json({
      status: true,
      message: 'Posts fetched successfully.',
      data: posts,
    });
  } catch (err) {
    res.status(422).json({
      status: false,
      message: 'Failed to fetch posts.',
      error: err.message,
    });
  }
};

/**
 *
 * Get post
 *
 * @swagger
 * /post/get:
 *   post:
 *     tags:
 *       - Posts
 *     summary: Get Post
 *     operationId: getPost
 *     produces:
 *       - application/json
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 *       422:
 *         description: Unprocessable Entity
 *       401:
 *         description: Unauthenticated
 */
const getPost = async (req, res) => {
  try {
    const { id } = req.body;
    const post = await Post.findById(id);
    if (post) {
      // const data = await OfferResponse.format(post)
      res.status(200).json({
        status: true,
        message: 'Post fetched successfully.',
        data: post,
      })
    } else {
      res.status(200).json({
        status: true,
        message: 'Failed to fetch post.',
        data: [],
      })
    }
  } catch (err) {
    res.status(422).json({
      status: false,
      message: 'Failed to get post.',
      error: err.message
    })
  }
};

/**
 *
 * Delete post
 *
 * @swagger
 * /post/delete:
 *   post:
 *     tags:
 *       - Posts
 *     summary: Delete Post
 *     operationId: deletePost
 *     produces:
 *       - application/json
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 *       422:
 *         description: Unprocessable Entity
 *       401:
 *         description: Unauthenticated
 */
const deletePost = async (req, res) => {
  try {
    const { id } = req.body;
    const post = await Post.findByIdAndDelete(id);
    if (post) {
      res.status(200).json({
        status: true,
        message: 'Post deleted successfully.',
        data: post,
      });
    } else {
      res.status(404).json({
        status: false,
        message: 'Post not found.',
      });
    }
  } catch (err) {
    res.status(422).json({
      status: false,
      message: 'Failed to delete post.',
      error: err.message,
    });
  }
};

// Post update

// exports.updatePost = async (req, res) => {
//   try {
//     const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     res.json(post);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

export { createPost, listPosts, getPost, deletePost };
