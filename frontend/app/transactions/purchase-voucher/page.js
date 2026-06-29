"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function PurchaseVouchers() {
  const router = useRouter();
  const [vouchers, setVouchers] = useState([]);
  const [error, setError] = useState("");

  const fetchVouchers = async () => {
    try {
      const token = localStorage.getItem("token");
      const companyId = localStorage.getItem("companyId");
      const res = await axios.get("http://localhost:5000/purchase-voucher", {
        headers: { auth: token },
        params: { companyId },
      });
      setVouchers(res.data.vouchers);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch vouchers");
    }
  };

  useEffect(() => {
    const companyId = localStorage.getItem("companyId");
    if (!companyId) {
      router.push("/companies");
      return;
    }
    fetchVouchers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Purchase Vouchers</h1>
        <div className="flex gap-2">
          <button
            onClick={() => router.push("/suppliers")}
            className="bg-gray-700 text-white px-4 py-2 rounded"
          >
            Suppliers
          </button>
          <button
            onClick={() => router.push("/transactions/purchase-voucher/new")}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            New Purchase Voucher
          </button>
        </div>
      </div>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <div className="bg-white rounded shadow divide-y">
        {vouchers.map((v) => (
          <div key={v.id} className="p-4">
            <div className="flex justify-between">
              <p className="font-semibold">
                {v.voucherNumber} — {v.supplier?.name}
              </p>
              <p className="font-semibold">₹{v.amount}</p>
            </div>
            <p className="text-sm text-gray-500">
              {new Date(v.date).toLocaleDateString()}
            </p>
            <ul className="text-sm text-gray-600 mt-2 list-disc pl-5">
              {v.voucherItems?.map((vi) => (
                <li key={vi.id}>
                  {vi.stockItem?.name} — Qty: {vi.qty} × ₹{vi.rate} = ₹
                  {vi.amount}
                </li>
              ))}
            </ul>
          </div>
        ))}

        {vouchers.length === 0 && (
          <p className="p-4 text-gray-500">No purchase vouchers yet.</p>
        )}
      </div>

      <button
        onClick={() => router.push("/dashboard")}
        className="mt-6 text-sm text-blue-600"
      >
        ← Back to Gateway
      </button>
    </div>
  );
}
