import { Grid, Card, CardActionArea, CardContent, Typography } from "@mui/material";
import { Service } from "@/types/service";

interface ServiceCardProps {
  services: Service[];
  selectedService: number | null;
  setSelectedService: (id: number) => void;
}

export default function ServiceCard({ services, selectedService, setSelectedService }: ServiceCardProps) {
  return (
    <Grid container spacing={3} sx={{p:2}}>
      {services.map((service) => (
        <Grid size={12} key={service.id}>
          <Card
            sx={{
              borderRadius: "16px",
            background: selectedService === service.id ? "#e8d5f0" : "#f5eefa",
              width: { xs: '100%', sm: 500 },
              height: 100
            }}>
            <CardActionArea 
              onClick={() => setSelectedService(service.id)}
              sx={{
                height: "100%",
                "&:hover": {
                  backgroundColor: "#ede0f5",
                },
              }}>
              <CardContent>
                <Typography variant="body1" sx={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.1rem', color: '#2d2438' }}>{service.name}</Typography>
                <Typography variant="body1" sx={{ fontFamily: 'var(--font-cormorant)', fontSize: '1rem', color: '#7a5490' }}>${service.price} CAD</Typography>
                <Typography variant="body2" sx={{ fontFamily: 'var(--font-cormorant)', color: '#9b72a8' }}>
                  {service.extraNotes}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}