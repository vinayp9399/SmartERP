"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const invoiceTypes = ["GST Invoice", "Proforma Invoice", "Quotation", "Estimate"];

export default function Billing() {
  const router = useRouter();
  const [invoices, setInvoices] = useState([]);
  const [invoiceType, setInvoiceType] = useState("");
  const [error, setError] = useState("");

  const fetchInvoices = async () => {
    try {
      const token = localStorage.getItem("token");
      const companyId = localStorage.getItem("companyId");
      const res = await axios.get("http://localhost:5000/invoice", {
        headers: { auth: token },
        params: { companyId, invoiceType },
      });
      setInvoices(res.data.invoices);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch invoices");
    }
  };

  useEffect(() => {
    const companyId = localStorage.getItem("companyId");
    if (!companyId) {
      router.push("/companies");
      return;
    }
    fetchInvoices();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Billing System</h1>
      </div>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <div className="flex gap-2 mb-4">
        <select
          value={invoiceType}
          onChange={(e) => setInvoiceType(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Types</option>
          {invoiceTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <button
          onClick={fetchInvoices}
          className="bg-gray-700 text-white px-4 py-2 rounded"
        >
          Filter
        </button>
      </div>

      <div className="bg-white rounded shadow divide-y">
        {invoices.map((inv) => (
          <div
            key={inv.id}
            className="flex justify-between items-center p-4"
          >
            <div>
              <p className="font-semibold">{inv.invoiceNumber}</p>
              <p className="text-sm text-gray-500">
                {inv.invoiceType} | {inv.customer?.name} |{" "}
                {new Date(inv.date).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => router.push(`/billing/${inv.id}`)}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
              >
                View
              </button>
            </div>
          </div>
        ))}

        {invoices.length === 0 && (
          <p className="p-4 text-gray-500">No invoices found.</p>
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
