"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function LowStockReport() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [threshold, setThreshold] = useState(10);
  const [error, setError] = useState("");

  const fetchReport = async () => {
    try {
      const token = localStorage.getItem("token");
      const companyId = localStorage.getItem("companyId");
      const res = await axios.get("http://localhost:5000/reports/low-stock", {
        headers: { auth: token },
        params: { companyId, threshold },
      });
      setItems(res.data.items);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch report");
    }
  };

  useEffect(() => { fetchReport(); }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-4">Low Stock Report</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <div className="flex gap-2 mb-4">
        <input
          type="number"
          value={threshold}
          onChange={(e) => setThreshold(e.target.value)}
          className="border p-2 rounded w-40"
          placeholder="Threshold qty"
        />
        <button onClick={fetchReport} className="bg-gray-700 text-white px-4 py-2 rounded">
          Apply
        </button>
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-200 text-left">
            <tr>
              <th className="p-3">Item</th>
              <th className="p-3">SKU</th>
              <th className="p-3">Unit</th>
              <th className="p-3">Current Qty</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-3">{item.name}</td>
                <td className="p-3">{item.sku}</td>
                <td className="p-3">{item.unit?.name || "—"}</td>
                <td className="p-3 text-red-600 font-semibold">{Number(item.quantity)}</td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={4} className="p-4 text-gray-500">No low stock items.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <button onClick={() => router.push("/reports")} className="mt-6 text-sm text-blue-600">
        ← Back to Reports
      </button>
    </div>
  );
}
