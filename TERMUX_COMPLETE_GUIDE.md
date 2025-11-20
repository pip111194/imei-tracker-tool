# 📱 Complete Termux Guide - IMEI Tracker Tool

**Termux se HTML aur API dono use karne ka complete guide**

## 🚀 Quick Install (Copy-Paste Ek Hi Baar)

```bash
pkg update -y && pkg upgrade -y && pkg install nodejs git -y && git clone https://github.com/pip111194/imei-tracker-tool.git && cd imei-tracker-tool && cd api && npm install && cd .. && chmod +x start.sh stop.sh && ./start.sh
```

**Bas! Ab browser mein jao:**
- http://localhost:8080/advanced-tracker.html

---

## 📋 Step-by-Step Installation

### Step 1: Termux Install Karo
1. **F-Droid** se download karo (NOT Google Play Store)
2. Link: https://f-droid.org/en/packages/com.termux/
3. Install karo aur open karo

### Step 2: Termux Update Karo
```bash
pkg update
pkg upgrade
```
**Note**: Jab puchhe "Do you want to continue? [Y/n]" → Type `Y` aur Enter

### Step 3: Node.js aur Git Install Karo
```bash
pkg install nodejs git -y
```

**Verify karo**:
```bash
node --version    # Should show v18.x.x or higher
npm --version     # Should show 9.x.x or higher
git --version     # Should show 2.x.x
```

### Step 4: Repository Clone Karo
```bash
cd ~
git clone https://github.com/pip111194/imei-tracker-tool.git
cd imei-tracker-tool
```

### Step 5: Dependencies Install Karo
```bash
cd api
npm install
```
**Wait karo** - 2-3 minutes lagenge

### Step 6: Scripts Ko Executable Banao
```bash
cd ..
chmod +x start.sh stop.sh
```

### Step 7: Server Start Karo
```bash
./start.sh
```

**Success! Ab dikhega**:
```
🚀 IMEI Tracker API Server v2.0
📡 Server running on: http://0.0.0.0:3000
🌐 Frontend:
   Basic:    http://localhost:8080/index.html
   Advanced: http://localhost:8080/advanced-tracker.html
```

---

## 🌐 Browser Mein Kaise Use Karein

### Method 1: Localhost (Recommended)
1. Termux mein server start karo: `./start.sh`
2. Browser open karo (Chrome/Firefox)
3. Type karo: `http://localhost:8080/advanced-tracker.html`
4. Done! ✅

### Method 2: Direct File Access
1. File manager open karo
2. Navigate: `Internal Storage/termux/imei-tracker-tool/`
3. `advanced-tracker.html` ko browser se open karo
4. API endpoint change karo: `http://localhost:3000/api`

---

## 🎯 Kaise Use Karein

### 1. Single IMEI Track Karna

**Browser Method**:
1. Advanced tracker open karo
2. IMEI enter karo (15 digits)
3. "Track Device" click karo
4. Result dekho

**Termux Command Method**:
```bash
curl -X POST http://localhost:3000/api/track \
  -H "Content-Type: application/json" \
  -d '{"imei":"357174051234567"}'
```

### 2. Batch Validation (Multiple IMEIs)

**Browser Method**:
1. "Batch Validate" tab pe jao
2. Multiple IMEIs enter karo (one per line)
3. "Validate Batch" click karo

**Termux Command Method**:
```bash
curl -X POST http://localhost:3000/api/batch-validate \
  -H "Content-Type: application/json" \
  -d '{"imeis":["357174051234567","358240051234568"]}'
```

### 3. Device History Dekhna

**Browser Method**:
1. "Device History" tab pe jao
2. IMEI enter karo
3. "Get History" click karo

**Termux Command Method**:
```bash
curl http://localhost:3000/api/history/357174051234567
```

### 4. Carrier Lock Check Karna

**Browser Method**:
1. "Carrier Lock" tab pe jao
2. IMEI enter karo
3. "Check Carrier Lock" click karo

