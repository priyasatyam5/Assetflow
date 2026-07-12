const { Asset, Allocation, MaintenanceRequest, User, sequelize } = require("../models");
const { Op } = require("sequelize");
const assetController = require("./assetController");
const maintenanceController = require("./maintenanceController");

// Baseline mock data for trends/distributions
const MOCK_ASSET_DISTRIBUTION = [
  { name: 'Laptops', value: 4120, color: '#2563EB' },
  { name: 'Furniture', value: 3210, color: '#14B8A6' },
  { name: 'Vehicles', value: 860, color: '#F59E0B' },
  { name: 'Electronics', value: 2740, color: '#8B5CF6' },
  { name: 'Others', value: 1550, color: '#94A3B8' },
];

const MOCK_MONTHLY_USAGE = [
  { month: 'Jan', allocated: 620, returned: 180 },
  { month: 'Feb', allocated: 710, returned: 210 },
  { month: 'Mar', allocated: 660, returned: 240 },
  { month: 'Apr', allocated: 790, returned: 260 },
  { month: 'May', allocated: 845, returned: 300 },
  { month: 'Jun', allocated: 905, returned: 340 },
  { month: 'Jul', allocated: 960, returned: 365 },
];

const MOCK_DEPARTMENT_UTILIZATION = [
  { month: 'Jan', engineering: 62, facilities: 48, fieldOps: 40 },
  { month: 'Feb', engineering: 66, facilities: 51, fieldOps: 44 },
  { month: 'Mar', engineering: 71, facilities: 49, fieldOps: 47 },
  { month: 'Apr', engineering: 75, facilities: 54, fieldOps: 52 },
  { month: 'May', engineering: 79, facilities: 58, fieldOps: 55 },
  { month: 'Jun', engineering: 84, facilities: 61, fieldOps: 59 },
  { month: 'Jul', engineering: 88, facilities: 63, fieldOps: 62 },
];

const MOCK_NOTIFICATIONS = [
  { id: 'ntf_1', title: 'Maintenance reminder', message: 'Projector AF-0062 service window closes in 2 days.', time: '10m ago' },
  { id: 'ntf_2', title: 'Pending approval', message: 'Transfer request TR-1042 awaiting your sign-off.', time: '45m ago' },
];

