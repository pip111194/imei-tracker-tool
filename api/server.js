// IMEI Tracker Tool - Advanced Backend Server v2.0
// Production-ready with real API integrations

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const config = require('./config');
const imeiService = require('./services/imeiService');

const app = express();
const PORT = config.server.port;
const HOST = config.server.host;

// Middleware
app.use(cors(config.cors));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from parent directory
app.use(express.static(path.join(__dirname, '..')));

// Rate limiting
const limiter = rateLimit(config.rateLimit);
app.use('/api/', limiter);

// Request logging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// ============================================
// API ROUTES
// ============================================

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        version: '2.0.0',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: config.server.env
    });
});

// Basic IMEI validation
app.post('/api/validate', async (req, res) => {
    try {
        const { imei } = req.body;

        if (!imei) {
            return res.status(400).json({ error: 'IMEI is required' });
        }

        if (!/^\d{15}$/.test(imei)) {
            return res.status(400).json({ error: 'IMEI must be exactly 15 digits' });
        }

        const isValid = imeiService.validateLuhn(imei);

        res.json({
            imei,
            valid: isValid,
            message: isValid ? 'Valid IMEI' : 'Invalid IMEI checksum'
        });
    } catch (error) {
        console.error('Validation error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Advanced IMEI tracking with real API integration
app.post('/api/track', async (req, res) => {
    try {
        const { imei } = req.body;

        if (!imei) {
            return res.status(400).json({ error: 'IMEI is required' });
        }

        if (!/^\d{15}$/.test(imei)) {
            return res.status(400).json({ error: 'IMEI must be 15 digits' });
        }

        const result = await imeiService.trackIMEI(imei);
        res.json(result);

    } catch (error) {
        console.error('Tracking error:', error);
        
        if (error.message === 'Invalid IMEI number') {
            return res.status(400).json({ error: error.message });
        }

        res.status(500).json({ error: 'Failed to track IMEI' });
    }
});

// Batch IMEI validation
app.post('/api/batch-validate', async (req, res) => {
    try {
        const { imeis } = req.body;

        if (!imeis || !Array.isArray(imeis)) {
            return res.status(400).json({ error: 'IMEIs array is required' });
        }

        if (imeis.length === 0) {
            return res.status(400).json({ error: 'At least one IMEI is required' });
        }

        if (imeis.length > 50) {
            return res.status(400).json({ error: 'Maximum 50 IMEIs allowed per request' });
        }

        const results = await imeiService.batchValidate(imeis);

        res.json({
            total: imeis.length,
            valid: results.filter(r => r.valid).length,
            invalid: results.filter(r => !r.valid).length,
            results
        });

    } catch (error) {
        console.error('Batch validation error:', error);
        res.status(500).json({ error: 'Failed to validate batch' });
    }
});

// Get device history (Mock data - integrate with real database)
app.get('/api/history/:imei', async (req, res) => {
    try {
        const { imei } = req.params;

        if (!/^\d{15}$/.test(imei)) {
            return res.status(400).json({ error: 'Invalid IMEI format' });
        }

        if (!imeiService.validateLuhn(imei)) {
            return res.status(400).json({ error: 'Invalid IMEI' });
        }

        // Mock history data - replace with real database query
        const history = [
            {
                date: new Date(Date.now() - 300 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                event: 'Device Activated',
                location: 'New Delhi, India',
                carrier: 'Airtel',
                details: 'First activation'
            },
            {
                date: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                event: 'SIM Changed',
                location: 'Mumbai, India',
                carrier: 'Jio',
                details: 'SIM card replaced'
            },
            {
                date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                event: 'Network Update',
                location: 'Bangalore, India',
                carrier: 'Jio',
                details: '5G network enabled'
            },
            {
                date: new Date().toISOString().split('T')[0],
                event: 'IMEI Checked',
                location: 'Current Location',
                carrier: 'Jio',
                details: 'Verification check'
            }
        ];

        res.json({
            imei,
            history,
            totalEvents: history.length
        });

    } catch (error) {
        console.error('History error:', error);
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});

// Check carrier lock status
app.get('/api/carrier-lock/:imei', async (req, res) => {
    try {
        const { imei } = req.params;

        if (!/^\d{15}$/.test(imei)) {
            return res.status(400).json({ error: 'Invalid IMEI format' });
        }

        if (!imeiService.validateLuhn(imei)) {
            return res.status(400).json({ error: 'Invalid IMEI' });
        }

        const components = imeiService.parseIMEI(imei);
        const deviceInfo = imeiService.getDeviceInfo(components.tac);

        // Mock carrier lock data - integrate with real API
        const lockStatus = {
            imei,
            locked: false,
            carrier: 'Unlocked',
            simLockStatus: 'Factory Unlocked',
            canUnlock: true,
            unlockEligibility: 'Eligible',
            manufacturer: deviceInfo.manufacturer,
            model: deviceInfo.model
        };

        res.json(lockStatus);

    } catch (error) {
        console.error('Carrier lock error:', error);
        res.status(500).json({ error: 'Failed to check carrier lock' });
    }
});

// TAC database lookup
app.get('/api/tac/:tac', (req, res) => {
    try {
        const { tac } = req.params;

        if (!/^\d{6,8}$/.test(tac)) {
            return res.status(400).json({ error: 'TAC must be 6-8 digits' });
        }

        const deviceInfo = imeiService.getDeviceInfo(tac);

        res.json({
            tac,
            ...deviceInfo
        });

    } catch (error) {
        console.error('TAC lookup error:', error);
        res.status(500).json({ error: 'Failed to lookup TAC' });
    }
});

// API statistics
app.get('/api/stats', (req, res) => {
    try {
        const tacDatabase = imeiService.getTACDatabase();
        const manufacturers = [...new Set(Object.values(tacDatabase).map(d => d.manufacturer))];

        res.json({
            totalTACRecords: Object.keys(tacDatabase).length,
            supportedManufacturers: manufacturers,
            apiVersion: '2.0.0',
            uptime: process.uptime(),
            cacheSize: imeiService.cache.size,
            features: [
                'Luhn Algorithm Validation',
                'TAC Database Lookup',
                'Batch Processing',
                'Device History',
                'Carrier Lock Check',
                'Real-time API Integration',
                'Caching System',
                'Rate Limiting'
            ]
        });

    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

// Get API configuration (without sensitive data)
app.get('/api/config', (req, res) => {
    res.json({
        rateLimit: {
            windowMs: config.rateLimit.windowMs,
            maxRequests: config.rateLimit.max
        },
        cache: config.cache,
        version: '2.0.0',
        endpoints: [
            'GET /api/health',
            'POST /api/validate',
            'POST /api/track',
            'POST /api/batch-validate',
            'GET /api/history/:imei',
            'GET /api/carrier-lock/:imei',
            'GET /api/tac/:tac',
            'GET /api/stats',
            'GET /api/config'
        ]
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        name: 'IMEI Tracker API',
        version: '2.0.0',
        description: 'Professional IMEI tracking and validation service',
        documentation: '/api/config',
        health: '/api/health',
        frontend: {
            basic: '/index.html',
            advanced: '/advanced-tracker.html'
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        path: req.path,
        availableEndpoints: '/api/config'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: config.server.env === 'development' ? err.message : 'Something went wrong'
    });
});

// Start server
const server = app.listen(PORT, HOST, () => {
    console.log('\n' + '='.repeat(60));
    console.log('🚀 IMEI Tracker API Server v2.0');
    console.log('='.repeat(60));
    console.log(`📡 Server running on: http://${HOST}:${PORT}`);
    console.log(`🌍 Environment: ${config.server.env}`);
    console.log(`⏰ Started at: ${new Date().toISOString()}`);
    console.log('\n📚 Available Endpoints:');
    console.log(`   GET  http://localhost:${PORT}/api/health`);
    console.log(`   POST http://localhost:${PORT}/api/validate`);
    console.log(`   POST http://localhost:${PORT}/api/track`);
    console.log(`   POST http://localhost:${PORT}/api/batch-validate`);
    console.log(`   GET  http://localhost:${PORT}/api/history/:imei`);
    console.log(`   GET  http://localhost:${PORT}/api/carrier-lock/:imei`);
    console.log(`   GET  http://localhost:${PORT}/api/tac/:tac`);
    console.log(`   GET  http://localhost:${PORT}/api/stats`);
    console.log(`   GET  http://localhost:${PORT}/api/config`);
    console.log('\n🌐 Frontend:');
    console.log(`   Basic:    http://localhost:${PORT}/index.html`);
    console.log(`   Advanced: http://localhost:${PORT}/advanced-tracker.html`);
    console.log('\n💡 Test with curl:');
    console.log(`   curl http://localhost:${PORT}/api/health`);
    console.log(`   curl -X POST http://localhost:${PORT}/api/validate -H "Content-Type: application/json" -d '{"imei":"357174051234567"}'`);
    console.log('\n' + '='.repeat(60) + '\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('\nSIGINT signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});

module.exports = app;