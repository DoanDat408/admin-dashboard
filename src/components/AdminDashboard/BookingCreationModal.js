import React from 'react';
import './BookingCreationModal.css';


const BookingCreationModal = ({ onClose, onSave, children }) => {
    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <button onClick={onClose} className="modal-close-btn">X</button>
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default BookingCreationModal;
