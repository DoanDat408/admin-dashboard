import React, { useState } from 'react';
import './WeeklyScheduleForm.css';

const timeSlots = {
    Sunday: ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'],
    Monday: ['09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00'],
    Tuesday: ['09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00'],
    Wednesday: ['09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00'],
    Thursday: ['09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00'],
    Friday: ['09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00'],
    Saturday: ['09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00']
};

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const WeeklyScheduleForm = ({ schedule, setSchedule }) => {
    const [activeDay, setActiveDay] = useState('Sunday');

    const handleTimeChange = (day, time) => {
        const updatedSchedule = { ...schedule };
        if (!updatedSchedule[day]) updatedSchedule[day] = new Set();

        if (updatedSchedule[day].has(time)) {
            updatedSchedule[day].delete(time);
        } else {
            updatedSchedule[day].add(time);
        }
        setSchedule(updatedSchedule);
    };

    const handleSelectAll = (day) => {
        const updatedSchedule = { ...schedule };
        // Nếu tất cả các slot thời gian của ngày đó đã được chọn, bỏ chọn tất cả
        if (updatedSchedule[day] && updatedSchedule[day].size === timeSlots[day].length) {
            updatedSchedule[day] = new Set();  // Bỏ chọn tất cả
        } else {
            // Nếu không, chọn tất cả thời gian
            updatedSchedule[day] = new Set(timeSlots[day]);
        }

        setSchedule(updatedSchedule);
    };

    return (
        <div className="weekly-schedule-form-container">
            <h3 className="schedule-title">Weekly Schedule</h3>
            <div className="custom-day-selector">
                {daysOfWeek.map((day) => (
                    <div
                        key={day}
                        className={`custom-day-tab ${activeDay === day ? 'active' : ''}`}
                        onClick={() => setActiveDay(day)}
                    >
                        {day}
                    </div>
                ))}
            </div>

            <div className="custom-day-schedule-box">
                <label className="select-all-label">
                    <input
                        type="checkbox"
                        checked={schedule[activeDay] && schedule[activeDay].size === timeSlots[activeDay].length}
                        onChange={() => handleSelectAll(activeDay)}
                    />
                    Select All for {activeDay}
                </label>

                <div className="custom-time-slot-grid">
                    {timeSlots[activeDay].map((time) => (
                        <label className="custom-time-checkbox" key={time}>
                            <input
                                type="checkbox"
                                checked={schedule[activeDay] && schedule[activeDay].has(time)}
                                onChange={() => handleTimeChange(activeDay, time)}
                            />
                            {time}
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WeeklyScheduleForm;
