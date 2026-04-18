const express = require('express');
const router = express.Router();

const { getPayrollsByEmail, getPayrollByEmailAndMonth} = require('../../controllers/admin_controllers/getListofPayrolls');


router.get('/payrolls/:email', getPayrollsByEmail);
router.get('/payroll/:email/:month', getPayrollByEmailAndMonth);


module.exports = router;