const crypto = require('crypto');
const { sequelize } = require('./db');
const bcrypt = require('bcryptjs');

const uuidv4 = () => crypto.randomUUID();

async function seed() {
  await sequelize.authenticate();
  console.log('Database connected.');

  const models = require('./models');

  // ---------- Departments ----------
  const deptData = [
    { id: uuidv4(), name: 'Engineering', code: 'ENG', status: 'active' },
    { id: uuidv4(), name: 'Human Resources', code: 'HR', status: 'active' },
    { id: uuidv4(), name: 'Finance', code: 'FIN', status: 'active' },
    { id: uuidv4(), name: 'Facilities', code: 'FAC', status: 'active' },
    { id: uuidv4(), name: 'Information Technology', code: 'IT', status: 'active' },
    { id: uuidv4(), name: 'Operations', code: 'OPS', status: 'active' },
  ];

  for (const d of deptData) {
    await models.Department.findOrCreate({ where: { name: d.name }, defaults: d });
  }
  const depts = await models.Department.findAll();
  const deptMap = Object.fromEntries(depts.map((d) => [d.name, d.id]));
  console.log(`Seeded ${depts.length} departments.`);

  // ---------- Categories ----------
  const catData = [
    { id: uuidv4(), name: 'Laptop', code: 'LAP', status: 'active' },
    { id: uuidv4(), name: 'Monitor', code: 'MON', status: 'active' },
    { id: uuidv4(), name: 'Printer', code: 'PRN', status: 'active' },
    { id: uuidv4(), name: 'Projector', code: 'PRJ', status: 'active' },
    { id: uuidv4(), name: 'Furniture', code: 'FUR', status: 'active' },
    { id: uuidv4(), name: 'Phone', code: 'PHN', status: 'active' },
    { id: uuidv4(), name: 'Vehicle', code: 'VEH', status: 'active' },
    { id: uuidv4(), name: 'Camera', code: 'CAM', status: 'active' },
    { id: uuidv4(), name: 'Networking', code: 'NET', status: 'active' },
    { id: uuidv4(), name: 'Server', code: 'SRV', status: 'active' },
  ];

  for (const c of catData) {
    await models.Category.findOrCreate({ where: { name: c.name }, defaults: c });
  }
  const cats = await models.Category.findAll();
  const catMap = Object.fromEntries(cats.map((c) => [c.name, c.id]));
  console.log(`Seeded ${cats.length} categories.`);

  // ---------- Vendors ----------
  const venData = [
    { id: uuidv4(), name: 'Dell Technologies', contactName: 'Sarah Chen', email: 'sarah@dell.com', phone: '1800-DELL-01' },
    { id: uuidv4(), name: 'HP Inc.', contactName: 'Mike Torres', email: 'mike@hp.com', phone: '1800-HP-INC' },
    { id: uuidv4(), name: 'Apple Inc.', contactName: 'Lisa Wong', email: 'lisa@apple.com', phone: '1800-APPL-E1' },
    { id: uuidv4(), name: 'Lenovo Group', contactName: 'Raj Kumar', email: 'raj@lenovo.com', phone: '1800-LEN-OVO' },
    { id: uuidv4(), name: 'Epson America', contactName: 'Yuki Tanaka', email: 'yuki@epson.com', phone: '1800-EPS-ON1' },
    { id: uuidv4(), name: 'Steelcase', contactName: 'Anna Schmidt', email: 'anna@steelcase.com', phone: '1800-STE-EL' },
    { id: uuidv4(), name: 'Cisco Systems', contactName: 'David Park', email: 'david@cisco.com', phone: '1800-CIS-CO' },
  ];

  for (const v of venData) {
    await models.Vendor.findOrCreate({ where: { name: v.name }, defaults: v });
  }
  const vens = await models.Vendor.findAll();
  const venMap = Object.fromEntries(vens.map((v) => [v.name, v.id]));
  console.log(`Seeded ${vens.length} vendors.`);

  // ---------- Locations ----------
  const locData = [
    { id: uuidv4(), name: 'Headquarters - Floor 1', code: 'HQ-01', type: 'office', status: 'active' },
    { id: uuidv4(), name: 'Headquarters - Floor 2', code: 'HQ-02', type: 'office', status: 'active' },
    { id: uuidv4(), name: 'Headquarters - Floor 3', code: 'HQ-03', type: 'office', status: 'active' },
    { id: uuidv4(), name: 'Warehouse A', code: 'WH-A', type: 'warehouse', status: 'active' },
    { id: uuidv4(), name: 'Warehouse B', code: 'WH-B', type: 'warehouse', status: 'active' },
    { id: uuidv4(), name: 'Lab 101', code: 'LAB-101', type: 'lab', status: 'active' },
    { id: uuidv4(), name: 'Conference Center', code: 'CC-01', type: 'common', status: 'active' },
  ];

  for (const l of locData) {
    await models.Location.findOrCreate({ where: { name: l.name }, defaults: l });
  }
  const locs = await models.Location.findAll();
  const locMap = Object.fromEntries(locs.map((l) => [l.name, l.id]));
  console.log(`Seeded ${locs.length} locations.`);

  // ---------- Users (employees) ----------
  const passwordHash = await bcrypt.hash('password123', 10);
  const userData = [
    { id: uuidv4(), name: 'Admin User', email: 'admin@assetflow.com', passwordHash, role: 'admin', status: 'active', departmentId: deptMap['Information Technology'], phoneNumber: '+1-555-0100' },
    { id: uuidv4(), name: 'Priya Shah', email: 'priya@assetflow.com', passwordHash, role: 'employee', status: 'active', departmentId: deptMap['Engineering'], phoneNumber: '+1-555-0101' },
    { id: uuidv4(), name: 'Raj Patel', email: 'raj@assetflow.com', passwordHash, role: 'employee', status: 'active', departmentId: deptMap['Engineering'], phoneNumber: '+1-555-0102' },
    { id: uuidv4(), name: 'Kiran Joshi', email: 'kiran@assetflow.com', passwordHash, role: 'employee', status: 'active', departmentId: deptMap['Facilities'], phoneNumber: '+1-555-0103' },
    { id: uuidv4(), name: 'Sana Iqbal', email: 'sana@assetflow.com', passwordHash, role: 'employee', status: 'active', departmentId: deptMap['Human Resources'], phoneNumber: '+1-555-0104' },
    { id: uuidv4(), name: 'Aditi Rao', email: 'aditi@assetflow.com', passwordHash, role: 'employee', status: 'active', departmentId: deptMap['Information Technology'], phoneNumber: '+1-555-0105' },
    { id: uuidv4(), name: 'Arjun Nair', email: 'arjun@assetflow.com', passwordHash, role: 'employee', status: 'active', departmentId: deptMap['Operations'], phoneNumber: '+1-555-0106' },
    { id: uuidv4(), name: 'Rohan Mehta', email: 'rohan@assetflow.com', passwordHash, role: 'employee', status: 'active', departmentId: deptMap['Finance'], phoneNumber: '+1-555-0107' },
  ];

  for (const u of userData) {
    await models.User.findOrCreate({ where: { email: u.email }, defaults: u });
  }
  const users = await models.User.findAll();
  const userMap = Object.fromEntries(users.map((u) => [u.name, u.id]));
  console.log(`Seeded ${users.length} users.`);

  // ---------- Assets (the main request) ----------
  const assetData = [
    {
      id: uuidv4(), name: 'Dell Latitude 5440', assetTag: 'AF-0114', serialNumber: 'DL-5440-001',
      categoryId: catMap['Laptop'], vendorId: venMap['Dell Technologies'], locationId: locMap['Headquarters - Floor 2'],
      acquisitionDate: '2024-03-15', acquisitionCost: 1249.99, condition: 'good', isSharedBookable: false,
      requiresBookingApproval: false, status: 'allocated', createdAt: new Date('2024-03-15'),
    },
    {
      id: uuidv4(), name: 'Dell Latitude 5440', assetTag: 'AF-0115', serialNumber: 'DL-5440-002',
      categoryId: catMap['Laptop'], vendorId: venMap['Dell Technologies'], locationId: locMap['Headquarters - Floor 1'],
      acquisitionDate: '2024-03-15', acquisitionCost: 1249.99, condition: 'good', isSharedBookable: false,
      requiresBookingApproval: false, status: 'available', createdAt: new Date('2024-03-15'),
    },
    {
      id: uuidv4(), name: 'Dell Monitor 27"', assetTag: 'AF-0201', serialNumber: 'MON-27-001',
      categoryId: catMap['Monitor'], vendorId: venMap['Dell Technologies'], locationId: locMap['Headquarters - Floor 2'],
      acquisitionDate: '2024-04-10', acquisitionCost: 349.99, condition: 'good', isSharedBookable: false,
      requiresBookingApproval: false, status: 'allocated', createdAt: new Date('2024-04-10'),
    },
    {
      id: uuidv4(), name: 'Epson Projector', assetTag: 'AF-0062', serialNumber: 'EPS-PRO-001',
      categoryId: catMap['Projector'], vendorId: venMap['Epson America'], locationId: locMap['Conference Center'],
      acquisitionDate: '2023-08-20', acquisitionCost: 899.00, condition: 'fair', isSharedBookable: true,
      requiresBookingApproval: true, status: 'allocated', createdAt: new Date('2023-08-20'),
    },
    {
      id: uuidv4(), name: 'MacBook Pro 16"', assetTag: 'AF-0330', serialNumber: 'MBP-16-001',
      categoryId: catMap['Laptop'], vendorId: venMap['Apple Inc.'], locationId: locMap['Headquarters - Floor 3'],
      acquisitionDate: '2024-06-01', acquisitionCost: 2499.00, condition: 'good', isSharedBookable: false,
      requiresBookingApproval: false, status: 'allocated', createdAt: new Date('2024-06-01'),
    },
    {
      id: uuidv4(), name: 'Ergonomic Office Chair', assetTag: 'AF-0202', serialNumber: 'STL-CHAIR-001',
      categoryId: catMap['Furniture'], vendorId: venMap['Steelcase'], locationId: locMap['Headquarters - Floor 1'],
      acquisitionDate: '2024-01-05', acquisitionCost: 850.00, condition: 'good', isSharedBookable: false,
      requiresBookingApproval: false, status: 'allocated', createdAt: new Date('2024-01-05'),
    },
    {
      id: uuidv4(), name: 'Ergonomic Office Chair', assetTag: 'AF-0203', serialNumber: 'STL-CHAIR-002',
      categoryId: catMap['Furniture'], vendorId: venMap['Steelcase'], locationId: locMap['Warehouse A'],
      acquisitionDate: '2024-01-05', acquisitionCost: 850.00, condition: 'good', isSharedBookable: false,
      requiresBookingApproval: false, status: 'available', createdAt: new Date('2024-01-05'),
    },
    {
      id: uuidv4(), name: 'HP LaserJet Pro', assetTag: 'AF-0081', serialNumber: 'HP-LJ-001',
      categoryId: catMap['Printer'], vendorId: venMap['HP Inc.'], locationId: locMap['Headquarters - Floor 1'],
      acquisitionDate: '2023-11-10', acquisitionCost: 420.00, condition: 'fair', isSharedBookable: true,
      requiresBookingApproval: false, status: 'available', createdAt: new Date('2023-11-10'),
    },
    {
      id: uuidv4(), name: 'Cisco Switch 2960', assetTag: 'AF-0099', serialNumber: 'CS-SW-001',
      categoryId: catMap['Networking'], vendorId: venMap['Cisco Systems'], locationId: locMap['Lab 101'],
      acquisitionDate: '2023-06-01', acquisitionCost: 1890.00, condition: 'good', isSharedBookable: false,
      requiresBookingApproval: false, status: 'available', createdAt: new Date('2023-06-01'),
    },
    {
      id: uuidv4(), name: 'Lenovo ThinkPad X1', assetTag: 'AF-0101', serialNumber: 'LEN-TP-001',
      categoryId: catMap['Laptop'], vendorId: venMap['Lenovo Group'], locationId: locMap['Warehouse A'],
      acquisitionDate: '2024-07-20', acquisitionCost: 1799.00, condition: 'good', isSharedBookable: false,
      requiresBookingApproval: false, status: 'available', createdAt: new Date('2024-07-20'),
    },
    {
      id: uuidv4(), name: 'Dell PowerEdge R740', assetTag: 'AF-0150', serialNumber: 'DL-SRV-001',
      categoryId: catMap['Server'], vendorId: venMap['Dell Technologies'], locationId: locMap['Lab 101'],
      acquisitionDate: '2023-02-15', acquisitionCost: 8500.00, condition: 'poor', isSharedBookable: false,
      requiresBookingApproval: false, status: 'available', createdAt: new Date('2023-02-15'),
    },
    {
      id: uuidv4(), name: 'Forklift Truck', assetTag: 'AF-0050', serialNumber: 'FL-001',
      categoryId: catMap['Vehicle'], vendorId: venMap['Steelcase'], locationId: locMap['Warehouse B'],
      acquisitionDate: '2022-09-01', acquisitionCost: 15000.00, condition: 'poor', isSharedBookable: false,
      requiresBookingApproval: false, status: 'maintenance', createdAt: new Date('2022-09-01'),
    },
    {
      id: uuidv4(), name: 'Conference Room B2 Kit', assetTag: 'AF-0098', serialNumber: 'CR-B2-001',
      categoryId: catMap['Projector'], vendorId: venMap['Epson America'], locationId: locMap['Conference Center'],
      acquisitionDate: '2024-02-01', acquisitionCost: 3200.00, condition: 'good', isSharedBookable: true,
      requiresBookingApproval: true, status: 'allocated', createdAt: new Date('2024-02-01'),
    },
    {
      id: uuidv4(), name: 'iPhone 15 Pro', assetTag: 'AF-0401', serialNumber: 'IP15-001',
      categoryId: catMap['Phone'], vendorId: venMap['Apple Inc.'], locationId: locMap['Warehouse A'],
      acquisitionDate: '2024-09-10', acquisitionCost: 1099.00, condition: 'good', isSharedBookable: false,
      requiresBookingApproval: false, status: 'available', createdAt: new Date('2024-09-10'),
    },
    {
      id: uuidv4(), name: 'Sony DSLR Camera', assetTag: 'AF-0301', serialNumber: 'SN-DSLR-001',
      categoryId: catMap['Camera'], vendorId: venMap['Epson America'], locationId: locMap['Warehouse A'],
      acquisitionDate: '2022-12-01', acquisitionCost: 1800.00, condition: 'good', isSharedBookable: true,
      requiresBookingApproval: false, status: 'available', createdAt: new Date('2022-12-01'),
    },
  ];

  const assetIds = {};
  for (const a of assetData) {
    await models.Asset.findOrCreate({ where: { assetTag: a.assetTag }, defaults: a });
    assetIds[a.assetTag] = a.id;
  }
  const totalAssets = await models.Asset.count();
  console.log(`Seeded ${totalAssets} assets.`);

  // ---------- Allocations (active + historical) ----------
  const existingAllocs = await models.Allocation.count();
  if (existingAllocs === 0) {
    const allocs = [
      {
        id: uuidv4(), assetId: assetIds['AF-0114'], employeeId: userMap['Priya Shah'],
        departmentId: deptMap['Engineering'], allocatedById: userMap['Admin User'],
        expectedReturnDate: '2026-07-15', status: 'active',
        createdAt: new Date('2026-03-12'), updatedAt: new Date('2026-03-12'),
      },
      {
        id: uuidv4(), assetId: assetIds['AF-0201'], employeeId: userMap['Priya Shah'],
        departmentId: deptMap['Engineering'], allocatedById: userMap['Admin User'],
        expectedReturnDate: '2026-08-01', status: 'active',
        createdAt: new Date('2026-04-01'), updatedAt: new Date('2026-04-01'),
      },
      {
        id: uuidv4(), assetId: assetIds['AF-0062'], employeeId: userMap['Rohan Mehta'],
        departmentId: deptMap['Finance'], allocatedById: userMap['Admin User'],
        expectedReturnDate: '2026-07-14', status: 'active',
        createdAt: new Date('2026-01-04'), updatedAt: new Date('2026-01-04'),
      },
      {
        id: uuidv4(), assetId: assetIds['AF-0330'], employeeId: userMap['Aditi Rao'],
        departmentId: deptMap['Information Technology'], allocatedById: userMap['Admin User'],
        expectedReturnDate: '2026-07-12', status: 'active',
        createdAt: new Date('2026-05-20'), updatedAt: new Date('2026-05-20'),
      },
      {
        id: uuidv4(), assetId: assetIds['AF-0202'], employeeId: userMap['Sana Iqbal'],
        departmentId: deptMap['Human Resources'], allocatedById: userMap['Admin User'],
        expectedReturnDate: '2026-07-18', status: 'active',
        createdAt: new Date('2026-02-10'), updatedAt: new Date('2026-02-10'),
      },
      {
        id: uuidv4(), assetId: assetIds['AF-0098'], employeeId: userMap['Arjun Nair'],
        departmentId: deptMap['Operations'], allocatedById: userMap['Admin User'],
        expectedReturnDate: '2026-07-20', status: 'active',
        createdAt: new Date('2026-06-15'), updatedAt: new Date('2026-06-15'),
      },
      // Historical (returned) allocations
      {
        id: uuidv4(), assetId: assetIds['AF-0114'], employeeId: userMap['Arjun Nair'],
        departmentId: deptMap['Operations'], allocatedById: userMap['Admin User'],
        expectedReturnDate: '2026-03-01', actualReturnDate: '2026-03-10',
        returnCondition: 'good', returnNotes: 'Returned after project completion',
        status: 'returned', createdAt: new Date('2026-01-04'), updatedAt: new Date('2026-03-10'),
      },
      {
        id: uuidv4(), assetId: assetIds['AF-0062'], employeeId: userMap['Kiran Joshi'],
        departmentId: deptMap['Facilities'], allocatedById: userMap['Admin User'],
        expectedReturnDate: '2025-12-20', actualReturnDate: '2025-12-18',
        returnCondition: 'fair', returnNotes: 'Minor wear, bulb replaced',
        status: 'returned', createdAt: new Date('2025-11-01'), updatedAt: new Date('2025-12-18'),
      },
    ];

    for (const al of allocs) {
      await models.Allocation.create(al);
    }
    console.log(`Seeded ${allocs.length} allocations.`);
  } else {
    console.log(`${existingAllocs} allocations already exist, skipping.`);
  }

  // ---------- Notifications ----------
  const existingNots = await models.Notification.count();
  if (existingNots === 0) {
    const now = new Date();
    const mins = (n) => new Date(now.getTime() - n * 60000);
    const hrs = (n) => new Date(now.getTime() - n * 3600000);
    const days = (n) => new Date(now.getTime() - n * 86400000);

    const nots = [
      { id: uuidv4(), userId: userMap['Admin User'], title: 'Maintenance reminder', message: 'Projector AF-0062 service window closes in 2 days.', type: 'alert', read: false, createdAt: mins(10) },
      { id: uuidv4(), userId: userMap['Admin User'], title: 'Pending approval', message: 'Transfer request TR-1042 awaiting your sign-off.', type: 'approval', read: false, createdAt: mins(45) },
      { id: uuidv4(), userId: userMap['Admin User'], title: 'Asset due today', message: 'MacBook Pro AF-0330 is due for return today.', type: 'alert', read: false, createdAt: hrs(2) },
      { id: uuidv4(), userId: userMap['Admin User'], title: 'Booking confirmed', message: 'Conference Room B2 booked for Team Engineering 2:00-3:00 PM.', type: 'booking', read: true, createdAt: hrs(3) },
      { id: uuidv4(), userId: userMap['Admin User'], title: 'Maintenance resolved', message: 'Laptop AF-0101 repair completed by Dell support.', type: 'alert', read: true, createdAt: days(1) },
      { id: uuidv4(), userId: userMap['Admin User'], title: 'Allocation approved', message: 'Monitor AF-0201 allocated to Priya Shah (Engineering).', type: 'approval', read: true, createdAt: days(2) },
      { id: uuidv4(), userId: userMap['Admin User'], title: 'Return overdue', message: 'Projector AF-0062 was due 3 days ago - follow up with Rohan Mehta.', type: 'alert', read: false, createdAt: days(3) },
      { id: uuidv4(), userId: userMap['Admin User'], title: 'New booking request', message: 'Camera AF-0301 requested by Marketing for product shoot.', type: 'booking', read: false, createdAt: days(5) },
    ];

    for (const n of nots) {
      await models.Notification.create(n);
    }
    console.log(`Seeded ${nots.length} notifications.`);
  } else {
    console.log(`${existingNots} notifications already exist, skipping.`);
  }

  console.log('\nSeed complete!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
