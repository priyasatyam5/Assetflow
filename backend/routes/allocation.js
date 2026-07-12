// backend/routes/allocation.js
const express = require("express");
const router = express.Router();
const {
  createAllocation,
  getAllocations,
  getAllocationById,
  updateAllocation,
  deleteAllocation,
  getAllocationStatus,
  getAllocationHistory,
  createTransferRequest,
} = require("../controllers/allocationController");

// Asset allocation-status (must be before /:id or it catches "allocation-status" as an id)
router.get("/asset/:id/allocation-status", getAllocationStatus);
router.get("/asset/:id/allocation-history", getAllocationHistory);

// Standard allocation CRUD
router.post("/", createAllocation);
router.get("/", getAllocations);
router.get("/:id", getAllocationById);
router.put("/:id", updateAllocation);
router.delete("/:id", deleteAllocation);

module.exports = router;

// Separate router for transfer requests
const transferRouter = express.Router();
const { TransferRequest, Allocation, Asset, User, Department } = require("../models");

transferRouter.post("/", createTransferRequest);

// Get all transfer requests
transferRouter.get("/", async (req, res) => {
  try {
    const requests = await TransferRequest.findAll({
      include: [
        { model: Asset, as: "asset", attributes: ["id", "name", "assetTag"] },
        { model: User, as: "targetEmployee", attributes: ["id", "name"] },
        { model: Department, as: "targetDepartment", attributes: ["id", "name"] },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports.transferRouter = transferRouter;
