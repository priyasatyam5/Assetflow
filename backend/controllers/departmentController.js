const { Department } = require("../models");

const mockDepartments = [
  { id: "eng-uuid", name: "Engineering", code: "ENG" },
  { id: "hr-uuid", name: "HR", code: "HR" },
  { id: "fin-uuid", name: "Finance", code: "FIN" },
];

exports.getDepartments = async (req, res) => {
  try {
    if (global.dbConnected) {
      const departments = await Department.findAll();
      return res.json(departments);
    } else {
      return res.json(mockDepartments);
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.getMockDepartments = () => mockDepartments;
