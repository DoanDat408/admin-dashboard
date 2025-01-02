import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const BookingCalendar = ({ bookings }) => {
    // Map bookings to calendar events
    const events = bookings.map(booking => ({
        title: `${booking.customerName} (Tech ID: ${booking.technicianId}, Price: $${booking.price.toFixed(2)})`,
        start: new Date(booking.startTime),
        end: new Date(new Date(booking.startTime).getTime() + booking.duration * 60000),
        allDay: false,
        extendedProps: {
            technicianId: booking.technicianId,
            serviceIds: booking.serviceIds,
            price: booking.price,
            duration: booking.duration
        }
    }));

    return (
        <div style={{ height: '80vh', padding: '20px' }}>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
                popup
                tooltipAccessor={(event) =>
                    `Technician ID: ${event.extendedProps.technicianId}
                    \nService IDs: ${event.extendedProps.serviceIds.join(', ')}
                    \nDuration: ${event.extendedProps.duration} minutes
                    \nPrice: $${event.extendedProps.price.toFixed(2)}`
                }
            />
        </div>
    );
};

export default BookingCalendar;
