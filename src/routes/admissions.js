const router = require('express').Router();
const { body } = require('express-validator');
const admissionsController = require('../controllers/admissionsController');
const validateRequest = require('../middleware/validateRequest');
const { formLimiter } = require('../middleware/rateLimiters');
const { CLASS_LIST } = require('../utils/constants');
const prisma = require('../config/prisma');

router.get('/', admissionsController.showForm);

const admissionValidators = [
  body('studentName').trim().notEmpty().withMessage('Student full name is required.'),
  body('dob').notEmpty().withMessage('Date of birth is required.').isISO8601().withMessage('Enter a valid date of birth.'),
  body('gender').isIn(['Male', 'Female']).withMessage('Please select a gender.'),
  body('classAppliedFor').isIn(CLASS_LIST).withMessage('Please select a valid class.'),
  body('guardianName').trim().notEmpty().withMessage('Guardian name is required.'),
  body('relation').trim().notEmpty().withMessage('Relation to student is required.'),
  body('phone')
    .trim()
    .matches(/^[0-9+\-\s()]{7,20}$/)
    .withMessage('Enter a valid phone number.'),
  body('email').trim().isEmail().withMessage('Enter a valid email address.'),
  body('address').trim().notEmpty().withMessage('Address is required.'),
];

const extraLocals = async () => ({
  classList: CLASS_LIST,
  feeStructures: await prisma.feeStructure.findMany({ orderBy: { displayOrder: 'asc' } }),
  submitted: false,
});

router.post('/', formLimiter, admissionValidators, validateRequest('admissions', extraLocals), admissionsController.submit);

module.exports = router;
