const EmployeePayrollLog = require('../../models/employee_models/EmployeePayrollLog');

// 🔹 GET ALL PAYROLLS
const getPayrollsByEmail = async (req, res) => {
    try {
        const { email } = req.params;

        const payrolls = await EmployeePayrollLog
            .find({ email })
            .sort({ month: -1 });

        if (!payrolls || payrolls.length === 0) {
            return res.status(404).json({
                message: 'No payroll records found'
            });
        }

        return res.status(200).json(payrolls);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};

// 🔥 NEW: GET SPECIFIC PAYROLL
const getPayrollByEmailAndMonth = async (req, res) => {
    try {
        const { email, month } = req.params;

        const payroll = await EmployeePayrollLog.findOne({
            email,
            month
        });

        if (!payroll) {
            return res.status(404).json({
                message: 'Payroll not found'
            });
        }

        return res.status(200).json(payroll);

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: 'Server error'
        });
    }
};

module.exports = {
    getPayrollsByEmail,
    getPayrollByEmailAndMonth 
};