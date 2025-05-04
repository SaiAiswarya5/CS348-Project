import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./docReport.css";

const DocReport = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get appointments from the location state
  const { appointments } = location.state || { appointments: [] };
  
  // State for report data
  const [reportData, setReportData] = useState({
    totalAppointments: 0,
    averagePatientAge: 0,
    uniqueMedications: 0,
    avgPricePerDrug: 0,
    avgQuantityPerDrug: 0,
  });

  useEffect(() => {
    if (appointments.length > 0) {
      const totalAppointments = appointments.length;
      const totalPatientAge = appointments.reduce((sum, appt) => sum + appt.patient_age, 0);
      const uniqueMedications = new Set(
        appointments.flatMap((appt) => appt.prescriptions?.map((med) => med.name))
      ).size;

      const avgPricePerDrug = appointments
        .flatMap((appt) => appt.prescriptions)
        .reduce((sum, med) => sum + med.price, 0) / (uniqueMedications || 1);

      const avgQuantityPerDrug = appointments
        .flatMap((appt) => appt.prescriptions)
        .reduce((sum, med) => sum + med.quantity, 0) / (uniqueMedications || 1);

      setReportData({
        totalAppointments,
        averagePatientAge: (totalPatientAge / totalAppointments) || 0,
        uniqueMedications,
        avgPricePerDrug,
        avgQuantityPerDrug,
      });
    }
  }, [appointments]);

  return (
    <div className="doc-report-container">
      <div className="doc-report-box">
        <h2 className="report-title">Report Statistics</h2>
        <div className="report-content">
          <p>Total Appointments Processed: {reportData.totalAppointments}</p>
          <p>Average Patient Age: {reportData.averagePatientAge.toFixed(1)}</p>
          <p>Total Unique Medications Prescribed: {reportData.uniqueMedications}</p>
          <p>Average Price Per Medication: ${reportData.avgPricePerDrug.toFixed(2)}</p>
          <p>Average Quantity Per Medication: {reportData.avgQuantityPerDrug.toFixed(1)}</p>
        </div>
        <button className="back-button" onClick={() => navigate("/doctor-past-appointments")}>
          Back to Past Appointments
        </button>
      </div>
    </div>
  );
};

export default DocReport;
