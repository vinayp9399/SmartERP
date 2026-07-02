"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function TrialBalance() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const token = localStorage.getItem("token");
        const companyId = localStorage.getItem("companyId");
        const res = await axios.get("http://localhost:5000/reports/trial-balance", {
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
      <h1 className="text-2xl font-bold mb-4">Trial Balance</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}

      {data && (
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-200 text-left">
              <tr>
                <th className="p-3">Account</th>
                <th className="p-3 text-right">Debit (₹)</th>
                <th className="p-3 text-right">Credit (₹)</th>
              </tr>
            </thead>
            <tbody>
              {data.entries.map((entry, i) => (
                <tr key={i} className="border-t">
                  <td className="p-3">{entry.account}</td>
                  <td className="p-3 text-right">
                    {Number(entry.debit) > 0 ? `₹${entry.debit}` : "—"}
                  </td>
                  <td className="p-3 text-right">
                    {Number(entry.credit) > 0 ? `₹${entry.credit}` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-100 font-bold">
                <td className="p-3">Total</td>
                <td className="p-3 text-right">₹{data.totalDebit}</td>
                <td className="p-3 text-right">₹{data.totalCredit}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      <button onClick={() => router.push("/reports")} className="mt-6 text-sm text-blue-600">
        ← Back to Reports
      </button>
    </div>
  );
}
