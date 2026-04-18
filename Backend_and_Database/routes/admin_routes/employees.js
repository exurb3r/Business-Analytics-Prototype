const express = require('express');
const router = express.Router();
const employeeController = require('../../controllers/admin_controllers/employeesController');

router.get('/', employeeController.getEmployees);

module.exports = router;