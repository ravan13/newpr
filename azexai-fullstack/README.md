# 🚀 AZEXAI FULL-STACK APPLICATION
## Complete Frontend + Backend Implementation

---

## 📁 Project Structure

```
azexai-fullstack/
├── backend/                    # Node.js + Express API
│   ├── src/
│   │   ├── config/            # Database, Redis config
│   │   ├── controllers/       # Request handlers
│   │   ├── middlewares/       # Auth, error handling
│   │   ├── models/            # Sequelize models
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic
│   │   ├── utils/             # Helper functions
│   │   └── server.js          # Main entry point
│   ├── .env.example
│   ├── package.json
│   └── Dockerfile
├── frontend/                   # React Application
│   ├── public/
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API services
│   │   ├── context/           # React Context
│   │   ├── hooks/             # Custom hooks
│   │   ├── utils/             # Helper functions
│   │   └── App.js
│   └── package.json
└── docker-compose.yml         # Docker orchestration
```

---

## 🛠 Technology Stack

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** PostgreSQL 15
- **Cache:** Redis 7
- **ORM:** Sequelize
- **Auth:** JWT (jsonwebtoken)
- **WebSocket:** Socket.io
- **Security:** Helmet, CORS, Rate Limiting

### Frontend
- **Framework:** React 18
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **WebSocket:** Socket.io-client
- **Charts:** Recharts
- **Icons:** Lucide React
- **Notifications:** React Hot Toast

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL 15+ (or Docker)
- Redis 7+ (or Docker)
- npm or yarn

### Option 1: Docker (Recommended)

```bash
# Clone and navigate
cd azexai-fullstack

# Start all services with Docker
docker-compose up -d

# Backend will be available at http://localhost:5000
# Frontend can be served separately or added to docker-compose

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

### Option 2: Manual Setup

#### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
nano .env

# Start PostgreSQL and Redis (if not using Docker)
# Then start the backend
npm run dev

# Backend will start on http://localhost:5000
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
echo "REACT_APP_API_URL=http://localhost:5000/api/v1" > .env
echo "REACT_APP_WS_URL=ws://localhost:5000" >> .env

# Start development server
npm start

# Frontend will start on http://localhost:3000
```

---

## 📡 API Endpoints

### Authentication
```
POST   /api/v1/auth/register          # Register new user
POST   /api/v1/auth/login             # Login
GET    /api/v1/auth/me                # Get current user (Protected)
PUT    /api/v1/auth/profile           # Update profile (Protected)
POST   /api/v1/auth/change-password   # Change password (Protected)
POST   /api/v1/auth/logout            # Logout (Protected)
```

### Indices
```
GET    /api/v1/indices                # Get all indices
GET    /api/v1/indices/:name          # Get specific index
GET    /api/v1/indices/:name/stats    # Get index statistics
GET    /api/v1/indices/:name/history  # Get history (Protected)
POST   /api/v1/indices/compare        # Compare indices (Protected)
```

### Analytics (Plus Tier)
```
POST   /api/v1/analytics/scenario     # Run scenario modeling (Plus)
POST   /api/v1/analytics/correlation  # Correlation analysis (Plus)
```

### Alerts
```
GET    /api/v1/alerts                 # Get user alerts (Protected)
POST   /api/v1/alerts                 # Create alert (Protected)
PUT    /api/v1/alerts/:id             # Update alert (Protected)
DELETE /api/v1/alerts/:id             # Delete alert (Protected)
```

---

## 🔌 WebSocket Events

### Client → Server
```javascript
// Subscribe to index updates
socket.emit('subscribe:index', { index: 'IIT-S' });

// Subscribe to all indices
socket.emit('subscribe:all');

// Unsubscribe from index
socket.emit('unsubscribe:index', { index: 'IIT-S' });
```

### Server → Client
```javascript
// Receive index updates
socket.on('index:update', (data) => {
  console.log(data);
  // { index: 'IIT-S', value: 9.37, timestamp: '2026-02-05T...' }
});

// Alert triggered
socket.on('alert:triggered', (data) => {
  console.log(data);
  // { alertId, message, index, value }
});
```

---

## 📊 Database Schema

### Users Table
```sql
- id (UUID, PK)
- email (VARCHAR, UNIQUE)
- password_hash (VARCHAR)
- full_name (VARCHAR)
- role (ENUM: user, plus, admin)
- is_active (BOOLEAN)
- last_login_at (TIMESTAMP)
- created_at, updated_at
```

### Index Data Table
```sql
- id (BIGINT, PK)
- index_name (VARCHAR)
- value (DECIMAL)
- change (DECIMAL)
- change_percent (DECIMAL)
- metadata (JSONB)
- timestamp (TIMESTAMP)
- created_at, updated_at
```

### Subscriptions Table
```sql
- id (UUID, PK)
- user_id (UUID, FK → users)
- plan_type (ENUM: basic, plus)
- status (ENUM: active, expired, cancelled)
- started_at, expires_at
- created_at, updated_at
```

### Alerts Table
```sql
- id (UUID, PK)
- user_id (UUID, FK → users)
- index_name (VARCHAR)
- alert_type (ENUM: above, below, change)
- target_value (DECIMAL)
- is_active (BOOLEAN)
- last_triggered_at (TIMESTAMP)
- created_at, updated_at
```

---

## 🔐 Authentication Flow

1. **Register:** `POST /api/v1/auth/register`
   - Returns: `{ token, refreshToken, user }`

2. **Login:** `POST /api/v1/auth/login`
   - Returns: `{ token, refreshToken, user }`

3. **Use Token:** Include in headers
   ```
   Authorization: Bearer YOUR_JWT_TOKEN
   ```

