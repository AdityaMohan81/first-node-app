import express from 'express';
import { login, logout, registerUser } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { loginValidation } from '../requests/auth/loginRequest.js';
import multer from 'multer';

const router = express.Router();
const upload = multer();

router.post('/login', loginValidation, login);
router.post('/register', upload.none(), registerUser);
router.post('/logout', protect, logout);

export default router;
