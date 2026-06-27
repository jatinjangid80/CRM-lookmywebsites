const Employee = require("../models/Employee");
const User = require("../models/User");

// GET /api/employees
async function getAll(req, res) {
  try {
    const employees = await Employee.find().sort({ empId: 1 });
    res.json({ success: true, data: employees });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// GET /api/employees/:id
async function getOne(req, res) {
  try {
    const emp = await Employee.findOne({ empId: req.params.id });
    if (!emp) return res.status(404).json({ success: false, message: "Employee not found." });
    res.json({ success: true, data: emp });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// POST /api/employees  (admin only)
async function create(req, res) {
  try {
    // Auto-generate empId
    const count = await Employee.countDocuments();
    const empId = `LMH-${String(count + 1).padStart(2, "0")}`;

    const emp = await Employee.create({ ...req.body, empId });
    res.status(201).json({ success: true, data: emp });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: "Employee ID already exists." });
    }
    res.status(500).json({ success: false, message: err.message });
  }
}

// PUT /api/employees/:id  (admin only)
async function update(req, res) {
  try {
    const emp = await Employee.findOneAndUpdate(
      { empId: req.params.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!emp) return res.status(404).json({ success: false, message: "Employee not found." });
    res.json({ success: true, data: emp });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// DELETE /api/employees/:id  (admin only)
async function remove(req, res) {
  try {
    const emp = await Employee.findOneAndDelete({ empId: req.params.id });
    if (!emp) return res.status(404).json({ success: false, message: "Employee not found." });
    // Also remove the linked User account
    await User.findOneAndDelete({ empId: req.params.id });
    res.json({ success: true, message: "Employee deleted." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// POST /api/employees/:id/set-credentials  (admin only)
async function setCredentials(req, res) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Username and password required." });
    }

    const emp = await Employee.findOne({ empId: req.params.id });
    if (!emp) return res.status(404).json({ success: false, message: "Employee not found." });

    // Upsert the User record
    let user = await User.findOne({ empId: emp.empId });
    if (user) {
      user.username = username.toLowerCase();
      user.password = password;
      user.name = emp.name;
      user.avatar = emp.avatar;
      user.email = emp.email;
      await user.save();
    } else {
      user = await User.create({
        username: username.toLowerCase(),
        password,
        name: emp.name,
        role: "employee",
        jobRole: emp.role,
        empId: emp.empId,
        avatar: emp.avatar,
        email: emp.email,
        phone: emp.phone,
      });
    }

    emp.username = username.toLowerCase();
    await emp.save();

    res.json({ success: true, message: "Credentials set.", username: user.username });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: "Username already taken." });
    }
    res.status(500).json({ success: false, message: err.message });
  }
}

// POST /api/employees/:id/attendance
async function markAttendance(req, res) {
  try {
    const emp = await Employee.findOne({ empId: req.params.id });
    if (!emp) return res.status(404).json({ success: false, message: "Employee not found." });

    const { date, status, checkIn, checkOut, notes } = req.body;
    const idx = emp.attendance.findIndex((a) => a.date === date);
    if (idx >= 0) {
      emp.attendance[idx] = { ...emp.attendance[idx].toObject(), status, checkIn, checkOut, notes };
    } else {
      emp.attendance.push({ date, status, checkIn, checkOut, notes });
    }
    await emp.save();
    res.json({ success: true, data: emp.attendance });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// POST /api/employees/:id/payroll
async function addPayroll(req, res) {
  try {
    const emp = await Employee.findOne({ empId: req.params.id });
    if (!emp) return res.status(404).json({ success: false, message: "Employee not found." });

    emp.payroll.push(req.body);
    await emp.save();
    res.json({ success: true, data: emp.payroll });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = { getAll, getOne, create, update, remove, setCredentials, markAttendance, addPayroll };
