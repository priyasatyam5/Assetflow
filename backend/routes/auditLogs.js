const express = require("express");
const router = express.Router();
const auditLogController = require("../controllers/auditLogController");

router.post("/", auditLogController.createLog);
router.get("/", auditLogController.getLogs);
router.get("/:id", auditLogController.getLogById);
router.put("/:id", auditLogController.updateLog);
router.delete("/:id", auditLogController.deleteLog);

module.exports = router;
