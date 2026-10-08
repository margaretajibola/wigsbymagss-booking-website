// app/services/installations/page.tsx

'use client'

import { useEffect, useState } from "react";
import { Box, Typography, TextField } from "@mui/material";
import { ArrowRight } from "lucide-react"; // ✅ import arrow icons
import { useRouter } from "next/navigation";
import { Service } from "@/types/service";
import ServiceCard from "@/components/services/ServiceCard";


export default function Installations() {
    const [services, setServices] = useState<Service[]>([]);
    const [selectedService, setSelectedService] = useState<number | null>(null);
    const [notes, setNotes] = useState("");

    const router = useRouter();

    // Fetch all installation services from API
    useEffect(() => {
        fetchServices();
    }, []);

    async function fetchServices() {
        try{
            const res = await fetch("/api/services");
            const data = await res.json();
            const filteredData = data.filter((service: Service) => service.category === "Installations");
            setServices(filteredData);
        }catch (error) {
            console.error("Failed to fetch reviews:", error);
        }
    }
    

    const handleNext = () => {
        if (!selectedService) {
        alert("Please select a service before continuing.");
        return;
        }

        // Navigate to calendar with serviceId and notes as URL params
        const params = new URLSearchParams({
            serviceId: String(selectedService),
            notes: notes
        });
        router.push(`/calendar?${params.toString()}`);
    };

    return(
        <Box sx={{p: {xs: 2, sm: 6}}}>
            <Typography sx={{color: '#5b3d6b', fontFamily: 'var(--font-italiana), serif', fontSize: '2rem', mb: 1}}>
                Select Service — Installations
            </Typography>

            <ServiceCard
                services={services}
                selectedService={selectedService}
                setSelectedService={setSelectedService}
            />

            {/* Notes Field */}
            <Box sx={{ mt: 4, p: 2}}>
                <TextField
                sx={{width: {xs: '100%', sm: 350}}}
                multiline
                rows={4}
                label="Additional Notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                />
            </Box>

            {/* Next Button */}
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <button
                    disabled={!selectedService}
                    className={`p-3 rounded-full shadow-sm transition ${
                        selectedService
                        ? "bg-[#8b5e9b] text-white hover:bg-[#7a5490]"
                        : "bg-[#ede8f0] cursor-not-allowed text-[#b0a0bb]"
                    }`}
                    aria-label="Next"
                    onClick={handleNext}
                    >
                    <ArrowRight className="w-6 h-6" />
                </button>
            </Box>

        </Box>

        
    );

}
