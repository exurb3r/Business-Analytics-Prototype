const express = require('express');
const router = express.Router();
const { 
    updateEmployeeByEmail,
    getEmployeeByEmail // 🔥 import
} = require('../../controllers/admin_controllers/addEmployeeController');


router.get('/:email', getEmployeeByEmail);


router.put('/:email', updateEmployeeByEmail);

module.exports = router;