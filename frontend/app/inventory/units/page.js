"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Units() {
  const router = useRouter();
  const [units, setUnits] = useState([]);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const fetchUnits = async () => {
    try {
      const token = localStorage.getItem("token");
      const companyId = localStorage.getItem("companyId");
      const res = await axios.get("http://localhost:5000/unit", {
        headers: { auth: token },
        params: { companyId },
      });
      setUnits(res.data.units);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch units");
    }
  };

  useEffect(() => {
    const companyId = localStorage.getItem("companyId");
    if (!companyId) {
      router.push("/companies");
      return;
    }
    fetchUnits();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const token = localStorage.getItem("token");
      const companyId = localStorage.getItem("companyId");
      await axios.post(
        "http://localhost:5000/unit",
        { name, companyId },
        { headers: { auth: token } }
      );
      setName("");
      fetchUnits();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create unit");
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/unit/${id}`, {
        headers: { auth: token },
      });
      fetchUnits();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete unit");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-4">Units of Measure</h1>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={handleCreate} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Unit name (e.g. PCS, KG, BOX, LTR)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded flex-1"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Unit
        </button>
      </form>

      <div className="bg-white rounded shadow divide-y">
        {units.map((unit) => (
          <div key={unit.id} className="flex justify-between items-center p-4">
            <p>{unit.name}</p>
            <button
              onClick={() => handleDelete(unit.id)}
              className="bg-red-600 text-white px-3 py-1 rounded text-sm"
            >
              Delete
            </button>
          </div>
        ))}

        {units.length === 0 && (
          <p className="p-4 text-gray-500">No units created yet.</p>
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
