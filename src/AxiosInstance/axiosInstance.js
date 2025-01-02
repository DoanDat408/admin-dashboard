import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5118/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refreshToken');

            if (refreshToken) {
                try {
                    const response = await axios.post('http://localhost:5118/api/Auth/refresh-token', {
                        refreshToken: refreshToken,
                    });

                    const newAccessToken = response.data.accessToken;
                    localStorage.setItem('token', newAccessToken);

                    // Cập nhật Authorization header với accessToken mới
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

                    // Thử lại request với token mới
                    return api(originalRequest);
                } catch (err) {
                    console.error('Failed to refresh token:', err);
                    window.location.href = '/login';
                    return Promise.reject(error);
                }
            } else {
                window.location.href = '/login';
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
