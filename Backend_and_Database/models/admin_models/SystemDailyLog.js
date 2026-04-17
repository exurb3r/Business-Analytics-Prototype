const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const systemDailyLogschema = new Schema({
    date: {
        type: Date,
        required: true
    },
    timeIn: {
        type: Date,
        required: true
    },
    timeOut: {
        type: Date,
        required: true
    },
    employee_id: {
        type: Schema.Types.ObjectId,
        ref: 'Employees',
        required: true
    },
    employeeName: {
        type: String,
        required: true
    },
    breakStart: {
        type: Date,
        required: true
    },
    breakEnd: {
        type: Date,
        required: true
    },
    latetime: {
        type: Boolean, // or number of minutes late ot time
    },
    undertime: {
        type: Boolean, // or number of  minutes or hours or time
    },
    overtime: {
        type: Boolean, //or number of hours or time
    },

    absent: {
        type: Boolean,
    },
    regularPay: {
        type: Boolean,
    },
    holidayPay: {
        type: Boolean,
    },
    regularHoliday: {
        type: Boolean,
    },
    specialHoliday: {
        type: Boolean,  
    },
    overtimePay: {
        type: Number,
    },
    daywage: {
        type: Number,
    }
});

module.exports = mongoose.model('SystemDailyLog', systemDailyLogschema);

