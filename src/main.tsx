import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './main.css'
import AppRoutes from './routes/AppRoutes'
import { SnackbarProvider } from 'notistack';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
      <BrowserRouter>
        <div className="content">
          <AppRoutes />
        </div>
      </BrowserRouter>
    </SnackbarProvider>
  </StrictMode>
)