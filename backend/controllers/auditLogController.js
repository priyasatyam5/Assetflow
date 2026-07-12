const { AuditLog } = require("../models");

exports.createLog = async (req, res) => {
  try {
    const log = await AuditLog.create(req.body);
    res.status(201).json(log);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getLogs = async (req, res) => {
  try {
    const logs = await AuditLog.findAll();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getLogById = async (req, res) => {
  try {
    const log = await AuditLog.findByPk(req.params.id);
    if (!log) return res.status(404).json({ error: "Log not found" });
    res.json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateLog = async (req, res) => {
  try {
    const log = await AuditLog.findByPk(req.params.id);
    if (!log) return res.status(404).json({ error: "Log not found" });
    await log.update(req.body);
    res.json(log);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteLog = async (req, res) => {
  try {
    const log = await AuditLog.findByPk(req.params.id);
    if (!log) return res.status(404).json({ error: "Log not found" });
    await log.destroy();
    res.json({ message: "Log deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
