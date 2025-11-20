# 🔑 API Keys Guide - Real IMEI APIs

Complete guide to get API keys for real IMEI tracking services.

## 🌟 Free APIs (No API Key Required)

### 1. Local TAC Database ✅
**Status**: Already Integrated
- **Cost**: Free
- **Features**: Device manufacturer, model, year, OS
- **Limitations**: Limited to TAC database
- **Setup**: No setup required

### 2. IMEI.info (Free Tier) ✅
**Status**: Partially Integrated
- **Website**: https://www.imei.info
- **Cost**: Free (limited) / Paid plans available
- **Features**: Basic device info, warranty check
- **API Docs**: https://www.imei.info/api
- **Setup**: 
  ```bash
  # No API key needed for basic checks
  # Just use the public endpoint
  ```

---

## 💰 Paid APIs (Recommended for Production)

### 1. IMEI24.com API 🔥
**Best for**: Complete device information

**Features**:
- ✅ Device specifications
- ✅ Warranty status
- ✅ Carrier lock status
- ✅ Blacklist check
- ✅ Stolen device database

**Pricing**:
- Free: 10 checks/month
- Basic: $9.99/month - 100 checks
- Pro: $29.99/month - 500 checks
- Enterprise: Custom pricing

**How to Get API Key**:
1. Visit https://www.imei24.com
2. Sign up for an account
3. Go to Dashboard → API Keys
4. Generate new API key
5. Copy the key

**Setup**:
```bash
# Add to api/.env
IMEI24_API_KEY=your_api_key_here
```

**Test**:
```bash
curl -X POST https://api.imei24.com/v2/imei/check \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"imei":"357174051234567"}'
```

---

### 2. CheckMEND API 🔒
**Best for**: Stolen device database

**Features**:
- ✅ Stolen device check
- ✅ Blacklist verification
- ✅ Insurance claim history
- ✅ Global database access

**Pricing**:
- Pay-per-check: $0.50 per check
- Monthly: $49/month - 100 checks
- Enterprise: Custom pricing

**How to Get API Key**:
1. Visit https://www.checkmend.com/api
2. Create business account
3. Verify your business
4. Request API access
5. Get API credentials

**Setup**:
```bash
# Add to api/.env
CHECKMEND_API_KEY=your_api_key_here
```

---

### 3. IMEI Pro API 📱
**Best for**: Carrier information

**Features**:
- ✅ Carrier lock status
- ✅ Network compatibility
- ✅ SIM lock info
- ✅ Unlock eligibility

**Pricing**:
- Free: 5 checks/month
- Starter: $14.99/month - 50 checks
- Professional: $49.99/month - 200 checks

**How to Get API Key**:
1. Visit https://imeipro.info
2. Register account
3. Navigate to API section
4. Generate API key
5. Copy credentials

**Setup**:
```bash
# Add to api/.env
IMEIPRO_API_KEY=your_api_key_here
```

---

### 4. GSMA IMEI Database 🏢
**Best for**: Official IMEI verification

**Features**:
- ✅ Official IMEI validation
- ✅ Device registration check
- ✅ Type allocation code verification
- ✅ Global database

**Pricing**:
- Enterprise only
- Contact for pricing

**How to Get Access**:
1. Visit https://www.gsma.com/services/gsma-device-check
2. Contact GSMA sales team
3. Submit business verification
4. Sign enterprise agreement
5. Receive API credentials

**Setup**:
```bash
# Add to api/.env
GSMA_API_KEY=your_enterprise_key_here
```

---

### 5. Apple Check Coverage API 🍎
**Best for**: Apple device warranty

**Features**:
- ✅ Warranty status
- ✅ Purchase date
- ✅ Coverage expiry
- ✅ AppleCare status

**Pricing**: Free (public API)

**How to Use**:
```bash
# Already integrated - no API key needed
# Uses Apple's public endpoint
```

**Test**:
```bash
curl "https://support-sp.apple.com/sp/product?cc=YOUR_SERIAL_NUMBER"
```

---

## 🚀 Quick Setup Guide

### Step 1: Choose Your APIs
Select based on your needs:
- **Basic tracking**: Use free TAC database (already included)
- **Complete tracking**: Get IMEI24 API key
- **Stolen check**: Get CheckMEND API key
- **Carrier info**: Get IMEI Pro API key

### Step 2: Get API Keys
Follow the guides above for each service.

### Step 3: Configure Environment
Create `api/.env` file:

```env
# IMEI24 API
IMEI24_API_KEY=your_imei24_key_here

# CheckMEND API
CHECKMEND_API_KEY=your_checkmend_key_here

# IMEI Pro API
IMEIPRO_API_KEY=your_imeipro_key_here

# GSMA API (Enterprise)
GSMA_API_KEY=your_gsma_key_here
```

### Step 4: Restart Server
```bash
cd ~/imei-tracker-tool
./stop.sh
./start.sh
```

