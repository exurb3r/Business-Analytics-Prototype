const express = require('express');
const router = express.Router();

const {
  getDashboardAnalytics,
  getTodayLogs            // ✅ imported
} = require('../../controllers/admin_controllers/dashboardController');

router.get('/',            getDashboardAnalytics);
router.get('/today-logs',  getTodayLogs);          // ✅ new route

module.exports = router;