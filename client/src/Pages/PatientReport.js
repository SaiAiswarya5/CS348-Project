import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./patientReport.css";

const PatientReport = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get appointments passed through state
  const { appointments } = location.state || { appointments: [] };

  // Calculate statistics
  const totalAppointments = appointments.length;

  const allPrescriptions = appointments.flatMap((appt) => appt.prescriptions || []);
  const uniqueDrugNames = new Set(allPrescriptions.map((med) => med.name));
  const totalUniqueDrugs = uniqueDrugNames.size;

  const totalDrugCost = allPrescriptions.reduce((sum, med) => sum + (med.price || 0), 0);

  const totalQuantities = allPrescriptions.reduce((sum, med) => sum + (med.quantity || 0), 0);

  const avgQuantityPerDrug =
    totalUniqueDrugs > 0 ? (totalQuantities / totalUniqueDrugs).toFixed(1) : "0";

  const avgPricePerDrug =
    totalUniqueDrugs > 0 ? (totalDrugCost / totalUniqueDrugs).toFixed(2) : "0.00";

  return (
    <div className="patient-report-container">
      <div className="patient-report-box">
        <h2 className="report-title">Patient Report Statistics</h2>
        <div className="report-content">
          <p>Total Number of Appointments: {totalAppointments}</p>
          <p>Total Number of Unique Medications: {totalUniqueDrugs}</p>
          <p>Average Quantity Per Medication: {avgQuantityPerDrug}</p>
          <p>Average Price Per Medication: ${avgPricePerDrug}</p>
          <p>Total Cost of All Medication Prescribed: ${totalDrugCost.toFixed(2)}</p>
        </div>
        <button
          className="back-button"
          onClick={() => navigate("/patient-past-appointments")}
        >
          Back to Past Appointments
        </button>
      </div>
    </div>
  );
};

export default PatientReport;
