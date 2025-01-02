import React from 'react';
import './Dashboard.css';
import { Pie, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Register the components
ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const Dashboard = () => {
    const totalCustomers = 150;
    const totalBookings = 320;
    const weeklyRevenue = 1200;
    const totalTechnicians = 8;

    const pieData = {
        labels: ['Nail Service', 'Hair Service', 'Massage', 'Facial'],
        datasets: [{
            data: [30, 20, 25, 25],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#8DD96F'],
        }],
    };

    const barData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        datasets: [{
            label: 'Revenue ($)',
            data: [300, 500, 700, 400, 600, 800, 900, 1000, 700, 600, 400, 500],
            backgroundColor: '#4BC0C0',
        }],
    };

    const todayBookings = [
        { time: '10:00 AM', customer: 'Alice', service: 'Nail Service' },
        { time: '11:30 AM', customer: 'Bob', service: 'Hair Service' },
        { time: '1:00 PM', customer: 'Charlie', service: 'Massage' },
        { time: '3:00 PM', customer: 'Diana', service: 'Facial' },
    ];

    return (
        <div className="dashboard">
            <div className="stats-cards">
                <div className="card">
                    <h3>{totalCustomers}</h3>
                    <p>Total Customers</p>
                </div>
                <div className="card">
                    <h3>{totalBookings}</h3>
                    <p>Total Bookings</p>
                </div>
                <div className="card">
                    <h3>${weeklyRevenue}</h3>
                    <p>Weekly Revenue</p>
                </div>
                <div className="card">
                    <h3>{totalTechnicians}</h3>
                    <p>Technicians</p>
                </div>
            </div>

            <div className="charts">
                <div className="chart pie-chart">
                    <h3>Popular Services</h3>
                    <Pie data={pieData} />
                </div>
                <div className="chart bar-chart">
                    <h3>Monthly Revenue</h3>
                    <Bar data={barData} />
                </div>
            </div>

            <div className="bookings-table">
                <h3>Today's Bookings</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>Customer</th>
                            <th>Service</th>
                        </tr>
                    </thead>
                    <tbody>
                        {todayBookings.map((booking, index) => (
                            <tr key={index}>
                                <td>{booking.time}</td>
                                <td>{booking.customer}</td>
                                <td>{booking.service}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dashboard;
