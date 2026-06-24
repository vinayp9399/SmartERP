"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function NewCompany() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    address: "",
    gstNumber: "",
    financialYear: "",
    state: "",
    contactInfo: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/company", form, {
        headers: { auth: token },
      });
      router.push("/companies");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create company");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h1 className="text-xl font-bold mb-4">Create Company</h1>

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
          Create
        </button>
      </form>
    </div>
  );
}
