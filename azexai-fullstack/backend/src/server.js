require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const http = require('http');
const socketIo = require('socket.io');
const rateLimit = require('express-rate-limit');

// Import routes
const authRoutes = require('./routes/auth.routes');
const indexRoutes = require('./routes/index.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const alertRoutes = require('./routes/alert.routes');

// Import middlewares
const { errorMiddleware } = require('./middlewares/error.middleware');

// Import services
const calculationService = require('./services/calculation.service');

// Database
const db = require('./models');

// Initialize Express
const app = express();
const server = http.createServer(app);

// Socket.IO setup
const io = socketIo(server, {
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Make io accessible throughout the app
app.set('io', io);
global.io = io;

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api/', limiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/indices', indexRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/alerts', alertRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'AzexAI Platform API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/v1/auth',
      indices: '/api/v1/indices',
      analytics: '/api/v1/analytics',
      alerts: '/api/v1/alerts'
    },
    docs: '/api/docs'
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Error Handler
app.use(errorMiddleware);

// WebSocket Connection Handling
io.on('connection', (socket) => {
  console.log('✓ Client connected:', socket.id);

  // Subscribe to specific index updates
  socket.on('subscribe:index', (data) => {
    const indexName = data.index || data;
    socket.join(`index:${indexName}`);
    console.log(`✓ Client ${socket.id} subscribed to ${indexName}`);
    
    // Send current value immediately
    const indexService = require('./services/index.service');
    indexService.getCurrentValue(indexName).then(current => {
      if (current) {
        socket.emit('index:update', {
          index: indexName,
          value: parseFloat(current.value),
          timestamp: current.timestamp
        });
      }
    });
  });

  // Unsubscribe from index
  socket.on('unsubscribe:index', (data) => {
    const indexName = data.index || data;
    socket.leave(`index:${indexName}`);
    console.log(`✓ Client ${socket.id} unsubscribed from ${indexName}`);
  });

  // Subscribe to all indices
  socket.on('subscribe:all', () => {
    const indices = ['IIT-S', 'Zenith', 'Nexus', 'Synergy', 'Genesis'];
    indices.forEach(index => socket.join(`index:${index}`));
    console.log(`✓ Client ${socket.id} subscribed to all indices`);
  });

  // Disconnect handler
  socket.on('disconnect', () => {
    console.log('✗ Client disconnected:', socket.id);
  });

  // Error handler
  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

// Database sync and server start
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Sync database
    await db.sequelize.sync({ alter: false });
    console.log('✓ Database connected and synced');

    // Start periodic calculations
    calculationService.startPeriodicCalculation();
    console.log('✓ Index calculation engine started');

    // Start server
    server.listen(PORT, () => {
      console.log(`
╔═══════════════════════════════════════════════════╗
║                                                   ║
║         AZEXAI BACKEND API SERVER                ║
║                                                   ║
║   Status: Running                                ║
║   Port: ${PORT}                                     ║
║   Environment: ${process.env.NODE_ENV?.toUpperCase().padEnd(11)}                  ║
║   Database: Connected                            ║
║   WebSocket: Active                              ║
║                                                   ║
║   API: http://localhost:${PORT}/api/v1              ║
║   Docs: http://localhost:${PORT}/api/docs           ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    db.sequelize.close();
  });
});

startServer();

module.exports = { app, io, server };
