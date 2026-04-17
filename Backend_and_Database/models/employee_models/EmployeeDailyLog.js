const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const employeeDailyLogSubschema = new Schema({
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
    breakStart: {
        type: Date,
        required: true
    },
    breakEnd: {
        type: Date,
        required: true
    },
    latetime: {
        type: Number, // or number of minutes late
    },
    undertime: {
        type: Number, // or number of  minutes or hours
    },
    overtime: {
        type: Number, //or number of hours
    },
    absent: {
        type: Boolean,
    },
    holidayPay: {
        type: Boolean,
    },
    regularPay: {
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

const employeeDailyLogSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    employeeDailyLog: [employeeDailyLogSubschema]
});

module.exports = mongoose.model('EmployeeDailyLog', employeeDailyLogSchema);