"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function StockSummary() {
  const router = useRouter();
  const [summary, setSummary] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const token = localStorage.getItem("token");
        const companyId = localStorage.getItem("companyId");
        const res = await axios.get("http://localhost:5000/reports/stock-summary", {
          headers: { auth: token },
          params: { companyId },
        });
        setSummary(res.data.summary);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch report");
      }
    };
    fetch();
  }, []);

  const totalValuation = summary.reduce((s, i) => s + i.valuation, 0);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-4">Stock Summary</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-200 text-left">
            <tr>
              <th className="p-3">Item</th>
              <th className="p-3">SKU</th>
              <th className="p-3">Group</th>
              <th className="p-3">Unit</th>
              <th className="p-3">Qty</th>
              <th className="p-3">Purchase Rate</th>
              <th className="p-3">Selling Rate</th>
              <th className="p-3">GST %</th>
              <th className="p-3">Valuation</th>
            </tr>
          </thead>
          <tbody>
            {summary.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-3">{item.name}</td>
                <td className="p-3">{item.sku}</td>
                <td className="p-3">{item.stockGroup}</td>
                <td className="p-3">{item.unit}</td>
                <td className="p-3">{item.quantity}</td>
                <td className="p-3">₹{item.purchasePrice}</td>
                <td className="p-3">₹{item.sellingPrice}</td>
                <td className="p-3">{item.gstPercentage}%</td>
                <td className="p-3">₹{item.valuation.toFixed(2)}</td>
              </tr>
            ))}
            {summary.length === 0 && (
              <tr><td colSpan={9} className="p-4 text-gray-500">No items found.</td></tr>
            )}
          </tbody>
          {summary.length > 0 && (
            <tfoot>
              <tr className="bg-gray-100 font-bold">
                <td colSpan={8} className="p-3 text-right">Total Valuation:</td>
                <td className="p-3">₹{totalValuation.toFixed(2)}</td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      <button onClick={() => router.push("/reports")} className="mt-6 text-sm text-blue-600">
        ← Back to Reports
      </button>
    </div>
  );
}
