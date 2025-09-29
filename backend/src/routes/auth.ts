import express from 'express';
import { body } from 'express-validator';
import { register, login, googleAuth, googleCallback } from '../controllers/authController';
import { AuthRequest, authenticateJWT } from '../middlewares/auth';

const router = express.Router();

// Email/password registration
router.post('/register', [
  body('name').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('role').notEmpty(),
], register);

// Email/password login
router.post('/login', [
  body('email').isEmail(),
  body('password').notEmpty(),
], login);

// Google OAuth2.0
router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);

router.get('/me', authenticateJWT, (req, res) => {
  const user = (req as AuthRequest).user;
  res.json({ user });
});

export default router;