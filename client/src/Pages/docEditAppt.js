import React, { useState, useEffect } from "react";

const EditDoc = () => {
    const [appointments, setAppointments] = useState([]); // Doctor's appointments
    const [selectedAppointment, setSelectedAppointment] = useState(""); // Chosen appointment
    const [newDate, setNewDate] = useState("");
    const [newTime, setNewTime] = useState("");

    const doctor_id = localStorage.getItem("doctor_id");

    // Fetch doctor's appointments
    useEffect(() => {
        fetch(`/api/appointments/doctor/${doctor_id}/0`)
            .then((response) => response.json())
            .then((data) => setAppointments(data))
            .catch((error) => console.error("Error fetching appointments:", error));
    }, [doctor_id]);

    // Handle update
    const handleUpdate = (e) => {
        e.preventDefault();

        if (!selectedAppointment) {
            alert("Please select an appointment to edit.");
            return;
        }

        const updatedData = {
            date: newDate || undefined,
            time: newTime || undefined,
        };

        fetch(`/api/edit-appointment/${selectedAppointment}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
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
            <h2>Manage Appointments</h2>
            <form onSubmit={handleUpdate}>
                {/* Select appointment */}
                <label>Select Appointment to Edit:</label>
                <select value={selectedAppointment} onChange={(e) => setSelectedAppointment(e.target.value)} required>
                    <option value="">Select an appointment</option>
                    {appointments.map((appt) => (
                        <option key={appt.appointment_id} value={appt.appointment_id}>
                            {appt.patient_name} - {appt.date} at {appt.time}
                        </option>
                    ))}
                </select>

                {/* Change Date */}
                <label>Change Date (optional):</label>
                <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />

                {/* Change Time */}
                <label>Change Time (optional):</label>
                <input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} />

                {/* Update Button */}
                <button type="submit">Update Appointment</button>
            </form>
        </div>
    );
};

export default EditDoc;
