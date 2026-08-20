import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import API from '../api';
import './Login.css';


function Login({ setUser }) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Runs when user clicks login button
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents automatic page refresh on submission
    try {
      // Sends data to flask
      const formData = new URLSearchParams();
      formData.append('username', username);
      
      // Sends a POST request to backend
      const response = await API.post('/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      
      // If successful, user is set as current user
      setUser({ username });

      navigate('/');
    } catch (error) {
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div className="login-split-layout">
      <div className="login-hero">
        {/*F1 section*/}
        <div className="hero-section f1-section">
          <div className="track-svg-wrapper">
            <svg viewBox="0 0 500 80" className="f1-track-svg">
              {/* The Track Base */}
              <rect x="0" y="10" width="500" height="60" rx="8" fill="#2d3748" />
              {/* Track Curbs */}
              <rect x="0" y="10" width="500" height="4" fill="#e2e8f0" opacity="0.3" />
              <rect x="0" y="66" width="500" height="4" fill="#e2e8f0" opacity="0.3" />
              {/* Dashed Center Line */}
              <line x1="0" y1="40" x2="500" y2="40" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="12 12" opacity="0.5" />

              <svg width="220" height="40" style={{ position: 'absolute', top: '10px', left: 0 }} className="moving-f1-svg">
                <g>
                  {/* Chassis */}
                  <path d="M 10 20 L 10 30 L 60 30 L 80 10 L 90 10 L 90 30 L 100 30 L 100 20 L 110 20 L 110 30 L 140 30 L 150 10 L 160 10 L 160 30 L 210 30 L 210 20 L 220 10 L 10 10 Z" fill="#e11d48" />
                  {/* Front Wing */}
                  <path d="M 10 25 L 0 25 L 0 23 L 10 23 Z" fill="#f1f5f9" />
                  {/* Rear Wing */}
                  <path d="M 210 25 L 220 25 L 220 15 L 210 15 Z" fill="#f1f5f9" />
                  {/* Front Wheel */}
                  <circle cx="40" cy="35" r="6" fill="#1e293b" />
                  <circle cx="40" cy="35" r="3" fill="#e2e8f0" />
                  {/* Rear Wheel */}
                  <circle cx="180" cy="35" r="6" fill="#1e293b" />
                  <circle cx="180" cy="35" r="3" fill="#e2e8f0" />
                </g>
              </svg>
            </svg>
          </div>
          <div className="section-label">F1 GRAND PRIX</div>
        </div>

        {/*Football section*/}
        <div className="hero-section football-section">
          <div className="goal-svg-wrapper">
            <svg viewBox="0 0 500 100" className="football-goal-svg">
              {/* The Grass */}
              <rect x="0" y="70" width="500" height="30" fill="#166534" />
              <rect x="0" y="70" width="500" height="2" fill="#15803d" />
              
              {/* The Goal Posts */}
              <rect x="50" y="20" width="4" height="50" fill="#f8fafc" rx="2" />
              <rect x="446" y="20" width="4" height="50" fill="#f8fafc" rx="2" />
              <rect x="50" y="20" width="400" height="4" fill="#f8fafc" rx="2" />
              
              {/* The Goal Net (Geometric Lines) */}
              <path d="M 54 70 L 54 24 M 74 70 L 74 24 M 94 70 L 94 24 M 114 70 L 114 24 M 134 70 L 134 24 M 154 70 L 154 24 M 174 70 L 174 24 M 194 70 L 194 24 M 214 70 L 214 24 M 234 70 L 234 24 M 254 70 L 254 24 M 274 70 L 274 24 M 294 70 L 294 24 M 314 70 L 314 24 M 334 70 L 334 24 M 354 70 L 354 24 M 374 70 L 374 24 M 394 70 L 394 24 M 414 70 L 414 24 M 434 70 L 434 24 M 446 70 L 446 24" stroke="#f8fafc" strokeWidth="1" opacity="0.1" />
              <path d="M 52 70 L 52 70 M 52 46 L 448 46 M 52 60 L 448 60" stroke="#f8fafc" strokeWidth="1" opacity="0.1" />

              <svg width="100" height="100" style={{ position: 'absolute', top: '10px', left: 0 }} className="moving-ball-svg">
                <g>
                  <circle cx="25" cy="75" r="12" fill="#f8fafc" />
                  <path d="M 13 75 L 22 65 L 25 75 L 22 85 Z" fill="#1e293b" opacity="0.2" />
                  <path d="M 25 63 L 28 75 L 25 87 L 22 75 Z" fill="#1e293b" opacity="0.2" />
                  <path d="M 37 75 L 28 65 L 25 75 L 28 85 Z" fill="#1e293b" opacity="0.2" />
                </g>
              </svg>
            </svg>
          </div>
          <div className="section-label">FOOTBALL LEAGUE</div>
        </div>

        {/*App title*/}
        <motion.div
          className="hero-text"
          initial={{ opacity: 0, y: 30 }}
          animate= {{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <h1>Prediction League</h1>
          <p>Predict the winners. Track your scores. Compete with friends.</p>
        </motion.div>
      </div>

      {/*Login Form*/}
      <div className="login-form-wrapper">
        <motion.div
          className="login-card"
          initial={{ opacity: 0, x: 50 }}
          animate= {{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2>Welcome Back</h2>
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Username</label>
              <input  
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="login-btn">
              Login
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;