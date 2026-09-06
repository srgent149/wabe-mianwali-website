const bcrypt = require('bcrypt');
const prisma = require('../config/prisma');
const { CLASS_LIST } = require('../utils/constants');

// ---------- Auth ----------

function loginForm(req, res) {
  if (req.session.adminId) return res.redirect('/admin');
  res.render('admin/login', { title: 'Admin Login', layout: 'admin/layout', bare: true });
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const admin = await prisma.adminUser.findUnique({ where: { email: (email || '').trim().toLowerCase() } });

    if (!admin || !(await bcrypt.compare(password || '', admin.passwordHash))) {
      req.flash('error', 'Invalid email or password.');
      return res.redirect('/admin/login');
    }

    req.session.adminId = admin.id;
    req.session.adminEmail = admin.email;
    res.redirect('/admin');
  } catch (err) {
    next(err);
  }
}

function logout(req, res) {
  req.session.destroy(() => {
    res.redirect('/admin/login');
  });
}

// ---------- Dashboard ----------

async function dashboard(req, res, next) {
  try {
    const [applications, jobApplications, contactMessages, students, feeChallans] = await Promise.all([
      prisma.admissionApplication.count(),
      prisma.jobApplication.count(),
      prisma.contactMessage.count({ where: { isRead: false } }),
      prisma.student.count(),
      prisma.feeChallan.count({ where: { status: 'Unpaid' } }),
    ]);

    const recentAdmissions = await prisma.admissionApplication.findMany({ orderBy: { createdAt: 'desc' }, take: 5 });
    const recentMessages = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' }, take: 5 });

    res.render('admin/dashboard', {
      title: 'Admin Dashboard',
      layout: 'admin/layout',
      stats: { applications, jobApplications, contactMessages, students, feeChallans },
      recentAdmissions,
      recentMessages,
    });
  } catch (err) {
    next(err);
  }
}

// ---------- Admission Applications ----------

async function listAdmissions(req, res, next) {
  try {
    const applications = await prisma.admissionApplication.findMany({ orderBy: { createdAt: 'desc' } });
    res.render('admin/admissions', { title: 'Admission Applications', layout: 'admin/layout', applications });
  } catch (err) {
    next(err);
  }
}

async function updateAdmissionStatus(req, res, next) {
  try {
    await prisma.admissionApplication.update({
      where: { id: parseInt(req.params.id, 10) },
      data: { status: req.body.status },
    });
    req.flash('success', 'Application status updated.');
    res.redirect('/admin/admissions');
  } catch (err) {
    next(err);
  }
}

// ---------- Job Applications ----------

async function listJobApplications(req, res, next) {
  try {
    const applications = await prisma.jobApplication.findMany({
      orderBy: { createdAt: 'desc' },
      include: { jobOpening: true },
    });
    res.render('admin/job-applications', { title: 'Job Applications', layout: 'admin/layout', applications });
  } catch (err) {
    next(err);
  }
}

// ---------- Contact Messages ----------

async function listContactMessages(req, res, next) {
  try {
    const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } });
    res.render('admin/contact-messages', { title: 'Contact Messages', layout: 'admin/layout', messages });
  } catch (err) {
    next(err);
  }
}

async function markMessageRead(req, res, next) {
  try {
    await prisma.contactMessage.update({ where: { id: parseInt(req.params.id, 10) }, data: { isRead: true } });
    req.flash('success', 'Message marked as read.');
    res.redirect('/admin/contact-messages');
  } catch (err) {
    next(err);
  }
}

// ---------- Fee Structures ----------

async function listFeeStructures(req, res, next) {
  try {
    const feeStructures = await prisma.feeStructure.findMany({ orderBy: { displayOrder: 'asc' } });
    res.render('admin/fee-structures', { title: 'Fee Structure', layout: 'admin/layout', feeStructures, classList: CLASS_LIST });
  } catch (err) {
    next(err);
  }
}

async function saveFeeStructure(req, res, next) {
  try {
    const { id, className, admissionFee, monthlyTuition, examFee, displayOrder } = req.body;
    const data = {
      className,
      admissionFee: parseInt(admissionFee, 10),
      monthlyTuition: parseInt(monthlyTuition, 10),
      examFee: parseInt(examFee, 10),
      displayOrder: parseInt(displayOrder || '0', 10),
    };
    if (id) {
      await prisma.feeStructure.update({ where: { id: parseInt(id, 10) }, data });
    } else {
      await prisma.feeStructure.create({ data });
    }
    req.flash('success', 'Fee structure saved.');
    res.redirect('/admin/fee-structures');
  } catch (err) {
    next(err);
  }
}

