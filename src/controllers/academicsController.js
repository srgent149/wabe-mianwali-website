const syllabus = require('../config/syllabus');

const assessmentStructure = [
  { name: 'Class Tests', frequency: 'Weekly', weightage: '10%' },
  { name: 'Monthly Tests', frequency: 'Monthly', weightage: '15%' },
  { name: 'Mid-Term Examination', frequency: 'Once per term', weightage: '25%' },
  { name: 'Final-Term Examination', frequency: 'End of academic year', weightage: '50%' },
  { name: 'Federal Board Examination (Class 9-10)', frequency: 'Annual (Board-conducted)', weightage: 'As per FBISE policy' },
];

function index(req, res) {
  res.render('academics', {
    title: 'Academics - WABE International School, Mianwali Campus',
    description:
      'Explore the Federal Board curriculum, subjects, and assessment structure at WABE International School, Mianwali Campus, from Nursery through Class 10.',
    syllabus,
    assessmentStructure,
  });
}

module.exports = { index };
