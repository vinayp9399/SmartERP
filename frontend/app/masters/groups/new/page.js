"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const presetGroups = ["Assets", "Liabilities", "Income", "Expenses"];

export default function NewGroup() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const token = localStorage.getItem("token");
      const companyId = localStorage.getItem("companyId");
      await axios.post(
        "http://localhost:5000/group",
        { name, companyId },
        { headers: { auth: token } }
      );
      router.push("/masters/groups");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create group");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h1 className="text-xl font-bold mb-4">Create Group</h1>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <input
          type="text"
          placeholder="Group Name (e.g. Assets, Liabilities, Income, Expenses)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border w-full p-2 mb-3 rounded"
          required
          list="presetGroups"
        />
        <datalist id="presetGroups">
          {presetGroups.map((g) => (
            <option key={g} value={g} />
          ))}
        </datalist>

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
