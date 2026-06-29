"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Suppliers() {
  const router = useRouter();
  const [suppliers, setSuppliers] = useState([]);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const fetchSuppliers = async () => {
    try {
      const token = localStorage.getItem("token");
      const companyId = localStorage.getItem("companyId");
      const res = await axios.get("http://localhost:5000/supplier", {
        headers: { auth: token },
        params: { companyId },
      });
      setSuppliers(res.data.suppliers);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch suppliers");
    }
  };

  useEffect(() => {
    const companyId = localStorage.getItem("companyId");
    if (!companyId) {
      router.push("/companies");
      return;
    }
    fetchSuppliers();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const token = localStorage.getItem("token");
      const companyId = localStorage.getItem("companyId");
      await axios.post(
        "http://localhost:5000/supplier",
        { name, companyId },
        { headers: { auth: token } }
      );
      setName("");
      fetchSuppliers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create supplier");
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/supplier/${id}`, {
        headers: { auth: token },
      });
      fetchSuppliers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete supplier");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-4">Supplier Management</h1>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={handleCreate} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Supplier Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded flex-1"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Supplier
        </button>
      </form>

      <div className="bg-white rounded shadow divide-y">
        {suppliers.map((s) => (
          <div key={s.id} className="flex justify-between items-center p-4">
            <div>
              <p className="font-semibold">{s.name}</p>
              <p className="text-sm text-gray-500">
                Outstanding Dues: ₹{s.outstandingDues}
              </p>
            </div>
            <button
              onClick={() => handleDelete(s.id)}
              className="bg-red-600 text-white px-3 py-1 rounded text-sm"
            >
              Delete
            </button>
          </div>
        ))}

        {suppliers.length === 0 && (
          <p className="p-4 text-gray-500">No suppliers added yet.</p>
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