async function deleteFeeStructure(req, res, next) {
  try {
    await prisma.feeStructure.delete({ where: { id: parseInt(req.params.id, 10) } });
    req.flash('success', 'Fee structure deleted.');
    res.redirect('/admin/fee-structures');
  } catch (err) {
    next(err);
  }
}

// ---------- Students & Fee Challans ----------

async function listFeeChallans(req, res, next) {
  try {
    const [challans, students] = await Promise.all([
      prisma.feeChallan.findMany({ orderBy: { createdAt: 'desc' }, include: { student: true }, take: 100 }),
      prisma.student.findMany({ orderBy: { name: 'asc' } }),
    ]);
    res.render('admin/fee-challans', { title: 'Fee Challans', layout: 'admin/layout', challans, students, classList: CLASS_LIST });
  } catch (err) {
    next(err);
  }
}

async function createStudent(req, res, next) {
  try {
    const { rollNumber, name, className, section, guardianName, guardianPhone, guardianEmail } = req.body;
    await prisma.student.create({
      data: { rollNumber, name, className, section, guardianName, guardianPhone, guardianEmail: guardianEmail || null },
    });
    req.flash('success', 'Student added.');
    res.redirect('/admin/fee-challans');
  } catch (err) {
    next(err);
  }
}

async function saveFeeChallan(req, res, next) {
  try {
    const { studentId, month, tuitionAmount, fineAmount, dueDate, status, paidDate, method } = req.body;
    const tuition = parseInt(tuitionAmount, 10);
    const fine = parseInt(fineAmount || '0', 10);

    await prisma.feeChallan.create({
      data: {
        studentId: parseInt(studentId, 10),
        month,
        tuitionAmount: tuition,
        fineAmount: fine,
        totalAmount: tuition + fine,
        dueDate: new Date(dueDate),
        status,
        paidDate: paidDate ? new Date(paidDate) : null,
        method: method || null,
      },
    });
    req.flash('success', 'Fee challan created.');
    res.redirect('/admin/fee-challans');
  } catch (err) {
    next(err);
  }
}

async function deleteFeeChallan(req, res, next) {
  try {
    await prisma.feeChallan.delete({ where: { id: parseInt(req.params.id, 10) } });
    req.flash('success', 'Fee challan deleted.');
    res.redirect('/admin/fee-challans');
  } catch (err) {
    next(err);
  }
}

// ---------- Job Openings ----------

async function listJobOpenings(req, res, next) {
  try {
    const jobOpenings = await prisma.jobOpening.findMany({ orderBy: { displayOrder: 'asc' } });
    res.render('admin/job-openings', { title: 'Job Openings', layout: 'admin/layout', jobOpenings });
  } catch (err) {
    next(err);
  }
}

async function saveJobOpening(req, res, next) {
  try {
    const { id, title, department, type, requirements, isActive, displayOrder } = req.body;
    const data = {
      title,
      department,
      type,
      requirements,
      isActive: isActive === 'on' || isActive === 'true',
      displayOrder: parseInt(displayOrder || '0', 10),
    };
    if (id) {
      await prisma.jobOpening.update({ where: { id: parseInt(id, 10) }, data });
    } else {
      await prisma.jobOpening.create({ data });
    }
    req.flash('success', 'Job opening saved.');
    res.redirect('/admin/job-openings');
  } catch (err) {
    next(err);
  }
}

async function deleteJobOpening(req, res, next) {
  try {
    await prisma.jobOpening.delete({ where: { id: parseInt(req.params.id, 10) } });
    req.flash('success', 'Job opening deleted.');
    res.redirect('/admin/job-openings');
  } catch (err) {
    next(err);
  }
}

// ---------- Faculty ----------

async function listFaculty(req, res, next) {
  try {
    const faculty = await prisma.facultyMember.findMany({ orderBy: { displayOrder: 'asc' } });
    res.render('admin/faculty', { title: 'Faculty', layout: 'admin/layout', faculty });
  } catch (err) {
    next(err);
  }
}

async function saveFaculty(req, res, next) {
  try {
    const { id, name, role, department, qualification, yearsExperience, displayOrder } = req.body;
    const data = {
      name,
      role,
      department,
      qualification,
      yearsExperience: parseInt(yearsExperience, 10),
      displayOrder: parseInt(displayOrder || '0', 10),
    };
    if (req.file) {
      data.photoPath = `/uploads/${req.file.filename}`;
    }
    if (id) {
      await prisma.facultyMember.update({ where: { id: parseInt(id, 10) }, data });
    } else {
      await prisma.facultyMember.create({ data });
    }
    req.flash('success', 'Faculty member saved.');
    res.redirect('/admin/faculty');
  } catch (err) {
    next(err);
  }
}

