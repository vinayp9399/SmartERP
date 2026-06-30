"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TransactionsHub() {
  const router = useRouter();

  useEffect(() => {
    const companyId = localStorage.getItem("companyId");
    if (!companyId) {
      router.push("/companies");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6">Transactions</h1>

      <div className="grid grid-cols-2 gap-4 max-w-md">
        <div
          onClick={() => router.push("/transactions/purchase-voucher")}
          className="bg-white rounded shadow p-6 text-center font-medium cursor-pointer hover:bg-blue-50"
        >
          Purchase Voucher
        </div>
        <div
          onClick={() => router.push("/transactions/sales-voucher")}
          className="bg-white rounded shadow p-6 text-center font-medium cursor-pointer hover:bg-blue-50"
        >
          Sales Voucher
        </div>
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
