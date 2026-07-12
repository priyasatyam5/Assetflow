const { Asset } = require("../models");

// In-memory fallback assets
let mockAssets = [
  { id: "af0114-uuid", name: "Laptop AF-0114", assetTag: "AF-0114", status: "available" },
  { id: "af0201-uuid", name: "Monitor AF-0201", assetTag: "AF-0201", status: "available" },
  { id: "af0150-uuid", name: "Printer AF-0150", assetTag: "AF-0150", status: "available" },
  { id: "pj101-uuid", name: "Projector PJ-101", assetTag: "PJ-101", status: "available" },
  { id: "crac-uuid", name: "Conference Room AC", assetTag: "CR-AC", status: "available" },
];

exports.getAssets = async (req, res) => {
  try {
    if (global.dbConnected) {
      const assets = await Asset.findAll();
      return res.json(assets);
    } else {
      return res.json(mockAssets);
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.createAsset = async (req, res) => {
  try {
    if (global.dbConnected) {
      const asset = await Asset.create(req.body);
      return res.status(201).json(asset);
    } else {
      const newAsset = {
        id: `asset-${Date.now()}`,
        name: req.body.name,
        assetTag: req.body.assetTag || `TAG-${Date.now()}`,
        status: req.body.status || "available",
        ...req.body,
      };
      mockAssets.push(newAsset);
      return res.status(201).json(newAsset);
    }
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// Helper for other controllers to update asset status in memory
exports.updateAssetStatusInMemory = (id, status) => {
  const asset = mockAssets.find(a => a.id === id || a.name === id || a.assetTag === id);
  if (asset) {
    asset.status = status;
    return true;
  }
  return false;
};

exports.getMockAssets = () => mockAssets;
