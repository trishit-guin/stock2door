import express from 'express';
import { body, validationResult } from 'express-validator';
import { register, login, googleAuth, googleCallback } from '../controllers/authController';
import { AuthRequest, authenticateJWT } from '../middlewares/auth';

const router = express.Router();

// Validation middleware
const handleValidation = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// Email/password registration
router.post('/register', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').notEmpty().withMessage('Role is required'),
  handleValidation
], register);

// Email/password login
router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidation
], login);

// Google OAuth2.0
router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);

router.get('/me', authenticateJWT, (req, res) => {
  const user = (req as AuthRequest).user;
  res.json({ user });
});

export default router;