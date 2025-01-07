import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/users/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
        }),
      });
      const data = await response.json();
      console.log('Response data:', data); // Debugging log
      if (response.status === 200) {
        // Save the access token to localStorage
        localStorage.setItem('accessToken', data.access); 
        console.log('Token saved:', data.access);
        navigate('/dashboard');
      } else {
        setError(data.detail || 'Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="login-wrapper">
      <img className="login-logo" src={logo} alt="app-logo" />
      <div className="login-wrapper2">
        <h1>Sign in</h1>
        <p>Welcome back!</p>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="login-input-box">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
            />
            <br />
          </div>
          <div className="login-input-box">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={userData.password}
              onChange={handleChange}
            />
            <br />
          </div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Sign in'}
          </button>
          <p>
            Don't have an account yet? <a href="/signup">Sign Up</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
