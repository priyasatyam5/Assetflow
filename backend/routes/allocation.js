// backend/routes/allocation.js
const express = require("express");
const router = express.Router();
const { Allocation, Asset, User, Department } = require("../models");
const assetController = require("../controllers/assetController");
const userController = require("../controllers/userController");
const departmentController = require("../controllers/departmentController");

// In-memory fallback allocations
let mockAllocations = [
  {
    id: "alloc-1",
    assetId: "af0114-uuid",
    asset: { name: "Laptop AF-0114", assetTag: "AF-0114" },
    allocatedToType: "employee",
    employeeId: "priya-uuid",
    employee: { name: "Priya", email: "priya@company.com" },
    expectedReturnDate: "2026-07-15",
    status: "active",
    createdAt: new Date(),
  }
];

// Create new allocation
router.post("/", async (req, res) => {
  try {
    const { asset, employee, department, returnDate } = req.body;
    
    // Support either ID or Name
    const assetId = asset;
    const employeeId = employee || null;
    const departmentId = department || null;
    const expectedReturnDate = returnDate;
    const allocatedToType = employeeId ? "employee" : "department";

    if (global.dbConnected) {
      const newAllocation = await Allocation.create({
        assetId,
        allocatedToType,
        employeeId,
        departmentId,
        expectedReturnDate,
        status: "active",
      });

      // Update asset status to allocated
      const dbAsset = await Asset.findByPk(assetId);
      if (dbAsset) {
        dbAsset.status = "allocated";
        await dbAsset.save();
      }

      res.status(201).json(newAllocation);
    } else {
      // Find asset name for mock display
      const mockAssets = assetController.getMockAssets();
      const assetObj = mockAssets.find(a => a.id === assetId || a.name === assetId);
      const assetName = assetObj ? assetObj.name : assetId;
      const assetTag = assetObj ? assetObj.assetTag : "AF-TEMP";

      // Find user name for mock display
      const mockUsers = userController.getMockUsers();
      const userObj = mockUsers.find(u => u.id === employeeId || u.name === employeeId);
      const employeeName = userObj ? userObj.name : employeeId;

      // Find department name for mock display
      const mockDeps = departmentController.getMockDepartments();
      const depObj = mockDeps.find(d => d.id === departmentId || d.name === departmentId);
      const departmentName = depObj ? depObj.name : departmentId;

      const newAllocation = {
        id: `alloc-${Date.now()}`,
        assetId,
        asset: { name: assetName, assetTag },
        allocatedToType,
        employeeId,
        employee: employeeId ? { name: employeeName } : null,
        departmentId,
        department: departmentId ? { name: departmentName } : null,
        expectedReturnDate,
        status: "active",
        createdAt: new Date(),
      };

      mockAllocations.push(newAllocation);
      
      // Update in-memory asset status to allocated
      assetController.updateAssetStatusInMemory(assetId, "allocated");

      res.status(201).json(newAllocation);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all allocations (with asset + employee details)
router.get("/", async (req, res) => {
  try {
    if (global.dbConnected) {
      const allocations = await Allocation.findAll({
        include: [
          { model: Asset, as: "asset" },
          { model: User, as: "employee" },
          { model: Department, as: "department" },
        ],
        order: [["createdAt", "DESC"]],
      });
      res.json(allocations);
    } else {
      res.json(mockAllocations);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single allocation by ID
router.get("/:id", async (req, res) => {
  try {
    if (global.dbConnected) {
      const allocation = await Allocation.findByPk(req.params.id, {
        include: [
          { model: Asset, as: "asset" },
          { model: User, as: "employee" },
          { model: Department, as: "department" },
        ],
      });
      if (!allocation) {
        return res.status(404).json({ error: "Allocation not found" });
      }
      res.json(allocation);
    } else {
      const allocation = mockAllocations.find(a => a.id === req.params.id);
      if (!allocation) {
        return res.status(404).json({ error: "Allocation not found" });
      }
      res.json(allocation);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update allocation
router.put("/:id", async (req, res) => {
  try {
    if (global.dbConnected) {
      const allocation = await Allocation.findByPk(req.params.id);
      if (!allocation) {
        return res.status(404).json({ error: "Allocation not found" });
      }

      await allocation.update(req.body);
      res.json(allocation);
    } else {
      const idx = mockAllocations.findIndex(a => a.id === req.params.id);
      if (idx === -1) {
        return res.status(404).json({ error: "Allocation not found" });
      }
      mockAllocations[idx] = { ...mockAllocations[idx], ...req.body };
      res.json(mockAllocations[idx]);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete allocation
router.delete("/:id", async (req, res) => {
  try {
    if (global.dbConnected) {
      const allocation = await Allocation.findByPk(req.params.id);
      if (!allocation) {
        return res.status(404).json({ error: "Allocation not found" });
      }

      // Revert asset status if deleting active allocation
      if (allocation.assetId) {
        const dbAsset = await Asset.findByPk(allocation.assetId);
        if (dbAsset) {
          dbAsset.status = "available";
          await dbAsset.save();
        }
      }

      await allocation.destroy();
      res.json({ message: "Allocation deleted successfully" });
    } else {
      const idx = mockAllocations.findIndex(a => a.id === req.params.id);
      if (idx === -1) {
        return res.status(404).json({ error: "Allocation not found" });
      }
      const alloc = mockAllocations[idx];
      assetController.updateAssetStatusInMemory(alloc.assetId, "available");
      mockAllocations.splice(idx, 1);
      res.json({ message: "Allocation deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
