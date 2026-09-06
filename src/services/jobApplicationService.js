const prisma = require('../config/prisma');

async function createApplication(data) {
  const jobOpeningId = data.jobOpeningId && data.jobOpeningId !== 'other' ? parseInt(data.jobOpeningId, 10) : null;

  return prisma.jobApplication.create({
    data: {
      jobOpeningId,
      applicantName: data.applicantName.trim(),
      qualification: data.qualification.trim(),
      experience: data.experience.trim(),
      phone: data.phone.trim(),
      email: data.email.trim().toLowerCase(),
      coverMessage: data.coverMessage || null,
      resumeFilePath: data.resumeFilePath || null,
    },
    include: { jobOpening: true },
  });
}

module.exports = { createApplication };
