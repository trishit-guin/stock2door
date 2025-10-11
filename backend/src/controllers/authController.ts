import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User, { UserRole } from '../models/User';
import { signToken } from '../services/jwt';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Input validation (additional to express-validator)
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Validate role
    if (!Object.values(UserRole).includes(role as UserRole)) {
      return res.status(400).json({ error: 'Invalid role specified.' });
    }

    // Check for duplicate email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    // Hash password
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Create user
    const user = await User.create({ 
      name, 
      email, 
      password: hashedPassword, 
      role: role as UserRole 
    });

    // Generate JWT token
    const token = signToken({ id: user._id, role: user.role });
    
    // Return user data and token
    res.status(201).json({
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role 
      },
      token,
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    
    // Handle MongoDB validation errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((error: any) => error.message);
      return res.status(400).json({ error: `Validation failed: ${messages.join(', ')}` });
    }
    
    res.status(500).json({ error: 'An error occurred during registration. Please try again.' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    // Input validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Check if user has a password (not OAuth user)
    if (!user.password) {
      return res.status(401).json({ error: 'Please login using Google OAuth or reset your password.' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Generate JWT token
    const token = signToken({ id: user._id, role: user.role });
    
    // Return user data and token
    res.json({
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role 
      },
      token,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'An error occurred during login. Please try again.' });
  }
};

export const googleAuth = async (req: Request, res: Response) => {
  res.json({ message: 'Google OAuth2.0 endpoint working' });
};

export const googleCallback = async (req: Request, res: Response) => {
  res.json({ message: 'Google OAuth2.0 callback working' });
}; 