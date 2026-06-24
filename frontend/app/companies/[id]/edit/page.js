"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";

export default function EditCompany() {
  const router = useRouter();
  const params = useParams();
  const [form, setForm] = useState({
    name: "",
    address: "",
    gstNumber: "",
    financialYear: "",
    state: "",
    contactInfo: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/company/${params.id}`,
          { headers: { auth: token } }
        );
        const company = res.data.company;
        setForm({
          name: company.name || "",
          address: company.address || "",
          gstNumber: company.gstNumber || "",
          financialYear: company.financialYear || "",
          state: company.state || "",
          contactInfo: company.contactInfo || "",
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch company");
      }
    };

    fetchCompany();
  }, [params.id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/company/${params.id}`, form, {
        headers: { auth: token },
      });
      router.push("/companies");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update company");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h1 className="text-xl font-bold mb-4">Alter Company</h1>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <input
          type="text"
          name="name"
          placeholder="Company Name"
          value={form.name}
          onChange={handleChange}
          className="border w-full p-2 mb-3 rounded"
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          className="border w-full p-2 mb-3 rounded"
        />
        <input
          type="text"
          name="gstNumber"
          placeholder="GST Number"
          value={form.gstNumber}
          onChange={handleChange}
          className="border w-full p-2 mb-3 rounded"
        />
        <input
          type="text"
          name="financialYear"
          placeholder="Financial Year"
          value={form.financialYear}
          onChange={handleChange}
          className="border w-full p-2 mb-3 rounded"
        />
        <input
          type="text"
          name="state"
          placeholder="State"
          value={form.state}
          onChange={handleChange}
          className="border w-full p-2 mb-3 rounded"
        />
        <input
          type="text"
          name="contactInfo"
          placeholder="Contact Information"
          value={form.contactInfo}
          onChange={handleChange}
          className="border w-full p-2 mb-3 rounded"
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
