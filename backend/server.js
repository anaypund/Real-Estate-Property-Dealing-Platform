const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors());

// Security headers (configured to allow serving uploaded images)
app.use(helmet({
    crossOriginResourcePolicy: false,
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Serve static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount routers
app.use('/api/auth', require('./routes/auth'));
app.use('/api/properties', require('./routes/properties'));
app.use('/api/buyers', require('./routes/buyers'));
app.use('/api/sellers', require('./routes/sellers'));

// Welcome route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Real Estate API - v1.0',
        endpoints: {
            auth: '/api/auth',
            properties: '/api/properties',
            buyers: '/api/buyers',
            sellers: '/api/sellers'
        }
    });
});

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`\n🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
    console.log(`📍 Base URL: http://localhost:${PORT}`);
    console.log(`📚 API Endpoints:`);
    console.log(`   - Auth: http://localhost:${PORT}/api/auth`);
    console.log(`   - Properties: http://localhost:${PORT}/api/properties`);
    console.log(`   - Buyers: http://localhost:${PORT}/api/buyers`);
    console.log(`   - Sellers: http://localhost:${PORT}/api/sellers\n`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});
