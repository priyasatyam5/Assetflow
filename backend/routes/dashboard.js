const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");

router.get("/assets-summary", dashboardController.assetsSummary);
router.get("/allocations-summary", dashboardController.allocationsSummary);
router.get("/maintenance-alerts", dashboardController.maintenanceAlerts);
router.get("/user-activity", dashboardController.userActivity);
router.get("/asset-trends", dashboardController.assetTrends);

module.exports = router;
