const { AuditResult } = require("../models");

exports.createResult = async (req, res) => {
  try {
    const result = await AuditResult.create(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getResults = async (req, res) => {
  try {
    const results = await AuditResult.findAll();
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getResultById = async (req, res) => {
  try {
    const result = await AuditResult.findByPk(req.params.id);
    if (!result) return res.status(404).json({ error: "Result not found" });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateResult = async (req, res) => {
  try {
    const result = await AuditResult.findByPk(req.params.id);
    if (!result) return res.status(404).json({ error: "Result not found" });
    await result.update(req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteResult = async (req, res) => {
  try {
    const result = await AuditResult.findByPk(req.params.id);
    if (!result) return res.status(404).json({ error: "Result not found" });
    await result.destroy();
    res.json({ message: "Result deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
