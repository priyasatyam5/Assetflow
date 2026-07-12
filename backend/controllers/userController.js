const { User } = require("../models");

const mockUsers = [
  { id: "priya-uuid", name: "Priya", email: "priya@company.com", role: "employee" },
  { id: "raj-uuid", name: "Raj", email: "raj@company.com", role: "employee" },
  { id: "kiran-uuid", name: "Kiran", email: "kiran@company.com", role: "employee" },
];

exports.getUsers = async (req, res) => {
  try {
    if (global.dbConnected) {
      const users = await User.findAll({
        attributes: ["id", "name", "email", "role", "status"],
      });
      return res.json(users);
    } else {
      return res.json(mockUsers);
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.getMockUsers = () => mockUsers;
