"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function PurchaseRegister() {
  const router = useRouter();
  const [vouchers, setVouchers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const token = localStorage.getItem("token");
        const companyId = localStorage.getItem("companyId");
        const res = await axios.get("http://localhost:5000/reports/purchase-register", {
          headers: { auth: token },
          params: { companyId },
        });
        setVouchers(res.data.vouchers);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch report");
      }
    };
    fetch();
  }, []);

  const grandTotal = vouchers.reduce((s, v) => s + Number(v.amount), 0);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-4">Purchase Register</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-200 text-left">
            <tr>
              <th className="p-3">Voucher No.</th>
              <th className="p-3">Date</th>
              <th className="p-3">Supplier</th>
              <th className="p-3">Items</th>
              <th className="p-3">Total</th>
            </tr>
          </thead>
          <tbody>
            {vouchers.map((v) => (
              <tr key={v.id} className="border-t">
                <td className="p-3">{v.voucherNumber}</td>
                <td className="p-3">{new Date(v.date).toLocaleDateString("en-IN")}</td>
                <td className="p-3">{v.supplier?.name}</td>
                <td className="p-3">
                  {v.voucherItems?.map((vi) => `${vi.stockItem?.name} (${vi.qty})`).join(", ")}
                </td>
                <td className="p-3">₹{Number(v.amount).toFixed(2)}</td>
              </tr>
            ))}
            {vouchers.length === 0 && (
              <tr><td colSpan={5} className="p-4 text-gray-500">No purchase records found.</td></tr>
            )}
          </tbody>
          {vouchers.length > 0 && (
            <tfoot>
              <tr className="bg-gray-100 font-bold">
                <td colSpan={4} className="p-3 text-right">Grand Total:</td>
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
