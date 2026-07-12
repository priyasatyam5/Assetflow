const express = require('express');
const router = express.Router();
const { Asset, User, Department, Category, Vendor, Location } = require('../models');

// GET /api/assets — list all assets
router.get('/assets', async (req, res) => {
  try {
    const assets = await Asset.findAll({
      attributes: ['id', 'name', 'assetTag', 'serialNumber', 'status', 'condition', 'acquisitionDate', 'acquisitionCost', 'createdAt'],
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name'] },
        { model: Vendor, as: 'vendor', attributes: ['id', 'name'] },
        { model: Location, as: 'location', attributes: ['id', 'name'] },
      ],
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

// GET /api/categories — list all categories
router.get('/categories', async (req, res) => {
  try {
    const cats = await Category.findAll({
      attributes: ['id', 'name', 'code'],
      order: [['name', 'ASC']],
    });
    res.json(cats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/vendors — list all vendors
router.get('/vendors', async (req, res) => {
  try {
    const vens = await Vendor.findAll({
      attributes: ['id', 'name', 'contactName', 'email', 'phone'],
      order: [['name', 'ASC']],
    });
    res.json(vens);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/locations — list all locations
router.get('/locations', async (req, res) => {
  try {
    const locs = await Location.findAll({
      attributes: ['id', 'name', 'code', 'type'],
      order: [['name', 'ASC']],
    });
    res.json(locs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
