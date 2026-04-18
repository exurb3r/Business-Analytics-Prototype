const express = require('express');
const router = express.Router();
const authController = require('../../controllers/admin_controllers/addEmployeeController');

router.post('/', authController.addEmployee);

module.exports = router;