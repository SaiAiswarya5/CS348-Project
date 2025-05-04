import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomePage from "./Pages/WelcomePage";
import DoctorLoginPage from "./Pages/DoctorLoginPage";
import PatientLoginPage from "./Pages/PatientLoginPage";
import DocSignUpPage from "./Pages/DocSignUpPage";
import PatientSignUpPage from "./Pages/PatientSignUpPage";
import DocDashboard from "./Pages/DocDashboard";
import PatientDashboard from "./Pages/PatientDashboard.js";
import CreateAppt from "./Pages/CreateAppt.js";
import PatientEditAppt from "./Pages/PatientEditAppt.js";
import PatientDeleteAppt from "./Pages/PatientDeleteAppt.js";
import DocEdit from "./Pages/docEditAppt.js";
import DocPrescribe from "./Pages/docPrescribe.js";
import PatientForgotPassword from "./Pages/patientForgotPassword.js"; 
import DoctorForgotPassword from "./Pages/doctorForgotPassword.js"; 
import DocFinishedAppts from "./Pages/DocFinishedAppts.js";
import DocReport from "./Pages/DocReport.js";
import PatientFinishedAppts from "./Pages/PatientFinishedAppts.js";
import PatientReport from "./Pages/PatientReport.js";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<WelcomePage />} />
                <Route path="/doctor-login" element={<DoctorLoginPage />} />
                <Route path="/patient-login" element={<PatientLoginPage />} />
                <Route path="/doctor-signup" element={<DocSignUpPage />} />
                <Route path="/patient-signup" element={<PatientSignUpPage />} />
                <Route path="/doctor-dashboard" element={<DocDashboard/>}/>
                <Route path="/patient-dashboard" element={<PatientDashboard />} />
                <Route path="/create-appointment" element={<CreateAppt />} />
                <Route path="/patient-edit-appointment" element={<PatientEditAppt />} />
                <Route path="/patient-delete-appointment" element={<PatientDeleteAppt />} />
                <Route path="/doctor-edit-appointment" element={<DocEdit />} />
                <Route path="/doctor-prescribe" element={<DocPrescribe />} />
                <Route path="/doctor-forgot-password" element={<DoctorForgotPassword />} />
                <Route path="/patient-forgot-password" element={<PatientForgotPassword />} />
                <Route path="/doctor-past-appointments" element={<DocFinishedAppts />} />
                <Route path="/patient-past-appointments" element={<PatientFinishedAppts />} />
                <Route path="/doctor-report" element={<DocReport />} />
                <Route path="/patient-report" element={<PatientReport />} />
            </Routes>
        </Router>
    );
};

export default App;
