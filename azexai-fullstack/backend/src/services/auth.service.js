const bcrypt = require('bcryptjs');
const db = require('../models');
const { Op } = require('sequelize');

class AuthService {
  /**
   * Create new user
   */
  async createUser({ email, password, fullName }) {
    // Check if user already exists
    const existingUser = await db.User.findOne({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Validate password strength
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await db.User.create({
      email: email.toLowerCase(),
      passwordHash,
      fullName,
      role: 'user'
    });

    // Create basic subscription
    await db.Subscription.create({
      userId: user.id,
      planType: 'basic',
      status: 'active',
      startedAt: new Date()
    });

    return user;
  }

  /**
   * Validate user credentials
   */
  async validateCredentials(email, password) {
    const user = await db.User.findOne({
      where: { 
        email: email.toLowerCase(),
        isActive: true
      },
      include: [{
        model: db.Subscription,
        as: 'subscriptions',
        where: { status: 'active' },
        required: false
      }]
    });

    if (!user) {
      return null;
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return null;
    }

    // Update last login
    await user.update({ lastLoginAt: new Date() });

    return user;
  }

  /**
   * Get user by ID
   */
  async getUserById(userId) {
    return await db.User.findByPk(userId, {
      attributes: { exclude: ['passwordHash'] },
      include: [{
        model: db.Subscription,
        as: 'subscriptions',
        where: { status: 'active' },
        required: false
      }]
    });
  }

  /**
   * Update user password
   */
  async updatePassword(userId, oldPassword, newPassword) {
    const user = await db.User.findByPk(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    // Verify old password
    const isValid = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!isValid) {
      throw new Error('Current password is incorrect');
    }

    // Validate new password
    if (newPassword.length < 6) {
      throw new Error('New password must be at least 6 characters long');
    }

    // Hash and update
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await user.update({ passwordHash });

    return true;
  }

  /**
   * Update user profile
   */
  async updateProfile(userId, data) {
    const user = await db.User.findByPk(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    const allowedFields = ['fullName'];
    const updateData = {};

    allowedFields.forEach(field => {
      if (data[field] !== undefined) {
        updateData[field] = data[field];
      }
    });

    await user.update(updateData);
    return user;
  }
}

module.exports = new AuthService();
