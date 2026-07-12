const { Allocation, Asset, User } = require("../models");

// Create new allocation
exports.createAllocation = async (req, res) => {
  try {
    const { asset, employee, department, returnDate } = req.body;

    const newAllocation = await Allocation.create({
      asset,
      employee,
      department,
      returnDate,
      status: "active", // default status
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
