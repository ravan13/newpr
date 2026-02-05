const express = require('express');
const router = express.Router();
const indexController = require('../controllers/index.controller');
const { authMiddleware, optionalAuth } = require('../middlewares/auth.middleware');

// Public routes
router.get('/', indexController.getAll);
router.get('/:name', indexController.getOne);
router.get('/:name/stats', indexController.getStatistics);

// Protected routes (require authentication)
router.get('/:name/history', authMiddleware, indexController.getHistory);
router.post('/compare', authMiddleware, indexController.compare);

module.exports = router;
