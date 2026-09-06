const prisma = require('../config/prisma');
const { CONTACT_REASONS } = require('../utils/constants');
const emailService = require('../services/emailService');

function index(req, res) {
  res.render('contact', {
    title: 'Contact Us - The WABE International School, Mianwali Campus',
    description: 'Get in touch with The WABE International School, Mianwali Campus - address, phone, office hours, and an online contact form.',
    reasons: CONTACT_REASONS,
    formValues: { reason: req.query.reason || '' },
    errors: {},
    submitted: false,
  });
}

async function submit(req, res, next) {
  try {
    const message = await prisma.contactMessage.create({
      data: {
        name: req.body.name.trim(),
        phone: req.body.phone.trim(),
        email: req.body.email.trim().toLowerCase(),
        reason: req.body.reason,
        message: req.body.message.trim(),
      },
    });

    emailService.sendContactEmails(message).catch((e) => console.error('Contact email failed:', e));

    res.render('contact', {
      title: 'Contact Us - The WABE International School, Mianwali Campus',
      description: 'Get in touch with The WABE International School, Mianwali Campus.',
      reasons: CONTACT_REASONS,
      formValues: {},
      errors: {},
      submitted: true,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { index, submit };
