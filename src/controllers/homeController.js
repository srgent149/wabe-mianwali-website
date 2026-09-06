const prisma = require('../config/prisma');
const syllabus = require('../config/syllabus');

async function index(req, res, next) {
  try {
    const [studentCount, facultyCount] = await Promise.all([
      prisma.student.count({ where: { status: 'Active' } }),
      prisma.facultyMember.count(),
    ]);

    const stagePreview = [
      { key: 'nursery-kg', label: 'Early Years', subjectsFrom: 'nursery-kg' },
      { key: 'grades-1-2', label: 'Primary I', subjectsFrom: 'grades-1-2' },
      { key: 'grades-3-5', label: 'Primary II', subjectsFrom: 'grades-3-5' },
      { key: 'grades-6-8', label: 'Middle School', subjectsFrom: 'grades-6-8' },
    ].map((stage) => {
      const match = syllabus.find((s) => s.key === stage.subjectsFrom);
      return { ...stage, subjects: match ? match.subjects.slice(0, 4) : [] };
    });

    res.render('home', {
      title: 'WABE International School, Mianwali Campus - Do School Differently',
      description:
        'WABE International School, Mianwali Campus offers Nursery through Class 10 education under the Federal Board curriculum, focused on academic excellence, digital learning, and confident communication.',
      studentCount,
      facultyCount,
      stagePreview,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { index };
