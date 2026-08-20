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
        {/*F1 sectfion*/}
        <div className="hero-section f1-section">
          <div className="track-container">
            <div className="track-line"></div>
            <div className="track-line dashed"></div>
            <div className="moving-f1">🏎️</div>
          </div>
          <div className="section-label">F1 Grand Prix</div>
        </div>

        {/*Football section*/}
        <div className="hero-section football-section">
          <div className="goal-container">
            <div className="goal-post-left"></div>
            <div className="goal-post-right"></div>
            <div className="goal-crossbar"></div>
            <div className="goal-net"></div>
            <div className="moving-ball">⚽</div>
          </div>
          <div className="section-label">Football League</div>
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