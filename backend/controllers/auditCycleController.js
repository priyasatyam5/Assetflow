const { AuditCycle } = require("../models");

exports.createCycle = async (req, res) => {
  try {
    const cycle = await AuditCycle.create(req.body);
    res.status(201).json(cycle);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getCycles = async (req, res) => {
  try {
    const cycles = await AuditCycle.findAll();
    res.json(cycles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCycleById = async (req, res) => {
  try {
    const cycle = await AuditCycle.findByPk(req.params.id);
    if (!cycle) return res.status(404).json({ error: "Cycle not found" });
    res.json(cycle);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCycle = async (req, res) => {
  try {
    const cycle = await AuditCycle.findByPk(req.params.id);
    if (!cycle) return res.status(404).json({ error: "Cycle not found" });
    await cycle.update(req.body);
    res.json(cycle);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteCycle = async (req, res) => {
  try {
    const cycle = await AuditCycle.findByPk(req.params.id);
    if (!cycle) return res.status(404).json({ error: "Cycle not found" });
    await cycle.destroy();
    res.json({ message: "Cycle deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
