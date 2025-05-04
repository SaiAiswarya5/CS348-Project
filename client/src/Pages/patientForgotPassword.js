import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PatientForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const navigate = useNavigate();

    const handleForgotPassword = async () => {
        console.log("Forgot Password button clicked");

        const response = await fetch("http://localhost:5000/forgot-password/patient", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, new_password: newPassword }),
        });

        const data = await response.json();

        if (response.ok) {
            alert("Password updated successfully. Please login with your new password.");
            navigate("/patient-login");
        } else {
            alert(data.error || "Password reset failed");
        }
    };

    return (
        <div className="login-container">
            <h2>Reset Password</h2>
            <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
            />
            <button onClick={handleForgotPassword}>Reset Password</button>
            <button onClick={() => navigate("/patient-login")}>Back to Login</button>
        </div>
    );
};

export default PatientForgotPassword;
