const Employee = require('../../models/admin_models/Employee');

const getEmployees = async(req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    }
    catch (err) {
        res.status(500).json({ message: err.message});
        console.error(err);
    }
}

module.exports = {
    getEmployees
}