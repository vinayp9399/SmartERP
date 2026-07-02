"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const reports = [
  {
    category: "Financial Reports",
    items: [
      { name: "Profit & Loss", path: "/reports/profit-loss" },
      { name: "Balance Sheet", path: "/reports/balance-sheet" },
      { name: "Trial Balance", path: "/reports/trial-balance" },
    ],
  },
  {
    category: "Inventory Reports",
    items: [
      { name: "Stock Summary", path: "/reports/stock-summary" },
      { name: "Low Stock Report", path: "/reports/low-stock" },
      { name: "Item Movement Report", path: "/reports/item-movement" },
    ],
  },
  {
    category: "Sales Reports",
    items: [
      { name: "Daily Sales", path: "/reports/daily-sales" },
      { name: "Monthly Sales", path: "/reports/monthly-sales" },
      { name: "Top Customers", path: "/reports/top-customers" },
    ],
  },
  {
    category: "Purchase Reports",
    items: [
      { name: "Purchase Register", path: "/reports/purchase-register" },
      { name: "Supplier Summary", path: "/reports/supplier-summary" },
    ],
  },
  {
    category: "GST Reports",
    items: [
      { name: "GST Report", path: "/reports/gst-report" },
    ],
  },
];

export default function ReportsHub() {
  const router = useRouter();

  useEffect(() => {
    const companyId = localStorage.getItem("companyId");
    if (!companyId) {
      router.push("/companies");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6">Reports</h1>

      <div className="space-y-6">
        {reports.map((section) => (
          <div key={section.category}>
            <h2 className="text-sm font-semibold text-gray-500 uppercase mb-2">
              {section.category}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {section.items.map((item) => (
                <div
                  key={item.name}
                  onClick={() => router.push(item.path)}
                  className="bg-white rounded shadow p-4 font-medium cursor-pointer hover:bg-blue-50"
                >
                  {item.name}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => router.push("/dashboard")}
        className="mt-8 text-sm text-blue-600"
      >
        ← Back to Gateway
      </button>
    </div>
  );
}
