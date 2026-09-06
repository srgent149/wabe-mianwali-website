const router = require('express').Router();
const adminController = require('../controllers/adminController');
const requireAdmin = require('../middleware/requireAdmin');
const { loginLimiter } = require('../middleware/rateLimiters');
const upload = require('../middleware/upload');

// Auth
router.get('/login', adminController.loginForm);
router.post('/login', loginLimiter, adminController.login);
router.post('/logout', adminController.logout);

// Everything below requires an authenticated admin session.
router.use(requireAdmin);

router.get('/', adminController.dashboard);

router.get('/admissions', adminController.listAdmissions);
router.post('/admissions/:id/status', adminController.updateAdmissionStatus);

router.get('/job-applications', adminController.listJobApplications);

router.get('/contact-messages', adminController.listContactMessages);
router.post('/contact-messages/:id/read', adminController.markMessageRead);

router.get('/fee-structures', adminController.listFeeStructures);
router.post('/fee-structures', adminController.saveFeeStructure);
router.post('/fee-structures/:id/delete', adminController.deleteFeeStructure);

router.get('/fee-challans', adminController.listFeeChallans);
router.post('/fee-challans/students', adminController.createStudent);
router.post('/fee-challans', adminController.saveFeeChallan);
router.post('/fee-challans/:id/delete', adminController.deleteFeeChallan);

router.get('/job-openings', adminController.listJobOpenings);
router.post('/job-openings', adminController.saveJobOpening);
router.post('/job-openings/:id/delete', adminController.deleteJobOpening);

router.get('/faculty', adminController.listFaculty);
router.post('/faculty', upload.single('photo'), adminController.saveFaculty);
router.post('/faculty/:id/delete', adminController.deleteFaculty);

router.get('/events', adminController.listEvents);
router.post('/events', adminController.saveEvent);
router.post('/events/:id/delete', adminController.deleteEvent);

router.get('/journal', adminController.listJournal);
router.post('/journal', upload.single('pdf'), adminController.saveJournal);
router.post('/journal/:id/delete', adminController.deleteJournal);

router.get('/gallery', adminController.listGallery);
router.post('/gallery', adminController.saveGalleryCategory);
router.post('/gallery/:id/delete', adminController.deleteGalleryCategory);

module.exports = router;
