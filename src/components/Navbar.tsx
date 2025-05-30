import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { ReactNode } from 'react';
import logo from '../assets/MySched-removebg-preview.png';

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