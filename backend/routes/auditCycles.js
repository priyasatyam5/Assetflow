const express = require("express");
const router = express.Router();
const auditCycleController = require("../controllers/auditCycleController");

router.post("/", auditCycleController.createCycle);
router.get("/", auditCycleController.getCycles);
router.get("/:id", auditCycleController.getCycleById);
router.put("/:id", auditCycleController.updateCycle);
router.delete("/:id", auditCycleController.deleteCycle);

module.exports = router;
