"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function NewSalesVoucher() {
  const router = useRouter();
  const [customers, setCustomers] = useState([]);
  const [stockItems, setStockItems] = useState([]);
  const [customerId, setCustomerId] = useState("");
  const [voucherNumber, setVoucherNumber] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [items, setItems] = useState([{ stockItemId: "", qty: "", rate: "" }]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const token = localStorage.getItem("token");
        const companyId = localStorage.getItem("companyId");

        const [customersRes, itemsRes] = await Promise.all([
          axios.get("http://localhost:5000/customer", {
            headers: { auth: token },
            params: { companyId },
          }),
          axios.get("http://localhost:5000/stock-item", {
            headers: { auth: token },
            params: { companyId },
          }),
        ]);

        setCustomers(customersRes.data.customers);
        setStockItems(itemsRes.data.stockItems);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch options");
      }
    };

    fetchOptions();
  }, []);

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;

    if (field === "stockItemId") {
      const selected = stockItems.find((si) => si.id === value);
      if (selected) {
        updated[index].rate = selected.sellingPrice;
      }
    }

    setItems(updated);
  };

  const addItemRow = () => {
    setItems([...items, { stockItemId: "", qty: "", rate: "" }]);
  };

  const removeItemRow = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const total = items.reduce(
    (sum, item) => sum + (parseFloat(item.qty) || 0) * (parseFloat(item.rate) || 0),
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const token = localStorage.getItem("token");
      const companyId = localStorage.getItem("companyId");

      await axios.post(
        "http://localhost:5000/sales-voucher",
        {
          customerId,
          voucherNumber,
          date,
          companyId,
          items: items.map((item) => ({
            stockItemId: item.stockItemId,
            qty: parseFloat(item.qty),
            rate: parseFloat(item.rate),
          })),
        },
        { headers: { auth: token } }
      );

      router.push("/transactions/sales-voucher");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to create sales voucher"
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-2xl"
      >
        <h1 className="text-xl font-bold mb-4">New Sales Voucher</h1>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <div className="grid grid-cols-2 gap-3 mb-3">
          <select
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            className="border p-2 rounded"
            required
          >
            <option value="">Select Customer</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Voucher No."
            value={voucherNumber}
            onChange={(e) => setVoucherNumber(e.target.value)}
            className="border p-2 rounded"
            required
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border p-2 rounded col-span-2"
            required
          />
        </div>

        <h2 className="font-semibold mb-2">Items Sold</h2>

        {items.map((item, index) => (
          <div key={index} className="grid grid-cols-4 gap-2 mb-2">
            <select
              value={item.stockItemId}
              onChange={(e) =>
                handleItemChange(index, "stockItemId", e.target.value)
              }
              className="border p-2 rounded col-span-2"
              required
            >
              <option value="">Select Item</option>
              {stockItems.map((si) => (
                <option key={si.id} value={si.id}>
                  {si.name} ({si.sku}) — Stock: {si.quantity}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Qty"
              value={item.qty}
              onChange={(e) => handleItemChange(index, "qty", e.target.value)}
              className="border p-2 rounded"
              required
            />

            <div className="flex gap-1">
              <input
                type="number"
                placeholder="Rate"
                value={item.rate}
                onChange={(e) =>
                  handleItemChange(index, "rate", e.target.value)
                }
                className="border p-2 rounded flex-1"
                required
              />
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItemRow(index)}
                  className="bg-red-600 text-white px-2 rounded"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addItemRow}
          className="text-sm text-blue-600 mb-4"
        >
          + Add another item
        </button>

        <p className="font-semibold mb-4">Total: ₹{total.toFixed(2)}</p>

        <button
          type="submit"
          className="bg-blue-600 text-white w-full p-2 rounded"
        >
          Create Sales Voucher
        </button>
      </form>
    </div>
  );
}
