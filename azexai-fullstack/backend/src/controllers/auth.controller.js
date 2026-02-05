const authService = require('../services/auth.service');
const { generateToken, generateRefreshToken } = require('../utils/jwt.util');
const { asyncHandler } = require('../middlewares/error.middleware');

class AuthController {
  /**
   * Register new user
   * POST /api/v1/auth/register
   */
  register = asyncHandler(async (req, res) => {
    const { email, password, fullName } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Create user
    const user = await authService.createUser({
      email,
      password,
      fullName
    });

    // Generate tokens
    const token = generateToken({
      userId: user.id,
      role: user.role
    });

    const refreshToken = generateRefreshToken({
      userId: user.id
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role
        },
        token,
        refreshToken
      }
    });
  });

  /**
   * Login user
   * POST /api/v1/auth/login
   */
  login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Validate credentials
    const user = await authService.validateCredentials(email, password);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Get subscription info
    const subscription = user.subscriptions && user.subscriptions.length > 0 
      ? user.subscriptions[0] 
      : null;

    // Generate tokens
    const token = generateToken({
      userId: user.id,
      role: user.role
    });

    const refreshToken = generateRefreshToken({
      userId: user.id
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          subscription: subscription ? {
            plan: subscription.planType,
            status: subscription.status
          } : null
        },
        token,
        refreshToken
      }
    });
  });

  /**
   * Get current user profile
   * GET /api/v1/auth/me
   */
  getProfile = asyncHandler(async (req, res) => {
    const user = await authService.getUserById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const subscription = user.subscriptions && user.subscriptions.length > 0 
      ? user.subscriptions[0] 
      : null;

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        isActive: user.isActive,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
        subscription: subscription ? {
          plan: subscription.planType,
          status: subscription.status,
          startedAt: subscription.startedAt,
          expiresAt: subscription.expiresAt
        } : null
      }
    });
  });

  /**
   * Update user profile
   * PUT /api/v1/auth/profile
   */
  updateProfile = asyncHandler(async (req, res) => {
    const { fullName } = req.body;

    const user = await authService.updateProfile(req.userId, {
      fullName
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      }
    });
  });

  /**
   * Change password
   * POST /api/v1/auth/change-password
   */
  changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Old password and new password are required'
      });
    }

    await authService.updatePassword(req.userId, oldPassword, newPassword);

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  });

  /**
   * Logout user (client-side token deletion)
   * POST /api/v1/auth/logout
   */
  logout = asyncHandler(async (req, res) => {
    // In a JWT system, logout is typically handled client-side
    // by deleting the token. Here we just confirm the action.
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  });
}

module.exports = new AuthController();
