const { Asset, Allocation, Maintenance, User, sequelize } = require("../models");
const { Op } = require("sequelize");

exports.assetsSummary = async (req, res) => {
  try {
    const totalAssets = await Asset.count();
    const available = await Asset.count({ where: { status: "available" } });
    const allocated = await Asset.count({ where: { status: "allocated" } });
    const maintenance = await Asset.count({ where: { status: "maintenance" } });
    res.json({ totalAssets, available, allocated, maintenance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.allocationsSummary = async (req, res) => {
  try {
    const activeAllocations = await Allocation.count({ where: { status: "active" } });
    const overdue = await Allocation.count({ where: { status: "overdue" } });
    const dueSoon = await Allocation.count({ where: { status: "dueSoon" } });
    res.json({ activeAllocations, overdue, dueSoon });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.maintenanceAlerts = async (req, res) => {
  try {
    const alerts = await Maintenance.findAll({
      where: { dueDate: { [Op.gte]: new Date() } },
      include: [Asset],
      limit: 10
    });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.userActivity = async (req, res) => {
  try {
    const activity = await Allocation.findAll({
      include: [User, Asset],
      order: [["updatedAt", "DESC"]],
      limit: 10
    });
    res.json(activity);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.assetTrends = async (req, res) => {
  try {
    const trends = await Allocation.findAll({
      attributes: [
        [sequelize.fn("MONTH", sequelize.col("createdAt")), "month"],
        [sequelize.fn("COUNT", sequelize.col("id")), "allocations"]
      ],
      group: ["month"]
    });
    res.json(trends);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
