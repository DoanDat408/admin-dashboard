import React, { useState, useEffect } from 'react';
import api from '../../AxiosInstance/axiosInstance';
import ServiceSelectionModal from '../AdminDashboard/ServiceSelectionModal';
import './BookingCreationForm.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; 
import { registerLocale } from 'react-datepicker';
import enCA from 'date-fns/locale/en-CA'; 
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Register the locale for English (Canada)
registerLocale('en-CA', enCA);

const BookingCreationForm = ({ booking, onSave, onCancel }) => {
    const [technicianId, setTechnicianId] = useState(booking?.technicianId || '');
    const [selectedServices, setSelectedServices] = useState(booking?.services || []); // Pre-populate if editing
    const [customerName, setCustomerName] = useState(booking?.customerName || '');
    const [startTime, setStartTime] = useState(booking?.startTime ? new Date(booking.startTime) : new Date()); // Use Date object for DatePicker
    const [totalDuration, setTotalDuration] = useState(booking?.duration || 0);
    const [totalPrice, setTotalPrice] = useState(booking?.price || 0);
    const [technicians, setTechnicians] = useState([]);
    const [services, setServices] = useState([]);
    const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    // Fetch technicians and services
    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                const [techniciansResponse, servicesResponse] = await Promise.all([
                    api.get('/Technicians'),
                    api.get('/Services')
                ]);

                if (isMounted) {
                    setTechnicians(techniciansResponse.data);
                    setServices(servicesResponse.data);
                }
            } catch (error) {
                if (isMounted) {
                    console.error('Error fetching data:', error);
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, []);

    // Service selection handler
    const handleServiceSelect = (selectedServiceIds) => {
        setIsServiceModalOpen(false);

        const selected = services.filter(service => selectedServiceIds.includes(service.id));
        setSelectedServices(selected);

        let totalDuration = 0;
        let totalPrice = 0;

        selected.forEach(service => {
            const price = parseFloat(service.price);
            totalPrice += isNaN(price) ? 0 : price;

            if (service.duration) {
                const duration = parseDuration(service.duration);
                if (!isNaN(duration) && duration > 0) {
                    totalDuration += duration;
                }
            }
        });

        setTotalDuration(totalDuration);
        setTotalPrice(totalPrice);
    };

    // Utility function to parse duration strings
    const parseDuration = (durationStr) => {
        if (!durationStr || typeof durationStr !== 'string') {
            return 0;
        }

        let totalMinutes = 0;
        const durationParts = durationStr.split(' ');

        if (durationParts.length >= 2 && durationParts[1] === 'hr') {
            const hours = parseInt(durationParts[0], 10);
            if (!isNaN(hours)) {
                totalMinutes += hours * 60;
            }
        }

        const minIndex = durationParts.indexOf('min');
        if (minIndex > 0) {
            const minutes = parseInt(durationParts[minIndex - 1], 10);
            if (!isNaN(minutes)) {
                totalMinutes += minutes;
            }
        }

        return totalMinutes;
    };

    // Validation function
    const validateForm = () => {
        const newErrors = {};

        if (!technicianId) {
            newErrors.technicianId = 'Please select a technician';
        }

        if (selectedServices.length === 0) {
            newErrors.selectedServices = 'Please select at least one service';
        }

        if (!customerName || customerName.trim().length === 0) {
            newErrors.customerName = 'Please enter a valid customer name';
        }

        if (!startTime) {
            newErrors.startTime = 'Please select a start time';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const bookingData = {
            technicianId: parseInt(technicianId, 10),
            serviceIds: selectedServices.map(service => parseInt(service.id, 10)),
            customerName: customerName.trim(),
            startTime: dayjs(startTime).format('YYYY-MM-DDTHH:mm:ss'), // Định dạng startTime chính xác
            duration: parseInt(totalDuration, 10),
            totalPrice: parseFloat(totalPrice) // Đảm bảo totalPrice là float
        };

        console.log('Booking Data Sent:', bookingData); // Ghi log dữ liệu trước khi gửi

        try {
            const response = await api.post('/Bookings', bookingData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Booking created successfully:', response.data);
            toast.success('Booking created successfully!');
            onSave(bookingData);
        } catch (error) {
            console.error('Error creating booking:', error);
            if (error.response && error.response.data) {
                console.error('Error response:', error.response.data);
            }
        }
    };













    // Handle cancel action with confirmation
    const handleCancel = () => {
        if (window.confirm('Are you sure you want to cancel this booking?')) {
            onCancel();
        }
    };

    return (
        <div className="booking-modal-backdrop">
            {isServiceModalOpen ? (
                <ServiceSelectionModal
                    services={services}
                    selectedServiceIds={selectedServices.map(service => service.id)}
                    onConfirm={handleServiceSelect}
                    onCancel={() => setIsServiceModalOpen(false)}
                />
            ) : (
                <div className="booking-modal-content">
                    <span className="booking-modal-close-btn" onClick={handleCancel}>&times;</span>
                    <h3 className="booking-modal-title">{booking ? 'Edit Booking' : 'Create Booking'}</h3>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="booking-form-label">Technician</label>
                            <select className="booking-form-select" value={technicianId} onChange={(e) => setTechnicianId(e.target.value)}>
                                <option value="">Select Technician</option>
                                {technicians.map((tech) => (
                                    <option key={tech.id} value={tech.id}>{tech.name}</option>
                                ))}
                            </select>
                            {errors.technicianId && <p className="error-message">{errors.technicianId}</p>}
                        </div>

                        <div className="form-group">
                            <label className="booking-form-label">Services</label>
                            <button type="button" className="booking-form-button" onClick={() => setIsServiceModalOpen(true)}>Select Services</button>
                            <ul className="booking-service-list">
                                {selectedServices.map(service => (
                                    <li key={service.id} className="booking-service-item">
                                        {service.name} - {service.duration ? service.duration : '-'} - ${service.price}
                                    </li>
                                ))}
                            </ul>
                            {errors.selectedServices && <p className="error-message">{errors.selectedServices}</p>}
                        </div>

                        <div className="form-group">
                            <label className="booking-form-label">Customer Name</label>
                            <input className="booking-form-input" type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
                            {errors.customerName && <p className="error-message">{errors.customerName}</p>}
                        </div>

                        <div className="form-group">
                            <label className="booking-form-label">Start Time</label>
                            <DatePicker
                                selected={startTime}
                                onChange={(date) => setStartTime(date)}
                                dateFormat="dd/MM/yyyy"
                                locale="en-CA"
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={30}
                                timeCaption="Time"
                                className="booking-form-input"
                            />
                            {errors.startTime && <p className="error-message">{errors.startTime}</p>}
                        </div>

                        <div className="form-group">
                            <label className="booking-form-label">Total Duration (minutes)</label>
                            <input className="booking-form-input" type="number" value={totalDuration} readOnly />
                        </div>

                        <div className="form-group">
                            <label className="booking-form-label">Total Price</label>
                            <input className="booking-form-input" type="text" value={`$${totalPrice}`} readOnly />
                        </div>

                        <div className="booking-form-buttons">
                            <button type="submit" className="booking-form-button" disabled={isSubmitting}>
                                {isSubmitting ? 'Saving...' : (booking ? 'Update Booking' : 'Save Booking')}
                            </button>
                            <button type="button" className="booking-form-button booking-form-cancel" onClick={handleCancel}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default React.memo(BookingCreationForm);
