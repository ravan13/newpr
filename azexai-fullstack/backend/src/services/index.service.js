const db = require('../models');
const redis = require('../config/redis');
const { Op } = require('sequelize');

class IndexService {
  /**
   * Get current value of an index
   */
  async getCurrentValue(indexName) {
    try {
      // Try cache first
      const cacheKey = `index:${indexName}:current`;
      let cached = null;
      
      try {
        if (redis.isReady) {
          cached = await redis.get(cacheKey);
        }
      } catch (cacheError) {
        // Silently ignore cache errors
        console.warn(`Cache error for ${indexName}:`, cacheError.message);
      }
      
      if (cached) {
        return JSON.parse(cached);
      }

      // Get from database
      const latest = await db.IndexData.findOne({
        where: { indexName },
        order: [['timestamp', 'DESC']]
      });

      if (latest && redis.isReady) {
        // Cache for 30 seconds
        try {
          await redis.setEx(cacheKey, 30, JSON.stringify(latest));
        } catch (cacheError) {
          console.warn(`Cache set error for ${indexName}:`, cacheError.message);
        }
      }

      return latest;
    } catch (error) {
      console.error('Error getting current value:', error);
      throw error;
    }
  }

  /**
   * Get all current indices
   */
  async getAllIndices() {
    const indices = ['IIT-S', 'Zenith', 'Nexus', 'Synergy', 'Genesis'];
    const results = await Promise.all(
      indices.map(name => this.getCurrentValue(name))
    );

    return indices.map((name, i) => ({
      name,
      value: results[i]?.value ? parseFloat(results[i].value) : null,
      change: results[i]?.change ? parseFloat(results[i].change) : null,
      changePercent: results[i]?.changePercent ? parseFloat(results[i].changePercent) : null,
      timestamp: results[i]?.timestamp || null,
      status: results[i] ? 'ACTIVE' : 'INACTIVE'
    }));
  }

  /**
   * Get historical data for an index
   */
  async getHistory(indexName, options = {}) {
    const {
      limit = 100,
      startDate = null,
      endDate = null,
      interval = 'all' // all, hourly, daily
    } = options;

    const where = { indexName };

    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) where.timestamp[Op.gte] = new Date(startDate);
      if (endDate) where.timestamp[Op.lte] = new Date(endDate);
    }

    const history = await db.IndexData.findAll({
      where,
      order: [['timestamp', 'DESC']],
      limit: parseInt(limit),
      attributes: ['id', 'value', 'change', 'changePercent', 'timestamp', 'metadata']
    });

    return history.map(item => ({
      value: parseFloat(item.value),
      change: parseFloat(item.change || 0),
      changePercent: parseFloat(item.changePercent || 0),
      timestamp: item.timestamp,
      metadata: item.metadata
    }));
  }

  /**
   * Get statistics for an index
   */
  async getStatistics(indexName, period = '24h') {
    const now = new Date();
    let startDate;

    switch (period) {
      case '1h':
        startDate = new Date(now - 60 * 60 * 1000);
        break;
      case '24h':
        startDate = new Date(now - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now - 24 * 60 * 60 * 1000);
    }

    const data = await db.IndexData.findAll({
      where: {
        indexName,
        timestamp: {
          [Op.gte]: startDate
        }
      },
      order: [['timestamp', 'ASC']],
      attributes: ['value', 'timestamp']
    });

    if (data.length === 0) {
      return null;
    }

    const values = data.map(d => parseFloat(d.value));
    const current = values[values.length - 1];
    const high = Math.max(...values);
    const low = Math.min(...values);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const open = values[0];

    return {
      current,
      high,
      low,
      avg,
      open,
      change: current - open,
      changePercent: ((current - open) / open) * 100,
      period,
      dataPoints: data.length,
      startDate,
      endDate: now
    };
  }

  /**
   * Save new index value
   */
  async saveIndexValue(indexName, value, metadata = {}) {
    try {
      // Get previous value for change calculation
      const previous = await this.getCurrentValue(indexName);
      
      let change = 0;
      let changePercent = 0;

      if (previous) {
        const prevValue = parseFloat(previous.value);
        change = value - prevValue;
        changePercent = (change / prevValue) * 100;
      }

      // Save to database
      const indexData = await db.IndexData.create({
        indexName,
        value: parseFloat(value.toFixed(2)),
        change: parseFloat(change.toFixed(2)),
        changePercent: parseFloat(changePercent.toFixed(2)),
        metadata,
        timestamp: new Date()
      });

      // Clear cache
      const cacheKey = `index:${indexName}:current`;
      try {
        if (redis.isOpen) {
          await redis.del(cacheKey);
        }
      } catch (cacheError) {
        // Silently ignore cache errors
        console.warn(`Cache clear error for ${indexName}:`, cacheError.message);
      }

      return indexData;
    } catch (error) {
      console.error('Error saving index value:', error);
      throw error;
    }
  }

  /**
   * Compare multiple indices
   */
  async compareIndices(indexNames, period = '24h') {
    const comparisons = await Promise.all(
      indexNames.map(async (name) => {
        const stats = await this.getStatistics(name, period);
        return {
          name,
          ...stats
        };
      })
    );

    return comparisons;
  }
}

module.exports = new IndexService();
