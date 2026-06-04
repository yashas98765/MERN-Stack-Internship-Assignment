const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';


// Register
router.post(
  '/register',
  [body('name').notEmpty(), body('email').isEmail(), body('password').isLength({ min: 6 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ message: 'Invalid input', errors: errors.array() });
    const { name, email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ message: 'User already exists' });

      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);
      user = new User({ name, email, password: hashed, isVerified: false });
      await user.save();

      // create verification token
      const payload = { user: { id: user.id }, type: 'verify' };
      const token = jwt.sign(payload, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
      const verifyLink = `${CLIENT_URL}/verify?token=${token}`;

      res.json({ token, verifyLink, user: { id: user.id, name: user.name, email: user.email } });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Please enter all fields' });
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    if (!user.isVerified) {
      // send a verification token in response for demo purposes
      const payload = { user: { id: user.id }, type: 'verify' };
      const token = jwt.sign(payload, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
      const verifyLink = `${CLIENT_URL}/verify?token=${token}`;
      return res.status(403).json({ message: 'Email not verified', verifyLink });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Verify email
router.post('/verify', async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ message: 'Token required' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
    if (decoded.type !== 'verify') return res.status(400).json({ message: 'Invalid token' });
    const user = await User.findById(decoded.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isVerified = true;
    await user.save();
    res.json({ message: 'Email verified' });
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ message: 'Invalid or expired token' });
  }
});

// Forgot password - generate reset token
router.post('/forgot', [body('email').isEmail()], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ message: 'Invalid input', errors: errors.array() });
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(200).json({ message: 'If the email exists, a reset link will be sent' });
    const payload = { user: { id: user.id }, type: 'reset' };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'devsecret', { expiresIn: '1h' });
    const resetLink = `${CLIENT_URL}/reset?token=${token}`;
    // In a real app we would email the resetLink. For this assignment we return it in the response for demo.
    return res.json({ message: 'Reset link generated', resetLink });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Reset password
router.post('/reset', [body('token').notEmpty(), body('password').isLength({ min: 6 })], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ message: 'Invalid input', errors: errors.array() });
  const { token, password } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
    if (decoded.type !== 'reset') return res.status(400).json({ message: 'Invalid token' });
    const user = await User.findById(decoded.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ message: 'Invalid or expired token' });
  }
});

module.exports = router;
