const Employee = require('../../models/admin_models/Employee');
const bcrypt = require('bcrypt');

// 🔹 ADD EMPLOYEE
const addEmployee = async (req, res) => {
    try {
        const { 
            firstname,
            lastname, 
            username, 
            email, 
            password, 
            contactNum, 
            address, 
            contactPerson, 
            contactPersonNum,
            position,
            basicPay,
            workingDays,
            timeIn,
            timeOut,
            breakStart,
            breakEnd
        } = req.body; 
        
        if (!firstname || !lastname || !username || !email || !password || !contactNum || !address || !position || !basicPay || !workingDays || !timeIn || !timeOut || !breakStart || !breakEnd) {
            return res.status(400).json({ message: "All credentials are required" });
        }

        const existingEmployee = await Employee.findOne({ email });
        if (existingEmployee) {
            return res.status(400).json({ message: "Email is already in use" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newEmployee = await Employee.create({
            firstname,
            lastname,
            username,
            email,
            password: hashedPassword,
            contactNum,
            address,
            contactPerson,
            contactPersonNum,
            position,
            basicPay,
            workingDays,
            timeIn,
            timeOut,
            breakStart,
            breakEnd,
            role: 777
        });

        res.status(200).json(newEmployee);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

const updateEmployeeByEmail = async (req, res) => {
    try {
        const { email } = req.params;

        const employee = await Employee.findOne({ email });
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        const {
            firstname,
            lastname,
            username,
            contactNum,
            address,
            contactPerson,
            contactPersonNum,
            position,
            basicPay,
            workingDays,
            timeIn,
            timeOut,
            breakStart,
            breakEnd
        } = req.body;

        employee.firstname = firstname ?? employee.firstname;
        employee.lastname = lastname ?? employee.lastname;
        employee.username = username ?? employee.username;
        employee.contactNum = contactNum ?? employee.contactNum;
        employee.address = address ?? employee.address;
        employee.contactPerson = contactPerson ?? employee.contactPerson;
        employee.contactPersonNum = contactPersonNum ?? employee.contactPersonNum;
        employee.position = position ?? employee.position;
        employee.basicPay = basicPay ?? employee.basicPay;
        employee.timeIn = timeIn ?? employee.timeIn;
        employee.timeOut = timeOut ?? employee.timeOut;
        employee.breakStart = breakStart ?? employee.breakStart;
        employee.breakEnd = breakEnd ?? employee.breakEnd;

        if (workingDays) {
            employee.workingDays = workingDays.map(d => ({ day: d.day || d }));
        }

        await employee.save();

        res.status(200).json({
            message: "Employee updated successfully",
            employee
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 🔥 GET EMPLOYEE BY EMAIL
const getEmployeeByEmail = async (req, res) => {
    try {
        const { email } = req.params;

        const employee = await Employee.findOne({ email });

        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        res.status(200).json(employee);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};



module.exports = {
    addEmployee,
     updateEmployeeByEmail,
     getEmployeeByEmail

};