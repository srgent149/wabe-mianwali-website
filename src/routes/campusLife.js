const router = require('express').Router();
const campusLifeController = require('../controllers/campusLifeController');
const { formLimiter } = require('../middleware/rateLimiters');

router.get('/', campusLifeController.index);
router.post('/subscribe', formLimiter, campusLifeController.subscribe);

module.exports = router;
