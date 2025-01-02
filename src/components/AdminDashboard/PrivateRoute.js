import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');

    // Nếu không có token, chuyển hướng đến trang đăng nhập
    if (!token) {
        return <Navigate to="/login" />;
    }

    // Giải mã JWT để kiểm tra vai trò
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userRole = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];

    // Kiểm tra vai trò của người dùng
    if (userRole === "Admin" || userRole === "AdminPolicy") {
        return children;  // Nếu là Admin, cho phép truy cập
    } else {
        alert('Access Denied: Admin only');  // Nếu không phải Admin, hiển thị thông báo và chuyển hướng
        return <Navigate to="/login" />;
    }
};

export default PrivateRoute;
