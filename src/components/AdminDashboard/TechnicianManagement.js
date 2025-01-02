import React, { useEffect, useState } from 'react';
import api from '../../AxiosInstance/axiosInstance';
import './TechnicianManagement.css';
import WeeklyScheduleForm from './WeeklyScheduleForm';
import { FaPlus } from 'react-icons/fa';

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const TechnicianManagement = () => {
    const [technicians, setTechnicians] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editName, setEditName] = useState('');
    const [editImageFile, setEditImageFile] = useState(null);
    const [editImageUrl, setEditImageUrl] = useState(''); // Khai báo editImageUrl với state ban đầu là chuỗi rỗng

    const [createName, setCreateName] = useState('');
    const [createImageFile, setCreateImageFile] = useState(null);
    const [currentTechnicianId, setCurrentTechnicianId] = useState(null);
    const [createImageUrl, setCreateImageUrl] = useState('');
    const [weeklySchedule, setWeeklySchedule] = useState({});
    const defaultImageUrl = '/images/people.png';

    useEffect(() => {
        fetchTechnicians();
    }, []);

    const fetchTechnicians = async () => {
        try {
            const response = await api.get('/Technicians');
            const technicians = response.data;

            // Duyệt qua từng technician để lấy weeklySchedules
            const technicianDataWithSchedules = await Promise.all(
                technicians.map(async (tech) => {
                    const scheduleResponse = await api.get(`/Technicians/${tech.id}/WeeklySchedule`);
                    return {
                        ...tech,
                        weeklySchedules: scheduleResponse.data,  // Gán weeklySchedules vào technician
                    };
                })
            );

            console.log('Technician data with schedules:', technicianDataWithSchedules);
            setTechnicians(technicianDataWithSchedules);  // Cập nhật state với dữ liệu mới
        } catch (error) {
            console.error('Error fetching technicians or schedules:', error);
            alert('Error fetching technicians or schedules. Please ensure you are authorized.');
        }
    };



    const handleEditClick = async (tech) => {
        setEditName(tech.name);
        setEditImageFile(null);
        setCurrentTechnicianId(tech.id);

        // Gọi API để lấy dữ liệu weeklySchedules của technician
        try {
            const scheduleResponse = await api.get(`/Technicians/${tech.id}/WeeklySchedule`);
            const schedule = {};

            // Tạo một đối tượng schedule với các ngày đã được chọn trước đó
            scheduleResponse.data.forEach((slot) => {
                const day = daysOfWeek[slot.dayOfWeek];  // dayOfWeek là số nguyên (0: Sunday, 1: Monday, ...)
                if (!schedule[day]) {
                    schedule[day] = new Set();
                }
                schedule[day].add(slot.startTime); // Sử dụng startTime để đánh dấu các mốc thời gian đã chọn
            });

            setWeeklySchedule(schedule);  // Cập nhật state với lịch trình đã được chọn
            setIsEditModalOpen(true);
        } catch (error) {
            console.error('Error fetching schedule:', error);
        }
    };



    const handleCreateClick = () => {
        setCreateName('');
        setCreateImageFile(null);
        const schedule = {};
        daysOfWeek.forEach(day => {
            schedule[day] = new Set();
        });
        setWeeklySchedule(schedule);

        setIsCreateModalOpen(true);
    };

    const handleFileChange = (e, setImageFile) => {
        const file = e.target.files[0];
        setImageFile(file);
    };

    const handleSaveChanges = async () => {
        try {
            // Gửi thông tin tên và hình ảnh nếu có chỉnh sửa
            await api.put(`/Technicians/${currentTechnicianId}`, {
                name: editName,
                imageUrl: editImageUrl, // Sửa nếu có chỉnh sửa
            });

            // Gửi từng lịch làm việc
            const scheduleData = prepareScheduleData(currentTechnicianId);
            for (const schedule of scheduleData) {
                await api.post(`/Technicians/${currentTechnicianId}/WeeklySchedule`, schedule);
            }

            fetchTechnicians(); // Tải lại danh sách technicians
            setIsEditModalOpen(false); // Đóng modal
        } catch (error) {
            console.error('Error updating technician:', error);
            alert('Error updating technician.');
        }
    };


    const handleCreateTechnician = async () => {
        try {
            // Gửi thông tin tên và hình ảnh trước
            const response = await api.post(`/Technicians`, {
                name: createName,
                imageUrl: createImageUrl,
            });

            const technicianId = response.data.id; // Lấy technicianId sau khi tạo thành công

            // Sau khi có technicianId, gửi lịch làm việc cho từng ngày
            const scheduleData = prepareScheduleData(technicianId);
            for (const schedule of scheduleData) {
                await api.post(`/Technicians/${technicianId}/WeeklySchedule`, schedule);
            }

            fetchTechnicians(); // Tải lại danh sách technicians
            setIsCreateModalOpen(false); // Đóng modal
            setCreateName('');
            setCreateImageUrl('');
        } catch (error) {
            console.error('Error creating technician:', error);
            alert('Error creating technician.');
        }
    };

    const prepareScheduleData = (technicianId) => {
        const scheduleData = [];
        Object.entries(weeklySchedule).forEach(([day, times]) => {
            times.forEach(time => {
                scheduleData.push({
                    technicianId: technicianId, // Thêm technicianId vào mỗi lịch
                    dayOfWeek: daysOfWeek.indexOf(day),
                    startTime: time,
                    endTime: time // Giả định rằng start và end time giống nhau
                });
            });
        });
        return scheduleData;
    };



    const handleDeleteTechnician = async (id) => {
        const confirmed = window.confirm("Are you sure you want to delete this technician?");
        if (!confirmed) return;

        try {
            const response = await api.delete(`/Technicians/${id}`);

            if (response.status === 204) {
                setTechnicians(technicians.filter(tech => tech.id !== id));
                alert('Technician has been successfully deleted.');
            } else {
                alert('Failed to delete technician.');
            }
        } catch (error) {
            console.error('Error deleting technician:', error);
            alert('Failed to delete technician.');
        }
    };



    const handleCancelEdit = () => setIsEditModalOpen(false);
    const handleCancelCreate = () => setIsCreateModalOpen(false);

    return (
        <div className="technician-management">
            <h2>Technician Management</h2>
            <button className="create-button" onClick={handleCreateClick}>
                <FaPlus /> Create Technician
            </button>

            {technicians.length > 0 ? (
                <table className="technician-table">
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Weekly Schedule</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {technicians.map((tech, index) => (
                            <tr key={tech.id}>
                                <td>{index + 1}</td>
                                <td>
                                    <img
                                        src={tech.imageUrl || defaultImageUrl}
                                        alt={tech.name}
                                        className="technician-image"
                                        onError={(e) => {
                                            e.target.src = defaultImageUrl;
                                        }}
                                    />
                                </td>
                                <td>{tech.name}</td>
                                <td>
                                    {tech.weeklySchedules && tech.weeklySchedules.length > 0 ? (
                                        // Lấy duy nhất `dayOfWeek` và hiển thị ngày trong tuần
                                        [...new Set(tech.weeklySchedules.map(schedule => daysOfWeek[schedule.dayOfWeek]))].map((day, idx) => (
                                            <div key={idx}>
                                                {day}
                                            </div>
                                        ))
                                    ) : (
                                        <div>No schedule available</div>
                                    )}
                                </td>
                                <td>
                                    <button className="action-button edit" onClick={() => handleEditClick(tech)}>Edit</button>
                                    <button className="action-button delete" onClick={() => handleDeleteTechnician(tech.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No technicians found.</p>
            )}

            {isEditModalOpen && (
                <div className="custom-modal-overlay">
                    <div className="custom-modal-content">
                        <h3>Edit Technician</h3>
                        <div className="custom-form-group">
                            <label htmlFor="techName">Name:</label>
                            <input
                                type="text"
                                id="techName"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                            />
                        </div>
                        <div className="custom-form-group">
                            <label htmlFor="techImageFile">Image File:</label>
                            <input
                                type="file"
                                id="techImageFile"
                                onChange={(e) => handleFileChange(e, setEditImageFile)}
                            />
                        </div>
                        <WeeklyScheduleForm schedule={weeklySchedule} setSchedule={setWeeklySchedule} />
                        <div className="custom-modal-buttons">
                            <button className="custom-save-button" onClick={handleSaveChanges}>Save Changes</button>
                            <button className="custom-cancel-button" onClick={handleCancelEdit}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}


            {isCreateModalOpen && (
                <div className="custom-modal-overlay">
                    <div className="custom-modal-content">
                        <h3>Create Technician</h3>
                        <div className="custom-form-group">
                            <label htmlFor="createName">Name:</label>
                            <input
                                type="text"
                                id="createName"
                                value={createName}
                                onChange={(e) => setCreateName(e.target.value)}
                            />
                        </div>
                        <div className="custom-form-group">
                            <label htmlFor="createImageFile">Image File:</label>
                            <input
                                type="file"
                                id="createImageFile"
                                onChange={(e) => handleFileChange(e, setCreateImageFile)}
                            />
                        </div>
                        <WeeklyScheduleForm schedule={weeklySchedule} setSchedule={setWeeklySchedule} />
                        <div className="custom-modal-buttons">
                            <button className="custom-save-button" onClick={handleCreateTechnician}>Save Changes</button>
                            <button className="custom-cancel-button" onClick={handleCancelCreate}>Cancel</button>
                        </div>
                    </div>
                </div>

            )}
        </div>
    );
};

export default TechnicianManagement;
