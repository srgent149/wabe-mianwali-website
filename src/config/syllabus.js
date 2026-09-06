// Curriculum data changes rarely (once per academic year at most), so it lives
// here as a static config rather than a database table. If it needs to become
// editable via the admin area later, promote this to a Prisma model following
// the same shape.

module.exports = [
  {
    key: 'nursery-kg',
    label: 'Nursery - KG',
    board: 'Federal Board (Early Years Framework)',
    subjects: ['English', 'Urdu', 'Numeracy', 'Environmental Studies', 'Art & Craft', 'Physical Activity'],
  },
  {
    key: 'grades-1-2',
    label: 'Grades 1 - 2',
    board: 'Federal Board',
    subjects: ['English', 'Urdu', 'Mathematics', 'General Science', 'Islamiyat', 'Social Studies', 'Computer Studies'],
  },
  {
    key: 'grades-3-5',
    label: 'Grades 3 - 5',
    board: 'Federal Board',
    subjects: ['English', 'Urdu', 'Mathematics', 'Science', 'Islamiyat', 'Social Studies', 'Computer Science', 'Art'],
  },
  {
    key: 'grades-6-8',
    label: 'Grades 6 - 8',
    board: 'Federal Board',
    subjects: ['English', 'Urdu', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Islamiyat', 'Pakistan Studies', 'Computer Science'],
  },
  {
    key: 'grades-9-10',
    label: 'Grades 9 - 10 (Matriculation)',
    board: 'Federal Board (Federal Board of Intermediate & Secondary Education)',
    subjects: ['English', 'Urdu', 'Mathematics', 'Physics', 'Chemistry', 'Biology / Computer Science', 'Islamiyat', 'Pakistan Studies'],
  },
];
