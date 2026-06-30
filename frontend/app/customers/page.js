"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Customers() {
  const router = useRouter();
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({ name: "", mobileNumber: "", address: "" });
  const [error, setError] = useState("");

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem("token");
      const companyId = localStorage.getItem("companyId");
      const res = await axios.get("http://localhost:5000/customer", {
        headers: { auth: token },
        params: { companyId },
      });
      setCustomers(res.data.customers);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch customers");
    }
  };

  useEffect(() => {
    const companyId = localStorage.getItem("companyId");
    if (!companyId) {
      router.push("/companies");
      return;
    }
    fetchCustomers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const token = localStorage.getItem("token");
      const companyId = localStorage.getItem("companyId");
      await axios.post(
        "http://localhost:5000/customer",
        { ...form, companyId },
        { headers: { auth: token } }
      );
      setForm({ name: "", mobileNumber: "", address: "" });
      fetchCustomers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create customer");
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/customer/${id}`, {
        headers: { auth: token },
      });
      fetchCustomers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete customer");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-4">Customer Management</h1>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={handleCreate} className="grid grid-cols-4 gap-2 mb-4">
        <input
          type="text"
          name="name"
          placeholder="Customer Name"
          value={form.name}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="mobileNumber"
          placeholder="Mobile Number"
          value={form.mobileNumber}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Customer
        </button>
      </form>

      <div className="bg-white rounded shadow divide-y">
        {customers.map((c) => (
          <div key={c.id} className="flex justify-between items-center p-4">
            <div>
              <p className="font-semibold">{c.name}</p>
              <p className="text-sm text-gray-500">
                {c.mobileNumber} | Outstanding: ₹{c.outstandingBalance}
              </p>
            </div>
            <button
              onClick={() => handleDelete(c.id)}
              className="bg-red-600 text-white px-3 py-1 rounded text-sm"
            >
              Delete
            </button>
          </div>
        ))}

        {customers.length === 0 && (
          <p className="p-4 text-gray-500">No customers added yet.</p>
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
