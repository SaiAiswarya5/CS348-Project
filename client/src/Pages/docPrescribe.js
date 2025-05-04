import React, { useState, useEffect } from "react";
import "./prescribe.css"; // Add styling here

const Prescribe = () => {
    const [unfinishedAppointments, setUnfinishedAppointments] = useState([]); 
    const [finishedAppointments, setFinishedAppointments] = useState([]); 

    const [selectedUnfinished, setSelectedUnfinished] = useState("");
    const [selectedFinished, setSelectedFinished] = useState("");

    const [diagnosis, setDiagnosis] = useState("");
    const [treatment, setTreatment] = useState("");

    const [drugName, setDrugName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [frequency, setFrequency] = useState("");
    const [price, setPrice] = useState("");

    const doctor_id = localStorage.getItem("doctor_id");

    // Fetch unfinished appointments (finished = 0)
    useEffect(() => {
        fetch(`/api/appointments/doctor/${doctor_id}/0`)
            .then((res) => res.json())
            .then((data) => setUnfinishedAppointments(data))
            .catch((err) => console.error("Error fetching unfinished appointments:", err));
    }, [doctor_id]);

    // Fetch finished appointments (finished = 1)
    useEffect(() => {
        fetch(`/api/appointments/doctor/${doctor_id}/1`)
            .then((res) => res.json())
            .then((data) => setFinishedAppointments(data))
            .catch((err) => console.error("Error fetching finished appointments:", err));
    }, [doctor_id]);

    // Handle finishing appointment
    const handleFinish = () => {
        if (!selectedUnfinished || !diagnosis || !treatment) {
            alert("Please complete all fields.");
            return;
        }

        fetch(`/api/finish-appointment/${selectedUnfinished}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ finished: true, diagnosis, treatment }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    alert("Appointment marked as finished.");
                    window.location.reload();
                } else {
                    alert("Failed to finish appointment.");
                }
            })
            .catch((err) => console.error("Error finishing appointment:", err));
    };

    // Handle prescribing medication
    const handlePrescribe = () => {
        if (!selectedFinished || !drugName || !quantity || !frequency || !price) {
            alert("Please fill in all prescription fields.");
            return;
        }

        fetch("/api/prescribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                appointment_id: selectedFinished,
                drug_name: drugName,
                quantity: quantity,
                frequency: frequency,
                price: price,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    alert(data.error);
                } else {
                    alert("Prescription added successfully!");
                    setDrugName("");
                    setQuantity("");
                    setFrequency("");
                    setPrice("");
                }
            })
            .catch((err) => console.error("Error prescribing:", err));
    };

    return (
        <div className="prescribe-container">
            {/* Left Side - Finish Appointment */}
            <div className="box">
                <h2>Finish Appointment</h2>
                <label>Select Appointment:</label>
                <select value={selectedUnfinished} onChange={(e) => setSelectedUnfinished(e.target.value)}>
                    <option value="">Select an appointment</option>
                    {unfinishedAppointments.map((appt) => (
                        <option key={appt.appointment_id} value={appt.appointment_id}>
                            {appt.patient_name} - {appt.date} at {appt.time}
                        </option>
                    ))}
                </select>

                <label>Diagnosis:</label>
                <input type="text" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} placeholder="Enter diagnosis" />

                <label>Treatment:</label>
                <input type="text" value={treatment} onChange={(e) => setTreatment(e.target.value)} placeholder="Enter treatment" />

                <button onClick={handleFinish}>Finish Appointment</button>
            </div>

            {/* Right Side - Prescribe Medication */}
            <div className="box">
                <h2>Prescribe Medication</h2>
                <label>Select Finished Appointment:</label>
                <select value={selectedFinished} onChange={(e) => setSelectedFinished(e.target.value)}>
                    <option value="">Select an appointment</option>
                    {finishedAppointments.map((appt) => (
                        <option key={appt.appointment_id} value={appt.appointment_id}>
                            {appt.patient_name} - {appt.date} at {appt.time}
                        </option>
                    ))}
                </select>

                <label>Drug Name:</label>
                <input type="text" value={drugName} onChange={(e) => setDrugName(e.target.value)} placeholder="Enter drug name" />

                <label>Quantity:</label>
                <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Enter quantity" />

                <label>Frequency:</label>
                <input type="text" value={frequency} onChange={(e) => setFrequency(e.target.value)} placeholder="Enter frequency" />

                <label>Price:</label>
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Enter price" />

                <button onClick={handlePrescribe}>Prescribe</button>
            </div>
        </div>
    );
};

export default Prescribe;
