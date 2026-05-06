const express = require('express');
const router = express.Router();
const { validateLogin, validateRegister } = require('../validations/validation');
const AuthService = require('../services/authService');
const { authenticate } = require('../middleware/auth');

// POST /api/auth/register - Register new user
router.post('/register', validateRegister, async (req, res) => {
  try {
    const result = await AuthService.register(req.body);
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// POST /api/auth/login - Login user
router.post('/login', validateLogin, async (req, res) => {
  try {
    const result = await AuthService.login(req.body.email, req.body.password);
    res.json({
      success: true,
      message: 'Login successful',
      data: result
    });
  } catch (error) {
    console.error(error.message);
    res.status(401).json({
      success: false,
      message: error.message
    });
  }
});

// POST /api/auth/refresh - Refresh token
router.post('/refresh', authenticate, async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const result = await AuthService.refreshToken(token);
    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: result
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message
    });
  }
});
// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    const result = await AuthService.forgotPassword(email);

    res.json({
      success: true,
      message: 'Password reset link generated',
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// POST /api/auth/reset-password/:token
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { newPassword } = req.body;

    await AuthService.resetPassword(req.params.token, newPassword);

    res.json({
      success: true,
      message: 'Password reset successful'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});
module.exports = router;
