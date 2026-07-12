const express = require("express");
const router = express.Router();
const maintenanceController = require("../controllers/maintenanceController");

router.get("/", maintenanceController.getMaintenanceRequests);
router.post("/", maintenanceController.createMaintenanceRequest);
router.put("/:id/status", maintenanceController.updateMaintenanceRequestStatus);

module.exports = router;
