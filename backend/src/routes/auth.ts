import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectToDB } from '../db';

const router = express.Router();

const JWT_SECRET = 'your_secret_key'; // Replace with env in real projects

// POST /register
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required, including role.' });
  }

  if (!['mentor', 'mentee'].includes(role)) {
    return res.status(400).json({ message: 'Role must be either "mentor" or "mentee".' });
  }

  try {
    const db = await connectToDB();

    const existingUser = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.run(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role]
    );

    const token = jwt.sign({ email, role }, JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({
      message: `Welcome to Incumatch, ${name.split(' ')[0]}. Your ${role} account has been successfully created.`,
      token
    });

    console.log(`✅ ${name} registered as ${role} using ${email}`);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

export default router;
