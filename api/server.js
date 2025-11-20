// IMEI Tracker Tool - Advanced Backend Server
// Node.js + Express API Server

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Extended TAC Database with more details
const tacDatabase = {
    '35174': { manufacturer: 'Apple', model: 'iPhone 6', year: 2014, os: 'iOS' },
    '35328': { manufacturer: 'Apple', model: 'iPhone 7', year: 2016, os: 'iOS' },
    '35419': { manufacturer: 'Apple', model: 'iPhone 8', year: 2017, os: 'iOS' },
    '35671': { manufacturer: 'Apple', model: 'iPhone X', year: 2017, os: 'iOS' },
    '35734': { manufacturer: 'Apple', model: 'iPhone XS', year: 2018, os: 'iOS' },
    '35907': { manufacturer: 'Apple', model: 'iPhone 11', year: 2019, os: 'iOS' },
    '35960': { manufacturer: 'Apple', model: 'iPhone 12', year: 2020, os: 'iOS' },
    '35123': { manufacturer: 'Apple', model: 'iPhone 13', year: 2021, os: 'iOS' },
    '35456': { manufacturer: 'Apple', model: 'iPhone 14', year: 2022, os: 'iOS' },
    '35789': { manufacturer: 'Apple', model: 'iPhone 15', year: 2023, os: 'iOS' },
    '35824': { manufacturer: 'Samsung', model: 'Galaxy S20', year: 2020, os: 'Android' },
    '35925': { manufacturer: 'Samsung', model: 'Galaxy S21', year: 2021, os: 'Android' },
    '35026': { manufacturer: 'Samsung', model: 'Galaxy S22', year: 2022, os: 'Android' },
    '35127': { manufacturer: 'Samsung', model: 'Galaxy S23', year: 2023, os: 'Android' },
    '35228': { manufacturer: 'Samsung', model: 'Galaxy S24', year: 2024, os: 'Android' },
    '86801': { manufacturer: 'Xiaomi', model: 'Redmi Note 10', year: 2021, os: 'Android' },
    '86802': { manufacturer: 'Xiaomi', model: 'Redmi Note 11', year: 2022, os: 'Android' },
    '86803': { manufacturer: 'OnePlus', model: 'OnePlus 9', year: 2021, os: 'Android' },
    '86804': { manufacturer: 'OnePlus', model: 'OnePlus 10', year: 2022, os: 'Android' },
    '35901': { manufacturer: 'Google', model: 'Pixel 6', year: 2021, os: 'Android' },
    '35902': { manufacturer: 'Google', model: 'Pixel 7', year: 2022, os: 'Android' },
    '35903': { manufacturer: 'Google', model: 'Pixel 8', year: 2023, os: 'Android' }
};

// Luhn Algorithm for IMEI validation
function validateIMEI(imei) {
    if (!/^\d{15}$/.test(imei)) {
        return false;
    }

    let sum = 0;
    for (let i = 0; i < 14; i++) {
        let digit = parseInt(imei[i]);
        if (i % 2 === 1) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        sum += digit;
    }

    const checkDigit = (10 - (sum % 10)) % 10;
    return checkDigit === parseInt(imei[14]);
}

// Extract IMEI components
function parseIMEI(imei) {
    return {
        tac: imei.substring(0, 8),
        fac: imei.substring(0, 2), // Final Assembly Code
        snr: imei.substring(8, 14),
        cd: imei[14]
    };
}

// Get device info from TAC
function getDeviceInfo(tac) {
    if (tacDatabase[tac]) {
        return tacDatabase[tac];
    }
    
    const tac6 = tac.substring(0, 6);
    const tac5 = tac.substring(0, 5);
    const tac2 = tac.substring(0, 2);
    
    return tacDatabase[tac6] || tacDatabase[tac5] || tacDatabase[tac2] || 
           { manufacturer: 'Unknown', model: 'Unknown Device', year: 'N/A', os: 'Unknown' };
}

// Check if device is reported stolen (Mock - integrate with real API)
function checkStolenStatus(imei) {
    // In production, integrate with GSMA IMEI Database or local police database
    const stolenIMEIs = ['123456789012345', '111111111111111'];
    return stolenIMEIs.includes(imei);
}

// Get device warranty status (Mock)
function getWarrantyStatus(imei, manufacturer) {
    // In production, integrate with manufacturer APIs
    const parsed = parseIMEI(imei);
    const deviceInfo = getDeviceInfo(parsed.tac);
    const currentYear = new Date().getFullYear();
    const deviceYear = deviceInfo.year;
    
    if (deviceYear === 'N/A') {
        return { status: 'Unknown', expiryDate: 'N/A' };
    }
    
    const warrantyYears = 1;
    const expiryYear = parseInt(deviceYear) + warrantyYears;
    const isValid = currentYear <= expiryYear;
    
    return {
        status: isValid ? 'Active' : 'Expired',
        expiryDate: `${expiryYear}-12-31`,
        remainingDays: isValid ? (expiryYear - currentYear) * 365 : 0
    };
}

