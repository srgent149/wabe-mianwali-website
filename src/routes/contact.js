const router = require('express').Router();
const { body } = require('express-validator');
const contactController = require('../controllers/contactController');
const validateRequest = require('../middleware/validateRequest');
const { formLimiter } = require('../middleware/rateLimiters');
const { CONTACT_REASONS } = require('../utils/constants');

router.get('/', contactController.index);

const contactValidators = [
  body('name').trim().notEmpty().withMessage('Name is required.'),
  body('phone')
    .trim()
    .matches(/^[0-9+\-\s()]{7,20}$/)
    .withMessage('Enter a valid phone number.'),
  body('email').trim().isEmail().withMessage('Enter a valid email address.'),
  body('reason').isIn(CONTACT_REASONS).withMessage('Please select a valid reason.'),
  body('message').trim().isLength({ min: 5 }).withMessage('Message must be at least 5 characters.'),
];

const extraLocals = () => ({ reasons: CONTACT_REASONS, submitted: false });

router.post('/', formLimiter, contactValidators, validateRequest('contact', extraLocals), contactController.submit);

module.exports = router;
