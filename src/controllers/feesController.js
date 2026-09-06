const prisma = require('../config/prisma');
const { CLASS_LIST } = require('../utils/constants');
const challanService = require('../services/challanService');

async function index(req, res, next) {
  try {
    const feeStructures = await prisma.feeStructure.findMany({ orderBy: { displayOrder: 'asc' } });
    res.render('fees', {
      title: 'Fees & Challan - The WABE International School, Mianwali Campus',
      description:
        'View class-wise fee structure and look up your fee & fine challan online at The WABE International School, Mianwali Campus.',
      classList: CLASS_LIST,
      feeStructures,
      result: null,
      searched: false,
      formValues: {},
      errors: {},
    });
  } catch (err) {
    next(err);
  }
}

async function lookupChallan(req, res, next) {
  try {
    const { className, rollNumber } = req.body;
    const feeStructures = await prisma.feeStructure.findMany({ orderBy: { displayOrder: 'asc' } });

    const result = await challanService.findLatestChallan(className, rollNumber || '');

    res.render('fees', {
      title: 'Fees & Challan - The WABE International School, Mianwali Campus',
      description: 'View class-wise fee structure and look up your fee & fine challan online.',
      classList: CLASS_LIST,
      feeStructures,
      result,
      searched: true,
      formValues: { className, rollNumber },
      errors: {},
    });
  } catch (err) {
    next(err);
  }
}

async function printChallan(req, res, next) {
  try {
    const challan = await challanService.findChallanById(req.params.id);
    if (!challan) {
      return res.status(404).render('errors/404', { title: 'Challan Not Found', layout: 'layouts/main' });
    }
    res.render('fees-print', {
      title: `Fee Challan - ${challan.student.name}`,
      description: 'Printable fee challan.',
      layout: false,
      challan,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { index, lookupChallan, printChallan };
