const Employee = require('../../models/admin_models/Employee'); // FIXED
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: "Email and Password are required" });
        }

        // Find employee
        const employee = await Employee.findOne({ email });
        if (!employee) {
            return res.status(401).json({ message: "User does not exist" });
        }

        // Compare password
        const match = await bcrypt.compare(password, employee.password);
        if (!match) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // Check secret
        if (!process.env.ACCESS_TOKEN_SECRET) {
            return res.status(500).json({ message: "Server config error" });
        }

        // Generate token
        const token = jwt.sign(
            { id: employee._id, role: employee.role },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "1h" }
        );

        // Send response
        res.json({
            token,
            user: {
                id: employee._id, // FIXED
                username: employee.username,
                email: employee.email,
                role: employee.role,
                firstname: employee.firstname,
                lastname: employee.lastname,
                position: employee.position
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { login };