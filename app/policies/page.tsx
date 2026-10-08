// app/policies/page.tsx
import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

const policies: string[] = [
    'Ensure your hair is properly washed and dried before your appointment',
    'Drop off wig 2 - 3 days before your appointment',
    'Non-refundable 20 dollars down payment would be required to book your appointment',
    'You cannot bring other people to your appointment',
    'Extreme cases of lateness would not be accepted and there would be a 15 dollars late charge',
    'Appointments would be cancelled after 45 mins of a no-show if I am not informed of any delays',
    'Please let me know at least 24 hours before your appointment if you decide to cancel',
    'Your appointment may be cancelled or rescheduled to a later date of your choice and your deposit would be refunded in case of emergencies',
    ];

export default function PoliciesPage() {
    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
            <h1 className="page-heading text-center">Booking Policies</h1>
            <p className="text-gray-600 text-center mb-8">
                Please read through before confirming your appointment.
            </p>
            <List
                sx={{
                    backgroundColor: '#f5eefa',
                    borderRadius: 3,
                    p: { xs: 2, sm: 3 },
                    '& .MuiListItem-root': {
                        py: 1,
                        borderBottom: '1px solid #e8d5f0',
                        '&:last-child': { borderBottom: 'none' },
                    },
                }}
            >
                {policies.map((item, index) => (
                <ListItem key={index}>
                    <ListItemText
                        primary={item}
                        sx={{
                            '& .MuiListItemText-primary': {
                                fontFamily: 'var(--font-cormorant)',
                                fontSize: '1.1rem',
                                color: '#2d2438',
                                lineHeight: 1.75,
                            }
                        }}
                    />
                </ListItem>
                ))}
            </List>
        </div>
    );

};

