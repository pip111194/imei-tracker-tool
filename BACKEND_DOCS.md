# 🔧 IMEI Tracker Tool - Backend Documentation

Complete technical documentation for the backend API server.

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [API Reference](#api-reference)
6. [Database Schema](#database-schema)
7. [Security](#security)
8. [Deployment](#deployment)
9. [Testing](#testing)
10. [Troubleshooting](#troubleshooting)

---

## 🏗️ Architecture Overview

```
┌─────────────────┐
│   Frontend      │
│  (HTML/CSS/JS)  │
└────────┬────────┘
         │ HTTP/HTTPS
         ▼
┌─────────────────┐
│   API Server    │
│   (Express.js)  │
├─────────────────┤
│ • Rate Limiter  │
│ • CORS          │
│ • Validation    │
│ • TAC Database  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  External APIs  │
│ (Future: GSMA,  │
│  Manufacturer)  │
└─────────────────┘
```

### Components

1. **Express Server** - Main HTTP server
2. **Middleware Layer** - CORS, rate limiting, validation
3. **Business Logic** - IMEI validation, TAC lookup
4. **TAC Database** - In-memory manufacturer database
5. **API Routes** - RESTful endpoints

---

## 💻 Technology Stack

### Core
- **Node.js** v16+ - JavaScript runtime
- **Express.js** v4.18+ - Web framework

### Dependencies
```json
{
  "express": "^4.18.2",        // Web framework
  "cors": "^2.8.5",            // Cross-origin requests
  "axios": "^1.6.0",           // HTTP client
  "express-rate-limit": "^7.1.5", // Rate limiting
  "dotenv": "^16.3.1",         // Environment variables
  "helmet": "^7.1.0",          // Security headers
  "morgan": "^1.10.0"          // HTTP logging
}
```

### Dev Dependencies
```json
{
  "nodemon": "^3.0.2",         // Auto-restart
  "jest": "^29.7.0"            // Testing framework
}
```

---

## 📦 Installation

### Prerequisites
- Node.js v16 or higher
- npm v8 or higher
- Git

### Local Setup

```bash
# Clone repository
git clone https://github.com/pip111194/imei-tracker-tool.git
cd imei-tracker-tool

# Install dependencies
cd api
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

### Production Setup

```bash
# Install production dependencies only
npm install --production

# Start server
npm start
```

---

## ⚙️ Configuration

### Environment Variables

Create `.env` file in `api/` directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=production
HOST=0.0.0.0

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ORIGIN=*
CORS_METHODS=GET,POST,PUT,DELETE

# Logging
LOG_LEVEL=info
LOG_FORMAT=combined

# Security
HELMET_ENABLED=true
TRUST_PROXY=false

# External APIs (Future)
GSMA_API_KEY=your_api_key_here
MANUFACTURER_API_KEY=your_api_key_here
```

### Server Configuration

Edit `api/server.js`:

```javascript
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

// Rate limiting configuration
const limiter = rateLimit({
    windowMs: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000,
    max: process.env.RATE_LIMIT_MAX_REQUESTS || 100,
    message: 'Too many requests from this IP'
});
```

---

## 📡 API Reference

### Base URL
```
http://localhost:3000/api
```

### Authentication
Currently no authentication required. For production, implement:
- API Keys
- JWT Tokens
- OAuth 2.0

### Rate Limiting
- **Window**: 15 minutes
- **Max Requests**: 100 per IP
- **Response**: 429 Too Many Requests

---

### Endpoints

#### 1. Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-11-20T09:40:00.000Z"
}
```

---

#### 2. Validate IMEI
```http
POST /api/validate
Content-Type: application/json
```

**Request Body:**
```json
{
  "imei": "357174051234567"
}
```

**Response (Success):**
```json
{
  "imei": "357174051234567",
  "valid": true,
  "message": "Valid IMEI"
}
```

**Response (Error):**
```json
{
  "imei": "123456789012345",
  "valid": false,
  "message": "Invalid IMEI"
}
```

**Validation Rules:**
- Must be exactly 15 digits
- Must pass Luhn algorithm check
- Only numeric characters allowed

---

#### 3. Track IMEI (Advanced)
```http
POST /api/track
Content-Type: application/json
```

**Request Body:**
```json
{
  "imei": "357174051234567"
}
```

**Response:**
```json
{
  "imei": "357174051234567",
  "valid": true,
  "components": {
    "tac": "35717405",
    "fac": "35",
    "serialNumber": "123456",
    "checkDigit": "7"
  },
  "device": {
    "manufacturer": "Apple",
    "model": "iPhone 6",
    "year": 2014,
    "os": "iOS"
  },
  "status": {
    "stolen": false,
    "blacklisted": false,
    "warranty": {
      "status": "Expired",
      "expiryDate": "2015-12-31",
      "remainingDays": 0
    }
  },
  "timestamp": "2024-11-20T09:40:00.000Z"
}
```

**Error Responses:**
```json
// Missing IMEI
{
  "error": "IMEI is required"
}

// Invalid format
{
  "error": "IMEI must be 15 digits"
}

// Invalid checksum
{
  "error": "Invalid IMEI number"
}
```

---

#### 4. Batch Validate
```http
POST /api/batch-validate
Content-Type: application/json
```

**Request Body:**
```json
{
  "imeis": [
    "357174051234567",
    "358240051234568",
    "359070051234569"
  ]
}
```

**Response:**
```json
{
  "total": 3,
  "valid": 3,
  "invalid": 0,
  "results": [
    {
      "imei": "357174051234567",
      "valid": true,
      "manufacturer": "Apple",
      "model": "iPhone 6"
    },
    {
      "imei": "358240051234568",
      "valid": true,
      "manufacturer": "Samsung",
      "model": "Galaxy S20"
    },
    {
      "imei": "359070051234569",
      "valid": true,
      "manufacturer": "Apple",
      "model": "iPhone 11"
    }
  ]
}
```

**Limits:**
- Maximum 50 IMEIs per request
- Each IMEI validated independently

---

#### 5. Device History
```http
GET /api/history/:imei
```

**Example:**
```http
GET /api/history/357174051234567
```

**Response:**
```json
{
  "imei": "357174051234567",
  "history": [
    {
      "date": "2024-01-15",
      "event": "Device Activated",
      "location": "New Delhi, India",
      "carrier": "Airtel"
    },
    {
      "date": "2024-06-20",
      "event": "SIM Changed",
      "location": "Mumbai, India",
      "carrier": "Jio"
    },
    {
      "date": "2024-11-20",
      "event": "IMEI Checked",
      "location": "Current Location",
      "carrier": "Jio"
    }
  ],
  "totalEvents": 3
}
```

**Note:** Currently returns mock data. Integrate with real database for production.

---

#### 6. Carrier Lock Status
```http
GET /api/carrier-lock/:imei
```

**Example:**
```http
GET /api/carrier-lock/357174051234567
```

**Response:**
```json
{
  "imei": "357174051234567",
  "locked": false,
  "carrier": "Unlocked",
  "simLockStatus": "Factory Unlocked",
  "canUnlock": true
}
```

---

#### 7. TAC Lookup
```http
GET /api/tac/:tac
```

**Example:**
```http
GET /api/tac/35717405
```

**Response:**
```json
{
  "tac": "35717405",
  "manufacturer": "Apple",
  "model": "iPhone 6",
  "year": 2014,
  "os": "iOS"
}
```

---

#### 8. API Statistics
```http
GET /api/stats
```

**Response:**
```json
{
  "totalTACRecords": 23,
  "supportedManufacturers": [
    "Apple",
    "Samsung",
    "Xiaomi",
    "OnePlus",
    "Google"
  ],
  "apiVersion": "2.0",
  "uptime": 3600
}
```

---

## 🗄️ Database Schema

### TAC Database Structure

```javascript
const tacDatabase = {
  'TAC_CODE': {
    manufacturer: 'String',  // Device manufacturer
    model: 'String',         // Device model
    year: Number,            // Release year
    os: 'String'            // Operating system
  }
}
```

### Example Entry
```javascript
'35717405': {
  manufacturer: 'Apple',
  model: 'iPhone 6',
  year: 2014,
  os: 'iOS'
}
```

### Adding New TAC Entries

Edit `api/server.js`:

```javascript
const tacDatabase = {
    // Existing entries...
    
    // Add new entry
    '12345678': {
        manufacturer: 'YourBrand',
        model: 'Model Name',
        year: 2024,
        os: 'Android'
    }
};
```

---

## 🔐 Security

### Implemented Security Features

1. **CORS Protection**
```javascript
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
```

2. **Rate Limiting**
```javascript
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use('/api/', limiter);
```

3. **Input Validation**
```javascript
// IMEI format validation
if (!/^\d{15}$/.test(imei)) {
    return res.status(400).json({ error: 'Invalid format' });
}

// Luhn algorithm validation
if (!validateIMEI(imei)) {
    return res.status(400).json({ error: 'Invalid IMEI' });
}
```

4. **Error Handling**
```javascript
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
});
```

### Recommended Security Enhancements

1. **Add Helmet.js**
```javascript
const helmet = require('helmet');
app.use(helmet());
```

2. **Implement API Keys**
```javascript
const apiKeyAuth = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || apiKey !== process.env.API_KEY) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
};

app.use('/api/', apiKeyAuth);
```

3. **Add HTTPS**
```javascript
const https = require('https');
const fs = require('fs');

const options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
};

