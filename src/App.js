import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login/Login';
import AdminDashboard from './components/AdminDashboard/AdminDashboard';
import Dashboard from './components/AdminDashboard/Dashboard';
import TechnicianManagement from './components/AdminDashboard/TechnicianManagement';
import PrivateRoute from './components/AdminDashboard/PrivateRoute';
import BookingsManagement from './components/AdminDashboard/BookingsManagement';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route
                    path="/admin-dashboard"
                    element={
                        <PrivateRoute>
                            <AdminDashboard />
                        </PrivateRoute>
                    }
                >
                    <Route index element={<Dashboard />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="technicians" element={<TechnicianManagement />} />
                    <Route path="bookings" element={<BookingsManagement />} /> 
                </Route>
            </Routes>
        </Router>
    );
}


export default App;
