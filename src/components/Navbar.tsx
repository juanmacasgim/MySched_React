import { Link, useLocation } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import { styled } from '@mui/system';
import { logout } from "../api/services";
import { useNavigate } from "react-router-dom";
import { ReactNode, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import logo from '../assets/MySched-removebg-preview.png';

const StyledAppBar = styled(AppBar)({
    position: 'fixed',
    top: 0,
    width: '100%',
    height: '64px',
    backgroundColor: 'lightgrey',
    color: 'rgb(11, 11, 11)',
});

const StyledAddCircleOutlineIcon = styled(AddCircleOutlineIcon)({
    display: 'flex',
    top: 0,
    width: '64px',
    height: '64px',
    color: 'black',
    '&:hover': {
        color: '#2F2D2D',
    },
});

const StyledLogoutIcon = styled(LogoutIcon)({
    display: 'flex',
    top: 0,
    width: '64px',
    height: '64px',
    color: 'black',
    '&:hover': {
        color: '#2F2D2D',
    },
});

const StyledHomeIcon = styled(HomeIcon)({
    display: 'flex',
    top: 0,
    width: '64px',
    height: '64px',
    color: 'black',
    '&:hover': {
        color: '#2F2D2D',
    },
});

interface NavbarProps {
  logo: string;
  actions?: ReactNode[];
}


export function Navbar({ actions }: NavbarProps) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" color="default">
        <Toolbar sx={{ pl: 0, pr: 2, minHeight: 64, maxHeight: 64, maxWidth: '100%' }}>
          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'left' }}>
            <img
            src={logo}
            alt="Logo"
            style={{ height: 150, marginRight: 16 }}
          />
          </Typography>
          {actions && actions.map((action, idx) => (
            <span key={idx}>{action}</span>
          ))}
        </Toolbar>
      </AppBar>
    </Box>
  );
}