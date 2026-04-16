const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const lessPaySubschema = new Schema({
    absent: {
        type: Number
    }, // number of days absent
    absentDeduction: {
        type: Number
    }, // amount to be deducted for absences
    late: {
        type: Number
    }, // number of minutes late
    lateDeduction: {
        type: Number
    }, // amount to be deducted for being late
    undertime: {
        type: Number
    }, // number of minutes undertime
    undertimeDeduction: {
        type: Number
    }, // amount to be deducted for undertime
    otherDeductionsDescription: {
        type: String
    }, // description of any other deductions
    otherDeductions: {
        type: Number
    }, // any other deductions
    

});

const addPaySubschema = new Schema({
    overtimeHours: {
        type: Number
    }, // number of overtime hours
    overtimePay: {
        type: Number
    }, // amount to be added for overtime
    regularHoliday: {
        type: Number
    }, // amount to be added for regular holidays
    regularHolidayPay: {
        type: Number
    }, // amount to be added for regular holiday pay
    specialHoliday: {
        type: Number
    }, // amount to be added for special holidays
    specialHolidayPay: {
        type: Number
    }, // amount to be added for special holiday pay
    sickLeave: {
        type: Number
    }, // number of sick leave days
    sickLeavePay: {
        type: Number
    }, // amount to be added for sick leave
    nightDifferentialHours: {
        type: Number
    }, // number of night differential hours
    nightDifferentialPay: {
        type: Number
    }, // amount to be added for night differential

    otheradditionsDescription: {
        type: String
    }, // description of any other additions
    otherAdditions: {
        type: Number
    }, // any other additions
});

const mandatoryDeductionsSubschema = new Schema({
    sssContribution: {
        type: Number
    },
    philHealthContribution: {
        type: Number
    },
    HDMFContribution: {
        type: Number
    },
    withholdingTax: {
        type: Number
    }
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
    _id: {
        type: Schema.Types.ObjectId,
        ref: 'Employees',   
    },
    employeePayrollLog : [employeeDailyLogSubschema]
});

module.exports = mongoose.model('EmployeePayrollLog', employeePayrollLogSchema);