exports.getDashboardSummary = async (req, res) => {
  try {
    let totalAssets = 12480;
    let allocatedAssets = 8764;
    let availableAssets = 3204;
    let underMaintenance = 312;
    let pendingTransfers = 47;
    let resourceBookings = 156;
    let recentActivity = [];
    let upcomingReturns = [];

    if (global.dbConnected) {
      // 1. Fetch counts from database
      totalAssets = await Asset.count();
      allocatedAssets = await Asset.count({ where: { status: "allocated" } });
      availableAssets = await Asset.count({ where: { status: "available" } });
      underMaintenance = await Asset.count({ where: { status: "maintenance" } });

      // Fallback/stubs for non-integrated models
      try {
        const { TransferRequest, ResourceBooking } = require("../models");
        if (TransferRequest) pendingTransfers = await TransferRequest.count({ where: { status: "pending" } });
        if (ResourceBooking) resourceBookings = await ResourceBooking.count({ where: { status: "active" } });
      } catch (err) {
        console.warn("Could not query TransferRequest/ResourceBooking models:", err.message);
      }

      // 2. Fetch recent activity (allocations)
      const allocations = await Allocation.findAll({
        include: [
          { model: User, as: "employee" },
          { model: Asset, as: "asset" },
        ],
        order: [["createdAt", "DESC"]],
        limit: 5,
      });

      recentActivity = allocations.map(a => ({
        id: a.id,
        title: `${a.asset ? a.asset.name : 'Asset'} allocated to ${a.employee ? a.employee.name : 'Employee'}`,
        meta: `${a.allocatedToType} · ${new Date(a.createdAt).toLocaleDateString()}`,
        tone: "primary",
      }));

      // 3. Fetch upcoming returns
      const returns = await Allocation.findAll({
        where: { status: "active", expectedReturnDate: { [Op.ne]: null } },
        include: [
          { model: User, as: "employee" },
          { model: Asset, as: "asset" },
        ],
        order: [["expectedReturnDate", "ASC"]],
        limit: 5,
      });

      upcomingReturns = returns.map(r => ({
        id: r.id,
        asset: r.asset ? r.asset.name : "Unknown Asset",
        employee: r.employee ? r.employee.name : "Unknown Employee",
        date: r.expectedReturnDate,
        status: new Date(r.expectedReturnDate) < new Date() ? "Overdue" : "On Track",
      }));

    } else {
      // Offline fallback: calculate stats dynamically based on mock storage
      const mockAssets = assetController.getMockAssets();
      const mockReqs = maintenanceController.getMockRequests();

      totalAssets = mockAssets.length;
      allocatedAssets = mockAssets.filter(a => a.status === "allocated").length;
      availableAssets = mockAssets.filter(a => a.status === "available").length;
      underMaintenance = mockAssets.filter(a => a.status === "maintenance").length;
      pendingTransfers = 5;
      resourceBookings = 12;

      // Add custom recent activities from mock lists
      recentActivity = [
        {
          id: "act_1",
          title: "Laptop AF-0114 allocated to Priya Shah",
          meta: "IT Department · 10 minutes ago",
          tone: "primary",
        },
        ...mockReqs.map(r => ({
          id: r.id,
          title: `Maintenance raised for ${r.asset ? r.asset.name : r.assetId}: ${r.description}`,
          meta: `Priority: ${r.priority} · Status: ${r.status}`,
          tone: r.priority === "High" ? "danger" : "amber",
        }))
      ].slice(0, 5);

      upcomingReturns = [
        { id: 'AF-0114', asset: 'Dell Latitude 5440', employee: 'Priya Shah', date: 'Jul 15, 2026', status: 'On Track' },
        { id: 'AF-0062', asset: 'Epson Projector', employee: 'Rohan Mehta', date: 'Jul 14, 2026', status: 'Overdue' },
      ];
    }

    // Return unified dashboard payload
    return res.json({
      stats: [
        { key: 'total', label: 'Total Assets', value: totalAssets, change: 4.2, trend: 'up', gradient: 'from-primary-500 to-primary-700' },
        { key: 'allocated', label: 'Allocated Assets', value: allocatedAssets, change: 2.8, trend: 'up', gradient: 'from-accent-500 to-accent-700' },
        { key: 'available', label: 'Available Assets', value: availableAssets, change: -1.6, trend: 'down', gradient: 'from-emerald-500 to-emerald-700' },
        { key: 'maintenance', label: 'Under Maintenance', value: underMaintenance, change: 6.1, trend: 'up', gradient: 'from-amber-500 to-amber-600' },
        { key: 'pending', label: 'Pending Transfers', value: pendingTransfers, change: -3.4, trend: 'down', gradient: 'from-rose-500 to-rose-600' },
        { key: 'bookings', label: 'Resource Bookings', value: resourceBookings, change: 8.9, trend: 'up', gradient: 'from-violet-500 to-violet-700' },
      ],
      assetDistribution: MOCK_ASSET_DISTRIBUTION,
      monthlyUsage: MOCK_MONTHLY_USAGE,
      departmentUtilization: MOCK_DEPARTMENT_UTILIZATION,
      recentActivity,
      upcomingReturns,
      notifications: MOCK_NOTIFICATIONS,
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Keep existing methods for backward compatibility
exports.assetsSummary = async (req, res) => {
  try {
    const totalAssets = await Asset.count();
    const available = await Asset.count({ where: { status: "available" } });
    const allocated = await Asset.count({ where: { status: "allocated" } });
    const maintenance = await Asset.count({ where: { status: "maintenance" } });
    res.json({ totalAssets, available, allocated, maintenance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.allocationsSummary = async (req, res) => {
  try {
    const activeAllocations = await Allocation.count({ where: { status: "active" } });
    const overdue = await Allocation.count({ where: { status: "overdue" } });
    const dueSoon = await Allocation.count({ where: { status: "dueSoon" } });
    res.json({ activeAllocations, overdue, dueSoon });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.maintenanceAlerts = async (req, res) => {
  try {
    const alerts = await MaintenanceRequest.findAll({
      where: { status: { [Op.in]: ["pending", "open", "in_progress"] } },
      include: [{ model: Asset, as: "asset" }],
      order: [["createdAt", "DESC"]],
      limit: 10,
    });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.userActivity = async (req, res) => {
  try {
    const activity = await Allocation.findAll({
      include: [
        { model: User, as: "employee" },
        { model: Asset, as: "asset" },
      ],
      order: [["updatedAt", "DESC"]],
      limit: 10,
    });
    res.json(activity);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.assetTrends = async (req, res) => {
  try {
    const trends = await Allocation.findAll({
      attributes: [
        [sequelize.fn("MONTH", sequelize.col("createdAt")), "month"],
        [sequelize.fn("COUNT", sequelize.col("id")), "allocations"],
      ],
      group: ["month"],
    });
    res.json(trends);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
