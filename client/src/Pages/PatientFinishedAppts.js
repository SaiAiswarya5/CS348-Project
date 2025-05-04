import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./patientFinishedAppts.css";

const PatientFinishedAppts = () => {
    const [appointments, setAppointments] = useState([]);
    const [physicians, setPhysicians] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState("");
    const [selectedSpecialty, setSelectedSpecialty] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    const patient_id = localStorage.getItem("patient_id");

    const fetchFinishedAppointments = async () => {
      try {
          const params = new URLSearchParams();
          if (selectedDoctor) params.append("doctor", selectedDoctor);
          if (selectedSpecialty) params.append("specialty", selectedSpecialty);
          if (startDate) params.append("start_date", startDate);
          if (endDate) params.append("end_date", endDate);
          if (startTime) params.append("start_time", startTime);
          if (endTime) params.append("end_time", endTime);
  
          const queryString = params.toString();
          const url = `/api/appointments/finished/${patient_id}${queryString ? '?' + queryString : ''}`;
  
          const response = await fetch(url);
          const data = await response.json();
          setAppointments(data);
      } catch (error) {
          console.error("Error fetching finished appointments:", error);
      }
  };
  

    // Load physicians for dropdown
    useEffect(() => {
        fetch("/api/physicians")
            .then((response) => response.json())
            .then((data) => setPhysicians(data))
            .catch((error) => console.error("Error fetching physicians:", error));
    }, []);

    // Fetch all finished appointments on initial load
    useEffect(() => {
        if (patient_id) fetchFinishedAppointments();
    }, [patient_id]);

    const handleViewAll = () => {
      setSelectedDoctor("");
      setSelectedSpecialty("");
      setStartDate("");
      setEndDate("");
      setStartTime("");
      setEndTime("");
      fetchFinishedAppointments();
  };

    return (
        <div className="doc-finished-container">
            {/* Filters Box */}
            <div className="filters-box">
                <button className="view-all" onClick={handleViewAll}>View All</button>

                <select className="dropdown" value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)}>
                    <option value="">Select Doctor</option>
                    {physicians.map((physician) => (
                        <option key={physician.physician_id} value={physician.physician_id}>
                            {physician.name}
                        </option>
                    ))}
                </select>

                <select
                  className="dropdown"
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                >
                  <option value="">Doctor Specialty</option>
                  {[...new Set(physicians.map((doc) => doc.specialty))]
                  .filter((s) => s) // remove empty/null specialties
                  .map((specialty, index) => (
                <option key={index} value={specialty}>
                {specialty.charAt(0).toUpperCase() + specialty.slice(1)}
                </option>
                ))}
                </select>

                <input
                    type="date"
                    className="mini-calendar"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <input
                    type="date"
                    className="mini-calendar"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />

                <input
                    type="time"
                    className="dropdown"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                />
                <input
                    type="time"
                    className="dropdown"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                />

                <button className="filter-button" onClick={fetchFinishedAppointments}>Filter</button>
            </div>

            {/* Appointments Box */}
            <div className="appointments-box">
                <div className="scroll-content">
                    {appointments.length === 0 ? (
                        <p>No appointments found.</p>
                    ) : (
                        appointments.map((appt) => (
                            <div key={appt.appointment_id} className="appointment-entry">
                                <p><strong>Doctor Name:</strong> {appt.physician_name}</p>
                                <p><strong>Specialty:</strong> {appt.physician_specialty}</p>
                                <p><strong>Date:</strong> {appt.date}</p>
                                <p><strong>Time:</strong> {appt.time}</p>
                                {appt.diagnosis && <p><strong>Diagnosis:</strong> {appt.diagnosis}</p>}
                                {appt.treatment && <p><strong>Treatment:</strong> {appt.treatment}</p>}
                                {appt.prescriptions && appt.prescriptions.map((med, index) => (
                                    <p key={index}>
                                        <strong>Prescription #{index + 1}:</strong> {med.name} - {med.quantity} {med.frequency}, ${med.price}
                                    </p>
                                ))}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Generate Report Button */}
            <div className="generate-report-container">
              <Link to="/patient-report" state={{ appointments }}>
                <button className="generate-report">Generate Report</button>
              </Link>
            </div>
        </div>
    );
};

export default PatientFinishedAppts;
