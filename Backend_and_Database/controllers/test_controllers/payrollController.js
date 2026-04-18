const Employee = require('../../models/admin_models/Employee');
const EmployeeDailyLog = require('../../models/employee_models/EmployeeDailyLog');
const EmployeePayrollLog = require('../../models/employee_models/EmployeePayrollLog');

const generateMonthlyPayrollInternal = async (email, date) => {

    const employee = await Employee.findOne({ email });
    if (!employee) return;

    const targetDate = new Date(date);
    const month = targetDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });

    const dailyLog = await EmployeeDailyLog.findOne({ email });
    if (!dailyLog) return;

    // Filter logs for the same month/year
    const logs = dailyLog.employeeDailyLog.filter(log => {
        const d = new Date(log.date);
        return (
            d.getMonth() === targetDate.getMonth() &&
            d.getFullYear() === targetDate.getFullYear()
        );
    });

    let lessPay = {
        late: 0,
        undertime: 0,
        absent: 0,
        damages: 0,
        advancements: 0,
        lateDeduction: 0,
        undertimeDeduction: 0,
        absentDeduction: 0
    };

    let addPay = {
        overtimeHours: 0,
        overtimePay: 0,
        regularHolidayPay: 0,
        specialHolidayPay: 0,
        nightDifferentialHours: 0,
        nightDifferentialPay: 0,
        otherAdditions: 0
    };

    const dailyRate = employee.basicPay / 22;
    const perMinuteRate = (dailyRate / 8) / 60;

    logs.forEach(log => {

        if (log.latetime) {
            lessPay.late += log.latetime;
            lessPay.lateDeduction += log.latetime * perMinuteRate;
        }

        if (log.undertime) {
            lessPay.undertime += log.undertime;
            lessPay.undertimeDeduction += log.undertime * perMinuteRate;
        }

        if (log.absent) {
            lessPay.absent += 1;
            lessPay.absentDeduction += dailyRate;
        }

        if (log.overtime) {
            addPay.overtimeHours += log.overtime;
            addPay.overtimePay += log.overtimePay || 0;
        }

        if (log.regularHoliday) {
            addPay.regularHolidayPay += log.daywage || 0;
        }

        if (log.specialHoliday) {
            addPay.specialHolidayPay += log.daywage || 0;
        }

    });

    const basicPay = employee.basicPay;

    const totalLess =
        lessPay.lateDeduction +
        lessPay.undertimeDeduction +
        lessPay.absentDeduction +
        lessPay.damages +
        lessPay.advancements;

    const totalAdd =
        addPay.overtimePay +
        addPay.regularHolidayPay +
        addPay.specialHolidayPay +
        addPay.nightDifferentialPay +
        addPay.otherAdditions;

    const grossPay = basicPay - totalLess + totalAdd;

const {
  computeSSS,
  computePhilHealth,
  computeHDMF,
  computeTax
} = require('../../math/governmentCalculations');


const sss = computeSSS(grossPay);
const philhealth = computePhilHealth(grossPay);
const hdmf = computeHDMF();
const tax = computeTax(grossPay);

const mandatoryDeductions = {
  sssContribution: Math.round(sss),
  philHealthContribution: Math.round(philhealth),
  hdmfContribution: hdmf,
  withholdingTax: Math.round(tax)
};

    const totalMandatory =
        mandatoryDeductions.sssContribution +
        mandatoryDeductions.philHealthContribution +
        mandatoryDeductions.hdmfContribution +
        mandatoryDeductions.withholdingTax;

    const netPay = grossPay - totalMandatory;

    let payroll = await EmployeePayrollLog.findOne({ email, month });

    if (!payroll) {

        payroll = new EmployeePayrollLog({
            employeeId: employee._id,
            email,
            month,
            basicPay,
            lessPay,
            addPay,
            mandatoryDeductions,
            grossPay,
            netPay
        });

    } else {

        payroll.basicPay = basicPay;
        payroll.lessPay = lessPay;
        payroll.addPay = addPay;
        payroll.mandatoryDeductions = mandatoryDeductions;
        payroll.grossPay = grossPay;
        payroll.netPay = netPay;

    }

    await payroll.save();
};

module.exports = { generateMonthlyPayrollInternal };