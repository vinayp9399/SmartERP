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

export default function NewLedger() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [type, setType] = useState(ledgerTypes[0]);
  const [groupId, setGroupId] = useState("");
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const token = localStorage.getItem("token");
        const companyId = localStorage.getItem("companyId");
        const res = await axios.get("http://localhost:5000/group", {
          headers: { auth: token },
          params: { companyId },
        });
        setGroups(res.data.groups);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch groups");
      }
    };

    fetchGroups();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const token = localStorage.getItem("token");
      const companyId = localStorage.getItem("companyId");
      await axios.post(
        "http://localhost:5000/ledger",
        { name, type, companyId, groupId: groupId || null },
        { headers: { auth: token } }
      );
      router.push("/masters/ledgers");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create ledger");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h1 className="text-xl font-bold mb-4">Create Ledger</h1>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <input
          type="text"
          placeholder="Ledger Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border w-full p-2 mb-3 rounded"
          required
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border w-full p-2 mb-3 rounded"
        >
          {ledgerTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <select
          value={groupId}
          onChange={(e) => setGroupId(e.target.value)}
          className="border w-full p-2 mb-3 rounded"
        >
          <option value="">No Group</option>
          {groups.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white w-full p-2 rounded"
        >
          Create
        </button>
      </form>
    </div>
  );
}
