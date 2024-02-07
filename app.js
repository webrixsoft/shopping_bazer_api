const path = require('path');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const express = require('express');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const xss = require('xss-clean');
const cors = require('cors');
const helmet = require('helmet');


// aarvi
const AppError = require('./utils/appError');
const authRouter = require('./admin/routes/authRoutes');

const app = express();

var allowlist = ['http://localhost:8080', 'http://localhost:8000']
var corsOptionsDelegate = function (req, callback) {
        var corsOptions;
        if (allowlist.indexOf(req.header('Origin')) !== -1) {
                corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
        } else {
                corsOptions = { origin: false } // disable CORS for this request
        }
        callback(null, corsOptions) // callback expects two parameters: error and options
}

// app.options('*', cors());

// Serving static files
// app.use("/images/", express.static(path.join(__dirname, 'public/support/image')));

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
        max: 10000,
        windowMs: 60 * 60 * 1000,
        message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/shopping/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

app.use(compression());
app.use(bodyParser.json())

app.use((req, res, next) => {
        req.requestTime = new Date().toISOString();

        next();
});

// 3) ROUTES
app.get('/', (req, res, next) => {
        res.json({
                status: 'success',
                message: 'Welcome to Shopping Bazar API!'
        });
});

// aarvi routes
app.use('/shopping/api/auth', cors(corsOptionsDelegate), authRouter);

app.all('*', (req, res, next) => {
        next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
// Pending 
// app.use(haldlingErrors);

module.exports = app;