"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function ItemMovementReport() {
  const router = useRouter();
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const token = localStorage.getItem("token");
        const companyId = localStorage.getItem("companyId");
        const res = await axios.get("http://localhost:5000/reports/item-movement", {
          headers: { auth: token },
          params: { companyId },
        });
        setTransactions(res.data.transactions);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch report");
      }
    };
    fetch();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-4">Item Movement Report</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-200 text-left">
            <tr>
              <th className="p-3">Date</th>
              <th className="p-3">Type</th>
              <th className="p-3">Voucher No.</th>
              <th className="p-3">Items</th>
              <th className="p-3">Qty</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id} className="border-t">
                <td className="p-3">{new Date(t.date).toLocaleDateString("en-IN")}</td>
                <td className="p-3">
                  <span className={`font-semibold ${t.type === "Stock In" ? "text-green-600" : "text-red-600"}`}>
                    {t.type}
                  </span>
                </td>
                <td className="p-3">{t.voucher?.voucherNumber || "—"}</td>
                <td className="p-3">
                  {t.voucher?.voucherItems?.map((vi) => vi.stockItem?.name).join(", ") || "—"}
                </td>
                <td className="p-3">{Number(t.quantity)}</td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr><td colSpan={5} className="p-4 text-gray-500">No transactions found.</td></tr>
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
