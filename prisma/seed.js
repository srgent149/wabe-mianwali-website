require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

const CLASS_ORDER = [
  'Nursery',
  'KG',
  'Class 1',
  'Class 2',
  'Class 3',
  'Class 4',
  'Class 5',
  'Class 6',
  'Class 7',
  'Class 8',
  'Class 9',
  'Class 10',
];

async function main() {
  console.log('Seeding database...');

  // ---- Fee Structure ----
  await prisma.feeChallan.deleteMany();
  await prisma.student.deleteMany();
  await prisma.feeStructure.deleteMany();
  await prisma.jobApplication.deleteMany();
  await prisma.jobOpening.deleteMany();
  await prisma.facultyMember.deleteMany();
  await prisma.galleryImage.deleteMany();
  await prisma.galleryCategory.deleteMany();
  await prisma.eventOrNews.deleteMany();
  await prisma.journalIssue.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.journalSubscriber.deleteMany();
  await prisma.admissionApplication.deleteMany();
  await prisma.adminUser.deleteMany();

  const baseFees = [
    { admissionFee: 8000, monthlyTuition: 3500, examFee: 800 }, // Nursery
    { admissionFee: 8000, monthlyTuition: 3500, examFee: 800 }, // KG
    { admissionFee: 9000, monthlyTuition: 4000, examFee: 900 }, // 1
    { admissionFee: 9000, monthlyTuition: 4000, examFee: 900 }, // 2
    { admissionFee: 9500, monthlyTuition: 4300, examFee: 1000 }, // 3
    { admissionFee: 9500, monthlyTuition: 4300, examFee: 1000 }, // 4
    { admissionFee: 10000, monthlyTuition: 4600, examFee: 1100 }, // 5
    { admissionFee: 11000, monthlyTuition: 5200, examFee: 1300 }, // 6
    { admissionFee: 11000, monthlyTuition: 5200, examFee: 1300 }, // 7
    { admissionFee: 11500, monthlyTuition: 5600, examFee: 1400 }, // 8
    { admissionFee: 13000, monthlyTuition: 6500, examFee: 1800 }, // 9
    { admissionFee: 13000, monthlyTuition: 6800, examFee: 2000 }, // 10
  ];

  for (let i = 0; i < CLASS_ORDER.length; i++) {
    await prisma.feeStructure.create({
      data: {
        className: CLASS_ORDER[i],
        ...baseFees[i],
        displayOrder: i,
      },
    });
  }

  // ---- Students + Fee Challans ----
  const studentSeeds = [
    {
      rollNumber: 'WM-1001',
      name: 'Ahmad Raza',
      className: 'Class 1',
      section: 'A',
      guardianName: 'Muhammad Raza',
      guardianPhone: '0300-1234567',
      guardianEmail: 'mraza@example.com',
    },
    {
      rollNumber: 'WM-1002',
      name: 'Ayesha Noor',
      className: 'Class 1',
      section: 'A',
      guardianName: 'Noor Ahmed',
      guardianPhone: '0301-2345678',
      guardianEmail: 'nahmed@example.com',
    },
    {
      rollNumber: 'WM-1003',
      name: 'Bilal Hussain',
      className: 'Class 3',
      section: 'B',
      guardianName: 'Hussain Shah',
      guardianPhone: '0302-3456789',
      guardianEmail: 'hshah@example.com',
    },
    {
      rollNumber: 'WM-1004',
      name: 'Fatima Zahra',
      className: 'Class 3',
      section: 'B',
      guardianName: 'Ali Zahra',
      guardianPhone: '0303-4567890',
      guardianEmail: 'azahra@example.com',
    },
    {
      rollNumber: 'WM-1005',
      name: 'Hamza Iqbal',
      className: 'Class 5',
      section: 'A',
      guardianName: 'Iqbal Khan',
      guardianPhone: '0304-5678901',
      guardianEmail: 'ikhan@example.com',
    },
    {
      rollNumber: 'WM-1006',
      name: 'Zainab Malik',
      className: 'Class 5',
      section: 'A',
      guardianName: 'Malik Tariq',
      guardianPhone: '0305-6789012',
      guardianEmail: 'mtariq@example.com',
    },
    {
      rollNumber: 'WM-1007',
      name: 'Usman Ghani',
      className: 'Class 7',
      section: 'C',
      guardianName: 'Ghani Baig',
      guardianPhone: '0306-7890123',
      guardianEmail: 'gbaig@example.com',
    },
    {
      rollNumber: 'WM-1008',
      name: 'Mariam Yousaf',
      className: 'Class 7',
      section: 'C',
      guardianName: 'Yousaf Mehmood',
      guardianPhone: '0307-8901234',
      guardianEmail: 'ymehmood@example.com',
    },
    {
      rollNumber: 'WM-1009',
      name: 'Talha Farooq',
      className: 'Class 9',
      section: 'A',
      guardianName: 'Farooq Anwar',
      guardianPhone: '0308-9012345',
      guardianEmail: 'fanwar@example.com',
    },
    {
      rollNumber: 'WM-1010',
      name: 'Hira Shahid',
      className: 'Class 9',
      section: 'A',
      guardianName: 'Shahid Pervez',
      guardianPhone: '0309-0123456',
      guardianEmail: 'spervez@example.com',
    },
    {
      rollNumber: 'WM-1011',
      name: 'Saad Aslam',
      className: 'Class 10',
      section: 'A',
      guardianName: 'Aslam Javed',
      guardianPhone: '0310-1122334',
      guardianEmail: 'ajaved@example.com',
    },
    {
      rollNumber: 'WM-1012',
      name: 'Alina Sadiq',
      className: 'Class 10',
      section: 'A',
      guardianName: 'Sadiq Nawaz',
      guardianPhone: '0311-2233445',
      guardianEmail: 'snawaz@example.com',
    },
  ];

  const feeByClass = Object.fromEntries(CLASS_ORDER.map((c, i) => [c, baseFees[i]]));

  for (const s of studentSeeds) {
    const student = await prisma.student.create({ data: s });
    const fee = feeByClass[s.className];

    // Two challans per student: one paid (previous month), one unpaid/partial (current month)
    await prisma.feeChallan.create({
      data: {
        studentId: student.id,
        month: 'July 2026',
        tuitionAmount: fee.monthlyTuition,
        fineAmount: 0,
        totalAmount: fee.monthlyTuition,
        dueDate: new Date('2026-07-10'),
        status: 'Paid',
        paidDate: new Date('2026-07-05'),
        method: 'Bank Transfer',
      },
    });

    const isFined = ['WM-1003', 'WM-1007', 'WM-1011'].includes(s.rollNumber);
    const fine = isFined ? 500 : 0;
    await prisma.feeChallan.create({
      data: {
        studentId: student.id,
        month: 'August 2026',
        tuitionAmount: fee.monthlyTuition,
        fineAmount: fine,
        totalAmount: fee.monthlyTuition + fine,
        dueDate: new Date('2026-08-10'),
        status: isFined ? 'Unpaid' : 'Paid',
        paidDate: isFined ? null : new Date('2026-08-06'),
        method: isFined ? null : 'Cash',
      },
    });
  }

  // ---- Faculty ----
  const facultySeeds = [
    {
      name: 'Mrs. Saima Anwar',
      role: 'Principal',
      department: 'Administration',
      qualification: 'M.Ed, M.A. English',
      yearsExperience: 18,
      displayOrder: 0,
    },
    {
      name: 'Mr. Kamran Yousuf',
      role: 'Vice Principal',
      department: 'Administration',
      qualification: 'M.Phil Education',
      yearsExperience: 15,
      displayOrder: 1,
    },
    {
      name: 'Ms. Rabia Naz',
      role: 'Head of Early Years',
      department: 'Early Years',
      qualification: 'B.Ed, Montessori Diploma',
      yearsExperience: 12,
      displayOrder: 2,
    },
    {
      name: 'Mr. Adnan Sattar',
      role: 'Senior Mathematics Teacher',
      department: 'Mathematics',
      qualification: 'M.Sc. Mathematics',
      yearsExperience: 11,
      displayOrder: 3,
    },
    {
      name: 'Ms. Farah Deeba',
      role: 'Senior English Teacher',
      department: 'English',
      qualification: 'M.A. English Literature',
      yearsExperience: 10,
      displayOrder: 4,
    },
    {
      name: 'Mr. Waqas Ahmed',
      role: 'Science Coordinator',
      department: 'Science',
      qualification: 'M.Sc. Physics',
      yearsExperience: 9,
      displayOrder: 5,
    },
    {
      name: 'Ms. Nadia Iqbal',
      role: 'Computer Science Teacher',
      department: 'Computer Science',
      qualification: 'BS Computer Science',
      yearsExperience: 7,
      displayOrder: 6,
    },
    {
      name: 'Mr. Zubair Hassan',
      role: 'Islamiyat & Urdu Teacher',
      department: 'Languages',
      qualification: 'M.A. Islamic Studies',
      yearsExperience: 13,
      displayOrder: 7,
    },
    {
      name: 'Ms. Sana Riaz',
      role: 'Guidance Counselor',
      department: 'Guidance & Development',
      qualification: 'M.Sc. Psychology',
      yearsExperience: 6,
      displayOrder: 8,
    },
    {
      name: 'Mr. Imran Latif',
      role: 'Sports & PE Teacher',
      department: 'Physical Education',
      qualification: 'B.Ed, Sports Sciences',
      yearsExperience: 8,
      displayOrder: 9,
    },
  ];
  await prisma.facultyMember.createMany({ data: facultySeeds });

  // ---- Job Openings ----
  const jobSeeds = [
    {
      title: 'Primary School Teacher',
      department: 'Primary Section',
      type: 'Full-time',
      requirements: 'B.Ed / BS Education, 2+ years teaching experience, strong classroom management skills.',
      displayOrder: 0,
    },
    {
      title: 'Mathematics Teacher (Middle School)',
      department: 'Mathematics',
      type: 'Full-time',
      requirements: 'M.Sc. Mathematics or equivalent, 3+ years experience teaching Grades 6-8.',
      displayOrder: 1,
    },
    {
      title: 'Science Teacher',
      department: 'Science',
      type: 'Full-time',
      requirements: 'M.Sc. in a Science subject, lab experience preferred, Federal Board curriculum familiarity.',
      displayOrder: 2,
    },
    {
      title: 'Computer Science Teacher',
      department: 'Computer Science',
      type: 'Part-time',
      requirements: 'BS Computer Science / IT, ability to teach programming basics to Grades 6-10.',
      displayOrder: 3,
    },
    {
      title: 'Front Office Coordinator',
      department: 'Administration',
      type: 'Full-time',
      requirements: "Bachelor's degree, excellent communication skills, prior front-desk/admin experience.",
      displayOrder: 4,
    },
    {
      title: 'Sports Instructor',
      department: 'Physical Education',
      type: 'Part-time',
      requirements: 'Diploma/degree in Sports Sciences or PE, experience coaching school-age children.',
      displayOrder: 5,
    },
  ];
  await prisma.jobOpening.createMany({ data: jobSeeds });

  // ---- Gallery Categories ----
  const gallerySeeds = [
    { title: 'Campus & Classrooms', colorTheme: 'blue', iconKey: 'building', displayOrder: 0 },
    { title: 'Science Labs', colorTheme: 'green', iconKey: 'microscope', displayOrder: 1 },
    { title: 'Sports Day', colorTheme: 'blue', iconKey: 'trophy', displayOrder: 2 },
    { title: 'Annual Function', colorTheme: 'green', iconKey: 'mic', displayOrder: 3 },
    { title: 'Digital Learning', colorTheme: 'blue', iconKey: 'laptop', displayOrder: 4 },
    { title: 'Library & Reading Corner', colorTheme: 'green', iconKey: 'book', displayOrder: 5 },
    { title: 'Field Trips', colorTheme: 'blue', iconKey: 'globe', displayOrder: 6 },
    { title: 'Graduation Day', colorTheme: 'green', iconKey: 'cap', displayOrder: 7 },
  ];
  await prisma.galleryCategory.createMany({ data: gallerySeeds });

  // ---- Events / News ----
  const eventSeeds = [
    {
      title: 'Annual Sports Day 2026',
      type: 'Event',
      description: 'A full day of inter-house athletics, races, and team sports for all classes.',
      eventDate: new Date('2026-09-20'),
      isPublished: true,
    },
    {
      title: 'Federal Board Matric Results Announced',
      type: 'News',
      description: 'Congratulations to our Class 10 students on an outstanding first Matriculation batch result.',
      eventDate: new Date('2026-08-15'),
      isPublished: true,
    },
    {
      title: 'Parent-Teacher Meeting - Term 1',
      type: 'Event',
      description: 'Guardians are invited to discuss student progress with class teachers.',
      eventDate: new Date('2026-09-05'),
      isPublished: true,
    },
    {
      title: 'Science Exhibition',
      type: 'Event',
      description: 'Students from Grades 6-10 showcase original science projects and experiments.',
      eventDate: new Date('2026-10-10'),
      isPublished: true,
    },
    {
      title: 'New Computer Lab Inaugurated',
      type: 'News',
      description: 'WABE Mianwali opens a newly equipped computer lab for digital learning classes.',
      eventDate: new Date('2026-08-01'),
      isPublished: true,
    },
    {
      title: 'Winter Break Notice',
      type: 'News',
      description: 'School will remain closed for winter break; classes resume in the new term.',
      eventDate: new Date('2026-12-20'),
      isPublished: true,
    },
  ];
  await prisma.eventOrNews.createMany({ data: eventSeeds });

  // ---- Journal Issues ----
  const journalSeeds = [
    {
      issueLabel: 'Issue 1',
      title: 'Foundations of Do School Differently',
      description: 'A look at our founding philosophy and the first academic year at WABE Mianwali.',
      publishDate: new Date('2025-12-01'),
    },
    {
      issueLabel: 'Issue 2',
      title: 'Growing Minds, Growing Campus',
      description: 'Coverage of our expansion to middle school and new science facilities.',
      publishDate: new Date('2026-04-01'),
    },
    {
      issueLabel: 'Issue 3',
      title: 'Our First Matric Batch',
      description: 'Celebrating Class 10 students as they prepare for Federal Board examinations.',
      publishDate: new Date('2026-08-01'),
    },
  ];
  await prisma.journalIssue.createMany({ data: journalSeeds });

  // ---- Admin User ----
  const adminEmail = process.env.ADMIN_SEED_EMAIL || 'admin@wabemianwali.edu.pk';
  const adminPassword = process.env.ADMIN_SEED_PASSWORD || 'ChangeMe123!';
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await prisma.adminUser.create({
    data: { email: adminEmail, passwordHash },
  });

  console.log('Seed complete.');
  console.log(`Admin login -> email: ${adminEmail}  password: ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
