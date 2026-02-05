const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const db = {};

// ==================== USER MODEL ====================
db.User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'password_hash'
  },
  fullName: {
    type: DataTypes.STRING,
    field: 'full_name'
  },
  role: {
    type: DataTypes.ENUM('user', 'plus', 'admin'),
    defaultValue: 'user'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  },
  lastLoginAt: {
    type: DataTypes.DATE,
    field: 'last_login_at'
  }
}, {
  tableName: 'users',
  timestamps: true,
  underscored: true
});

// ==================== INDEX DATA MODEL ====================
db.IndexData = sequelize.define('IndexData', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  indexName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'index_name'
  },
  value: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  change: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  changePercent: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    field: 'change_percent'
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'index_data',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['index_name', 'timestamp']
    },
    {
      fields: ['timestamp']
    }
  ]
});

// ==================== SUBSCRIPTION MODEL ====================
db.Subscription = sequelize.define('Subscription', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  planType: {
    type: DataTypes.ENUM('basic', 'plus'),
    allowNull: false,
    field: 'plan_type'
  },
  status: {
    type: DataTypes.ENUM('active', 'expired', 'cancelled'),
    defaultValue: 'active'
  },
  startedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'started_at'
  },
  expiresAt: {
    type: DataTypes.DATE,
    field: 'expires_at'
  }
}, {
  tableName: 'subscriptions',
  timestamps: true,
  underscored: true
});

// ==================== ALERT MODEL ====================
db.Alert = sequelize.define('Alert', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  indexName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'index_name'
  },
  alertType: {
    type: DataTypes.ENUM('above', 'below', 'change'),
    allowNull: false,
    field: 'alert_type'
  },
  targetValue: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'target_value'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  },
  lastTriggeredAt: {
    type: DataTypes.DATE,
    field: 'last_triggered_at'
  }
}, {
  tableName: 'alerts',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['user_id', 'is_active']
    }
  ]
});

// ==================== USER QUERY MODEL ====================
db.UserQuery = sequelize.define('UserQuery', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  queryType: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'query_type'
  },
  queryParams: {
    type: DataTypes.JSONB,
    allowNull: false,
    field: 'query_params'
  },
  results: {
    type: DataTypes.JSONB
  },
  executionTimeMs: {
    type: DataTypes.INTEGER,
    field: 'execution_time_ms'
  }
}, {
  tableName: 'user_queries',
  timestamps: true,
  underscored: true
});

// ==================== ASSOCIATIONS ====================

// User <-> Subscription
db.User.hasMany(db.Subscription, {
  foreignKey: 'userId',
  as: 'subscriptions'
});
db.Subscription.belongsTo(db.User, {
  foreignKey: 'userId',
  as: 'user'
});

// User <-> Alert
db.User.hasMany(db.Alert, {
  foreignKey: 'userId',
  as: 'alerts'
});
db.Alert.belongsTo(db.User, {
  foreignKey: 'userId',
  as: 'user'
});

// User <-> UserQuery
db.User.hasMany(db.UserQuery, {
  foreignKey: 'userId',
  as: 'queries'
});
db.UserQuery.belongsTo(db.User, {
  foreignKey: 'userId',
  as: 'user'
});

// ==================== EXPORT ====================
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
