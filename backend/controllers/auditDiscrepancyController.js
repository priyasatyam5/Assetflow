const { AuditDiscrepancy } = require("../models");

exports.createDiscrepancy = async (req, res) => {
  try {
    const discrepancy = await AuditDiscrepancy.create(req.body);
    res.status(201).json(discrepancy);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getDiscrepancies = async (req, res) => {
  try {
    const discrepancies = await AuditDiscrepancy.findAll();
    res.json(discrepancies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDiscrepancyById = async (req, res) => {
  try {
    const discrepancy = await AuditDiscrepancy.findByPk(req.params.id);
    if (!discrepancy) return res.status(404).json({ error: "Discrepancy not found" });
    res.json(discrepancy);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateDiscrepancy = async (req, res) => {
  try {
    const discrepancy = await AuditDiscrepancy.findByPk(req.params.id);
    if (!discrepancy) return res.status(404).json({ error: "Discrepancy not found" });
    await discrepancy.update(req.body);
    res.json(discrepancy);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteDiscrepancy = async (req, res) => {
  try {
    const discrepancy = await AuditDiscrepancy.findByPk(req.params.id);
    if (!discrepancy) return res.status(404).json({ error: "Discrepancy not found" });
    await discrepancy.destroy();
    res.json({ message: "Discrepancy deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};