// components/ServiceList.tsx

"use client";
import { Service } from "@/types/service";

type Props = {
  services: Service[];
  onEdit: (service: Service) => void;
  onDelete: (id: number) => void;
};

export default function ServiceList({ services, onEdit, onDelete }: Props) {
  return (
    <div className="rounded-lg">
      <div className="hidden sm:block overflow-x-auto rounded-lg">
      <table className="min-w-[640px] w-full bg-[#f5eefa] text-[#2d2438] rounded-lg shadow-sm">
        <thead className="bg-[#f5eefa]">
          <tr>
            <th className="text-left py-3 px-4 text-[#7a5490]">Name</th>
            <th className="text-[#7a5490]">Category</th>
            <th className="text-[#7a5490]">Price</th>
            <th className="text-[#7a5490]">Extra Notes</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {services.map(service => (
            <tr key={service.id}>
              <td className="py-2 px-4 text-[#2d2438]">{service.name}</td>
              <td className="text-center text-[#2d2438]">{service.category}</td>
              <td className="text-center text-[#2d2438]">{service.price} CAD</td>
              <td className="text-center text-[#2d2438]">{service.extraNotes}</td>
              <td className="text-right space-x-2 px-4">
                <button
                  onClick={() => onEdit(service)}
                  className="px-3 py-1 text-sm font-medium text-[#5b3d6b] bg-[#e8d5f0] rounded hover:bg-[#ddd0e8] transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(service.id)}
                  className="px-3 py-1 text-sm font-medium text-red-700 bg-red-200 rounded hover:bg-red-300 transition"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {services.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center py-4 text-gray-500">
                No services found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>

      {/* Stacked card layout for small screens */}
      <div className="sm:hidden flex flex-col gap-3">
        {services.length === 0 && (
          <p className="text-center py-4 text-gray-500">No services found.</p>
        )}
        {services.map(service => (
          <div key={service.id} className="bg-[#f5eefa] text-[#2d2438] rounded-lg shadow-sm p-4">
            <p className="font-medium">{service.name}</p>
            <p className="text-sm text-[#7a5490]">{service.category} &middot; {service.price} CAD</p>
            {service.extraNotes && <p className="text-sm text-[#7a5490] mt-1">{service.extraNotes}</p>}
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => onEdit(service)}
                className="flex-1 px-3 py-2 text-sm font-medium text-[#5b3d6b] bg-[#e8d5f0] rounded hover:bg-[#ddd0e8] transition"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(service.id)}
                className="flex-1 px-3 py-2 text-sm font-medium text-red-700 bg-red-100 rounded hover:bg-red-200 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>

  );
}
