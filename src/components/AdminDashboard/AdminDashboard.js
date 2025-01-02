import React from 'react';
import { Outlet } from 'react-router-dom';
import './AdminDashboard.css';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';



const AdminDashboard = () => {
    return (
        <div>
            <Header />
            <Sidebar />
            <div className="main-content">
                <Outlet /> {/* This will render the nested routes */}
            </div>
        </div>
    );
};



export default AdminDashboard;
