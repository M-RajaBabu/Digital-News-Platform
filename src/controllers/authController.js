const { User } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (user) => {
  return jwt.sign(
    { userId: user.id, email: user.email, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

exports.register = async (req, res, next) => {
  try {
    const { email, username, password, firstName, lastName, dateOfBirth, phone, location } = req.body;
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: 'Email already registered', status: 400 });
    }
    const user = await User.create({ email, username, password, firstName, lastName, dateOfBirth, phone, location });
    const token = generateToken(user);
    res.status(201).json({ token, user: { ...user.toJSON(), password: undefined } });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials', status: 401 });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials', status: 401 });
    }
    const token = generateToken(user);
    user.lastLoginAt = new Date();
    await user.save();
    res.json({ token, user: { ...user.toJSON(), password: undefined } });
  } catch (err) {
    res.status(500).json({ error: 'Login failed', message: err.message, status: 500 });
  }
};

exports.socialLogin = async (req, res) => {
  try {
    const { idToken } = req.body;
    const ticket = await client.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    let user = await User.findOne({ where: { googleId: payload.sub } });
    if (!user) {
      user = await User.create({
        email: payload.email,
        username: payload.email.split('@')[0],
        firstName: payload.given_name,
        lastName: payload.family_name,
        avatar: payload.picture,
        googleId: payload.sub,
        isVerified: true
      });
    }
    const token = generateToken(user);
    user.lastLoginAt = new Date();
    await user.save();
    res.json({ token, user: { ...user.toJSON(), password: undefined } });
  } catch (err) {
    res.status(500).json({ error: 'Google login failed', message: err.message, status: 500 });
  }
}; 