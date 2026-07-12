const express = require("express");
const router = express.Router();
const auditAuditorController = require("../controllers/auditAuditorController");

router.post("/", auditAuditorController.createAuditor);
router.get("/", auditAuditorController.getAuditors);
router.get("/:id", auditAuditorController.getAuditorById);
router.put("/:id", auditAuditorController.updateAuditor);
router.delete("/:id", auditAuditorController.deleteAuditor);

module.exports = router;
