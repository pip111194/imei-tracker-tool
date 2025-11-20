// IMEI Tracker - Configuration File
// Real API Integrations

module.exports = {
    // Server Configuration
    server: {
        port: process.env.PORT || 3000,
        host: process.env.HOST || '0.0.0.0',
        env: process.env.NODE_ENV || 'development'
    },

    // Real IMEI Check APIs
    apis: {
        // IMEI.info API (Free tier available)
        imeiInfo: {
            enabled: true,
            baseUrl: 'https://api.imei.info',
            apiKey: process.env.IMEI_INFO_API_KEY || '',
            endpoints: {
                check: '/check',
                history: '/history'
            }
        },

        // IMEI24.com API
        imei24: {
            enabled: true,
            baseUrl: 'https://api.imei24.com/v2',
            apiKey: process.env.IMEI24_API_KEY || '',
            endpoints: {
                check: '/imei/check',
                warranty: '/warranty/check'
            }
        },

        // CheckMEND API (Stolen device database)
        checkMend: {
            enabled: true,
            baseUrl: 'https://api.checkmend.com/v2',
            apiKey: process.env.CHECKMEND_API_KEY || '',
            endpoints: {
                check: '/check',
                report: '/report'
            }
        },

        // GSMA IMEI Database (Official)
        gsma: {
            enabled: false, // Requires enterprise account
            baseUrl: 'https://api.gsma.com/imei',
            apiKey: process.env.GSMA_API_KEY || '',
            endpoints: {
                validate: '/validate',
                lookup: '/lookup'
            }
        },

        // Apple Check Coverage API
        apple: {
            enabled: true,
            baseUrl: 'https://checkcoverage.apple.com/api',
            endpoints: {
                warranty: '/warranty'
            }
        },

        // Samsung IMEI Check
        samsung: {
            enabled: true,
            baseUrl: 'https://www.samsung.com/api',
            endpoints: {
                check: '/imei/check'
            }
        },

        // IMEI Pro API
        imeiPro: {
            enabled: true,
            baseUrl: 'https://imeipro.info/api',
            apiKey: process.env.IMEIPRO_API_KEY || '',
            endpoints: {
                check: '/check',
                carrier: '/carrier'
            }
        }
    },

    // Rate Limiting
    rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
        max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
        message: 'Too many requests from this IP, please try again later.'
    },

    // CORS Configuration
    cors: {
        origin: process.env.CORS_ORIGIN || '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
    },

    // Cache Configuration
    cache: {
        enabled: true,
        ttl: 600, // 10 minutes
        checkPeriod: 120 // 2 minutes
    },

    // Logging
    logging: {
        level: process.env.LOG_LEVEL || 'info',
        format: process.env.LOG_FORMAT || 'combined'
    },

    // Security
    security: {
        helmet: true,
        trustProxy: process.env.TRUST_PROXY === 'true'
    },

    // Free Alternative APIs (No API Key Required)
    freeApis: {
        // IMEI.info free endpoint
        imeiInfoFree: 'https://www.imei.info/api/check',
        
        // TAC Database
        tacDatabase: 'https://tac-database.com/api/lookup',
        
        // Device Info API
        deviceInfo: 'https://api.deviceinfo.me/imei'
    }
};