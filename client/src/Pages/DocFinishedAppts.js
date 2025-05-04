import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./docFinishedAppts.css";

const DocFinishedAppts = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [selectedAgeRange, setSelectedAgeRange] = useState("");
  const [selectedBloodType, setSelectedBloodType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const navigate = useNavigate();

  const doctor_id = localStorage.getItem("doctor_id");

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch(`/api/appointments/doctor/${doctor_id}/1`);
        const data = await res.json();

        const uniquePatients = [
          ...new Map(data.map((item) => [item.patient_id, item])).values()
        ];

        setPatients(uniquePatients);
      } catch (err) {
        console.error("Error fetching patients:", err);
      }
    };
    fetchPatients();
  }, [doctor_id]);

  useEffect(() => {
    fetchFinishedAppointments();
  }, [doctor_id]);

  useEffect(() => {
    const allFiltersCleared =
      !selectedPatient &&
      !selectedAgeRange &&
      !selectedBloodType &&
      !startDate &&
      !endDate &&
      !startTime &&
      !endTime;

    if (allFiltersCleared) {
      fetchFinishedAppointments();
    }
  }, [
    selectedPatient,
    selectedAgeRange,
    selectedBloodType,
    startDate,
    endDate,
    startTime,
    endTime
  ]);

  const fetchFinishedAppointments = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedPatient) params.append("patient", selectedPatient);
      if (selectedAgeRange) params.append("age_range", selectedAgeRange);
      if (selectedBloodType) params.append("blood_type", selectedBloodType);
      if (startDate) params.append("start_date", startDate);
      if (endDate) params.append("end_date", endDate);
      if (startTime) params.append("start_time", startTime);
      if (endTime) params.append("end_time", endTime);

      const query = params.toString();
      const url = `/api/appointments/finished/doctor/${doctor_id}${query ? "?" + query : ""}`;

      const response = await fetch(url);
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error("Error fetching finished appointments:", error);
    }
  };

  const handleViewAll = () => {
    setSelectedPatient("");
    setSelectedAgeRange("");
    setSelectedBloodType("");
    setStartDate("");
    setEndDate("");
    setStartTime("");
    setEndTime("");
  };

  return (
    <div className="doc-finished-container">
      <div className="filters-box">
        <button className="view-all" onClick={handleViewAll}>
          View All
        </button>

        <select
          className="dropdown"
          value={selectedPatient}
          onChange={(e) => setSelectedPatient(e.target.value)}
        >
          <option value="">Select Patient</option>
          {patients.length > 0 ? (
            patients.map((p) => (
              <option key={p.patient_id} value={p.patient_id}>
                {p.patient_name}
              </option>
            ))
          ) : (
            <option>No patients available</option>
          )}
        </select>

        <select
          className="dropdown"
          value={selectedAgeRange}
          onChange={(e) => setSelectedAgeRange(e.target.value)}
        >
          <option value="">Age Range</option>
          <option value="0-18">0-18</option>
          <option value="19-35">19-35</option>
          <option value="36-50">36-50</option>
          <option value="51+">51+</option>
        </select>

        <select
          className="dropdown"
          value={selectedBloodType}
          onChange={(e) => setSelectedBloodType(e.target.value)}
        >
          <option value="">Blood Type</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
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

        <button className="filter-button" onClick={fetchFinishedAppointments}>
          Filter
        </button>
      </div>

      <div className="appointments-box">
        <div className="scroll-content">
          {appointments.length === 0 ? (
            <p>No appointments found.</p>
          ) : (
            appointments.map((appt) => (
              <div key={appt.appointment_id} className="appointment-entry">
                <p><strong>Patient Name:</strong> {appt.patient_name}</p>
                <p><strong>Patient Age:</strong> {appt.patient_age}</p>
                <p><strong>Blood Type:</strong> {appt.blood_type}</p>
                <p><strong>Date:</strong> {appt.date}</p>
                <p><strong>Time:</strong> {appt.time}</p>
                <p><strong>Diagnosis:</strong> {appt.diagnosis}</p>
                <p><strong>Treatment:</strong> {appt.treatment}</p>
                {appt.prescriptions?.map((med, index) => (
                  <p key={index}>
                    <strong>Prescription #{index + 1}:</strong> {med.name} - {med.quantity} {med.frequency}, ${med.price}
                  </p>
                ))}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="generate-report-container">
        <Link to="/doctor-report" state={{ appointments }}>
          <button className="generate-report">Generate Report</button>
        </Link>
      </div>
    </div>
  );
};

export default DocFinishedAppts;
