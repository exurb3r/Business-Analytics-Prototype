const express = require('express');
const router = express.Router();

router.use('/addData', require('./test_routes/addData.js'));


module.exports = router;