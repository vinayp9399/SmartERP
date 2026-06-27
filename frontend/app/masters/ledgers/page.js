"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const ledgerTypes = [
  "Customer",
  "Supplier",
  "Expense",
  "Income",
  "Bank",
  "Cash",
  "Stock Item",
];

export default function Ledgers() {
  const router = useRouter();
  const [ledgers, setLedgers] = useState([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [error, setError] = useState("");

  const fetchLedgers = async () => {
    try {
      const token = localStorage.getItem("token");
      const companyId = localStorage.getItem("companyId");
      const res = await axios.get("http://localhost:5000/ledger", {
        headers: { auth: token },
        params: { companyId, search, type },
      });
      setLedgers(res.data.ledgers);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch ledgers");
    }
  };

  useEffect(() => {
    const companyId = localStorage.getItem("companyId");
    if (!companyId) {
      router.push("/companies");
      return;
    }
    fetchLedgers();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/ledger/${id}`, {
        headers: { auth: token },
      });
      fetchLedgers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete ledger");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Ledger Management</h1>
        <div className="flex gap-2">
          <button
            onClick={() => router.push("/masters/groups")}
            className="bg-gray-700 text-white px-4 py-2 rounded"
          >
            Manage Groups
          </button>
          <button
            onClick={() => router.push("/masters/ledgers/new")}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Create Ledger
          </button>
        </div>
      </div>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search ledger by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Types</option>
          {ledgerTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <button
          onClick={fetchLedgers}
          className="bg-gray-700 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      <div className="bg-white rounded shadow divide-y">
        {ledgers.map((ledger) => (
          <div
            key={ledger.id}
            className="flex justify-between items-center p-4"
          >
            <div>
              <p className="font-semibold">{ledger.name}</p>
              <p className="text-sm text-gray-500">{ledger.type} Ledger</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  router.push(`/masters/ledgers/${ledger.id}/edit`)
                }
                className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
              >
                Alter
              </button>
              <button
                onClick={() => handleDelete(ledger.id)}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {ledgers.length === 0 && (
          <p className="p-4 text-gray-500">No ledgers found.</p>
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
