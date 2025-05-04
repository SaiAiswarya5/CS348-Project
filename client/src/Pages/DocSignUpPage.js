import React, { useState } from "react";

const DocSignUpPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        specialty: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch("http://localhost:5000/signup/physician", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        if (response.ok) {
            alert("Physician signed up successfully!");
        } else {
            alert(`Error: ${data.error}`);
        }
    };

    return (
        <div className="signup-container">
            <h2>Doctor Signup</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                <input type="text" name="specialty" placeholder="Specialty" onChange={handleChange} required />
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};

export default DocSignUpPage;
