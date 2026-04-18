const Employee = require('../../models/admin_models/Employee');
const EmployeeDailyLog = require('../../models/employee_models/EmployeeDailyLog');
const SystemDailyLog = require('../../models/admin_models/SystemDailyLog');
const { dailyWage: computeDailyWage, dailyGrossWage } = require('../../math/dailywageCalcu');
const holidays = require('../../system_data/holidays');
const { generateMonthlyPayrollInternal } = require('./payrollController');

const addData = async (req, res) => {

    const [email, date, timeIn, timeOut, breakStart, breakEnd] = req.body;

    try {

        const employee = await Employee.findOne({ email });
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // 🔹 SAFE TIME PARSER
        const parseTime = (dateStr, timeStr) => {
            if (!timeStr) return null;
            const [h, m] = timeStr.split(':').map(Number);
            const d = new Date(dateStr);
            d.setHours(h, m, 0, 0);
            return d;
        };

        const scheduledTimeIn = parseTime(date, employee.timeIn);
        const scheduledTimeOut = parseTime(date, employee.timeOut);
        const scheduledBreakStart = parseTime(date, employee.breakStart);
        const scheduledBreakEnd = parseTime(date, employee.breakEnd);

        const actualTimeIn = parseTime(date, timeIn);
        const actualTimeOut = parseTime(date, timeOut);
        const actualBreakStart = parseTime(date, breakStart);
        const actualBreakEnd = parseTime(date, breakEnd);

        // 🔥 STRICT ABSENT
        const absent = (!timeIn && !timeOut);

        let total_late = 0;
        let total_undertime = 0;
        let total_overtime = 0;
        let breakViolationMinutes = 0;

        if (!absent) {

            if (actualTimeIn && actualTimeIn > scheduledTimeIn) {
                total_late = Math.round((actualTimeIn - scheduledTimeIn) / 60000);
            }

            if (actualTimeOut && actualTimeOut < scheduledTimeOut) {
                total_undertime = Math.round((scheduledTimeOut - actualTimeOut) / 60000);
            }

            if (actualTimeOut && actualTimeOut > scheduledTimeOut) {
                total_overtime = Math.round((actualTimeOut - scheduledTimeOut) / 60000);
            }

            if (actualBreakStart && actualBreakEnd && actualBreakEnd > scheduledBreakEnd) {
                breakViolationMinutes = Math.round((actualBreakEnd - scheduledBreakEnd) / 60000);
            }

            total_undertime += breakViolationMinutes;
        }

        // 🔹 HOLIDAY / REST DAY
        const dateKey = new Date(date).toISOString().split('T')[0];

        let specification = 'regular day';
        let dayMultiplier = 1;

        if (holidays[dateKey]) {
            const holiday = holidays[dateKey];
            dayMultiplier = holiday.multiplier;

            if (holiday.type === 'regular') specification = 'regular holiday';
            else if (holiday.type === 'special_non_working') specification = 'special holiday';
            else if (holiday.type === 'special_day') specification = 'special working holiday';

        } else {
            const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });

            const isWorkingDay = employee.workingDays.some(
                d => d.day.toLowerCase() === dayName.toLowerCase()
            );

            if (!isWorkingDay) {
                specification = 'rest day';
                dayMultiplier = 1.3;
            }
        }

        // 🔹 WAGE
        const baseDailyWage = computeDailyWage(
            employee.basicPay,
            employee.workingDays.length
        );

        let dailyWageResult = 0;

        if (!absent) {
            dailyWageResult = dailyGrossWage(
                baseDailyWage,
                total_late,
                total_overtime,
                total_undertime,
                0,
                false,
                specification,
                dayMultiplier
            );
        }

        const overtimePay = (!absent && total_overtime > 0)
            ? ((baseDailyWage / 8) / 60) * total_overtime * 1.25
            : 0;

        // 🔹 DAILY LOG
        let dailyLog = await EmployeeDailyLog.findOne({ email });

        if (!dailyLog) {
            dailyLog = new EmployeeDailyLog({ email, employeeDailyLog: [] });
        }

        const inputDate = new Date(date);
        inputDate.setHours(0, 0, 0, 0);

        const exists = dailyLog.employeeDailyLog.some(log => {
            const logDate = new Date(log.date);
            logDate.setHours(0, 0, 0, 0);
            return logDate.getTime() === inputDate.getTime();
        });

        if (exists) {
            return res.status(400).json({ message: "Daily log already exists for this date" });
        }

        // 🔹 PUSH LOG (FIXED — NO FAKE REQUIRED FIELDS)
        dailyLog.employeeDailyLog.push({
            date: new Date(date),

            timeIn: actualTimeIn,
            timeOut: actualTimeOut,
            breakStart: actualBreakStart,
            breakEnd: actualBreakEnd,

            latetime: total_late,
            undertime: total_undertime,
            overtime: total_overtime,
            absent,

            regularPay: specification === 'regular day',
            regularHoliday: specification === 'regular holiday',
            specialHoliday: specification === 'special holiday',
            holidayPay: ['regular holiday', 'special holiday'].includes(specification),

            overtimePay,
            daywage: dailyWageResult
        });

        await dailyLog.save();

        // 🔹 SYSTEM LOG (IMPORTANT FIX HERE)
        await SystemDailyLog.create({
            date: new Date(date),

            timeIn: actualTimeIn,
            timeOut: actualTimeOut,
            breakStart: actualBreakStart,
            breakEnd: actualBreakEnd,

            employee_id: employee._id,
            employeeName: `${employee.firstname} ${employee.lastname}`,

            latetime: total_late,
            undertime: total_undertime,
            overtime: total_overtime,
            absent,

            regularPay: specification === 'regular day',
            holidayPay: ['regular holiday', 'special holiday'].includes(specification),
            regularHoliday: specification === 'regular holiday',
            specialHoliday: specification === 'special holiday',

            overtimePay,
            daywage: dailyWageResult
        });

        await generateMonthlyPayrollInternal(email, date);

        return res.status(200).json({
            message: 'Daily log saved successfully',
            daywage: dailyWageResult,
            specification,
            total_late,
            total_undertime,
            total_overtime,
            absent
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { addData };