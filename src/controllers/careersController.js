const prisma = require('../config/prisma');
const jobApplicationService = require('../services/jobApplicationService');
const emailService = require('../services/emailService');

async function index(req, res, next) {
  try {
    const openings = await prisma.jobOpening.findMany({ where: { isActive: true }, orderBy: { displayOrder: 'asc' } });
    res.render('careers', {
      title: 'Careers - WABE International School, Mianwali Campus',
      description: 'Explore open teaching and administrative positions at WABE International School, Mianwali Campus.',
      openings,
      formValues: {},
      errors: {},
      submitted: false,
      preselectJobId: req.query.job || '',
    });
  } catch (err) {
    next(err);
  }
}

async function submit(req, res, next) {
  try {
    const application = await jobApplicationService.createApplication(req.body);
    const jobTitle = application.jobOpening ? application.jobOpening.title : 'General Application';

    emailService.sendJobApplicationEmails(application, jobTitle).catch((e) => console.error('Job application email failed:', e));

    const openings = await prisma.jobOpening.findMany({ where: { isActive: true }, orderBy: { displayOrder: 'asc' } });
    res.render('careers', {
      title: 'Careers - WABE International School, Mianwali Campus',
      description: 'Explore open teaching and administrative positions at WABE International School, Mianwali Campus.',
      openings,
      formValues: {},
      errors: {},
      submitted: true,
      preselectJobId: '',
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { index, submit };