https.createServer(options, app).listen(443);
```

4. **Implement JWT Authentication**
```javascript
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ error: 'No token' });
    
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Invalid token' });
        req.userId = decoded.id;
        next();
    });
};
```

---

## 🚀 Deployment

### Termux (Android)
See [TERMUX_SETUP.md](TERMUX_SETUP.md)

### Heroku
```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create imei-tracker-api

# Deploy
git push heroku main

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set PORT=3000
```

### Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Docker
```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY api/package*.json ./
RUN npm install --production

COPY api/ ./

EXPOSE 3000

CMD ["node", "server.js"]
```

```bash
# Build image
docker build -t imei-tracker-api .

# Run container
docker run -p 3000:3000 imei-tracker-api
```

### AWS EC2
```bash
# SSH into EC2
ssh -i key.pem ubuntu@your-ec2-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone and setup
git clone https://github.com/pip111194/imei-tracker-tool.git
cd imei-tracker-tool/api
npm install --production

# Install PM2
sudo npm install -g pm2

# Start with PM2
pm2 start server.js --name imei-tracker
pm2 startup
pm2 save
```

---

## 🧪 Testing

### Manual Testing

```bash
# Health check
curl http://localhost:3000/api/health

# Validate IMEI
curl -X POST http://localhost:3000/api/validate \
  -H "Content-Type: application/json" \
  -d '{"imei":"357174051234567"}'

