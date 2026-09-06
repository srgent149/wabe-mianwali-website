const rateLimit = require('express-rate-limit');

// Applied to public form-submission routes to deter spam/abuse.
const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many submissions from this device. Please try again later.',
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many login attempts. Please try again later.',
});

module.exports = { formLimiter, loginLimiter };
