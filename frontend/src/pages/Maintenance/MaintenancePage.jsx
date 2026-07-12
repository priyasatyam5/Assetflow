import { useState, useEffect } from "react";
import {
  FiTool,
  FiAlertTriangle,
  FiUpload,
  FiSend,
} from "react-icons/fi";
import apiClient from "../../services/apiClient.js";

export default function MaintenancePage() {
  const [asset, setAsset] = useState("");
  const [issue, setIssue] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [photo, setPhoto] = useState(null);
  const [message, setMessage] = useState("");
  const [requests, setRequests] = useState([]);
  const [history, setHistory] = useState([]);
  const [assetsList, setAssetsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMaintenanceData = async () => {
    try {
      const [maintRes, assetsRes] = await Promise.all([
        apiClient.get("/maintenance-requests"),
        apiClient.get("/assets"),
      ]);
      setRequests(maintRes.data?.requests || []);
      setHistory(maintRes.data?.history || []);
      setAssetsList(assetsRes.data || []);
    } catch (err) {
      console.error("Failed to load maintenance data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenanceData();
  }, []);

  const handleRequest = async () => {
    if (!asset || !issue) {
      setMessage("Please fill all required fields.");
      return;
    }

    try {
      await apiClient.post("/maintenance-requests", {
        assetId: asset,
        description: issue,
        priority,
      });

      setMessage("✅ Maintenance Request Submitted");
      setAsset("");
      setIssue("");
      setPriority("Medium");
      setPhoto(null);

      // Refresh listings
      fetchMaintenanceData();
    } catch (error) {
      console.error("Error creating maintenance request:", error);
      setMessage("❌ Failed to submit request");
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await apiClient.put(`/maintenance-requests/${id}/status`, {
        status: newStatus,
      });
      // Refresh listings
      fetchMaintenanceData();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark p-8">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold mb-2 text-ink dark:text-white">
          Maintenance Management
        </h1>

        <p className="text-slate-500 mb-8">
          Raise maintenance requests and track repair workflow.
        </p>

        <div className="glass-panel rounded-xl2 p-6">

          <h2 className="text-xl font-semibold mb-6">
            Raise Maintenance Request
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            {/* Asset */}

            <div>

              <label className="block mb-2 font-medium">
                Select Asset
              </label>

              <div className="relative">

                <FiTool className="absolute left-3 top-4 text-slate-400"/>

                <select
                  value={asset}
                  onChange={(e)=>setAsset(e.target.value)}
                  className="w-full border rounded-xl px-10 py-3 bg-white dark:bg-slate-800 text-ink dark:text-white"
                  disabled={loading}
                >
                  <option value="">Choose Asset</option>
                  {assetsList.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.assetTag})
                    </option>
                  ))}
                </select>

              </div>

            </div>

            {/* Priority */}

            <div>

              <label className="block mb-2 font-medium">
                Priority
              </label>

              <div className="relative">

                <FiAlertTriangle className="absolute left-3 top-4 text-slate-400"/>

                <select
                  value={priority}
                  onChange={(e)=>setPriority(e.target.value)}
                  className="w-full border rounded-xl px-10 py-3 bg-white dark:bg-slate-800 text-ink dark:text-white"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>

              </div>

            </div>

            {/* Issue */}

            <div className="md:col-span-2">

              <label className="block mb-2 font-medium">
                Describe Issue
              </label>

              <textarea
                rows="4"
                value={issue}
                onChange={(e)=>setIssue(e.target.value)}
                className="w-full border rounded-xl p-4 bg-white dark:bg-slate-800 text-ink dark:text-white"
                placeholder="Describe the issue..."
              />

            </div>

            {/* Upload */}

            <div className="md:col-span-2">

              <label className="block mb-2 font-medium">
                Attach Photo
              </label>

              <div className="relative">

                <FiUpload className="absolute left-3 top-4 text-slate-400"/>

                <input
                  type="file"
                  onChange={(e)=>setPhoto(e.target.files[0])}
                  className="w-full border rounded-xl px-10 py-3 bg-white dark:bg-slate-800 text-ink dark:text-white"
                />

              </div>

            </div>

          </div>

          <button
            onClick={handleRequest}
            className="mt-8 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
          >
            <FiSend />
            Raise Request
          </button>

          {message && (
            <div className={`mt-6 rounded-lg px-4 py-3 ${message.startsWith("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {message}
            </div>
          )}

        </div>
        <div className="glass-panel rounded-xl2 p-6 mt-8 overflow-x-auto">

          <h2 className="text-xl font-semibold mb-6">
            Maintenance Requests
          </h2>

          <table className="w-full text-left">

            <thead>

              <tr className="border-b">

                <th className="py-3 pr-4">Asset</th>
                <th className="pr-4">Issue</th>
                <th className="pr-4">Priority</th>
                <th className="pr-4">Status</th>
                <th className="pr-4">Asset Status</th>
                <th>Actions</th>

              </tr>

            </thead>

            <tbody>

              {requests.map((request) => (

                <tr key={request.id} className="border-b text-ink dark:text-slate-300">

                  <td className="py-3 pr-4 font-medium">{request.asset?.name || request.assetId}</td>

                  <td className="pr-4">{request.description || request.issue}</td>

                  <td className="pr-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      request.priority === "High" ? "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400" :
                      request.priority === "Medium" ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" :
                      "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400"
                    }`}>
                      {request.priority}
                    </span>
                  </td>

                  <td className="pr-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      request.status === "Resolved" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" :
                      request.status === "Pending" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" :
                      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                    }`}>
                      {request.status}
                    </span>
                  </td>

                  <td className="pr-4">{request.assetStatus || (request.asset?.status === "maintenance" ? "Under Maintenance" : "Available")}</td>
                  <td className="space-x-2 py-2 flex flex-wrap gap-y-2">

                    {request.status === "Pending" && (
                      <>
                        <button
                          onClick={() => updateStatus(request.id, "Approved")}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() => updateStatus(request.id, "Rejected")}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {request.status === "Approved" && (
                      <button
                        onClick={() => updateStatus(request.id, "Technician Assigned")}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                        Assign Technician
                      </button>
                    )}

                    {request.status === "Technician Assigned" && (
                      <button
                        onClick={() => updateStatus(request.id, "In Progress")}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                        Start Work
                      </button>
                    )}

                    {request.status === "In Progress" && (
                      <button
                        onClick={() => updateStatus(request.id, "Resolved")}
                        className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                        Resolve
                      </button>
                    )}

                  </td>

                </tr>

              ))}

              {requests.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-slate-500">
                    No active maintenance requests.
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>
        <div className="glass-panel rounded-xl2 p-6 mt-8 overflow-x-auto">

          <h2 className="text-xl font-semibold mb-6">
            Maintenance History
          </h2>

          <table className="w-full text-left">

            <thead>

              <tr className="border-b">

                <th className="py-3 pr-4">Asset</th>
                <th className="pr-4">Status</th>
                <th>Date & Time</th>

              </tr>

            </thead>

            <tbody>

              {history.map((item) => (

                <tr key={item.id} className="border-b text-ink dark:text-slate-300">

                  <td className="py-3 pr-4 font-medium">{item.asset?.name || item.asset}</td>

                  <td className="pr-4">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400">
                      {item.status}
                    </span>
                  </td>

                  <td>{item.date || new Date(item.updatedAt).toLocaleString()}</td>

                </tr>

              ))}

              {history.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center py-6 text-slate-500">
                    No maintenance history logs found.
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}