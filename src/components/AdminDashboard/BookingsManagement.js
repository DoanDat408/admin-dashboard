import React, { useState, useEffect } from 'react';
import BookingCalendar from './BookingCalendar';
import BookingCreationForm from './BookingCreationForm';
import api from '../../AxiosInstance/axiosInstance';

const BookingsManagement = () => {
    const [showCreateBooking, setShowCreateBooking] = useState(false);
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        fetchBookings(); // Lấy dữ liệu bookings khi tải trang
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await api.get('/Bookings');
            console.log("Fetched Bookings: ", response.data); // Kiểm tra dữ liệu bookings
            setBookings(response.data);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    };

    // Gọi API để tạo mới booking
    const handleCreateBooking = async (bookingData) => {
        console.log("Booking Data Sent:", JSON.stringify(bookingData, null, 2)); // Log JSON

        try {
            const response = await api.post('/Bookings', bookingData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('Booking created successfully:', response.data);
            fetchBookings(); // Refresh the bookings after successful creation
        } catch (error) {
            console.error('Error creating booking:', error);
            if (error.response && error.response.data) {
                console.error('Server response:', error.response.data);
            }
        }
    };



    return (
        <div>
            <h1>Bookings Management</h1>
            <button onClick={() => setShowCreateBooking(true)}>Create Booking</button>
            {showCreateBooking && (
                <BookingCreationForm
                    onSave={handleCreateBooking} // Truyền onSave prop đến BookingCreationForm
                    onCancel={() => setShowCreateBooking(false)}
                />
            )}
            <BookingCalendar bookings={bookings} />
        </div>
    );
};

export default BookingsManagement;
