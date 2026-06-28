"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function StockItems() {
  const router = useRouter();
  const [stockItems, setStockItems] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const fetchStockItems = async () => {
    try {
      const token = localStorage.getItem("token");
      const companyId = localStorage.getItem("companyId");
      const res = await axios.get("http://localhost:5000/stock-item", {
        headers: { auth: token },
        params: { companyId, search },
      });
      setStockItems(res.data.stockItems);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch stock items");
    }
  };

  useEffect(() => {
    const companyId = localStorage.getItem("companyId");
    if (!companyId) {
      router.push("/companies");
      return;
    }
    fetchStockItems();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/stock-item/${id}`, {
        headers: { auth: token },
      });
      fetchStockItems();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete stock item");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Stock Items</h1>
        <div className="flex gap-2">
          <button
            onClick={() => router.push("/inventory/stock-groups")}
            className="bg-gray-700 text-white px-4 py-2 rounded"
          >
            Stock Groups
          </button>
          <button
            onClick={() => router.push("/inventory/units")}
            className="bg-gray-700 text-white px-4 py-2 rounded"
          >
            Units
          </button>
          <button
            onClick={() => router.push("/inventory/stock-items/new")}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Create Stock Item
          </button>
        </div>
      </div>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search item by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <button
          onClick={fetchStockItems}
          className="bg-gray-700 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-200 text-left">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">SKU</th>
              <th className="p-3">Qty</th>
              <th className="p-3">Purchase Rate</th>
              <th className="p-3">Selling Rate</th>
              <th className="p-3">GST %</th>
              <th className="p-3">Valuation</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {stockItems.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-3">{item.name}</td>
                <td className="p-3">{item.sku}</td>
                <td className="p-3">{item.quantity}</td>
                <td className="p-3">₹{item.purchasePrice}</td>
                <td className="p-3">₹{item.sellingPrice}</td>
                <td className="p-3">{item.gstPercentage}%</td>
                <td className="p-3">
                  ₹{(item.quantity * item.purchasePrice).toFixed(2)}
                </td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() =>
                      router.push(`/inventory/stock-items/${item.id}/edit`)
                    }
                    className="bg-yellow-500 text-white px-3 py-1 rounded text-xs"
                  >
                    Alter
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded text-xs"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {stockItems.length === 0 && (
              <tr>
                <td colSpan={8} className="p-4 text-gray-500">
                  No stock items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
