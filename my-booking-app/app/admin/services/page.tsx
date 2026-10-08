// app/admin/services/page.tsx 

"use client";
import { useEffect, useState } from "react";
import { Service } from "@/types/service";
import ServiceForm from "@/components/services/ServiceForm";
import ServiceList from "@/components/services/ServiceList";

export default function AdminServices() {
    const [services, setServices] = useState<Service[]>([]);
    const [editingService, setEditingService] = useState<Service | null>(null);

    // Fetch all services
    useEffect(() => {
        fetchServices();
    }, []);

    async function fetchServices() {
        const res = await fetch("/api/services");
        const data = await res.json();
        setServices(data);
    }

    async function handleSave(serviceData: Partial<Service>) {
        const method = editingService ? "PUT" : "POST";
        const url = editingService ? `/api/services/${editingService.id}` : "/api/services";

        const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(serviceData),
        });

        if (res.ok) {
        await fetchServices();
        setEditingService(null);
        } else {
        alert("Failed to save service");
        }
    }

    async function handleDelete(id: number) {
        if (!confirm("Delete this service?")) return;
        const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
        if (res.ok) {
        setServices(prev => prev.filter(s => s.id !== id));
        }
    } 

    return (
        <div>
            <h1 className="page-heading">Manage Services</h1>
            <ServiceForm
            editingService={editingService}
            onSave={handleSave}
            onCancel={() => setEditingService(null)}
            />

            <h2 className="section-heading mt-10">All Services</h2>
            <ServiceList
            services={services}
            onEdit={setEditingService}
            onDelete={handleDelete}
            />
        </div>

    );
}
