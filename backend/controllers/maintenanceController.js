const { MaintenanceRequest, Asset, User } = require("../models");
const assetController = require("./assetController");

let mockRequests = [];
let mockHistory = [];

exports.getMaintenanceRequests = async (req, res) => {
  try {
    if (global.dbConnected) {
      const requests = await MaintenanceRequest.findAll({
        include: [{ model: Asset, as: "asset" }],
        order: [["createdAt", "DESC"]],
      });
      
      // Construct history from resolved/updated logs if needed, 
      // or we can query AuditLogs. For simplicity, we just return the requests and a simple history list.
      const history = await MaintenanceRequest.findAll({
        where: { status: ["Resolved", "Approved", "Rejected"] },
        include: [{ model: Asset, as: "asset" }],
        order: [["updatedAt", "DESC"]],
      });

      return res.json({ requests, history });
    } else {
      return res.json({ requests: mockRequests, history: mockHistory });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.createMaintenanceRequest = async (req, res) => {
  try {
    const { assetId, description, priority, photoUrl } = req.body;

    if (global.dbConnected) {
      const request = await MaintenanceRequest.create({
        assetId,
        description,
        priority,
        photoUrl,
        status: "Pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      const populated = await MaintenanceRequest.findByPk(request.id, {
        include: [{ model: Asset, as: "asset" }],
      });
      return res.status(201).json(populated);
    } else {
      // Find asset name for mock display
      const mockAssets = assetController.getMockAssets();
      const assetObj = mockAssets.find(a => a.id === assetId || a.name === assetId);
      const assetName = assetObj ? assetObj.name : assetId;

      const newRequest = {
        id: `maint-${Date.now()}`,
        assetId: assetId,
        asset: { name: assetName },
        description,
        priority,
        status: "Pending",
        assetStatus: "Available",
        photoUrl: photoUrl || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockRequests.push(newRequest);
      return res.status(201).json(newRequest);
    }
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

exports.updateMaintenanceRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // Approved, Rejected, Technician Assigned, In Progress, Resolved

    if (global.dbConnected) {
      const request = await MaintenanceRequest.findByPk(id, {
        include: [{ model: Asset, as: "asset" }],
      });
      if (!request) {
        return res.status(404).json({ error: "Maintenance request not found" });
      }

      request.status = status;
      request.updatedAt = new Date();
      await request.save();

      // If resolved or approved, update asset status accordingly
      if (request.asset) {
        if (status === "Approved") {
          request.asset.status = "maintenance";
          await request.asset.save();
        } else if (status === "Resolved") {
          request.asset.status = "available";
          await request.asset.save();
        }
      }

      return res.json(request);
    } else {
      const request = mockRequests.find(r => r.id === id);
      if (!request) {
        return res.status(404).json({ error: "Maintenance request not found" });
      }

      request.status = status;
      request.updatedAt = new Date();

      let assetStatus = "Available";
      if (status === "Approved" || status === "Technician Assigned" || status === "In Progress") {
        assetStatus = "Under Maintenance";
      } else if (status === "Resolved") {
        assetStatus = "Available";
      }
      request.assetStatus = assetStatus;

      // Update mock asset status
      assetController.updateAssetStatusInMemory(request.assetId, status === "Approved" ? "maintenance" : "available");

      // Add to mock history
      mockHistory.push({
        id: `hist-${Date.now()}`,
        asset: request.asset ? request.asset.name : request.assetId,
        status,
        date: new Date().toLocaleString(),
      });

      return res.json(request);
    }
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

exports.getMockRequests = () => mockRequests;
exports.getMockHistory = () => mockHistory;
