"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Groups() {
  const router = useRouter();
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState("");

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

  useEffect(() => {
    const companyId = localStorage.getItem("companyId");
    if (!companyId) {
      router.push("/companies");
      return;
    }
    fetchGroups();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/group/${id}`, {
        headers: { auth: token },
      });
      fetchGroups();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete group");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Group Management</h1>
        <button
          onClick={() => router.push("/masters/groups/new")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Group
        </button>
      </div>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <div className="bg-white rounded shadow divide-y">
        {groups.map((group) => (
          <div
            key={group.id}
            className="flex justify-between items-center p-4"
          >
            <p className="font-semibold">{group.name}</p>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  router.push(`/masters/groups/${group.id}/edit`)
                }
                className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
              >
                Alter
              </button>
              <button
                onClick={() => handleDelete(group.id)}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {groups.length === 0 && (
          <p className="p-4 text-gray-500">No groups found.</p>
        )}
      </div>

      <button
        onClick={() => router.push("/masters/ledgers")}
        className="mt-6 text-sm text-blue-600"
      >
        ← Back to Ledgers
      </button>
    </div>
  );
}
