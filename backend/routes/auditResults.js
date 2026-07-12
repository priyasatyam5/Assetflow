const express = require("express");
const router = express.Router();
const auditResultController = require("../controllers/auditResultController");

router.post("/", auditResultController.createResult);
router.get("/", auditResultController.getResults);
router.get("/:id", auditResultController.getResultById);
router.put("/:id", auditResultController.updateResult);
router.delete("/:id", auditResultController.deleteResult);

module.exports = router;
