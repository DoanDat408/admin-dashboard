import React from 'react';
import './Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUserCircle } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
    return (
        <header className="header">
            <div className="header-left">
                <h1>LT Nails Guelph</h1>
            </div>
            <div className="header-right">
                <button className="icon-button">
                    <FontAwesomeIcon icon={faBell} />
                </button>
                <div className="profile-section">
                    <FontAwesomeIcon icon={faUserCircle} className="profile-icon" />
                    <div className="profile-dropdown">
                        <p>View Profile</p>
                        <p>Logout</p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
