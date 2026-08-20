import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import API from '../api';
import './Login.css';

function Login({ setUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Auto-check: If user is already logged in, send them to dashboard
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await API.get('/user');
        if (res.data.user) {
          setUser(res.data.user);
          navigate('/dashboard');
        }
      } catch (err) {
        // User is not logged in, stay on login page.
      }
    };
    checkSession();
  }, [navigate, setUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await API.post('/login', {
        username: username,
        password: password
      });
      
      if (response.data.user) {
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/dashboard');
      } else {
        setError('Invalid credentials.');
      }
    } catch (error) {
      setError('Login failed. Check username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="simple-login-wrapper">
      <motion.div 
        className="simple-login-card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="login-header">
          <h2>Welcome Back</h2>
          <p>Sign in to access your dashboard</p>
        </div>

        <form className="simple-login-form" onSubmit={handleSubmit}>
          <div className="simple-form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              disabled={loading}
            />
          </div>

          <div className="simple-form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>

          {error && <div className="simple-error-msg">{error}</div>}

          <button type="submit" className="simple-login-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default Login;