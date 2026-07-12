const { Allocation, Asset, User, Department, TransferRequest } = require("../models");
const { Op } = require("sequelize");

// Create new allocation (with conflict check)
exports.createAllocation = async (req, res) => {
  try {
    const { assetId, employeeId, departmentId, returnDate } = req.body;

    // Check if the asset is already allocated
    const activeAllocation = await Allocation.findOne({
      where: {
        assetId,
        status: "active",
        actualReturnDate: null,
      },
      include: [
        { model: User, as: "employee", attributes: ["id", "name"] },
        { model: Department, as: "department", attributes: ["id", "name"] },
      ],
    });

    if (activeAllocation) {
      return res.status(409).json({
        error: "Asset already allocated",
        message: `Asset already allocated to ${activeAllocation.employee?.name || 'Unknown'} (${activeAllocation.department?.name || 'Unknown'})`,
        currentHolder: {
          employeeName: activeAllocation.employee?.name,
          departmentName: activeAllocation.department?.name,
          allocationDate: activeAllocation.createdAt,
        },
      });
    }

    const newAllocation = await Allocation.create({
      assetId,
      employeeId,
      departmentId,
      expectedReturnDate: returnDate,
      status: "active",
    });

    res.status(201).json(newAllocation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all allocations
exports.getAllocations = async (req, res) => {
  try {
    const allocations = await Allocation.findAll({
      include: [
        { model: Asset, as: "asset" },
        { model: User, as: "employee" },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json(allocations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get allocation status for an asset (current active allocation or null)
exports.getAllocationStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const activeAllocation = await Allocation.findOne({
      where: {
        assetId: id,
        status: "active",
        actualReturnDate: null,
      },
      include: [
        { model: Asset, as: "asset", attributes: ["id", "name", "assetTag", "status"] },
        { model: User, as: "employee", attributes: ["id", "name"] },
        { model: Department, as: "department", attributes: ["id", "name"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    if (!activeAllocation) {
      return res.json({ allocated: false, allocation: null });
    }

    res.json({
      allocated: true,
      allocation: {
        id: activeAllocation.id,
        asset: activeAllocation.asset,
        employee: activeAllocation.employee,
        department: activeAllocation.department,
        allocatedAt: activeAllocation.createdAt,
        expectedReturnDate: activeAllocation.expectedReturnDate,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get allocation history for an asset
exports.getAllocationHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const history = await Allocation.findAll({
      where: { assetId: id },
      include: [
        { model: User, as: "employee", attributes: ["id", "name"] },
        { model: Department, as: "department", attributes: ["id", "name"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    const formatted = history.map((h) => ({
      id: h.id,
      date: h.createdAt,
      action: h.actualReturnDate ? "Returned" : "Allocated",
      employeeName: h.employee?.name || "Unknown",
      departmentName: h.department?.name || null,
      returnCondition: h.returnCondition,
      returnNotes: h.returnNotes,
      status: h.status,
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a transfer request
exports.createTransferRequest = async (req, res) => {
  try {
    const { assetId, currentAllocationId, toEmployeeId, toDepartmentId, reason } = req.body;

    // Validate that the current allocation is still active
    const allocation = await Allocation.findOne({
      where: {
        id: currentAllocationId,
        assetId,
        status: "active",
        actualReturnDate: null,
      },
    });

    if (!allocation) {
      return res.status(400).json({ error: "Current allocation is no longer active or not found" });
    }

    const transferRequest = await TransferRequest.create({
      assetId,
      currentAllocationId,
      targetEmployeeId: toEmployeeId,
      targetDepartmentId: toDepartmentId,
      reason,
      status: "Requested",
    });

    res.status(201).json(transferRequest);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get single allocation by ID
exports.getAllocationById = async (req, res) => {
  try {
    const allocation = await Allocation.findByPk(req.params.id, {
      include: [
        { model: Asset, as: "asset" },
        { model: User, as: "employee" },
      ],
    });
    if (!allocation) return res.status(404).json({ error: "Allocation not found" });
    res.json(allocation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update allocation
exports.updateAllocation = async (req, res) => {
  try {
    const allocation = await Allocation.findByPk(req.params.id);
    if (!allocation) return res.status(404).json({ error: "Allocation not found" });

    await allocation.update(req.body);
    res.json(allocation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete allocation
exports.deleteAllocation = async (req, res) => {
  try {
    const allocation = await Allocation.findByPk(req.params.id);
    if (!allocation) return res.status(404).json({ error: "Allocation not found" });

    await allocation.destroy();
    res.json({ message: "Allocation deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
