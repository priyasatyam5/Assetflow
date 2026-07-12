const express = require('express');
const router = express.Router();
const { AuditCycle, AuditResult, AuditDiscrepancy, AuditAuditor, Asset, Department, User, Location } = require('../models');
const { Op } = require('sequelize');

// GET /api/audit-cycles/active — returns the active audit cycle with asset checklist
router.get('/active', async (req, res) => {
  try {
    const cycle = await AuditCycle.findOne({
      where: { status: 'active' },
      include: [
        { model: Department, as: 'department', attributes: ['id', 'name'] },
        { model: Location, as: 'location', attributes: ['id', 'name'] },
        { model: AuditAuditor, as: 'auditors', include: [{ model: User, as: 'user', attributes: ['id', 'name'] }] },
        {
          model: AuditResult,
          as: 'results',
          include: [
            { model: Asset, as: 'asset', attributes: ['id', 'name', 'assetTag'] },
            { model: User, as: 'auditor', attributes: ['id', 'name'] },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    if (!cycle) {
      return res.json({ active: false, cycle: null });
    }

    const discrepancyCount = await AuditDiscrepancy.count({
      where: { auditCycleId: cycle.id, resolved: false },
    });

    res.json({
      active: true,
      cycle: {
        id: cycle.id,
        name: cycle.name,
        department: cycle.department,
        location: cycle.location,
        startDate: cycle.startDate,
        endDate: cycle.endDate,
        status: cycle.status,
        auditors: cycle.auditors?.map((a) => a.user?.name).filter(Boolean) || [],
        assets: cycle.results?.map((r) => ({
          id: r.id,
          assetId: r.assetId,
          assetTag: r.asset?.assetTag,
          assetName: r.asset?.name,
          expectedLocation: r.asset?.locationId || 'Unassigned',
          verification: r.status || 'Pending',
          auditor: r.auditor?.name,
          notes: r.notes,
          checkedAt: r.checkedAt,
        })) || [],
        discrepancyCount,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/audit-cycles/:id/close — close an audit cycle
router.post('/:id/close', async (req, res) => {
  try {
    const cycle = await AuditCycle.findByPk(req.params.id);
    if (!cycle) return res.status(404).json({ error: 'Audit cycle not found' });

    await cycle.update({ status: 'closed' });
    res.json({ message: 'Audit cycle closed successfully', cycle });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
