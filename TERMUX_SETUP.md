# 📱 IMEI Tracker Tool - Termux Setup Guide

Complete guide to run IMEI Tracker Tool on Android using Termux.

## 🚀 Quick Start (5 Minutes)

### Step 1: Install Termux
Download from [F-Droid](https://f-droid.org/en/packages/com.termux/) (NOT Google Play Store)

### Step 2: Update Termux
```bash
pkg update && pkg upgrade -y
```

### Step 3: Install Required Packages
```bash
# Install Node.js and Git
pkg install nodejs git -y

# Verify installation
node --version
npm --version
git --version
```

### Step 4: Clone Repository
```bash
# Clone the project
git clone https://github.com/pip111194/imei-tracker-tool.git

# Navigate to project
cd imei-tracker-tool
```

### Step 5: Install Dependencies
```bash
# Go to API directory
cd api

# Install Node.js packages
npm install

# Go back to root
cd ..
```

### Step 6: Start Server
```bash
# Start the backend server
cd api
node server.js
```

You should see:
```
🚀 IMEI Tracker API Server running on port 3000
📡 API Endpoints:
   POST /api/validate - Basic IMEI validation
   POST /api/track - Advanced IMEI tracking
   ...
```

### Step 7: Access Frontend

**Option A: Using Termux (Recommended)**
```bash
# Open new Termux session (swipe from left, New Session)
cd imei-tracker-tool

# Install simple HTTP server
npm install -g http-server

# Start frontend server
http-server -p 8080
```

**Option B: Direct File Access**
Open `advanced-tracker.html` in your Android browser:
```
file:///storage/emulated/0/termux/imei-tracker-tool/advanced-tracker.html
```

### Step 8: Test the Tool

Open browser and go to:
- Frontend: `http://localhost:8080/advanced-tracker.html`
- API: `http://localhost:3000/api/health`

---

## 🔧 Complete Installation Commands

Copy-paste this entire block:

```bash
# Update Termux
pkg update && pkg upgrade -y

# Install dependencies
pkg install nodejs git -y

# Clone repository
cd ~
git clone https://github.com/pip111194/imei-tracker-tool.git
cd imei-tracker-tool

# Install backend dependencies
cd api
npm install
cd ..

# Install frontend server
npm install -g http-server

# Create startup script
cat > start.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting IMEI Tracker Tool..."
cd ~/imei-tracker-tool/api
node server.js &
cd ~/imei-tracker-tool
http-server -p 8080 &
echo "✅ Server started!"
echo "📱 Frontend: http://localhost:8080/advanced-tracker.html"
echo "🔌 API: http://localhost:3000/api"
EOF

chmod +x start.sh

echo "✅ Installation complete!"
echo "Run: ./start.sh to start the tool"
```

---

## 🎯 Usage

### Start the Tool
```bash
cd ~/imei-tracker-tool
./start.sh
```

### Stop the Tool
```bash
# Find and kill processes
pkill node
pkill http-server
```

### Test API Endpoints

**1. Health Check**
```bash
curl http://localhost:3000/api/health
```

**2. Validate IMEI**
```bash
curl -X POST http://localhost:3000/api/validate \
  -H "Content-Type: application/json" \
  -d '{"imei":"357174051234567"}'
```

**3. Track IMEI (Advanced)**
```bash
curl -X POST http://localhost:3000/api/track \
  -H "Content-Type: application/json" \
  -d '{"imei":"357174051234567"}'
```

**4. Batch Validation**
```bash
curl -X POST http://localhost:3000/api/batch-validate \
  -H "Content-Type: application/json" \
  -d '{"imeis":["357174051234567","358240051234568"]}'
```

**5. Device History**
```bash
curl http://localhost:3000/api/history/357174051234567
```

**6. Carrier Lock Status**
```bash
curl http://localhost:3000/api/carrier-lock/357174051234567
```

---

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Endpoints

#### 1. POST /api/validate
Basic IMEI validation using Luhn algorithm.

**Request:**
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
  "message": "Valid IMEI"
}
```

#### 2. POST /api/track
Advanced IMEI tracking with device info, security status, and warranty.

**Request:**
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

#### 3. POST /api/batch-validate
Validate multiple IMEIs at once (max 50).

**Request:**
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
    }
  ]
}
```

