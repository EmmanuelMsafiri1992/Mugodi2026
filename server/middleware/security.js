import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import { securityConfig } from '../config/security.js';

// General rate limiter
export const generalLimiter = rateLimit({
  windowMs: securityConfig.rateLimits.general.windowMs,
  max: securityConfig.rateLimits.general.max,
  message: {
    success: false,
    message: 'Too many requests, please try again later'
  }
});

// Auth rate limiter (stricter)
export const authLimiter = rateLimit({
  windowMs: securityConfig.rateLimits.auth.windowMs,
  max: securityConfig.rateLimits.auth.max,
  message: {
    success: false,
    message: 'Too many login attempts, please try again later'
  }
});

// Sanitize input
export const sanitizeInput = mongoSanitize();

// Prevent HTTP Parameter Pollution
export const preventParamPollution = hpp({
  whitelist: ['price', 'category', 'rating', 'sort']
});

// Block suspicious patterns
export const blockAttacks = (req, res, next) => {
  const suspiciousPatterns = [
    /(\.\.\/)/, // Path traversal
    /<script>/i, // XSS
    /javascript:/i, // XSS
    /on\w+=/i, // Event handlers
  ];

  const checkString = (str) => {
    if (typeof str !== 'string') return false;
    return suspiciousPatterns.some(pattern => pattern.test(str));
  };

  const checkObject = (obj) => {
    for (const key in obj) {
      if (checkString(obj[key])) return true;
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        if (checkObject(obj[key])) return true;
      }
    }
    return false;
  };

  if (checkObject(req.body) || checkObject(req.query) || checkObject(req.params)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid input detected'
    });
  }

  next();
};

// Security logger
export const securityLogger = (req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${req.ip}`);
  }
  next();
};
