"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function DailySales() {
  const router = useRouter();
  const [daily, setDaily] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const token = localStorage.getItem("token");
        const companyId = localStorage.getItem("companyId");
        const res = await axios.get("http://localhost:5000/reports/daily-sales", {
          headers: { auth: token },
          params: { companyId },
        });
        setDaily(res.data.daily);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch report");
      }
    };
    fetch();
  }, []);

  const grandTotal = daily.reduce((s, d) => s + d.total, 0);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-4">Daily Sales</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-200 text-left">
            <tr>
              <th className="p-3">Date</th>
              <th className="p-3">No. of Sales</th>
              <th className="p-3">Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {daily.map((d, i) => (
              <tr key={i} className="border-t">
                <td className="p-3">{d.date}</td>
                <td className="p-3">{d.count}</td>
                <td className="p-3">₹{d.total.toFixed(2)}</td>
              </tr>
            ))}
            {daily.length === 0 && (
              <tr><td colSpan={3} className="p-4 text-gray-500">No sales data found.</td></tr>
            )}
          </tbody>
          {daily.length > 0 && (
            <tfoot>
              <tr className="bg-gray-100 font-bold">
                <td colSpan={2} className="p-3 text-right">Grand Total:</td>
                <td className="p-3">₹{grandTotal.toFixed(2)}</td>
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
