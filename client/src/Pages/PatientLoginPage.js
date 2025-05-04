import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './patientlogin.css';

const PatientLoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    // Handle login button click
    const handleLogin = async () => {
        console.log("Login button clicked");

        // Send login request to the backend
        const response = await fetch('http://localhost:5000/login/patient', {  // Change the URL to point to the correct backend route
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("patient_id", data.patient_id);
            // Redirect to the patient dashboard or home page upon successful login
            navigate("/patient-dashboard");
        } else {
            // Show an error message if login fails
            alert(data.error || "Login failed");
        }
    };

    return (
        <div className="login-container">
            <h2>Patient Login</h2>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
            <button onClick={() => navigate("/patient-signup")}>Sign Up</button>
            <button onClick={() => navigate("/patient-forgot-password")}>Forgot Password</button>
        </div>
    );
};

export default PatientLoginPage;
