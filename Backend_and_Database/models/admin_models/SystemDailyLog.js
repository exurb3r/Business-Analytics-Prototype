const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const systemDailyLogschema = new Schema({
    date: {
        type: Date,
        required: true
    },

    // 🔥 FIXED: allow null when absent
    timeIn: {
        type: Date,
        default: null
    },
    timeOut: {
        type: Date,
        default: null
    },
    breakStart: {
        type: Date,
        default: null
    },
    breakEnd: {
        type: Date,
        default: null
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

    latetime: {
        type: Number,
        default: 0
    },

    undertime: {
        type: Number,
        default: 0
    },

    overtime: {
        type: Number,
        default: 0
    },

    absent: {
        type: Boolean,
        default: false
    },

    regularPay: {
        type: Boolean,
        default: false
    },

    holidayPay: {
        type: Boolean,
        default: false
    },

    regularHoliday: {
        type: Boolean,
        default: false
    },

    specialHoliday: {
        type: Boolean,
        default: false
    },

    overtimePay: {
        type: Number,
        default: 0
    },

    daywage: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('SystemDailyLog', systemDailyLogschema);