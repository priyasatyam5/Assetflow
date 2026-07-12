// backend/routes/allocation.js
const express = require("express");
const router = express.Router();
const { Allocation, Asset, User } = require("../models"); // include related models

// Create new allocation
router.post("/", async (req, res) => {
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
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all allocations (with asset + employee details)
router.get("/", async (req, res) => {
  try {
    const allocations = await Allocation.findAll({
      include: [
        { model: Asset, as: "asset" },
        { model: User, as: "employee" },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json(allocations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single allocation by ID
router.get("/:id", async (req, res) => {
  try {
    const allocation = await Allocation.findByPk(req.params.id, {
      include: [
        { model: Asset, as: "asset" },
        { model: User, as: "employee" },
      ],
    });
    if (!allocation) {
      return res.status(404).json({ error: "Allocation not found" });
    }
    res.json(allocation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update allocation
router.put("/:id", async (req, res) => {
  try {
    const allocation = await Allocation.findByPk(req.params.id);
    if (!allocation) {
      return res.status(404).json({ error: "Allocation not found" });
    }

    await allocation.update(req.body);
    res.json(allocation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete allocation
router.delete("/:id", async (req, res) => {
  try {
    const allocation = await Allocation.findByPk(req.params.id);
    if (!allocation) {
      return res.status(404).json({ error: "Allocation not found" });
    }

    await allocation.destroy();
    res.json({ message: "Allocation deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
