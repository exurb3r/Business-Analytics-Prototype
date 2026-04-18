const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lessPaySubschema = new Schema({
    late: { type: Number, default: 0 },
    undertime: { type: Number, default: 0 },
    absent: { type: Number, default: 0 },
    damages: { type: Number, default: 0 },
    advancements: { type: Number, default: 0 },

    lateDeduction: { type: Number, default: 0 },
    undertimeDeduction: { type: Number, default: 0 },
    absentDeduction: { type: Number, default: 0 }
});

const addPaySubschema = new Schema({
    overtimeHours: { type: Number, default: 0 },
    overtimePay: { type: Number, default: 0 },

    regularHolidayPay: { type: Number, default: 0 },
    specialHolidayPay: { type: Number, default: 0 },

    nightDifferentialHours: { type: Number, default: 0 },
    nightDifferentialPay: { type: Number, default: 0 },

    otherAdditions: { type: Number, default: 0 }
});

const mandatoryDeductionsSubschema = new Schema({
    sssContribution: { type: Number, default: 0 },
    philHealthContribution: { type: Number, default: 0 },
    hdmfContribution: { type: Number, default: 0 },
    withholdingTax: { type: Number, default: 0 }
});


const employeeDailyLogSubschema = new Schema({
    startingDate: {
        type: Date,
        required: true
    },
    endingDate: {
        type: Date,
        required: true
    },
    basicPay: {
        type: Number,
        required: true
    },
    lessPay: { type: lessPaySubschema },
    addPay: { type: addPaySubschema },
    grossPay: {
        type: Number,
        required: true
    },
    mandatoryDeductions: { type: mandatoryDeductionsSubschema },
    netPay: {
        type: Number,
        required: true
    }
});


const employeePayrollLogSchema = new Schema({
    employeeId: {
        type: Schema.Types.ObjectId,
        ref: 'Employees',
        required: true
    },

    email: {
        type: String,
        required: true
    },
    
    month: {
        type: String,
        required: true
    },

    lessPay: { type: lessPaySubschema, default: () => ({}) },
    addPay: { type: addPaySubschema, default: () => ({}) },
    mandatoryDeductions: { type: mandatoryDeductionsSubschema, default: () => ({}) },

    basicPay: { type: Number, required: true },

    grossPay: { type: Number, default: 0 },
    netPay: { type: Number, default: 0 }
});

module.exports = mongoose.model('EmployeePayrollLog', employeePayrollLogSchema);