require('dotenv').config();

function required(name, fallback) {
  return process.env[name] || fallback;
}

module.exports = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  isProd: process.env.NODE_ENV === 'production',
  sessionSecret: required('SESSION_SECRET', 'dev-only-insecure-secret'),

  smtp: {
    host: process.env.SMTP_HOST || '',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.SMTP_FROM || 'WABE International School <no-reply@wabemianwali.edu.pk>',
  },

  school: {
    officeEmail: required('SCHOOL_OFFICE_EMAIL', 'office@wabemianwali.edu.pk'),
    hrEmail: required('SCHOOL_HR_EMAIL', 'careers@wabemianwali.edu.pk'),
    address: required('SCHOOL_ADDRESS', 'WABE International School, Mianwali Campus, Mianwali, Punjab, Pakistan'),
    phone: required('SCHOOL_PHONE', '+92 300 0000000'),
    whatsappNumber: required('SCHOOL_WHATSAPP_NUMBER', '923000000000'),
    mapsEmbedUrl: required('GOOGLE_MAPS_EMBED_URL', 'https://www.google.com/maps?q=Mianwali,Punjab,Pakistan&output=embed'),
    name: 'WABE International School',
    campus: 'Mianwali Campus',
    brandLine: 'Do School Differently',
    tagline: 'Working At Basic Education',
    officeHours: 'Mon - Sat, 8:00 AM - 3:00 PM',
    socials: {
      facebook: 'https://facebook.com',
      instagram: 'https://instagram.com',
      youtube: 'https://youtube.com',
    },
  },
};
