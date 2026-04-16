const express = require('express');
const router = express.Router();
const { permit, ROLES } = require('../middleware/role');
const verifyJWT = require('../middleware/verifyJWT');




module.exports = router;