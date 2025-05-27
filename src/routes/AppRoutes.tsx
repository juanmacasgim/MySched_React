import { Routes, Route, Navigate } from 'react-router-dom'
import App from '../App'
import Login from '../pages/Login'
import Calendar from '../pages/Calendar'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/mysched/home" element={<App />} />
      <Route path="/mysched/login" element={<Login />} />
      <Route path="/mysched/calendar" element={<Calendar />} />
      <Route path="*" element={<Navigate to="/mysched/home" />} />
    </Routes>
  )
}

export default AppRoutes