# Track IMEI
curl -X POST http://localhost:3000/api/track \
  -H "Content-Type: application/json" \
  -d '{"imei":"357174051234567"}'
```

### Automated Testing (Jest)

Create `api/tests/server.test.js`:

```javascript
const request = require('supertest');
const app = require('../server');

describe('IMEI Tracker API', () => {
    test('Health check', async () => {
        const res = await request(app).get('/api/health');
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('OK');
    });

    test('Validate valid IMEI', async () => {
        const res = await request(app)
            .post('/api/validate')
            .send({ imei: '357174051234567' });
        expect(res.statusCode).toBe(200);
        expect(res.body.valid).toBe(true);
    });

    test('Reject invalid IMEI', async () => {
        const res = await request(app)
            .post('/api/validate')
            .send({ imei: '123456789012345' });
        expect(res.body.valid).toBe(false);
    });
});
```

Run tests:
```bash
npm test
```

---

## 🐛 Troubleshooting

### Common Issues

**1. Port Already in Use**
```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port
PORT=3001 node server.js
```

**2. Module Not Found**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**3. CORS Errors**
```javascript
// Update CORS configuration
app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true
}));
```

**4. Rate Limit Issues**
```javascript
// Increase rate limit for development
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000 // Increased
});
```

---

## 📊 Performance Optimization

### 1. Enable Compression
```javascript
const compression = require('compression');
app.use(compression());
```

### 2. Add Caching
```javascript
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 });

app.post('/api/track', (req, res) => {
    const { imei } = req.body;
    const cached = cache.get(imei);
    
    if (cached) {
        return res.json(cached);
    }
    
    // Process and cache result
    const result = processIMEI(imei);
    cache.set(imei, result);
    res.json(result);
});
```

### 3. Database Connection Pooling
```javascript
// For future database integration
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'imei_tracker'
});
```

---

## 📝 Changelog

### Version 2.0.0 (Current)
- ✅ Advanced IMEI tracking
- ✅ Batch validation
- ✅ Device history
- ✅ Carrier lock status
- ✅ TAC database lookup
- ✅ Rate limiting
- ✅ CORS support

### Version 1.0.0
- ✅ Basic IMEI validation
- ✅ Simple frontend
- ✅ TAC database

---

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 📄 License

MIT License - See [LICENSE](LICENSE)

---

**Backend Documentation v2.0**