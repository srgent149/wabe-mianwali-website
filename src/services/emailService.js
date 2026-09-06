const { sendMail } = require('../config/mailer');
const env = require('../config/env');

const schoolName = `${env.school.name}, ${env.school.campus}`;

async function sendAdmissionEmails(application) {
  const subject = `New Admission Application - ${application.studentName}`;
  const officeText = [
    `A new admission application has been submitted.`,
    ``,
    `Student: ${application.studentName}`,
    `Class applied for: ${application.classAppliedFor}`,
    `Date of birth: ${new Date(application.dob).toDateString()}`,
    `Gender: ${application.gender}`,
    `Previous school: ${application.previousSchool || 'N/A'}`,
    `Guardian: ${application.guardianName} (${application.relation})`,
    `Phone: ${application.phone}`,
    `Email: ${application.email}`,
    `Address: ${application.address}`,
    `Notes: ${application.notes || 'N/A'}`,
  ].join('\n');

  await sendMail({ to: env.school.officeEmail, subject, text: officeText });

  const applicantText = [
    `Dear ${application.guardianName},`,
    ``,
    `Thank you for applying to ${schoolName} for ${application.studentName} (${application.classAppliedFor}).`,
    `We have received your application and our admissions team will contact you shortly to schedule the next steps.`,
    ``,
    `Regards,`,
    `${schoolName} Admissions Office`,
  ].join('\n');

  await sendMail({
    to: application.email,
    subject: `We received your application - ${schoolName}`,
    text: applicantText,
  });
}

async function sendJobApplicationEmails(application, jobTitle) {
  const subject = `New Job Application - ${jobTitle} - ${application.applicantName}`;
  const hrText = [
    `A new job application has been submitted.`,
    ``,
    `Position: ${jobTitle}`,
    `Applicant: ${application.applicantName}`,
    `Qualification: ${application.qualification}`,
    `Experience: ${application.experience}`,
    `Phone: ${application.phone}`,
    `Email: ${application.email}`,
    `Cover message: ${application.coverMessage || 'N/A'}`,
  ].join('\n');

  await sendMail({ to: env.school.hrEmail, subject, text: hrText });

  const applicantText = [
    `Dear ${application.applicantName},`,
    ``,
    `Thank you for applying for the ${jobTitle} position at ${schoolName}.`,
    `Our HR team will review your application and reach out if your profile is shortlisted.`,
    ``,
    `Regards,`,
    `${schoolName} HR Office`,
  ].join('\n');

  await sendMail({
    to: application.email,
    subject: `Application received - ${schoolName}`,
    text: applicantText,
  });
}

async function sendContactEmails(message) {
  const subject = `New Contact Message - ${message.reason}`;
  const officeText = [
    `A new contact message has been submitted via the website.`,
    ``,
    `Name: ${message.name}`,
    `Phone: ${message.phone}`,
    `Email: ${message.email}`,
    `Reason: ${message.reason}`,
    `Message: ${message.message}`,
  ].join('\n');

  await sendMail({ to: env.school.officeEmail, subject, text: officeText });

  const senderText = [
    `Dear ${message.name},`,
    ``,
    `Thank you for reaching out to ${schoolName}. We have received your message and will respond soon.`,
    ``,
    `Regards,`,
    `${schoolName} Front Office`,
  ].join('\n');

  await sendMail({
    to: message.email,
    subject: `We received your message - ${schoolName}`,
    text: senderText,
  });
}

module.exports = { sendAdmissionEmails, sendJobApplicationEmails, sendContactEmails };
