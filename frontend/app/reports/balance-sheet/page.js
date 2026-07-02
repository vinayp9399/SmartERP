"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function BalanceSheet() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const token = localStorage.getItem("token");
        const companyId = localStorage.getItem("companyId");
        const res = await axios.get("http://localhost:5000/reports/balance-sheet", {
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
      <h1 className="text-2xl font-bold mb-6">Balance Sheet</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}

      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
          <div className="bg-white rounded shadow p-6">
            <h2 className="font-bold text-lg mb-4 text-green-700">Assets</h2>
            <div className="flex justify-between py-2 border-b text-sm">
              <span>Accounts Receivable (Customers)</span>
              <span>₹{data.assets.accountsReceivable}</span>
            </div>
            <div className="flex justify-between py-2 border-b text-sm">
              <span>Stock Valuation</span>
              <span>₹{data.assets.stockValuation}</span>
            </div>
            <div className="flex justify-between py-2 font-bold">
              <span>Total Assets</span>
              <span>₹{data.assets.totalAssets}</span>
            </div>
          </div>

          <div className="bg-white rounded shadow p-6">
            <h2 className="font-bold text-lg mb-4 text-red-700">Liabilities</h2>
            <div className="flex justify-between py-2 border-b text-sm">
              <span>Accounts Payable (Suppliers)</span>
              <span>₹{data.liabilities.accountsPayable}</span>
            </div>
            <div className="flex justify-between py-2 font-bold">
              <span>Total Liabilities</span>
              <span>₹{data.liabilities.totalLiabilities}</span>
            </div>
          </div>

          <div className="bg-white rounded shadow p-6 md:col-span-2">
            <div className="flex justify-between text-lg font-bold">
              <span>Net Equity (Assets − Liabilities)</span>
              <span className={Number(data.equity) >= 0 ? "text-green-600" : "text-red-600"}>
                ₹{data.equity}
              </span>
            </div>
          </div>
        </div>
      )}

      <button onClick={() => router.push("/reports")} className="mt-6 text-sm text-blue-600">
        ← Back to Reports
      </button>
    </div>
  );
}
