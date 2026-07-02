"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function SupplierSummary() {
  const router = useRouter();
  const [suppliers, setSuppliers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const token = localStorage.getItem("token");
        const companyId = localStorage.getItem("companyId");
        const res = await axios.get("http://localhost:5000/reports/supplier-summary", {
          headers: { auth: token },
          params: { companyId },
        });
        setSuppliers(res.data.suppliers);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch report");
      }
    };
    fetch();
  }, []);

  const totalDues = suppliers.reduce((s, sup) => s + Number(sup.outstandingDues), 0);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-4">Supplier Summary</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-200 text-left">
            <tr>
              <th className="p-3">Rank</th>
              <th className="p-3">Supplier</th>
              <th className="p-3">Outstanding Dues</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((s, i) => (
              <tr key={s.id} className="border-t">
                <td className="p-3 font-semibold">#{i + 1}</td>
                <td className="p-3">{s.name}</td>
                <td className="p-3">₹{Number(s.outstandingDues).toFixed(2)}</td>
              </tr>
            ))}
            {suppliers.length === 0 && (
              <tr><td colSpan={3} className="p-4 text-gray-500">No suppliers found.</td></tr>
            )}
          </tbody>
          {suppliers.length > 0 && (
            <tfoot>
              <tr className="bg-gray-100 font-bold">
                <td colSpan={2} className="p-3 text-right">Total Outstanding:</td>
                <td className="p-3">₹{totalDues.toFixed(2)}</td>
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
