import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    <div className="login-container">
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
    </div>
  );
}

export default Login;