import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

const Login = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5118/api/Auth/login', {
                phoneNumber: phoneNumber,
                password: password,
            });

            if (response.data && response.data.accessToken) {
                const token = response.data.accessToken;
                localStorage.setItem('token', token);

                // Decode the JWT token to access user roles
                const payload = JSON.parse(atob(token.split('.')[1]));

                // Check for "Admin" role in the payload
                const userRole = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
                if (userRole === "Admin" || userRole === "AdminPolicy") {
                    window.location.href = "/admin-dashboard";
                } else {
                    alert('Access Denied: Admin only');
                    localStorage.removeItem('token'); // Clear the token if unauthorized
                }
            } else {
                alert('Login failed! Please check your credentials.');
            }
        } catch (error) {
            console.error('Login error:', error.response ? error.response.data : error.message);
            if (error.response && error.response.status === 401) {
                alert('Unauthorized: Invalid username or password.');
            } else {
                alert('Login failed! Please try again.');
            }
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <img src="/images/logo.png" alt="LT Nails Guelph" className="logo" />
                <h2>Welcome back</h2>
                <div className="form-container">
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="Phone Number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                            className="input-field"
                        />
                    </div>
                    <div className="form-group password-container">
                        <input
                            type={passwordVisible ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="input-field password-field"
                        />
                        <span className="toggle-password" onClick={togglePasswordVisibility}>
                            <i className={passwordVisible ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                        </span>
                    </div>
                    <div className="form-group extra-links">
                        <label>
                            <input type="checkbox" /> Remember me
                        </label>
                    </div>
                    <div className="form-group">
                        <button type="submit" className="login-button" onClick={handleLogin}>
                            Login
                        </button>
                    </div>
                </div>
            </div>
            <div className="image-side">
                <img src="/images/artificial nails.png" alt="Make it real" className="contain-image" />
            </div>
        </div>
    );
};

export default Login;
