const router = require('express').Router();
const facultyController = require('../controllers/facultyController');

router.get('/', facultyController.index);

module.exports = router;
