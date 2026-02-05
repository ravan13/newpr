const indexService = require('../services/index.service');
const { asyncHandler } = require('../middlewares/error.middleware');

class IndexController {
  /**
   * Get all indices
   * GET /api/v1/indices
   */
  getAll = asyncHandler(async (req, res) => {
    const indices = await indexService.getAllIndices();

    res.json({
      success: true,
      data: indices,
      timestamp: new Date()
    });
  });

  /**
   * Get specific index
   * GET /api/v1/indices/:name
   */
  getOne = asyncHandler(async (req, res) => {
    const { name } = req.params;

    const index = await indexService.getCurrentValue(name);

    if (!index) {
      return res.status(404).json({
        success: false,
        message: `Index '${name}' not found`
      });
    }

    res.json({
      success: true,
      data: {
        name: index.indexName,
        value: parseFloat(index.value),
        change: parseFloat(index.change || 0),
        changePercent: parseFloat(index.changePercent || 0),
        timestamp: index.timestamp,
        metadata: index.metadata
      }
    });
  });

  /**
   * Get index history
   * GET /api/v1/indices/:name/history
   */
  getHistory = asyncHandler(async (req, res) => {
    const { name } = req.params;
    const { limit, startDate, endDate, interval } = req.query;

    const history = await indexService.getHistory(name, {
      limit: limit ? parseInt(limit) : 100,
      startDate,
      endDate,
      interval
    });

    res.json({
      success: true,
      data: {
        index: name,
        history,
        count: history.length
      }
    });
  });

  /**
   * Get index statistics
   * GET /api/v1/indices/:name/stats
   */
  getStatistics = asyncHandler(async (req, res) => {
    const { name } = req.params;
    const { period } = req.query;

    const stats = await indexService.getStatistics(name, period || '24h');

    if (!stats) {
      return res.status(404).json({
        success: false,
        message: `No data available for index '${name}'`
      });
    }

    res.json({
      success: true,
      data: {
        index: name,
        ...stats
      }
    });
  });

  /**
   * Compare multiple indices
   * POST /api/v1/indices/compare
   */
  compare = asyncHandler(async (req, res) => {
    const { indices, period } = req.body;

    if (!indices || !Array.isArray(indices) || indices.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least 2 indices to compare'
      });
    }

    const comparison = await indexService.compareIndices(indices, period || '24h');

    res.json({
      success: true,
      data: {
        comparison,
        period: period || '24h'
      }
    });
  });
}

module.exports = new IndexController();
