import React, { useState } from "react";
import './patientsignup.css';

const PatientSignUpPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        age: "",
        blood_type: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch("http://localhost:5000/signup/patient", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        if (response.ok) {
            alert("Patient signed up successfully!");
        } else {
            alert(`Error: ${data.error}`);
        }
    };

    return (
        <div className="signup-container">
            <h2>Patient Signup</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                <input type="number" name="age" placeholder="Age" onChange={handleChange} required />
                <input type="text" name="blood_type" placeholder="Blood Type" onChange={handleChange} required />
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
    
};

export default PatientSignUpPage;