4. **Token Expiry:** 
   - Access Token: 7 days (configurable)
   - Refresh Token: 30 days (configurable)

---

## 🧪 Testing the API

### Using cURL

```bash
# Register
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@azexai.com","password":"password123","fullName":"Test User"}'

# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@azexai.com","password":"password123"}'

# Get indices
curl http://localhost:5000/api/v1/indices

# Get specific index
curl http://localhost:5000/api/v1/indices/IIT-S

# Protected endpoint (use token from login)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/v1/auth/me
```

### Using JavaScript (Frontend)

```javascript
// Login
const response = await fetch('http://localhost:5000/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@azexai.com',
    password: 'password123'
  })
});

const { data } = await response.json();
const token = data.token;

// Make authenticated request
const userResponse = await fetch('http://localhost:5000/api/v1/auth/me', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

---

## 🎨 Frontend Features

### Pages
- **Landing Page** (`/`) - Corporate website
- **Dashboard** (`/dashboard`) - User dashboard with indices
- **Login** (`/login`) - Authentication
- **Register** (`/register`) - User registration
- **Analytics** (`/analytics`) - Advanced analytics (Plus)
- **Alerts** (`/alerts`) - Alert management
- **Profile** (`/profile`) - User profile

### Key Components
- **IndexCard** - Display individual index
- **IndexChart** - Recharts visualization
- **AlertModal** - Create/edit alerts
- **Navbar** - Navigation with auth state
- **ProtectedRoute** - Route guard for auth
- **WebSocketProvider** - Real-time data context

---

## 🔧 Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=azexai
DB_USER=postgres
DB_PASSWORD=your_password
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api/v1
REACT_APP_WS_URL=ws://localhost:5000
```

---

## 🚀 Deployment

### Backend Deployment (Example: AWS EC2)

```bash
# SSH to server
ssh user@your-server.com

# Clone repository
git clone your-repo-url
cd azexai-fullstack/backend

# Install dependencies
npm install --production

# Set environment variables
cp .env.example .env
nano .env  # Edit with production values

# Install PM2 for process management
npm install -g pm2

# Start with PM2
pm2 start src/server.js --name azexai-backend
pm2 save
pm2 startup

# View logs
pm2 logs azexai-backend
```

### Frontend Deployment (Example: Vercel/Netlify)

```bash
# Build for production
cd frontend
npm run build

# Deploy to Vercel
vercel --prod

# Or deploy to Netlify
netlify deploy --prod --dir=build
```

### Using Docker (Production)

```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  backend:
    build: ./backend
    environment:
      - NODE_ENV=production
      - PORT=5000
      # ... other production env vars
    restart: always

  frontend:
    build: ./frontend
    restart: always

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    restart: always
```

---

## 📈 Monitoring & Logging

### Backend Logs
```bash
# View Docker logs
docker-compose logs -f backend

# View PM2 logs
pm2 logs azexai-backend

# Application logs
# Logs are written to console and can be redirected to file
npm start > backend.log 2>&1
```

### Database Monitoring
```bash
# Connect to PostgreSQL
docker exec -it azexai-postgres psql -U postgres -d azexai

# Check table sizes
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## 🔒 Security Checklist

- [ ] Change `JWT_SECRET` to strong random value
- [ ] Use strong database passwords
- [ ] Enable HTTPS in production
- [ ] Set up rate limiting (already configured)
- [ ] Enable CORS only for trusted origins
- [ ] Use helmet for security headers
- [ ] Implement input validation
- [ ] Sanitize user inputs
- [ ] Keep dependencies updated
- [ ] Use environment variables for secrets
- [ ] Enable database backups
- [ ] Monitor for suspicious activity

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if ports are available
lsof -i :5000  # Backend port
lsof -i :5432  # PostgreSQL
lsof -i :6379  # Redis

# Check database connection
docker-compose logs postgres

# Check Redis connection
docker-compose logs redis
```

### Database connection failed
```bash
# Ensure PostgreSQL is running
docker-compose ps

# Test connection
docker exec -it azexai-postgres psql -U postgres -d azexai

# Check environment variables
cat backend/.env
```

### WebSocket not connecting
- Check CORS settings in backend
- Verify WebSocket URL in frontend
- Check firewall/security group rules
- Look for errors in browser console

---

## 📝 Development Tips

### Hot Reload
- Backend: Using `nodemon` (npm run dev)
- Frontend: React dev server auto-reloads

### Database Changes
```bash
# Reset database
docker-compose down -v
docker-compose up -d

# Or manually
docker exec -it azexai-postgres psql -U postgres -d azexai -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
```

### Adding New Features

1. **Backend:**
   - Add service in `src/services/`
   - Add controller in `src/controllers/`
   - Add route in `src/routes/`
   - Update `src/server.js` if needed

2. **Frontend:**
   - Add component in `src/components/`
   - Add page in `src/pages/`
   - Add route in `App.js`
   - Update API service if needed

---

## 📚 Additional Resources

- [Express.js Docs](https://expressjs.com/)
- [React Docs](https://react.dev/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Socket.io Docs](https://socket.io/docs/)
- [Sequelize Docs](https://sequelize.org/)

---

## 🤝 Support

For issues and questions:
- Check troubleshooting section
- Review API documentation
- Check Docker logs
- Review environment variables

---

## 📄 License

Proprietary - © AzexAI 2026. All rights reserved.

---

## ✅ Next Steps

1. ✅ Setup backend ← **YOU ARE HERE**
2. ⬜ Setup frontend
3. ⬜ Implement proprietary calculation logic
4. ⬜ Add payment integration (Stripe/PayPal)
5. ⬜ Deploy to production
6. ⬜ Set up monitoring & alerts

**Ready to start!** Run `docker-compose up -d` and your backend will be live! 🚀
