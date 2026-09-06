const router = require('express').Router();
const academicsController = require('../controllers/academicsController');

router.get('/', academicsController.index);

module.exports = router;
