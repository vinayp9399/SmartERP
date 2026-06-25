"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Companies() {
  const router = useRouter();
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState("");

  const fetchCompanies = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/company", {
        headers: { auth: token },
      });
      setCompanies(res.data.companies);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch companies");
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/company/${id}`, {
        headers: { auth: token },
      });
      fetchCompanies();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete company");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Company Selection</h1>
        <button
          onClick={() => router.push("/companies/new")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Company
        </button>
      </div>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <p className="text-sm text-gray-600 mb-4">
        {companies.length}/5 companies created
      </p>

      <div className="bg-white rounded shadow divide-y">
        {companies.map((company) => (
          <div
            key={company.id}
            className="flex justify-between items-center p-4"
          >
            <div>
              <p className="font-semibold">{company.name}</p>
              <p className="text-sm text-gray-500">
                {company.state} | GST: {company.gstNumber || "N/A"}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  localStorage.setItem("companyId", company.id);
                  localStorage.setItem("companyName", company.name);
                  router.push("/dashboard");
                }}
                className="bg-green-600 text-white px-3 py-1 rounded text-sm"
              >
                Select
              </button>
              <button
                onClick={() =>
                  router.push(`/companies/${company.id}/edit`)
                }
                className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
              >
                Alter
              </button>
              <button
                onClick={() => handleDelete(company.id)}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {companies.length === 0 && (
          <p className="p-4 text-gray-500">No companies created yet.</p>
        )}
      </div>
    </div>
  );
}
