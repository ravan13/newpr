const { Sequelize } = require('sequelize');

const dialect = process.env.DB_DIALECT || 'postgres';
const options = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  dialect: dialect,
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    underscored: true,
    timestamps: true
  }
};

if (dialect === 'sqlite') {
  options.storage = process.env.DB_STORAGE || './database.sqlite';
}

const sequelize = new Sequelize(
  process.env.DB_NAME || 'azexai',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'postgres',
  options
);

// Test connection
sequelize
  .authenticate()
  .then(() => {
    console.log('✓ Database connection established successfully');
  })
  .catch((err) => {
    console.error('✗ Unable to connect to database:', err.message);
  });

module.exports = sequelize;
