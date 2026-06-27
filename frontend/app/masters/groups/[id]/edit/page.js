"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";

export default function EditGroup() {
  const router = useRouter();
  const params = useParams();
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/group/${params.id}`,
          { headers: { auth: token } }
        );
        setName(res.data.group.name);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch group");
      }
    };

    fetchGroup();
  }, [params.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/group/${params.id}`,
        { name },
        { headers: { auth: token } }
      );
      router.push("/masters/groups");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update group");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h1 className="text-xl font-bold mb-4">Alter Group</h1>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <input
          type="text"
          placeholder="Group Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border w-full p-2 mb-3 rounded"
          required
        />

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
