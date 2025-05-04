import React, { useState, useEffect } from "react";
import './createAppt.css';

const CreateAppt = () => {
    const [physicians, setPhysicians] = useState([]); // Store physician list
    const [selectedPhysician, setSelectedPhysician] = useState("");
    const [appointmentDate, setAppointmentDate] = useState("");
    const [appointmentTime, setAppointmentTime] = useState("");

    // Fetch physicians from backend when component mounts
    useEffect(() => {
        fetch("/api/physicians")  // Ensure this endpoint exists in your backend
            .then((response) => response.json())
            .then((data) => setPhysicians(data))
            .catch((error) => console.error("Error fetching physicians:", error));
    }, []);

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        
        const patient_id = localStorage.getItem("patient_id"); // Get patient_id from localStorage

        if (!patient_id || !selectedPhysician || !appointmentDate || !appointmentTime) {
            alert("Please select all fields.");
            return;
        }

        const appointmentData = {
            patient_id,
            physician_id: selectedPhysician,
            date: appointmentDate,
            time: appointmentTime
        };

        fetch("/api/create-appointment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(appointmentData)
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                alert("Appointment created successfully!");
            } else {
                alert("Failed to create appointment.");
            }
        })
        .catch((error) => console.error("Error creating appointment:", error));
    };

    return (
        <div className="create-appt-container">
            <h2>Create Appointment</h2>
            <form onSubmit={handleSubmit}>
                {/* Physician Dropdown */}
                <label>Choose Physician:</label>
                <select value={selectedPhysician} onChange={(e) => setSelectedPhysician(e.target.value)} required>
                    <option value="">Select a physician</option>
                    {physicians.map((physician) => (
                        <option key={physician.physician_id} value={physician.physician_id}>
                            {physician.name} - {physician.specialty}
                        </option>
                    ))}
                </select>

                {/* Date Picker */}
                <label>Select Date:</label>
                <input type="date" value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} required />

                {/* Time Picker */}
                <label>Select Time:</label>
                <input type="time" value={appointmentTime} onChange={(e) => setAppointmentTime(e.target.value)} required />

                <button type="submit">Create Appointment</button>
            </form>
        </div>
    );
};

export default CreateAppt;
