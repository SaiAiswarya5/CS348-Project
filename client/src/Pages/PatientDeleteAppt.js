import React, { useState, useEffect } from "react";
import './patientdeleteappt.css';

const DeleteAppt = () => {
    const [appointments, setAppointments] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState("");

    // Fetch patient's appointments
    useEffect(() => {
        const patient_id = localStorage.getItem("patient_id");

        if (!patient_id) {
            alert("No patient ID found. Please log in again.");
            return;
        }

        fetch(`/api/appointments/${patient_id}`)
            .then((response) => response.json())
            .then((data) => setAppointments(data))
            .catch((error) => console.error("Error fetching appointments:", error));
    }, []);

    // Handle delete appointment
    const handleDelete = () => {
        if (!selectedAppointment) {
            alert("Please select an appointment to delete.");
            return;
        }

        fetch(`/api/delete-appointment/${selectedAppointment}`, {
            method: "DELETE",
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    alert("Appointment deleted successfully!");
                    setAppointments(appointments.filter(appt => appt.appointment_id !== selectedAppointment));
                    setSelectedAppointment("");
                } else {
                    alert("Failed to delete appointment.");
                }
            })
            .catch((error) => console.error("Error deleting appointment:", error));
    };

    return (
        <div className="delete-appt-container">
            <h2>Delete Appointment</h2>

            {/* Appointment Dropdown */}
            <label>Choose Appointment:</label>
            <select value={selectedAppointment} onChange={(e) => setSelectedAppointment(e.target.value)} required>
                <option value="">Select an appointment</option>
                {appointments.map((appt) => (
                    <option key={appt.appointment_id} value={appt.appointment_id}>
                        Dr. {appt.physician_name} - {appt.physician_specialty} ({appt.date} {appt.time})
                    </option>
                ))}
            </select>

            <button onClick={handleDelete} style={{ backgroundColor: "red", color: "white" }}>
                Delete Appointment
            </button>
        </div>
    );
};

export default DeleteAppt;
