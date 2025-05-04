import React, { useState, useEffect } from "react";
import './patientedit.css';

const EditAppt = () => {
    const [appointments, setAppointments] = useState([]); // User's appointments
    const [physicians, setPhysicians] = useState([]); // All available physicians
    const [selectedAppointment, setSelectedAppointment] = useState(""); // Chosen appointment
    const [newPhysician, setNewPhysician] = useState("");
    const [newDate, setNewDate] = useState("");
    const [newTime, setNewTime] = useState("");

    const patient_id = localStorage.getItem("patient_id");

    // Fetch patient's appointments
    useEffect(() => {
        fetch(`/api/appointments/${patient_id}`)
            .then((response) => response.json())
            .then((data) => setAppointments(data))
            .catch((error) => console.error("Error fetching appointments:", error));
    }, [patient_id]);

    // Fetch available physicians
    useEffect(() => {
        fetch("/api/physicians")
            .then((response) => response.json())
            .then((data) => setPhysicians(data))
            .catch((error) => console.error("Error fetching physicians:", error));
    }, []);

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!selectedAppointment) {
            alert("Please select an appointment to edit.");
            return;
        }

        const updatedData = {
            physician_id: newPhysician || undefined, // Send only if changed
            date: newDate || undefined,
            time: newTime || undefined,
        };

        fetch(`/api/edit-appointment/${selectedAppointment}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedData),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    alert("Appointment updated successfully!");
                    window.location.reload();
                } else {
                    alert("Failed to update appointment.");
                }
            })
            .catch((error) => console.error("Error updating appointment:", error));
    };

    return (
        <div className="edit-appt-container">
            <h2>Edit Appointment</h2>
            <form onSubmit={handleSubmit}>
                {/* Select existing appointment */}
                <label>Select Appointment to Edit:</label>
                <select value={selectedAppointment} onChange={(e) => setSelectedAppointment(e.target.value)} required>
                    <option value="">Select an appointment</option>
                    {appointments.map((appt) => (
                        <option key={appt.appointment_id} value={appt.appointment_id}>
                            Dr. {appt.physician_name} ({appt.physician_specialty}) on {appt.date} at {appt.time}
                        </option>
                    ))}
                </select>

                {/* Select new physician (optional) */}
                <label>Change Physician (optional):</label>
                <select value={newPhysician} onChange={(e) => setNewPhysician(e.target.value)}>
                    <option value="">Keep current physician</option>
                    {physicians.map((physician) => (
                        <option key={physician.physician_id} value={physician.physician_id}>
                            {physician.name} - {physician.specialty}
                        </option>
                    ))}
                </select>

                {/* Change Date */}
                <label>Change Date (optional):</label>
                <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />

                {/* Change Time */}
                <label>Change Time (optional):</label>
                <input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} />

                <button type="submit">Update Appointment</button>
            </form>
        </div>
    );
};

export default EditAppt;
