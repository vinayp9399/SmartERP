"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function ProfitLoss() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const token = localStorage.getItem("token");
        const companyId = localStorage.getItem("companyId");
        const res = await axios.get("http://localhost:5000/reports/profit-loss", {
          headers: { auth: token },
          params: { companyId },
        });
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch report");
      }
    };
    fetch();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6">Profit & Loss</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}

      {data && (
        <div className="bg-white rounded shadow p-6 max-w-md">
          <div className="flex justify-between py-3 border-b">
            <span className="text-gray-600">Total Revenue (Sales)</span>
            <span className="font-semibold text-green-600">₹{data.revenue}</span>
          </div>
          <div className="flex justify-between py-3 border-b">
            <span className="text-gray-600">Cost of Goods (Purchases)</span>
            <span className="font-semibold text-red-600">₹{data.costOfGoods}</span>
          </div>
          <div className="flex justify-between py-3">
            <span className="font-bold text-lg">Gross Profit</span>
            <span className={`font-bold text-lg ${Number(data.grossProfit) >= 0 ? "text-green-600" : "text-red-600"}`}>
              ₹{data.grossProfit}
            </span>
          </div>
        </div>
      )}

      <button onClick={() => router.push("/reports")} className="mt-6 text-sm text-blue-600">
        ← Back to Reports
      </button>
    </div>
  );
}