// API Routes

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Basic IMEI validation
app.post('/api/validate', (req, res) => {
    const { imei } = req.body;
    
    if (!imei) {
        return res.status(400).json({ error: 'IMEI is required' });
    }
    
    const isValid = validateIMEI(imei);
    
    res.json({
        imei,
        valid: isValid,
        message: isValid ? 'Valid IMEI' : 'Invalid IMEI'
    });
});

// Advanced IMEI tracking
app.post('/api/track', (req, res) => {
    const { imei } = req.body;
    
    if (!imei) {
        return res.status(400).json({ error: 'IMEI is required' });
    }
    
    if (!/^\d{15}$/.test(imei)) {
        return res.status(400).json({ error: 'IMEI must be 15 digits' });
    }
    
    const isValid = validateIMEI(imei);
    
    if (!isValid) {
        return res.status(400).json({ error: 'Invalid IMEI number' });
    }
    
    const parsed = parseIMEI(imei);
    const deviceInfo = getDeviceInfo(parsed.tac);
    const isStolen = checkStolenStatus(imei);
    const warranty = getWarrantyStatus(imei, deviceInfo.manufacturer);
    
    res.json({
        imei,
        valid: true,
        components: {
            tac: parsed.tac,
            fac: parsed.fac,
            serialNumber: parsed.snr,
            checkDigit: parsed.cd
        },
        device: {
            manufacturer: deviceInfo.manufacturer,
            model: deviceInfo.model,
            year: deviceInfo.year,
            os: deviceInfo.os
        },
        status: {
            stolen: isStolen,
            blacklisted: isStolen,
            warranty: warranty
        },
        timestamp: new Date().toISOString()
    });
});

// Batch IMEI validation
app.post('/api/batch-validate', (req, res) => {
    const { imeis } = req.body;
    
    if (!imeis || !Array.isArray(imeis)) {
        return res.status(400).json({ error: 'IMEIs array is required' });
    }
    
    if (imeis.length > 50) {
        return res.status(400).json({ error: 'Maximum 50 IMEIs allowed per request' });
    }
    
    const results = imeis.map(imei => {
        const isValid = validateIMEI(imei);
        const parsed = parseIMEI(imei);
        const deviceInfo = isValid ? getDeviceInfo(parsed.tac) : null;
        
        return {
            imei,
            valid: isValid,
            manufacturer: deviceInfo ? deviceInfo.manufacturer : 'Unknown',
            model: deviceInfo ? deviceInfo.model : 'Unknown'
        };
    });
    
    res.json({
        total: imeis.length,
        valid: results.filter(r => r.valid).length,
        invalid: results.filter(r => !r.valid).length,
        results
    });
});

// Get device history (Mock)
app.get('/api/history/:imei', (req, res) => {
    const { imei } = req.params;
    
    if (!validateIMEI(imei)) {
        return res.status(400).json({ error: 'Invalid IMEI' });
    }
    
    // Mock history data
    const history = [
        {
            date: '2024-01-15',
            event: 'Device Activated',
            location: 'New Delhi, India',
            carrier: 'Airtel'
        },
        {
            date: '2024-06-20',
            event: 'SIM Changed',
            location: 'Mumbai, India',
            carrier: 'Jio'
        },
        {
            date: '2024-11-20',
            event: 'IMEI Checked',
            location: 'Current Location',
            carrier: 'Jio'
        }
    ];
    
    res.json({
        imei,
        history,
        totalEvents: history.length
    });
});

// Check carrier lock status
app.get('/api/carrier-lock/:imei', (req, res) => {
    const { imei } = req.params;
    
    if (!validateIMEI(imei)) {
        return res.status(400).json({ error: 'Invalid IMEI' });
    }
    
    // Mock carrier lock data
    res.json({
        imei,
        locked: false,
        carrier: 'Unlocked',
        simLockStatus: 'Factory Unlocked',
        canUnlock: true
    });
});

// Get TAC database info
app.get('/api/tac/:tac', (req, res) => {
    const { tac } = req.params;
    
    if (!/^\d{6,8}$/.test(tac)) {
        return res.status(400).json({ error: 'TAC must be 6-8 digits' });
    }
    
    const deviceInfo = getDeviceInfo(tac);
    
    res.json({
        tac,
        ...deviceInfo
    });
});

// Statistics endpoint
app.get('/api/stats', (req, res) => {
    res.json({
        totalTACRecords: Object.keys(tacDatabase).length,
        supportedManufacturers: [...new Set(Object.values(tacDatabase).map(d => d.manufacturer))],
        apiVersion: '2.0',
        uptime: process.uptime()
    });
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 IMEI Tracker API Server running on port ${PORT}`);
    console.log(`📡 API Endpoints:`);
    console.log(`   POST /api/validate - Basic IMEI validation`);
    console.log(`   POST /api/track - Advanced IMEI tracking`);
    console.log(`   POST /api/batch-validate - Batch validation`);
    console.log(`   GET  /api/history/:imei - Device history`);
    console.log(`   GET  /api/carrier-lock/:imei - Carrier lock status`);
    console.log(`   GET  /api/tac/:tac - TAC database lookup`);
    console.log(`   GET  /api/stats - API statistics`);
});

module.exports = app;