### Step 5: Test APIs
```bash
# Test with real IMEI
curl -X POST http://localhost:3000/api/track \
  -H "Content-Type: application/json" \
  -d '{"imei":"357174051234567"}'
```

---

## 📊 API Comparison

| API | Free Tier | Cost | Features | Best For |
|-----|-----------|------|----------|----------|
| TAC Database | ✅ Unlimited | Free | Basic info | Development |
| IMEI24 | 10/month | $9.99+ | Complete | Production |
| CheckMEND | ❌ No | $0.50/check | Stolen check | Security |
| IMEI Pro | 5/month | $14.99+ | Carrier info | Unlock services |
| GSMA | ❌ No | Enterprise | Official | Large scale |
| Apple | ✅ Unlimited | Free | Warranty | Apple devices |

---

## 🔧 Configuration Examples

### Minimal Setup (Free)
```env
# No API keys needed
# Uses local TAC database only
```

### Basic Setup (Recommended)
```env
# IMEI24 for complete tracking
IMEI24_API_KEY=your_key_here
```

### Advanced Setup
```env
# Multiple APIs for comprehensive data
IMEI24_API_KEY=your_imei24_key
CHECKMEND_API_KEY=your_checkmend_key
IMEIPRO_API_KEY=your_imeipro_key
```

### Enterprise Setup
```env
# All APIs including GSMA
IMEI24_API_KEY=your_imei24_key
CHECKMEND_API_KEY=your_checkmend_key
IMEIPRO_API_KEY=your_imeipro_key
GSMA_API_KEY=your_gsma_key
```

---

## 🧪 Testing Without API Keys

The tool works perfectly without any API keys using:
- ✅ Local TAC database (40+ devices)
- ✅ Luhn algorithm validation
- ✅ Component parsing
- ✅ Warranty calculation
- ✅ Mock stolen database

**Test it now**:
```bash
cd ~/imei-tracker-tool
./start.sh

# Open browser
http://localhost:8080/advanced-tracker.html

# Test IMEI: 357174051234567
```

---

## 💡 Tips & Best Practices

### 1. Start Free
Begin with the local TAC database. It's sufficient for most use cases.

### 2. Add APIs Gradually
Add paid APIs only when you need specific features:
- Need stolen check? → Add CheckMEND
- Need carrier info? → Add IMEI Pro
- Need warranty? → Already have Apple API

### 3. Monitor Usage
Track your API usage to avoid unexpected costs:
```javascript
// Check API stats
curl http://localhost:3000/api/stats
```

### 4. Cache Results
The tool automatically caches results for 10 minutes to reduce API calls.

### 5. Rate Limiting
Built-in rate limiting protects your API quotas:
- 100 requests per 15 minutes per IP
- Configurable in `api/.env`

---

## 🔐 Security Best Practices

### 1. Never Commit API Keys
```bash
# .gitignore already includes
.env
.env.local
.env.production
```

### 2. Use Environment Variables
```bash
# Never hardcode keys in code
# Always use process.env.API_KEY
```

### 3. Rotate Keys Regularly
Change your API keys every 3-6 months.

### 4. Monitor API Usage
Set up alerts for unusual activity.

### 5. Use Different Keys
Use different API keys for development and production.

---

## 🆘 Troubleshooting

### API Key Not Working
```bash
# Check if key is set
echo $IMEI24_API_KEY

# Verify .env file
cat api/.env

# Restart server
./stop.sh && ./start.sh
```

### API Rate Limit Exceeded
```bash
# Check current usage
curl http://localhost:3000/api/stats

# Wait for rate limit window to reset
# Or upgrade your API plan
```

### API Timeout
```bash
# Increase timeout in config.js
timeout: 10000  // 10 seconds
```

---

## 📞 Support

### IMEI24 Support
- Email: support@imei24.com
- Docs: https://docs.imei24.com

### CheckMEND Support
- Email: api@checkmend.com
- Phone: +44 20 3322 1234

### IMEI Pro Support
- Email: support@imeipro.info
- Live Chat: Available on website

---

## 🎓 Additional Resources

- [IMEI Structure Guide](https://en.wikipedia.org/wiki/International_Mobile_Equipment_Identity)
- [Luhn Algorithm](https://en.wikipedia.org/wiki/Luhn_algorithm)
- [TAC Database](https://www.tacdb.com/)
- [GSMA Device Check](https://www.gsma.com/services/gsma-device-check)

---

## 📈 Recommended Setup for Different Use Cases

### Personal Use
```env
# No API keys needed
# Use local TAC database
```

### Small Business
```env
IMEI24_API_KEY=your_key  # $9.99/month
```

### Mobile Repair Shop
```env
IMEI24_API_KEY=your_key
CHECKMEND_API_KEY=your_key
# Total: ~$60/month
```

### Enterprise
```env
IMEI24_API_KEY=your_key
CHECKMEND_API_KEY=your_key
IMEIPRO_API_KEY=your_key
GSMA_API_KEY=your_key
# Custom pricing
```

---

**Last Updated**: November 2024
**Version**: 2.0.0