import { useState, useEffect } from "react";
import {
  FiPackage,
  FiUser,
  FiCalendar,
  FiArrowRight,
} from "react-icons/fi";
import apiClient from "../../services/apiClient.js";

export default function AssetAllocationPage() {
  const [asset, setAsset] = useState("");
  const [employee, setEmployee] = useState("");
  const [department, setDepartment] = useState("");
  const [returnDate, setReturnDate] = useState("");

  const [assetsList, setAssetsList] = useState([]);
  const [employeesList, setEmployeesList] = useState([]);
  const [departmentsList, setDepartmentsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOptions = async () => {
    try {
      const [assetsRes, usersRes, deptsRes] = await Promise.all([
        apiClient.get("/assets"),
        apiClient.get("/users"),
        apiClient.get("/departments"),
      ]);
      setAssetsList(assetsRes.data || []);
      setEmployeesList(usersRes.data || []);
      setDepartmentsList(deptsRes.data || []);
    } catch (err) {
      console.error("Failed to load options:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark p-8">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl font-bold text-ink dark:text-white">
          Asset Allocation & Transfer
        </h1>

        <p className="text-slate-500 mt-2 mb-8">
          Allocate assets to employees or departments.
        </p>

        <div className="glass-panel rounded-xl2 p-6">

          <h2 className="text-xl font-semibold mb-6">
            Allocate Asset
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            {/* Asset */}

            <div>
              <label className="block mb-2 font-medium">
                Asset
              </label>

              <div className="relative">

                <FiPackage className="absolute left-3 top-4 text-slate-400" />

                <select
                  value={asset}
                  onChange={(e) => setAsset(e.target.value)}
                  className="w-full rounded-xl border px-10 py-3 bg-white dark:bg-slate-800 text-ink dark:text-white"
                  disabled={loading}
                >
                  <option value="">Select Asset</option>
                  {assetsList.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.assetTag}) - {a.status}
                    </option>
                  ))}
                </select>

              </div>
            </div>

            {/* Employee */}

            <div>

              <label className="block mb-2 font-medium">
                Employee
              </label>

              <div className="relative">

                <FiUser className="absolute left-3 top-4 text-slate-400" />

                <select
                  value={employee}
                  onChange={(e) => {
                    setEmployee(e.target.value);
                    if (e.target.value) setDepartment(""); // mutual exclusion
                  }}
                  className="w-full rounded-xl border px-10 py-3 bg-white dark:bg-slate-800 text-ink dark:text-white"
                  disabled={loading}
                >
                  <option value="">Select Employee</option>
                  {employeesList.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.role})
                    </option>
                  ))}
                </select>

              </div>

            </div>

            {/* Department */}

            <div>

              <label className="block mb-2 font-medium">
                Department
              </label>

              <select
                value={department}
                onChange={(e) => {
                  setDepartment(e.target.value);
                  if (e.target.value) setEmployee(""); // mutual exclusion
                }}
                className="w-full rounded-xl border px-4 py-3 bg-white dark:bg-slate-800 text-ink dark:text-white"
                disabled={loading}
              >
                <option value="">Select Department</option>
                {departmentsList.map((dep) => (
                  <option key={dep.id} value={dep.id}>
                    {dep.name}
                  </option>
                ))}
              </select>

            </div>

            {/* Return Date */}

            <div>

              <label className="block mb-2 font-medium">
                Expected Return Date
              </label>

              <div className="relative">

                <FiCalendar className="absolute left-3 top-4 text-slate-400" />

                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full rounded-xl border px-10 py-3 bg-white dark:bg-slate-800 text-ink dark:text-white"
                />

              </div>

            </div>

          </div>

          <button
            onClick={async () => {
              if (!asset) {
                alert("Please select an asset.");
                return;
              }
              if (!employee && !department) {
                alert("Please select an employee or department to allocate the asset to.");
                return;
              }
              try {
                const response = await apiClient.post("/allocations", {
                  asset,
                  employee,
                  department,
                  returnDate,
                });

                alert("Asset allocated successfully!");
                console.log(response.data);
                
                // Clear selection
                setAsset("");
                setEmployee("");
                setDepartment("");
                setReturnDate("");
                
                // Reload list to refresh asset statuses
                fetchOptions();
              } catch (error) {
                console.error("Error allocating asset:", error);
                alert("Failed to allocate asset: " + (error.response?.data?.error || error.message));
              }
            }}
            className="mt-8 flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
          >
            <FiArrowRight />
            Allocate Asset
          </button>

        </div>

      </div>
    </div>
  );
}