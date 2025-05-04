import React from "react";
import { useNavigate } from "react-router-dom";
import './patientDashboard.css';

const DoctorDashboard = () => {
    const navigate = useNavigate();

    const handleEditAppointment = () => {
        // Redirect to the edit appointment page
        navigate("/doctor-edit-appointment");
    };

    const handlePrescribe = () => {
        // Redirect to the prescribe medication page
        navigate("/doctor-prescribe");
    };

    return (
        <div className="dashboard-container">
            <h2>Doctor Dashboard</h2>
            <button onClick={handleEditAppointment}>Edit Appointment</button>
            <button onClick={handlePrescribe}>Prescribe</button>
            <button onClick={() => navigate("/doctor-past-appointments")}>View Past Appointments & Reports</button>
        </div>
    );
};

export default DoctorDashboard;
