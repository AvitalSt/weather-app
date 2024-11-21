import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomeButton() {
    const navigate = useNavigate();

    const goHome = () => {
        navigate('/');
    };

    return (
        <div>
            <button className="home-button" onClick={goHome}>
                🏠 Go Home
            </button>
            <style>{`
                .home-button {
                    background-color: #4CAF50; 
                    color: white;
                    border: none;
                    padding: 10px 20px; 
                    text-align: center;
                    text-decoration: none;
                    display: inline-block;
                    font-size: 16px;
                    margin-top: 10px;
                    cursor: pointer;
                    border-radius: 50px; 
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); 
                    transition: all 0.3s ease; 
                }
                .home-button:hover {
                    background-color: #45a049; 
                    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3); 
                }
            `}</style>
        </div>
    );
}
