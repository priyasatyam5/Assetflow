const express = require('express');
const router = express.Router();
const { Asset, User, Department } = require('../models');

// GET /api/assets — list all assets
router.get('/assets', async (req, res) => {
  try {
    const assets = await Asset.findAll({
      attributes: ['id', 'name', 'assetTag', 'status', 'condition'],
      order: [['createdAt', 'DESC']],
    });
    res.json(assets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/employees — list all employees/users
router.get('/employees', async (req, res) => {
  try {
    const employees = await User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'departmentId'],
      include: [{ model: Department, as: 'department', attributes: ['id', 'name'] }],
      order: [['name', 'ASC']],
    });
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/departments — list all departments
router.get('/departments', async (req, res) => {
  try {
    const depts = await Department.findAll({
      attributes: ['id', 'name', 'code'],
      order: [['name', 'ASC']],
    });
    res.json(depts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
