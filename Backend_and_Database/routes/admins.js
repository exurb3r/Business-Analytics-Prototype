const express = require('express');
const router = express.Router();
const { permit, ROLES } = require('../middleware/role');
const verifyJWT = require('../middleware/verifyJWT');

router.use("/auth", require("./admin_routes/adminAuth"));
router.use(verifyJWT);
router.use(permit(ROLES.ADMIN)); // Only allow admins  to access the following routes
router.use("/addEmployee", require("./admin_routes/addEmployee.js"));
router.use("/employees", require("./admin_routes/employees.js"));
router.use('/attendance', require('./admin_routes/attendance.js'));
router.use('/getlistofpayrolls', require('./admin_routes/getListofPayrolls.js'));
router.use('/updateEmployee', require('./admin_routes/updateEmployee.js'));
router.use('/dashboard' , require('./admin_routes/dashboard.js'))

module.exports = router;

