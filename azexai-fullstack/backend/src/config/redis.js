const redis = require('redis');

const client = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    reconnectStrategy: (retries) => {
      if (retries > 5) {
        console.log('Redis reconnect limit reached, giving up.');
        return new Error('Redis connection failed');
      }
      return Math.min(retries * 50, 500);
    }
  },
  password: process.env.REDIS_PASSWORD || undefined
});

client.on('error', (err) => {
  // Only log if it's not a connection refused error which is expected locally without redis
  if (err.code !== 'ECONNREFUSED') {
    console.error('✗ Redis error:', err.message);
  }
});

client.on('connect', () => {
  console.log('✓ Redis connected');
});

client.on('ready', () => {
  console.log('✓ Redis ready');
});

(async () => {
  try {
    await client.connect();
  } catch (error) {
    // Soft fail - app can work without Redis
    console.log('ℹ Running without Redis (cache disabled)');
  }
})();

module.exports = client;
