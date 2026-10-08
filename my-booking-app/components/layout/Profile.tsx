"use client";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";

import React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';


export default function Profile() {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const { user } = useCurrentUser();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
      setAnchorEl(null);
  };

  async function handleLogout() {
    handleClose(); // closes menu first
    await fetch("/api/auth/logout", { method: "POST" });
    // optionally clear client storage if you have any
    window.dispatchEvent(new Event("user-refresh"));
    router.push("/auth/login");
  }

  function handleDashboard() {
    handleClose(); // closes menu first
    console.log(user?.role);
    if (user?.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/user");
    }
  }

  return (
    <div>
      <IconButton
        aria-label="account options"
        aria-controls={open ? "account-menu" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <AccountCircleIcon sx={{ color: '#f9f0fb' }} />
      </IconButton>

      <Menu
        id="account-menu"
        slotProps={{ 
        list: { 
          'aria-labelledby': 'account-button', 
          sx:{
            backgroundColor: "#5a3f61",
          }
        } 
      }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleLogout} sx={{ fontFamily: 'var(--font-julius)', fontSize: '0.8rem', letterSpacing: '0.05em', color: '#f9f0fb', '&:hover': { backgroundColor: '#4e3555' } }}>Logout</MenuItem>
        <MenuItem onClick={handleDashboard} sx={{ fontFamily: 'var(--font-julius)', fontSize: '0.8rem', letterSpacing: '0.05em', color: '#f9f0fb', '&:hover': { backgroundColor: '#4e3555' } }}>Dashboard</MenuItem>
      </Menu>
    </div>
  );
}