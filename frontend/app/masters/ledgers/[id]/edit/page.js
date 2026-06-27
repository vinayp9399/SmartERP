"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";

const ledgerTypes = [
  "Customer",
  "Supplier",
  "Expense",
  "Income",
  "Bank",
  "Cash",
  "Stock Item",
];

export default function EditLedger() {
  const router = useRouter();
  const params = useParams();
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

  useEffect(() => {
    const fetchLedger = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/ledger/${params.id}`,
          { headers: { auth: token } }
        );
        setName(res.data.ledger.name);
        setType(res.data.ledger.type);
        setGroupId(res.data.ledger.groupId || "");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch ledger");
      }
    };

    fetchLedger();
  }, [params.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/ledger/${params.id}`,
        { name, type, groupId: groupId || null },
        { headers: { auth: token } }
      );
      router.push("/masters/ledgers");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update ledger");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h1 className="text-xl font-bold mb-4">Alter Ledger</h1>

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
          Update
        </button>
      </form>
    </div>
  );
}
