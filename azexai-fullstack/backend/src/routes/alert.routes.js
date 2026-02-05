const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/auth.middleware');
const { asyncHandler } = require('../middlewares/error.middleware');
const db = require('../models');

// All alert endpoints require authentication

/**
 * Get user's alerts
 * GET /api/v1/alerts
 */
router.get('/', authMiddleware, asyncHandler(async (req, res) => {
  const alerts = await db.Alert.findAll({
    where: { userId: req.userId },
    order: [['createdAt', 'DESC']]
  });

  res.json({
    success: true,
    data: alerts
  });
}));

/**
 * Create new alert
 * POST /api/v1/alerts
 */
router.post('/', authMiddleware, asyncHandler(async (req, res) => {
  const { indexName, alertType, targetValue } = req.body;

  if (!indexName || !alertType || !targetValue) {
    return res.status(400).json({
      success: false,
      message: 'indexName, alertType, and targetValue are required'
    });
  }

  const alert = await db.Alert.create({
    userId: req.userId,
    indexName,
    alertType,
    targetValue,
    isActive: true
  });

  res.status(201).json({
    success: true,
    message: 'Alert created successfully',
    data: alert
  });
}));

/**
 * Update alert
 * PUT /api/v1/alerts/:id
 */
router.put('/:id', authMiddleware, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { targetValue, isActive } = req.body;

  const alert = await db.Alert.findOne({
    where: { id, userId: req.userId }
  });

  if (!alert) {
    return res.status(404).json({
      success: false,
      message: 'Alert not found'
    });
  }

  await alert.update({
    targetValue: targetValue !== undefined ? targetValue : alert.targetValue,
    isActive: isActive !== undefined ? isActive : alert.isActive
  });

  res.json({
    success: true,
    message: 'Alert updated successfully',
    data: alert
  });
}));

/**
 * Delete alert
 * DELETE /api/v1/alerts/:id
 */
router.delete('/:id', authMiddleware, asyncHandler(async (req, res) => {
  const { id } = req.params;

  const alert = await db.Alert.findOne({
    where: { id, userId: req.userId }
  });

  if (!alert) {
    return res.status(404).json({
      success: false,
      message: 'Alert not found'
    });
  }

  await alert.destroy();

  res.json({
    success: true,
    message: 'Alert deleted successfully'
  });
}));

module.exports = router;
