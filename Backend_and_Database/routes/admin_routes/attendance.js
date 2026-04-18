const express = require('express');
const router = express.Router();

const { getAttendance } = require('../../controllers/admin_controllers/attendanceController');

router.get('/', getAttendance);

module.exports = router;