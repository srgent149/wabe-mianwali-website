const prisma = require('../config/prisma');

async function index(req, res, next) {
  try {
    const faculty = await prisma.facultyMember.findMany({ orderBy: { displayOrder: 'asc' } });
    const departments = [...new Set(faculty.map((f) => f.department))].sort();

    res.render('faculty', {
      title: 'Faculty - The WABE International School, Mianwali Campus',
      description: 'Meet the experienced teaching and administrative faculty at The WABE International School, Mianwali Campus.',
      faculty,
      departments,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { index };
