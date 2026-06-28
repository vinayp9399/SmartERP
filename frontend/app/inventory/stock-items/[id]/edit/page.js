"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";

export default function EditStockItem() {
  const router = useRouter();
  const params = useParams();
  const [form, setForm] = useState({
    name: "",
    sku: "",
    purchasePrice: "",
    sellingPrice: "",
    quantity: "",
    gstPercentage: "",
    stockGroupId: "",
    unitId: "",
  });
  const [stockGroups, setStockGroups] = useState([]);
  const [units, setUnits] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const companyId = localStorage.getItem("companyId");

        const [itemRes, groupsRes, unitsRes] = await Promise.all([
          axios.get(`http://localhost:5000/stock-item/${params.id}`, {
            headers: { auth: token },
          }),
          axios.get("http://localhost:5000/stock-group", {
            headers: { auth: token },
            params: { companyId },
          }),
          axios.get("http://localhost:5000/unit", {
            headers: { auth: token },
            params: { companyId },
          }),
        ]);

        const item = itemRes.data.stockItem;
        setForm({
          name: item.name || "",
          sku: item.sku || "",
          purchasePrice: item.purchasePrice || "",
          sellingPrice: item.sellingPrice || "",
          quantity: item.quantity || "",
          gstPercentage: item.gstPercentage || "",
          stockGroupId: item.stockGroupId || "",
          unitId: item.unitId || "",
        });
        setStockGroups(groupsRes.data.stockGroups);
        setUnits(unitsRes.data.units);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch stock item");
      }
    };

    fetchData();
  }, [params.id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/stock-item/${params.id}`,
        {
          ...form,
          purchasePrice: parseFloat(form.purchasePrice),
          sellingPrice: parseFloat(form.sellingPrice),
          quantity: parseFloat(form.quantity),
          gstPercentage: parseFloat(form.gstPercentage),
          stockGroupId: form.stockGroupId || null,
          unitId: form.unitId || null,
        },
        { headers: { auth: token } }
      );
      router.push("/inventory/stock-items");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update stock item");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h1 className="text-xl font-bold mb-4">Alter Stock Item</h1>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <input
          type="text"
          name="name"
          placeholder="Item Name"
          value={form.name}
          onChange={handleChange}
          className="border w-full p-2 mb-3 rounded"
          required
        />
        <input
          type="text"
          name="sku"
          placeholder="SKU"
          value={form.sku}
          onChange={handleChange}
          className="border w-full p-2 mb-3 rounded"
          required
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={form.quantity}
          onChange={handleChange}
          className="border w-full p-2 mb-3 rounded"
          required
        />
        <input
          type="number"
          name="purchasePrice"
          placeholder="Purchase Rate"
          value={form.purchasePrice}
          onChange={handleChange}
          className="border w-full p-2 mb-3 rounded"
          required
        />
        <input
          type="number"
          name="sellingPrice"
          placeholder="Selling Rate"
          value={form.sellingPrice}
          onChange={handleChange}
          className="border w-full p-2 mb-3 rounded"
          required
        />
        <input
          type="number"
          name="gstPercentage"
          placeholder="GST %"
          value={form.gstPercentage}
          onChange={handleChange}
          className="border w-full p-2 mb-3 rounded"
          required
        />

        <select
          name="stockGroupId"
          value={form.stockGroupId}
          onChange={handleChange}
          className="border w-full p-2 mb-3 rounded"
        >
          <option value="">No Stock Group</option>
          {stockGroups.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>

        <select
          name="unitId"
          value={form.unitId}
          onChange={handleChange}
          className="border w-full p-2 mb-3 rounded"
        >
          <option value="">No Unit</option>
          {units.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>

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
