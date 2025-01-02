import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faUsers, faBook, faConciergeBell, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import './Sidebar.css';

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="sidebar">
            <Link to="/admin-dashboard/dashboard" className={location.pathname === "/admin-dashboard/dashboard" ? "active" : ""}>
                <FontAwesomeIcon icon={faTachometerAlt} className="sidebar-icon" />
                Dashboard
            </Link>
            <Link to="/admin-dashboard/technicians" className={location.pathname === "/admin-dashboard/technicians" ? "active" : ""}>
                <FontAwesomeIcon icon={faUsers} className="sidebar-icon" />
                Technicians
            </Link>
            <Link to="/admin-dashboard/bookings" className={location.pathname === "/admin-dashboard/bookings" ? "active" : ""}>
                <FontAwesomeIcon icon={faBook} className="sidebar-icon" />
                Bookings
            </Link>
            <Link to="/admin-dashboard/services" className={location.pathname === "/admin-dashboard/services" ? "active" : ""}>
                <FontAwesomeIcon icon={faConciergeBell} className="sidebar-icon" />
                Services
            </Link>
            <button onClick={handleLogout} className="logout-button">
                <FontAwesomeIcon icon={faSignOutAlt} className="sidebar-icon" />
                Logout
            </button>
        </div>
    );
};

export default Sidebar;
