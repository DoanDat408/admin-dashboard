import React, { useState, useEffect } from 'react';
import './ServiceSelectionModal.css';

const ServiceSelectionModal = ({ services, selectedServiceIds, onConfirm, onCancel }) => {
    const [selectedServices, setSelectedServices] = useState(selectedServiceIds || []);

    // Group services by category
    const groupedServices = services.reduce((groups, service) => {
        const category = service.category;
        if (!groups[category]) {
            groups[category] = [];
        }
        groups[category].push(service);
        return groups;
    }, {});

    // Handle selecting/deselecting services
    const handleServiceChange = (serviceId, isChecked) => {
        if (isChecked) {
            setSelectedServices(prev => [...prev, serviceId]);
        } else {
            setSelectedServices(prev => prev.filter(id => id !== serviceId));
        }
    };

    // When the confirm button is clicked
    const handleConfirm = () => {
        onConfirm(selectedServices);
    };

    // Ensure selected services remain checked when the modal opens again
    useEffect(() => {
        setSelectedServices(selectedServiceIds || []);
    }, [selectedServiceIds]);

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h3>Select Services</h3>
                {Object.keys(groupedServices).length > 0 ? (
                    Object.keys(groupedServices).map((category) => (
                        <div key={category}>
                            <h4>{category}</h4>
                            <ul>
                                {groupedServices[category].map(service => (
                                    <li key={service.id}>
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={selectedServices.includes(service.id)}
                                                onChange={(e) => handleServiceChange(service.id, e.target.checked)}
                                            />
                                            {service.name} - {service.duration} - ${service.price}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))
                ) : (
                    <p>No services available.</p>
                )}
                <div className="modal-buttons">
                    <button onClick={handleConfirm}>OK</button>
                    <button onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default ServiceSelectionModal;