**Termux Command Method**:
```bash
curl http://localhost:3000/api/carrier-lock/357174051234567
```

---

## 🔧 Important Commands

### Server Start Karna
```bash
cd ~/imei-tracker-tool
./start.sh
```

### Server Stop Karna
```bash
./stop.sh
```

### Server Status Check Karna
```bash
curl http://localhost:3000/api/health
```

### Logs Dekhna
```bash
# Real-time logs
tail -f /data/data/com.termux/files/usr/var/log/imei-tracker.log
```

---

## 🌍 Same WiFi Pe Dusre Devices Se Access Karna

### Step 1: Apna Local IP Nikalo
```bash
ifconfig | grep inet
```
**Example output**: `inet 192.168.1.100`

### Step 2: Dusre Device Se Access Karo
- **Same WiFi pe connect karo**
- Browser mein type karo: `http://192.168.1.100:8080/advanced-tracker.html`
- API endpoint: `http://192.168.1.100:3000/api`

### Step 3: Firewall Allow Karo (If needed)
```bash
# Termux mein firewall usually nahi hota
# But agar problem ho to:
pkg install iptables -y
```

---

## 🔥 Advanced Features

### 1. Auto-Start on Termux Launch
```bash
echo 'cd ~/imei-tracker-tool && ./start.sh' >> ~/.bashrc
```

### 2. Background Mein Run Karna
```bash
# Install termux-services
pkg install termux-services -y

# Create service
mkdir -p ~/.termux/boot
cat > ~/.termux/boot/imei-tracker << 'EOF'
#!/data/data/com.termux/files/usr/bin/bash
cd ~/imei-tracker-tool
./start.sh
EOF

chmod +x ~/.termux/boot/imei-tracker
```

### 3. Custom Port Use Karna
```bash
# Edit api/.env
nano api/.env

# Add:
PORT=8888

# Restart
./stop.sh && ./start.sh
```

### 4. API Keys Add Karna
```bash
# Edit .env file
nano api/.env

# Add your API keys:
IMEI24_API_KEY=your_key_here
CHECKMEND_API_KEY=your_key_here

# Save: Ctrl+X, Y, Enter
# Restart server
./stop.sh && ./start.sh
```

---

## 🧪 Test IMEIs

Ye IMEIs test karne ke liye use karo:

```
357174051234567  - Apple iPhone 6
358240051234567  - Samsung Galaxy S20
359070051234567  - Apple iPhone 11
868010051234567  - Xiaomi Redmi Note 10
868060051234567  - OnePlus 9
359010051234567  - Google Pixel 6
```

---

## 🐛 Common Problems & Solutions

### Problem 1: "Port already in use"
```bash
# Solution:
./stop.sh
pkill node
pkill http-server
./start.sh
```

### Problem 2: "Module not found"
```bash
# Solution:
cd ~/imei-tracker-tool/api
rm -rf node_modules
npm install
cd ..
./start.sh
```

### Problem 3: "Permission denied"
```bash
# Solution:
chmod +x start.sh stop.sh
termux-setup-storage
```

### Problem 4: "Cannot access frontend"
```bash
# Solution:
npm install -g http-server
cd ~/imei-tracker-tool
http-server -p 8080
```

### Problem 5: "API not responding"
```bash
# Check if server is running:
curl http://localhost:3000/api/health

# If not running:
cd ~/imei-tracker-tool/api
node server.js
```

### Problem 6: "Connection refused"
```bash
# Check if ports are correct:
netstat -tuln | grep 3000
netstat -tuln | grep 8080

# Restart with different ports:
PORT=3001 node api/server.js &
http-server -p 8081 &
```

---

## 📊 Performance Tips

### 1. Memory Optimization
```bash
# Limit Node.js memory
node --max-old-space-size=512 api/server.js
```

### 2. Cache Clear Karna
```bash
# Clear npm cache
npm cache clean --force

# Clear app cache
cd ~/imei-tracker-tool/api
rm -rf node_modules/.cache
```

