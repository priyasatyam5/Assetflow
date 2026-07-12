const express = require('express');
const router = express.Router();
const { Asset, Department, Allocation, ResourceBooking, MaintenanceRequest } = require('../models');
const { Op, fn, col, literal } = require('sequelize');

// GET /api/reports/utilization-by-department
router.get('/utilization-by-department', async (req, res) => {
  try {
    const departments = await Department.findAll({ attributes: ['id', 'name'] });
    const result = await Promise.all(
      departments.map(async (dept) => {
        const count = await Allocation.count({
          where: { departmentId: dept.id, status: 'active' },
        });
        return { department: dept.name, allocated: count };
      })
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/reports/maintenance-frequency
router.get('/maintenance-frequency', async (req, res) => {
  try {
    const records = await MaintenanceRequest.findAll({
      attributes: [
        [fn('date_trunc', 'month', col('created_at')), 'month'],
        [fn('count', col('id')), 'count'],
      ],
      group: ['month'],
      order: [[fn('date_trunc', 'month', col('created_at')), 'ASC']],
      limit: 7,
    });
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formatted = records.map((r) => {
      const d = new Date(r.dataValues.month);
      return { month: months[d.getMonth()] || 'Unknown', requests: parseInt(r.dataValues.count, 10) };
    });
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/reports/most-used-assets
router.get('/most-used-assets', async (req, res) => {
  try {
    const assets = await Asset.findAll({
      attributes: ['id', 'name', 'assetTag'],
      include: [
        {
          model: ResourceBooking,
          as: 'resourceBookings',
          attributes: [],
          where: {
            createdAt: { [Op.gte]: new Date(new Date() - 30 * 24 * 60 * 60 * 1000) },
          },
          required: false,
        },
      ],
    });
    const withCounts = assets.map((a) => ({
      id: a.id,
      name: a.name,
      tag: a.assetTag,
      bookings: a.resourceBookings?.length || 0,
    }));
    withCounts.sort((a, b) => b.bookings - a.bookings);
    res.json(withCounts.slice(0, 10));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/reports/idle-assets
router.get('/idle-assets', async (req, res) => {
  try {
    const assets = await Asset.findAll({
      where: {
        status: { [Op.notIn]: ['allocated', 'maintenance'] },
      },
      limit: 10,
    });
    res.json(assets.map((a) => ({
      id: a.id,
      name: a.name,
      tag: a.assetTag,
      status: a.status || 'idle',
      condition: a.condition || 'good',
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/reports/maintenance-due
router.get('/maintenance-due', async (req, res) => {
  try {
    const dueAssets = await Asset.findAll({
      where: {
        condition: { [Op.or]: ['fair', 'poor'] },
        status: { [Op.ne]: 'maintenance' },
      },
      limit: 10,
    });
    res.json(dueAssets.map((a) => ({
      id: a.id,
      name: a.name,
      tag: a.assetTag,
      condition: a.condition,
      acquisitionDate: a.acquisitionDate,
      status: a.status,
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
