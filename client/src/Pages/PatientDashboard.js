import React from "react";
import { useNavigate } from "react-router-dom";
import './patientDashboard.css';

const PatientDashboard = () => {
    const navigate = useNavigate();

    const handleCreateAppointment = () => {
        // Redirect to the create appointment page
        navigate("/create-appointment");
    };

    const handleEditAppointment = () => {
        // Redirect to the edit appointment page
        navigate("/patient-edit-appointment");
    };

    const handleDeleteAppointment = () => {
        // Redirect to the delete appointment page
        navigate("/patient-delete-appointment");
    };

    return (
        <div className="dashboard-container">
            <h2>Patient Dashboard</h2>
            <button onClick={handleCreateAppointment}>Create Appointment</button>
            <button onClick={handleEditAppointment}>Edit Appointment</button>
            <button onClick={handleDeleteAppointment}>Delete Appointment</button>
            <button onClick={() => navigate("/patient-past-appointments")}>View Past Appointments & Reports</button>
        </div>
    );
};

export default PatientDashboard;
