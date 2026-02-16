const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/response.utils');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 'User already exists with this email', 400);
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
      phone,
    });

    // Generate token
    const token = user.generateToken();

    // Remove password from response
    user.password = undefined;

    return successResponse(
      res,
      'User registered successfully',
      {
        user,
        token,
      },
      201
    );
  } catch (error) {
    console.error('Registration error:', error);
    return errorResponse(res, 'Registration failed', 500);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Validate input
    if (!email || !password || !role) {
      return errorResponse(
        res,
        'Please provide email, password, and role',
        400
      );
    }

    // Find user and include password
    const user = await User.findOne({ email, role }).select('+password');

    if (!user) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    // Check if user is active
    if (!user.isActive) {
      return errorResponse(res, 'Account is deactivated', 403);
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = user.generateToken();

    // Remove password from response
    user.password = undefined;

    return successResponse(res, 'Login successful', {
      user,
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    return errorResponse(res, 'Login failed', 500);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    return successResponse(res, 'User retrieved successfully', { user });
  } catch (error) {
    console.error('Get user error:', error);
    return errorResponse(res, 'Failed to get user', 500);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  try {
    return successResponse(res, 'Logged out successfully');
  } catch (error) {
    return errorResponse(res, 'Logout failed', 500);
  }
};
