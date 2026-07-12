const { AuditAuditor } = require("../models");

exports.createAuditor = async (req, res) => {
  try {
    const auditor = await AuditAuditor.create(req.body);
    res.status(201).json(auditor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAuditors = async (req, res) => {
  try {
    const auditors = await AuditAuditor.findAll();
    res.json(auditors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAuditorById = async (req, res) => {
  try {
    const auditor = await AuditAuditor.findByPk(req.params.id);
    if (!auditor) return res.status(404).json({ error: "Auditor association not found" });
    res.json(auditor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateAuditor = async (req, res) => {
  try {
    const auditor = await AuditAuditor.findByPk(req.params.id);
    if (!auditor) return res.status(404).json({ error: "Auditor association not found" });
    await auditor.update(req.body);
    res.json(auditor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteAuditor = async (req, res) => {
  try {
    const auditor = await AuditAuditor.findByPk(req.params.id);
    if (!auditor) return res.status(404).json({ error: "Auditor association not found" });
    await auditor.destroy();
    res.json({ message: "Auditor association deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
