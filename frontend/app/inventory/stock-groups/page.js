"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function StockGroups() {
  const router = useRouter();
  const [stockGroups, setStockGroups] = useState([]);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const fetchStockGroups = async () => {
    try {
      const token = localStorage.getItem("token");
      const companyId = localStorage.getItem("companyId");
      const res = await axios.get("http://localhost:5000/stock-group", {
        headers: { auth: token },
        params: { companyId },
      });
      setStockGroups(res.data.stockGroups);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch stock groups");
    }
  };

  useEffect(() => {
    const companyId = localStorage.getItem("companyId");
    if (!companyId) {
      router.push("/companies");
      return;
    }
    fetchStockGroups();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const token = localStorage.getItem("token");
      const companyId = localStorage.getItem("companyId");
      await axios.post(
        "http://localhost:5000/stock-group",
        { name, companyId },
        { headers: { auth: token } }
      );
      setName("");
      fetchStockGroups();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create stock group");
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/stock-group/${id}`, {
        headers: { auth: token },
      });
      fetchStockGroups();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete stock group");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-4">Stock Groups</h1>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={handleCreate} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Stock group name (e.g. Electronics, Furniture)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded flex-1"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Stock Group
        </button>
      </form>

      <div className="bg-white rounded shadow divide-y">
        {stockGroups.map((group) => (
          <div key={group.id} className="flex justify-between items-center p-4">
            <p>{group.name}</p>
            <button
              onClick={() => handleDelete(group.id)}
              className="bg-red-600 text-white px-3 py-1 rounded text-sm"
            >
              Delete
            </button>
          </div>
        ))}

        {stockGroups.length === 0 && (
          <p className="p-4 text-gray-500">No stock groups created yet.</p>
        )}
      </div>

      <button
        onClick={() => router.push("/inventory/stock-items")}
        className="mt-6 text-sm text-blue-600"
      >
        ← Back to Stock Items
      </button>
    </div>
  );
}
