const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const workingDaysSchema = new Schema({
    day: {
        type: String,
        required: true
    }
}); 


const employeeSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    contactNum: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    contactPerson: {
        type: String,
        required: true
    },
    contactPersonNum: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    basicPay: {
        type: Number,
        required: true
    },
    workingDays: [ workingDaysSchema ],//example: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    timeIn: {
        type: String,
        required: true 
    },
    timeOut: {
        type: String,
        required: true 
    },  
    breakStart: {
        type: String,
        required: true 
    },
    breakEnd: {
        type: String,
        required: true 
    },
    role: {
        type: Number,
        required: true
    } //employee
})

module.exports = mongoose.model('Employees', employeeSchema);