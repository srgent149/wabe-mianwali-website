const router = require('express').Router();
const { body } = require('express-validator');
const feesController = require('../controllers/feesController');
const validateRequest = require('../middleware/validateRequest');
const { CLASS_LIST } = require('../utils/constants');
const prisma = require('../config/prisma');

router.get('/', feesController.index);

const lookupValidators = [
  body('className').isIn(CLASS_LIST).withMessage('Please select a valid class.'),
  body('rollNumber').trim().notEmpty().withMessage('Roll number is required.'),
];

const extraLocals = async () => ({
  classList: CLASS_LIST,
  feeStructures: await prisma.feeStructure.findMany({ orderBy: { displayOrder: 'asc' } }),
  result: null,
  searched: false,
});

router.post('/challan', lookupValidators, validateRequest('fees', extraLocals), feesController.lookupChallan);
router.get('/challan/:id/print', feesController.printChallan);

module.exports = router;
