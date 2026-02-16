const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  logout,
} = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const {
  validateRegister,
  validateLogin,
} = require('../validators/auth.validator');

// Public routes
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

// Protected routes
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

module.exports = router;
