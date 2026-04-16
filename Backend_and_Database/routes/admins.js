const express = require('express');
const router = express.Router();
const { permit, ROLES } = require('../middleware/role');
const verifyJWT = require('../middleware/verifyJWT');

router.use("/auth", require("./admin_routes/adminAuth"));

module.exports = router;

