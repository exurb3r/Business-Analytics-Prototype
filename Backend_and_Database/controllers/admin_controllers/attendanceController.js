const SystemDailyLog = require('../../models/admin_models/SystemDailyLog');
const Employee = require('../../models/admin_models/Employee');

const getAttendance = async (req, res) => {
    try {
        const { filter, date } = req.query;

        let query = {};

        if (filter === 'today') {
            const today = new Date().toISOString().split('T')[0];
            query.date = {
                $gte: new Date(today),
                $lt: new Date(today + 'T23:59:59')
            };
        }

        if (filter === 'custom' && date) {
            query.date = {
                $gte: new Date(date),
                $lt: new Date(date + 'T23:59:59')
            };
        }

        const logs = await SystemDailyLog.find(query).lean();

        const formatted = await Promise.all(logs.map(async (log) => {

            const employee = await Employee.findById(log.employee_id).lean();

            if (!employee) {
                return {
                    id: log._id,
                    name: log.employeeName || "Unknown",
                    position: "N/A",
                    date: log.date,
                    timeIn: log.timeIn,
                    timeOut: log.timeOut,
                    status: ["Error"],
                    payroll: null
                };
            }

            // ✅ Derive daily rate the same way addData does
            const basicPay = Number(employee.basicPay) || 0;
            const workingDaysCount = employee.workingDays?.length || 26;
            const baseDailyWage = basicPay / workingDaysCount;
            const perMin = baseDailyWage / (8 * 60); // per minute rate

            // ✅ Read from DB — these are stored as minutes
            const lateMin = Number(log.latetime) || 0;
            const utMin   = Number(log.undertime) || 0;
            const otMin   = Number(log.overtime)  || 0;

            const lateDeduct = lateMin * perMin;
            const utDeduct   = utMin   * perMin;
            const otAdd      = otMin   * perMin * 1.25;
            const nightDiff  = employee.nightWorker
                ? (8 * 60) * perMin * 0.10
                : 0;

            const total = Number(log.daywage) || 0;

            const status = [];
            if (log.absent)    status.push("Absent");
            if (lateMin > 0)   status.push("Late");
            if (utMin > 0)     status.push("Undertime");
            if (otMin > 0)     status.push("Overtime");
            if (status.length === 0) status.push("On-time");

            return {
                id:          log._id,
                empId:       log.employee_id,
                name:        log.employeeName,
                position:    employee.position || "N/A",
                date:        log.date,
                timeIn:      log.timeIn,
                timeOut:     log.timeOut,
                breakOut:    log.breakStart,
                breakReturn: log.breakEnd,
                status,
                // ✅ Also expose raw minutes so frontend can show them
                lateMin,
                utMin,
                otMin,
                payroll: {
                    lateDeduct,
                    utDeduct,
                    otAdd,
                    nightDiff,
                    total
                }
            };
        }));

        res.json(formatted);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { getAttendance };