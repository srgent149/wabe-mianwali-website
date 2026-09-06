const prisma = require('../config/prisma');
const { CLASS_LIST } = require('../utils/constants');
const admissionService = require('../services/admissionService');
const emailService = require('../services/emailService');

async function showForm(req, res, next) {
  try {
    const feeStructures = await prisma.feeStructure.findMany({ orderBy: { displayOrder: 'asc' } });
    res.render('admissions', {
      title: 'Admissions - The WABE International School, Mianwali Campus',
      description:
        'Start the admissions process at The WABE International School, Mianwali Campus. Learn about eligibility, required documents, and apply online.',
      classList: CLASS_LIST,
      feeStructures,
      formValues: {},
      errors: {},
      submitted: false,
    });
  } catch (err) {
    next(err);
  }
}

async function submit(req, res, next) {
  try {
    const application = await admissionService.createApplication(req.body);

    emailService.sendAdmissionEmails(application).catch((e) => console.error('Admission email failed:', e));

    const feeStructures = await prisma.feeStructure.findMany({ orderBy: { displayOrder: 'asc' } });
    res.render('admissions', {
      title: 'Admissions - The WABE International School, Mianwali Campus',
      description: 'Start the admissions process at The WABE International School, Mianwali Campus.',
      classList: CLASS_LIST,
      feeStructures,
      formValues: {},
      errors: {},
      submitted: true,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { showForm, submit };
