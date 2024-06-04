import express from 'express';
import { getUser } from '../controllers/userController.js';
import { auth, admin, authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/get', authenticateUser, getUser);
// router.put('/:id', auth, admin, userController.updateUser);
// router.delete('/:id', auth, admin, userController.deleteUser);
// router.get('/', auth, admin, userController.listUsers);

export default router;
