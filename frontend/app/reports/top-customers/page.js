"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function TopCustomers() {
  const router = useRouter();
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const token = localStorage.getItem("token");
        const companyId = localStorage.getItem("companyId");
        const res = await axios.get("http://localhost:5000/reports/top-customers", {
          headers: { auth: token },
          params: { companyId },
        });
        setCustomers(res.data.customers);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch report");
      }
    };
    fetch();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-4">Top Customers</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-200 text-left">
            <tr>
              <th className="p-3">Rank</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Mobile</th>
              <th className="p-3">Outstanding Balance</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c, i) => (
              <tr key={c.id} className="border-t">
                <td className="p-3 font-semibold">#{i + 1}</td>
                <td className="p-3">{c.name}</td>
                <td className="p-3">{c.mobileNumber || "—"}</td>
                <td className="p-3">₹{Number(c.outstandingBalance).toFixed(2)}</td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr><td colSpan={4} className="p-4 text-gray-500">No customers found.</td></tr>
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
