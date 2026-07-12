const express = require("express");
const router = express.Router();
const auditDiscrepancyController = require("../controllers/auditDiscrepancyController");

router.post("/", auditDiscrepancyController.createDiscrepancy);
router.get("/", auditDiscrepancyController.getDiscrepancies);
router.get("/:id", auditDiscrepancyController.getDiscrepancyById);
router.put("/:id", auditDiscrepancyController.updateDiscrepancy);
router.delete("/:id", auditDiscrepancyController.deleteDiscrepancy);

module.exports = router;
