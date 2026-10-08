// components/ServiceForm.tsx

"use client";
import { useState, useEffect } from "react";
import { Service } from "@/types/service";

type Props = {
  editingService: Service | null;
  onSave: (data: Partial<Service>) => void;
  onCancel: () => void;
};

export default function ServiceForm({ editingService, onSave, onCancel }: Props) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    extraNotes: "",
  });

  useEffect(() => {
    if (editingService) {
      setForm({
        name: editingService.name,
        price: editingService.price.toString(),
        category: editingService.category,
        extraNotes: editingService.extraNotes || "",
      });
    } else {
      setForm({ name: "", price: "", extraNotes: "", category: ""});
    }
  }, [editingService]);

  function resetForm() {
    setForm({ name: "", price: "", extraNotes: "", category: "" });
  } 

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      name: form.name,
      price: Number(form.price),
      extraNotes: form.extraNotes,
      category: form.category,
    });

    if (!editingService) {
      resetForm(); // Clear form after creating new service
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 bg-[#f5eefa] p-6 rounded-lg shadow-sm"
    >
        <input
            id="name"
            required
            placeholder="Enter Service Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="border border-[#ddd0e8] p-2 rounded text-[#2d2438] placeholder-[#b0a0bb] focus:ring-2 focus:ring-[#c4a8d4] focus:outline-none"
        />
        <input
            id="price"
            required
            type="number"
            placeholder="Enter Price"
            value={form.price}
            onChange={e => setForm({ ...form, price: e.target.value })}
            className="border border-[#ddd0e8] p-2 rounded text-[#2d2438] placeholder-[#b0a0bb] focus:ring-2 focus:ring-[#c4a8d4] focus:outline-none"
        />
        <input
            id="extraNotes"
            placeholder="Enter Extra Notes"
            value={form.extraNotes}
            onChange={e => setForm({ ...form, extraNotes: e.target.value })}
            className="border border-[#ddd0e8] p-2 rounded text-[#2d2438] placeholder-[#b0a0bb] focus:ring-2 focus:ring-[#c4a8d4] focus:outline-none"
        />
        <select
            id="category"
            required
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}
            className="border border-[#ddd0e8] p-2 rounded bg-white text-[#2d2438] focus:ring-2 focus:ring-[#c4a8d4] focus:outline-none"
            >
            <option value="">Select Category</option>
            <option value="Installations">Installations</option>
            <option value="Sew-ins">Sew-ins</option>
            <option value="Other Services">Other Services</option>
        </select>

        <div className="col-span-1 sm:col-span-2 flex justify-between">
            <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
            >
            Cancel
            </button>
            <button
            type="submit"
            className="btn-primary"
            >
            {editingService ? "Update Service" : "Create Service"}
            </button>
        </div>
    </form>
  );
}
