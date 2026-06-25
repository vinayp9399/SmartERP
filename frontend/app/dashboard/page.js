"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const menuItems = [
  "Masters",
  "Transactions",
  "Inventory",
  "Accounting",
  "Banking",
  "Payroll",
  "GST",
  "Reports",
  "Utilities",
  "Administration",
];

export default function Dashboard() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");

  useEffect(() => {
    const storedCompanyId = localStorage.getItem("companyId");
    const storedCompanyName = localStorage.getItem("companyName");

    if (!storedCompanyId) {
      router.push("/companies");
      return;
    }

    setCompanyName(storedCompanyName || "");
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gateway of SmartERP</h1>
        <div className="text-right">
          <p className="text-sm text-gray-600">Company</p>
          <p className="font-semibold">{companyName}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {menuItems.map((item) => (
          <div
            key={item}
            className="bg-white rounded shadow p-6 text-center font-medium cursor-pointer hover:bg-blue-50"
          >
            {item}
          </div>
        ))}
      </div>

      <button
        onClick={() => router.push("/companies")}
        className="mt-6 text-sm text-blue-600"
      >
        ← Back to Company Selection
      </button>
    </div>
  );
}
