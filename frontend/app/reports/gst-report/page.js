"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function GSTReport() {
  const router = useRouter();
  const [gstRegister, setGstRegister] = useState([]);
  const [taxSummary, setTaxSummary] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const token = localStorage.getItem("token");
        const companyId = localStorage.getItem("companyId");
        const res = await axios.get("http://localhost:5000/reports/gst-report", {
          headers: { auth: token },
          params: { companyId },
        });
        setGstRegister(res.data.gstRegister);
        setTaxSummary(res.data.taxSummary);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch report");
      }
    };
    fetch();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-4">GST Report</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}

      {taxSummary && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          {[
            { label: "Taxable Amount", value: taxSummary.totalTaxable },
            { label: "CGST", value: taxSummary.totalCGST },
            { label: "SGST", value: taxSummary.totalSGST },
            { label: "IGST", value: taxSummary.totalIGST },
            { label: "Grand Total", value: taxSummary.grandTotal },
          ].map((item) => (
            <div key={item.label} className="bg-white rounded shadow p-4">
              <p className="text-xs text-gray-500">{item.label}</p>
              <p className="text-lg font-bold">₹{item.value}</p>
            </div>
          ))}
        </div>
      )}

      <h2 className="font-semibold mb-2">GST Register</h2>
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-200 text-left">
            <tr>
              <th className="p-3">Voucher No.</th>
              <th className="p-3">Date</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Taxable Amt</th>
              <th className="p-3">CGST</th>
              <th className="p-3">SGST</th>
              <th className="p-3">IGST</th>
              <th className="p-3">Total</th>
            </tr>
          </thead>
          <tbody>
            {gstRegister.map((row, i) => (
              <tr key={i} className="border-t">
                <td className="p-3">{row.voucherNumber}</td>
                <td className="p-3">{row.date}</td>
                <td className="p-3">{row.customer}</td>
                <td className="p-3">₹{row.taxableAmount}</td>
                <td className="p-3">₹{row.cgst}</td>
                <td className="p-3">₹{row.sgst}</td>
                <td className="p-3">₹{row.igst}</td>
                <td className="p-3">₹{row.total}</td>
              </tr>
            ))}
            {gstRegister.length === 0 && (
              <tr><td colSpan={8} className="p-4 text-gray-500">No GST records found.</td></tr>
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
