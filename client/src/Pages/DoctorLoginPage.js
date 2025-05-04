import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const DoctorLoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        console.log("Login button clicked");  // This will show up in your browser console when the button is clicked
    
        const response = await fetch('http://localhost:5000/login/physician', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
    
        const data = await response.json();
    
        if (response.ok) {
            localStorage.setItem("doctor_id", data.doctor_id);
            // Redirect to the physician dashboard or home page upon successful login
            navigate("/doctor-dashboard");
        } else {
            // Show an error message if login fails
            alert(data.error || "Login failed");
        }
    };

    return (
        <div className="login-container">
            <h2>Doctor Login</h2>
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
            <button onClick={() => navigate("/doctor-signup")}>Sign Up</button>
            <button onClick={() => navigate("/doctor-forgot-password")}>Forgot Password</button>
        </div>
    );
};

export default DoctorLoginPage;
