const prisma = require('../config/prisma');

async function createApplication(data) {
  return prisma.admissionApplication.create({
    data: {
      studentName: data.studentName.trim(),
      dob: new Date(data.dob),
      gender: data.gender,
      classAppliedFor: data.classAppliedFor,
      previousSchool: data.previousSchool || null,
      guardianName: data.guardianName.trim(),
      relation: data.relation,
      phone: data.phone.trim(),
      email: data.email.trim().toLowerCase(),
      address: data.address.trim(),
      notes: data.notes || null,
    },
  });
}

module.exports = { createApplication };
