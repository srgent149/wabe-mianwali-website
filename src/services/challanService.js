const prisma = require('../config/prisma');

async function findLatestChallan(className, rollNumber) {
  const student = await prisma.student.findFirst({
    where: {
      rollNumber: rollNumber.trim(),
      className,
    },
  });

  if (!student) {
    return null;
  }

  const challan = await prisma.feeChallan.findFirst({
    where: { studentId: student.id },
    orderBy: { dueDate: 'desc' },
  });

  if (!challan) {
    return null;
  }

  return { student, challan };
}

async function findChallanById(id) {
  const challan = await prisma.feeChallan.findUnique({
    where: { id: parseInt(id, 10) },
    include: { student: true },
  });
  return challan;
}

module.exports = { findLatestChallan, findChallanById };
