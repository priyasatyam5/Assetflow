import { useState } from "react";
import {
  FiPackage,
  FiUser,
  FiCalendar,
  FiArrowRight,
} from "react-icons/fi";

export default function AssetAllocationPage() {
  const [asset, setAsset] = useState("");
  const [employee, setEmployee] = useState("");
  const [department, setDepartment] = useState("");
  const [returnDate, setReturnDate] = useState("");

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
                  className="w-full rounded-xl border px-10 py-3"
                >
                  <option value="">Select Asset</option>
                  <option>Laptop AF-0114</option>
                  <option>Monitor AF-0201</option>
                  <option>Printer AF-0150</option>
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
                  onChange={(e) => setEmployee(e.target.value)}
                  className="w-full rounded-xl border px-10 py-3"
                >
                  <option value="">Select Employee</option>
                  <option>Priya</option>
                  <option>Raj</option>
                  <option>Kiran</option>
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
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full rounded-xl border px-4 py-3"
              >
                <option value="">Select Department</option>
                <option>Engineering</option>
                <option>HR</option>
                <option>Finance</option>
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
                  className="w-full rounded-xl border px-10 py-3"
                />

              </div>

            </div>

          </div>

          <button
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