#### 4. GET /api/history/:imei
Get device usage history.

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
    }
  ],
  "totalEvents": 3
}
```

#### 5. GET /api/carrier-lock/:imei
Check carrier lock status.

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

#### 6. GET /api/tac/:tac
Lookup TAC database.

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

#### 7. GET /api/stats
API statistics.

**Response:**
```json
{
  "totalTACRecords": 23,
  "supportedManufacturers": ["Apple", "Samsung", "Xiaomi", ...],
  "apiVersion": "2.0",
  "uptime": 3600
}
```

---

## 🛠️ Troubleshooting

### Issue: Port Already in Use
```bash
# Kill existing processes
pkill node
pkill http-server

# Or use different ports
node server.js --port 3001
http-server -p 8081
```

### Issue: Permission Denied
```bash
# Grant storage permission
termux-setup-storage

# Make script executable
chmod +x start.sh
```

### Issue: Module Not Found
```bash
# Reinstall dependencies
cd ~/imei-tracker-tool/api
rm -rf node_modules package-lock.json
npm install
```

### Issue: Cannot Access Frontend
```bash
# Check if server is running
curl http://localhost:8080

# Restart frontend server
pkill http-server
http-server -p 8080
```

---

## 🔐 Security Best Practices

1. **Change Default Port** (Production)
```bash
PORT=8443 node server.js
```

2. **Add Environment Variables**
```bash
# Create .env file
cat > api/.env << EOF
PORT=3000
NODE_ENV=production
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
EOF
```

3. **Enable HTTPS** (Advanced)
```bash
pkg install openssl -y
# Generate SSL certificate
openssl req -nodes -new -x509 -keyout server.key -out server.cert
```

---

## 📦 Dependencies

### Backend (Node.js)
- `express` - Web framework
- `cors` - Cross-origin resource sharing
- `axios` - HTTP client
- `express-rate-limit` - Rate limiting
- `dotenv` - Environment variables
- `helmet` - Security headers
- `morgan` - HTTP logger

### Frontend
- Pure HTML/CSS/JavaScript
- No external dependencies
- Works offline

---

## 🚀 Advanced Features

### 1. Auto-Start on Termux Launch
```bash
# Add to ~/.bashrc
echo 'cd ~/imei-tracker-tool && ./start.sh' >> ~/.bashrc
```

### 2. Background Service
```bash
# Install termux-services
pkg install termux-services -y

# Create service
mkdir -p ~/.termux/boot
cat > ~/.termux/boot/imei-tracker << 'EOF'
#!/data/data/com.termux/files/usr/bin/bash
cd ~/imei-tracker-tool/api
node server.js &
EOF

chmod +x ~/.termux/boot/imei-tracker
```

### 3. Remote Access (Same WiFi)
```bash
# Get your local IP
ifconfig | grep inet

# Access from other devices
# http://YOUR_LOCAL_IP:3000/api
# http://YOUR_LOCAL_IP:8080/advanced-tracker.html
```

### 4. Custom TAC Database
Edit `api/server.js` and add your TAC entries:
```javascript
const tacDatabase = {
    '35717405': { 
        manufacturer: 'Apple', 
        model: 'iPhone 6', 
        year: 2014, 
        os: 'iOS' 
    },
    // Add more entries
};
```

---

## 📊 Performance Tips

1. **Increase Rate Limit**
```javascript
// In server.js
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500 // Increase from 100
});
```

2. **Enable Caching**
```bash
pkg install redis -y
# Add Redis caching to server.js
```

3. **Optimize for Low Memory**
```bash
# Limit Node.js memory
node --max-old-space-size=512 server.js
```

---

## 🎓 Learning Resources

- [Termux Wiki](https://wiki.termux.com/)
- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/guide/)
- [IMEI Structure](https://en.wikipedia.org/wiki/International_Mobile_Equipment_Identity)

---

## 🤝 Contributing

Found a bug or want to add features? Contributions welcome!

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test in Termux
5. Submit pull request

---

## 📞 Support

- GitHub Issues: [Report Bug](https://github.com/pip111194/imei-tracker-tool/issues)
- Documentation: [README.md](README.md)

---

**Made with ❤️ for Termux users**