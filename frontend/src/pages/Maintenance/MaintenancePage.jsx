import { useState } from "react";
import {
  FiTool,
  FiAlertTriangle,
  FiUpload,
  FiSend,
} from "react-icons/fi";

export default function MaintenancePage() {
  const [asset, setAsset] = useState("");
  const [issue, setIssue] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [photo, setPhoto] = useState(null);
  const [message, setMessage] = useState("");
  const [requests, setRequests] = useState([]);
  const [history, setHistory] = useState([]);

  const handleRequest = () => {

  if (!asset || !issue) {
    setMessage("Please fill all required fields.");
    return;
  }

  const newRequest = {
    id: Date.now(),
    asset,
    issue,
    priority,
    photo: photo ? photo.name : "No Photo",
    status: "Pending",
    assetStatus: "Available",
  };

  setRequests([...requests, newRequest]);

  setMessage("✅ Maintenance Request Submitted");

  setAsset("");
  setIssue("");
  setPriority("Medium");
  setPhoto(null);
};
const updateStatus = (id, newStatus) => {

  setRequests(
    requests.map((request) => {

      if (request.id !== id) return request;

      let assetStatus = request.assetStatus;

      if (newStatus === "Approved") {
        assetStatus = "Under Maintenance";
      }

      if (newStatus === "Resolved") {
        assetStatus = "Available";
      }

      return {
        ...request,
        status: newStatus,
        assetStatus,
      };
    })
  );
  setHistory((prev) => [
  ...prev,
  {
    id: Date.now(),
    asset: requests.find((r) => r.id === id)?.asset,
    status: newStatus,
    date: new Date().toLocaleString(),
  },
]);

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
                  className="w-full border rounded-xl px-10 py-3"
                >
                  <option value="">Choose Asset</option>
                  <option>Laptop AF-0114</option>
                  <option>Projector PJ-101</option>
                  <option>Conference Room AC</option>
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
                  className="w-full border rounded-xl px-10 py-3"
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
                className="w-full border rounded-xl p-4"
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
                  className="w-full border rounded-xl px-10 py-3"
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
            <div className="mt-6 rounded-lg bg-green-100 text-green-700 px-4 py-3">
              {message}
            </div>
          )}

        </div>
        <div className="glass-panel rounded-xl2 p-6 mt-8">

  <h2 className="text-xl font-semibold mb-6">
    Maintenance Requests
  </h2>

  <table className="w-full">

    <thead>

      <tr className="border-b">

        <th className="text-left py-3">Asset</th>
        <th className="text-left">Issue</th>
        <th className="text-left">Priority</th>
        <th className="text-left">Status</th>
        <th className="text-left">Asset Status</th>
        <th className="text-left">Actions</th>

      </tr>

    </thead>

    <tbody>

      {requests.map((request) => (

        <tr key={request.id} className="border-b">

          <td className="py-3">{request.asset}</td>

          <td>{request.issue}</td>

          <td>{request.priority}</td>

          <td>{request.status}</td>

          <td>{request.assetStatus}</td>
          <td className="space-x-2">

  {request.status === "Pending" && (
    <>
      <button
        onClick={() => updateStatus(request.id, "Approved")}
        className="bg-green-500 text-white px-3 py-1 rounded"
      >
        Approve
      </button>

      <button
        onClick={() => updateStatus(request.id, "Rejected")}
        className="bg-red-500 text-white px-3 py-1 rounded"
      >
        Reject
      </button>
    </>
  )}

  {request.status === "Approved" && (
    <button
      onClick={() => updateStatus(request.id, "Technician Assigned")}
      className="bg-blue-500 text-white px-3 py-1 rounded"
    >
      Assign Technician
    </button>
  )}

  {request.status === "Technician Assigned" && (
    <button
      onClick={() => updateStatus(request.id, "In Progress")}
      className="bg-yellow-500 text-white px-3 py-1 rounded"
    >
      Start Work
    </button>
  )}

  {request.status === "In Progress" && (
    <button
      onClick={() => updateStatus(request.id, "Resolved")}
      className="bg-purple-500 text-white px-3 py-1 rounded"
    >
      Resolve
    </button>
  )}

</td>

        </tr>

      ))}

    </tbody>

  </table>

</div>
<div className="glass-panel rounded-xl2 p-6 mt-8">

  <h2 className="text-xl font-semibold mb-6">
    Maintenance History
  </h2>

  <table className="w-full">

    <thead>

      <tr className="border-b">

        <th className="text-left py-3">Asset</th>
        <th className="text-left">Status</th>
        <th className="text-left">Date & Time</th>

      </tr>

    </thead>

    <tbody>

      {history.map((item) => (

        <tr key={item.id} className="border-b">

          <td className="py-3">{item.asset}</td>

          <td>{item.status}</td>

          <td>{item.date}</td>

        </tr>

      ))}

    </tbody>

  </table>

</div>

      </div>

    </div>
  );
}