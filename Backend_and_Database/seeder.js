const mongoose = require("mongoose");
require("dotenv").config();

const EmployeePayrollLog = require("./models/employee_models/EmployeePayrollLog");

// 🔹 CONNECT DB
mongoose.connect(process.env.DATABASE_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

// 🔹 CONSTANTS
const EMAIL = "mdaguab@gmail.com";
const BASIC_PAY = 40000;

// 🔹 HELPER FUNCTION
const createPayroll = (month, employeeId) => {

  // LESS
  const lessPay = {
    late: 120,
    undertime: 90,
    absent: 1,
    damages: 500,
    advancements: 1000,

    lateDeduction: 120 * 10,
    undertimeDeduction: 90 * 10,
    absentDeduction: 1500
  };

  // ADD
  const addPay = {
    overtimeHours: 10,
    overtimePay: 2500,

    regularHolidayPay: 2000,
    specialHolidayPay: 1000,

    nightDifferentialHours: 5,
    nightDifferentialPay: 800,

    otherAdditions: 500
  };

  // DEDUCTIONS
  const mandatoryDeductions = {
    sssContribution: 500,
    philHealthContribution: 300,
    hdmfContribution: 200,
    withholdingTax: 1000
  };

  // COMPUTE
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

  const grossPay = BASIC_PAY - totalLess + totalAdd;

  const totalMandatory =
    mandatoryDeductions.sssContribution +
    mandatoryDeductions.philHealthContribution +
    mandatoryDeductions.hdmfContribution +
    mandatoryDeductions.withholdingTax;

  const netPay = grossPay - totalMandatory;

  return {
    employeeId,
    email: EMAIL,
    month,
    basicPay: BASIC_PAY,
    lessPay,
    addPay,
    mandatoryDeductions,
    grossPay,
    netPay
  };
};

// 🔹 MAIN SEED FUNCTION
const seedPayroll = async () => {
  try {
    // ⚠️ Replace with real employeeId from your Employees collection
    const employeeId = new mongoose.Types.ObjectId();

    // DELETE EXISTING
    await EmployeePayrollLog.deleteMany({ email: EMAIL });

    const months = [
      "January 2026",
      "February 2026",
      "March 2026",
      "April 2026"
    ];

    const payrolls = months.map(m => createPayroll(m, employeeId));

    await EmployeePayrollLog.insertMany(payrolls);

    console.log("✅ Payroll seeded successfully!");

    process.exit();

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedPayroll();