const express = require('express');
const router = express.Router();
const { Notification } = require('../models');
const { Op } = require('sequelize');

// GET /api/notifications — returns paginated notifications
// Query params: type (alert|approval|booking), limit (default 50)
router.get('/', async (req, res) => {
  try {
    const { type, limit = 50 } = req.query;
    const where = {};
    if (type) where.type = type;

    const notifications = await Notification.findAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit, 10) || 50,
    });

    res.json(notifications.map((n) => ({
      id: n.id,
      type: n.type,
      title: n.title,
      message: n.message,
      read: n.read,
      createdAt: n.createdAt,
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
