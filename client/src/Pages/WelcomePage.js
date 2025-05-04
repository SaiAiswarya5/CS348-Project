import React from 'react';
import { useNavigate } from 'react-router-dom';
import './welcome.css';

const WelcomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="welcome-container">
            <h1>Welcome!</h1>
            <h3>Please choose doctor or patient to login/signup:</h3>
            <div className="button-group">
                <button onClick={() => navigate('/doctor-login')}>Doctor</button>
                <button onClick={() => navigate('/patient-login')}>Patient</button>
            </div>
            
        </div>
    );
};

export default WelcomePage;
