const router = require('express').Router();
const { body } = require('express-validator');
const careersController = require('../controllers/careersController');
const validateRequest = require('../middleware/validateRequest');
const { formLimiter } = require('../middleware/rateLimiters');
const prisma = require('../config/prisma');

router.get('/', careersController.index);

const applicationValidators = [
  body('applicantName').trim().notEmpty().withMessage('Full name is required.'),
  body('jobOpeningId').notEmpty().withMessage('Please select a position.'),
  body('qualification').trim().notEmpty().withMessage('Qualification is required.'),
  body('experience').trim().notEmpty().withMessage('Experience is required.'),
  body('phone')
    .trim()
    .matches(/^[0-9+\-\s()]{7,20}$/)
    .withMessage('Enter a valid phone number.'),
  body('email').trim().isEmail().withMessage('Enter a valid email address.'),
];

const extraLocals = async () => ({
  openings: await prisma.jobOpening.findMany({ where: { isActive: true }, orderBy: { displayOrder: 'asc' } }),
  submitted: false,
  preselectJobId: '',
});

router.post('/', formLimiter, applicationValidators, validateRequest('careers', extraLocals), careersController.submit);

module.exports = router;