### 3. Speed Increase Karna
```bash
# Use production mode
NODE_ENV=production ./start.sh
```

---

## 🔐 Security Tips

### 1. API Keys Ko Secure Rakho
```bash
# Never share your .env file
# Add to .gitignore (already done)
```

### 2. Rate Limiting Enable Karo
```bash
# Already enabled by default
# 100 requests per 15 minutes
```

### 3. HTTPS Enable Karna (Advanced)
```bash
pkg install openssl -y
openssl req -nodes -new -x509 -keyout server.key -out server.cert
```

---

## 📱 Termux Shortcuts

### Create Shortcuts
```bash
# Add to ~/.bashrc
echo 'alias imei-start="cd ~/imei-tracker-tool && ./start.sh"' >> ~/.bashrc
echo 'alias imei-stop="cd ~/imei-tracker-tool && ./stop.sh"' >> ~/.bashrc
echo 'alias imei-status="curl http://localhost:3000/api/health"' >> ~/.bashrc

# Reload
source ~/.bashrc

# Now use:
imei-start
imei-stop
imei-status
```

---

## 🎓 Learning Resources

### Termux Basics
- [Termux Wiki](https://wiki.termux.com/)
- [Termux GitHub](https://github.com/termux/termux-app)

### Node.js
- [Node.js Docs](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/)

### IMEI Information
- [IMEI Structure](https://en.wikipedia.org/wiki/International_Mobile_Equipment_Identity)
- [TAC Database](https://www.tacdb.com/)

---

## 💡 Pro Tips

### 1. Multiple Termux Sessions
- Swipe from left edge
- Click "New Session"
- Run different commands in each

### 2. Copy-Paste in Termux
- Long press to select text
- Volume Up + Q = Show keyboard
- Volume Up + V = Paste

### 3. Termux Widgets
```bash
# Install widget
pkg install termux-widget -y

# Create widget script
mkdir -p ~/.shortcuts
cat > ~/.shortcuts/imei-start.sh << 'EOF'
#!/data/data/com.termux/files/usr/bin/bash
cd ~/imei-tracker-tool && ./start.sh
EOF
chmod +x ~/.shortcuts/imei-start.sh
```

### 4. Backup Your Setup
```bash
# Backup
tar -czf imei-backup.tar.gz ~/imei-tracker-tool

# Restore
tar -xzf imei-backup.tar.gz -C ~/
```

---

## 🆘 Need Help?

### Check Logs
```bash
cd ~/imei-tracker-tool/api
node server.js
# Watch for errors
```

### Test API Manually
```bash
# Health check
curl http://localhost:3000/api/health

# Validate IMEI
curl -X POST http://localhost:3000/api/validate \
  -H "Content-Type: application/json" \
  -d '{"imei":"357174051234567"}'
```

### Reinstall Everything
```bash
cd ~
rm -rf imei-tracker-tool
git clone https://github.com/pip111194/imei-tracker-tool.git
cd imei-tracker-tool
cd api && npm install && cd ..
chmod +x start.sh stop.sh
./start.sh
```

---

## 📞 Support

- **GitHub Issues**: https://github.com/pip111194/imei-tracker-tool/issues
- **Documentation**: README.md, BACKEND_DOCS.md
- **API Guide**: API_KEYS_GUIDE.md

---

## ✅ Checklist

Before using, make sure:
- [ ] Termux installed from F-Droid
- [ ] Node.js installed (`node --version`)
- [ ] Repository cloned
- [ ] Dependencies installed (`npm install`)
- [ ] Scripts executable (`chmod +x`)
- [ ] Server running (`./start.sh`)
- [ ] Browser can access (`http://localhost:8080`)
- [ ] API responding (`curl http://localhost:3000/api/health`)

---

**Sab kuch ready hai! Happy tracking! 🎉**

**Version**: 2.0.0
**Last Updated**: November 2024