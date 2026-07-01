"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";

export default function InvoiceDetail() {
  const router = useRouter();
  const params = useParams();
  const [invoice, setInvoice] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/invoice/${params.id}`,
          { headers: { auth: token } }
        );
        setInvoice(res.data.invoice);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch invoice");
      }
    };

    fetchInvoice();
  }, [params.id]);

  const handleDownloadPDF = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:5000/invoice/${params.id}/pdf`,
        {
          headers: { auth: token },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice-${invoice.invoiceNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError("Failed to download PDF");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const total = invoice?.voucher?.voucherItems?.reduce(
    (sum, vi) => sum + Number(vi.qty) * Number(vi.rate),
    0
  ) || 0;

  if (error) return <p className="p-8 text-red-500">{error}</p>;
  if (!invoice) return <p className="p-8">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex gap-2 mb-4 print:hidden">
        <button
          onClick={() => router.push("/billing")}
          className="text-sm text-blue-600"
        >
          ← Back to Billing
        </button>
        <div className="ml-auto flex gap-2">
          <button
            onClick={handlePrint}
            className="bg-gray-700 text-white px-4 py-2 rounded"
          >
            Print Invoice
          </button>
          <button
            onClick={handleDownloadPDF}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            PDF Download
          </button>
        </div>
      </div>

      <div
        id="invoice-print-area"
        className="bg-white p-8 rounded shadow max-w-2xl mx-auto"
      >
        {/* Company Header */}
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold">SmartERP</h1>
          <p className="font-semibold">{invoice.company?.name}</p>
          {invoice.company?.address && (
            <p className="text-sm text-gray-600">{invoice.company.address}</p>
          )}
          {invoice.company?.gstNumber && (
            <p className="text-sm text-gray-600">
              GSTIN: {invoice.company.gstNumber}
            </p>
          )}
          {invoice.company?.contactInfo && (
            <p className="text-sm text-gray-600">
              {invoice.company.contactInfo}
            </p>
          )}
        </div>

        <hr className="mb-4" />

        <h2 className="text-lg font-bold text-center mb-4">
          {invoice.invoiceType}
        </h2>

        <div className="flex justify-between mb-4 text-sm">
          <div>
            <p>
              <span className="font-semibold">Invoice No:</span>{" "}
              {invoice.invoiceNumber}
            </p>
            <p>
              <span className="font-semibold">Date:</span>{" "}
              {new Date(invoice.date).toLocaleDateString()}
            </p>
          </div>
          <div className="text-right">
            <p className="font-semibold">Bill To:</p>
            <p>{invoice.customer?.name}</p>
            {invoice.customer?.mobileNumber && (
              <p>{invoice.customer.mobileNumber}</p>
            )}
            {invoice.customer?.address && <p>{invoice.customer.address}</p>}
          </div>
        </div>

        <hr className="mb-4" />

        {/* Items Table */}
        <table className="w-full text-sm mb-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left p-2">Item</th>
              <th className="text-left p-2">SKU</th>
              <th className="text-right p-2">Qty</th>
              <th className="text-right p-2">Rate</th>
              <th className="text-right p-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.voucher?.voucherItems?.map((vi) => (
              <tr key={vi.id} className="border-t">
                <td className="p-2">{vi.stockItem?.name}</td>
                <td className="p-2">{vi.stockItem?.sku}</td>
                <td className="p-2 text-right">{vi.qty}</td>
                <td className="p-2 text-right">₹{Number(vi.rate).toFixed(2)}</td>
                <td className="p-2 text-right">
                  ₹{(Number(vi.qty) * Number(vi.rate)).toFixed(2)}
                </td>
              </tr>
            ))}

            {(!invoice.voucher?.voucherItems ||
              invoice.voucher.voucherItems.length === 0) && (
              <tr>
                <td colSpan={5} className="p-2 text-gray-500 text-center">
                  No items
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <hr className="mb-4" />

        <div className="text-right">
          <p className="text-lg font-bold">Total: ₹{total.toFixed(2)}</p>
        </div>

        <p className="text-center text-sm text-gray-500 mt-8">
          Thank you for your business.
        </p>
      </div>
    </div>
  );
}
