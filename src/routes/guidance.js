const router = require('express').Router();
const guidanceController = require('../controllers/guidanceController');

router.get('/', guidanceController.index);

module.exports = router;
