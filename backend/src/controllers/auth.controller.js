const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/response.utils');

const sendTokenResponse = (user, statusCode, res, message) => {
  const token = user.generateToken();
  user.password = undefined;

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  };

  res.cookie('token', token, cookieOptions);

  return successResponse(res, message, { user, token }, statusCode);
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone, organization, district } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 'User already exists with this email', 400);
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      phone,
      organization: role === 'contractor' ? organization : undefined,
      district,
    });

    return sendTokenResponse(user, 201, res, 'User registered successfully');
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

    if (!email || !password) {
      return errorResponse(res, 'Please provide email and password', 400);
    }

    // Build query - role is optional (unified login)
    const query = { email };
    if (role) query.role = role;

    const user = await User.findOne(query).select('+password');

    if (!user) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    if (!user.isActive) {
      return errorResponse(res, 'Account is deactivated', 403);
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    user.lastLogin = new Date();
    await user.save();

    return sendTokenResponse(user, 200, res, 'Login successful');
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
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });
    return successResponse(res, 'Logged out successfully');
  } catch (error) {
    return errorResponse(res, 'Logout failed', 500);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, district, organization } = req.body;
    const updateFields = {};
    if (name) updateFields.name = name;
    if (phone) updateFields.phone = phone;
    if (district) updateFields.district = district;
    if (organization && req.user.role === 'contractor') updateFields.organization = organization;

    const user = await User.findByIdAndUpdate(req.user.id, updateFields, {
      new: true,
      runValidators: true,
    });

    return successResponse(res, 'Profile updated successfully', { user });
  } catch (error) {
    console.error('Update profile error:', error);
    return errorResponse(res, 'Failed to update profile', 500);
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return errorResponse(res, 'Please provide current and new password', 400);
    }

    const user = await User.findById(req.user.id).select('+password');
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return errorResponse(res, 'Current password is incorrect', 401);
    }

    user.password = newPassword;
    await user.save();

    return sendTokenResponse(user, 200, res, 'Password changed successfully');
  } catch (error) {
    console.error('Change password error:', error);
    return errorResponse(res, 'Failed to change password', 500);
  }
};
