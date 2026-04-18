const SystemDailyLog = require('../../models/admin_models/SystemDailyLog');

const getDashboardAnalytics = async (req, res) => {
  try {
    const now = new Date();

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    const weekLogs = await SystemDailyLog.find({
      date: { $gte: startOfWeek, $lt: endOfWeek }
    });

    const weekly = {
      logins:    Array(7).fill(0),
      late:      Array(7).fill(0),
      absent:    Array(7).fill(0),
      overtime:  Array(7).fill(0),
      undertime: Array(7).fill(0),
    };

    weekLogs.forEach(log => {
      const d = new Date(log.date).getDay();
      if (!log.absent)       weekly.logins[d]    += 1;
      if (log.absent)        weekly.absent[d]    += 1;
      if (log.latetime > 0)  weekly.late[d]      += 1;
      if (log.overtime > 0)  weekly.overtime[d]  += 1;
      if (log.undertime > 0) weekly.undertime[d] += 1;
    });

    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date(startOfToday);
    endOfToday.setDate(startOfToday.getDate() + 1);

    const todayLogs = await SystemDailyLog.find({
      date: { $gte: startOfToday, $lt: endOfToday }
    });

    const todayStats = {
      present:   0,
      late:      0,
      absent:    0,
      overtime:  0,
      undertime: 0,
    };

    todayLogs.forEach(log => {
      if (log.absent) { todayStats.absent += 1; return; }
      todayStats.present += 1;
      if (log.latetime > 0)  todayStats.late      += 1;
      if (log.overtime > 0)  todayStats.overtime  += 1;
      if (log.undertime > 0) todayStats.undertime += 1;
    });

    res.status(200).json({ weekly, today: todayStats });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ NEW — raw today logs for the table + activity feed
const getTodayLogs = async (req, res) => {
  try {
    const now = new Date();

    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date(startOfToday);
    endOfToday.setDate(startOfToday.getDate() + 1);

    const logs = await SystemDailyLog.find({
      date: { $gte: startOfToday, $lt: endOfToday }
    }).sort({ timeIn: -1 });

    res.status(200).json({ logs });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ both exported now
module.exports = { getDashboardAnalytics, getTodayLogs };