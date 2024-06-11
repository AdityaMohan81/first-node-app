import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';
import multer from 'multer';
import AddUserRequest from '../requests/user/addUserRequest.js';

const secret = process.env.JWT_SECRET;
const upload = multer();

/**
 * Login user using email
 *
 * @swagger
 * /login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login user
 *     operationId: login
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     requestBody:
 *       description: User Login
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Your email
 *               password:
 *                 type: string
 *                 description: Your password
 *     responses:
 *       200:
 *         description: Success
 *       422:
 *         description: Unprocessable Entity
 *       500:
 *         description: Internal Server Error
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    const token = generateToken(res, user._id);
    res.json({
      status: true,
      message: "Logged In Successful.",
      data: { user, token },
    });
  } else {
    res.json({
      status: false,
      message: "Invalid email or password.",
      data: [],
    });
  }
});

/**
 * @swagger
 * /logout:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Logout user
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
const logout = (req, res) => {
  // console.log("🚀 ~ logout ~ req.header:", req.header)
  if (req.user) {
    res.cookie('jwt', '', {
      httpOnly: true,
      expires: new Date(0),
    });
    res.json({
      status: true,
      message: 'Logged out successfully',
      data: [],
    });
  } else {
    res.json({
      status: false,
      message: 'User not found.',
      data: [],
    });
  }
};


/**
 * Register a new user
 *
 * @swagger
 * /register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register a new user
 *     operationId: register
 *     consumes:
 *       - multipart/form-data
 *     produces:
 *       - application/json
 *     requestBody:
 *       description: User Registration
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: user name
 *               email:
 *                 type: string
 *                 description: user email
 *               password:
 *                 type: string
 *                 description: user password
 *               confirm_password:
 *                 type: string
 *                 description: confirm user password
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
const registerUser = asyncHandler(async (req, res) => {
  try {
    const validatedData = await new AddUserRequest(req).validate();
    const { name, email, password } = validatedData;

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(422);
      throw 'User already exists';
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      const token = generateToken(res, user._id);
      res.status(201).json({
        status: true,
        message: 'User registered successfully.',
        data: { user, token },
      });
    } else {
      res.status(422);
      throw 'Invalid user data';
    }
  } catch (error) {
    console.log("🚀 ~ registerUser ~ error:", error)
    res.status(422).json({
      status: false,
      message: 'Failed to register user',
      error: error
    });
  }

});

export { login, logout, registerUser };