async function deleteFaculty(req, res, next) {
  try {
    await prisma.facultyMember.delete({ where: { id: parseInt(req.params.id, 10) } });
    req.flash('success', 'Faculty member deleted.');
    res.redirect('/admin/faculty');
  } catch (err) {
    next(err);
  }
}

// ---------- Events / News ----------

async function listEvents(req, res, next) {
  try {
    const events = await prisma.eventOrNews.findMany({ orderBy: { eventDate: 'desc' } });
    res.render('admin/events', { title: 'Events & News', layout: 'admin/layout', events });
  } catch (err) {
    next(err);
  }
}

async function saveEvent(req, res, next) {
  try {
    const { id, title, type, description, eventDate, isPublished } = req.body;
    const data = {
      title,
      type,
      description,
      eventDate: new Date(eventDate),
      isPublished: isPublished === 'on' || isPublished === 'true',
    };
    if (id) {
      await prisma.eventOrNews.update({ where: { id: parseInt(id, 10) }, data });
    } else {
      await prisma.eventOrNews.create({ data });
    }
    req.flash('success', 'Event/News saved.');
    res.redirect('/admin/events');
  } catch (err) {
    next(err);
  }
}

async function deleteEvent(req, res, next) {
  try {
    await prisma.eventOrNews.delete({ where: { id: parseInt(req.params.id, 10) } });
    req.flash('success', 'Event/News deleted.');
    res.redirect('/admin/events');
  } catch (err) {
    next(err);
  }
}

// ---------- Journal Issues ----------

async function listJournal(req, res, next) {
  try {
    const journalIssues = await prisma.journalIssue.findMany({ orderBy: { publishDate: 'desc' } });
    res.render('admin/journal', { title: 'School Journal', layout: 'admin/layout', journalIssues });
  } catch (err) {
    next(err);
  }
}

async function saveJournal(req, res, next) {
  try {
    const { id, issueLabel, title, description, publishDate } = req.body;
    const data = { issueLabel, title, description, publishDate: new Date(publishDate) };
    if (req.file) {
      data.pdfFilePath = `/uploads/${req.file.filename}`;
    }
    if (id) {
      await prisma.journalIssue.update({ where: { id: parseInt(id, 10) }, data });
    } else {
      await prisma.journalIssue.create({ data });
    }
    req.flash('success', 'Journal issue saved.');
    res.redirect('/admin/journal');
  } catch (err) {
    next(err);
  }
}

async function deleteJournal(req, res, next) {
  try {
    await prisma.journalIssue.delete({ where: { id: parseInt(req.params.id, 10) } });
    req.flash('success', 'Journal issue deleted.');
    res.redirect('/admin/journal');
  } catch (err) {
    next(err);
  }
}

// ---------- Gallery Categories ----------

async function listGallery(req, res, next) {
  try {
    const categories = await prisma.galleryCategory.findMany({ orderBy: { displayOrder: 'asc' } });
    res.render('admin/gallery', { title: 'Gallery Categories', layout: 'admin/layout', categories });
  } catch (err) {
    next(err);
  }
}

async function saveGalleryCategory(req, res, next) {
  try {
    const { id, title, colorTheme, iconKey, displayOrder } = req.body;
    const data = { title, colorTheme, iconKey, displayOrder: parseInt(displayOrder || '0', 10) };
    if (id) {
      await prisma.galleryCategory.update({ where: { id: parseInt(id, 10) }, data });
    } else {
      await prisma.galleryCategory.create({ data });
    }
    req.flash('success', 'Gallery category saved.');
    res.redirect('/admin/gallery');
  } catch (err) {
    next(err);
  }
}

async function deleteGalleryCategory(req, res, next) {
  try {
    await prisma.galleryCategory.delete({ where: { id: parseInt(req.params.id, 10) } });
    req.flash('success', 'Gallery category deleted.');
    res.redirect('/admin/gallery');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  loginForm,
  login,
  logout,
  dashboard,
  listAdmissions,
  updateAdmissionStatus,
  listJobApplications,
  listContactMessages,
  markMessageRead,
  listFeeStructures,
  saveFeeStructure,
  deleteFeeStructure,
  listFeeChallans,
  createStudent,
  saveFeeChallan,
  deleteFeeChallan,
  listJobOpenings,
  saveJobOpening,
  deleteJobOpening,
  listFaculty,
  saveFaculty,
  deleteFaculty,
  listEvents,
  saveEvent,
  deleteEvent,
  listJournal,
  saveJournal,
  deleteJournal,
  listGallery,
  saveGalleryCategory,
  deleteGalleryCategory,
};
