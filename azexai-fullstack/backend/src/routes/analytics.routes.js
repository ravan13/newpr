const express = require('express');
const router = express.Router();
const { authMiddleware, requirePlus } = require('../middlewares/auth.middleware');
const calculationService = require('../services/calculation.service');
const { asyncHandler } = require('../middlewares/error.middleware');

// All analytics endpoints require Plus subscription

/**
 * Run scenario modeling
 * POST /api/v1/analytics/scenario
 */
router.post('/scenario', authMiddleware, requirePlus, asyncHandler(async (req, res) => {
  const { index, adjustments, timeframe } = req.body;

  if (!index) {
    return res.status(400).json({
      success: false,
      message: 'Index name is required'
    });
  }

  const result = await calculationService.runScenario({
    index,
    adjustments,
    timeframe
  });

  res.json({
    success: true,
    data: result
  });
}));

/**
 * Correlation analysis
 * POST /api/v1/analytics/correlation
 */
router.post('/correlation', authMiddleware, requirePlus, asyncHandler(async (req, res) => {
  const { index1, index2, period } = req.body;

  if (!index1 || !index2) {
    return res.status(400).json({
      success: false,
      message: 'Two index names are required'
    });
  }

  const result = await calculationService.analyzeCorrelation(index1, index2, period);

  res.json({
    success: true,
    data: result
  });
}));

module.exports = router;
