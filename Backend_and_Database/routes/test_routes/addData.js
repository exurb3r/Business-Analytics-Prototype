const express = require('express');
const router = express.Router();
const addDataController = require('../../controllers/test_controllers/addDataController');

router.post('/', addDataController.addData);

module.exports = router;