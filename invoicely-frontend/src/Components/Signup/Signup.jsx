import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import './SignUp.css';

function SignUp() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    email: '',
    full_name: '',
    company_name: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (userData.password !== userData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    const passwordStrength = validatePasswordStrength(userData.password);
    if (!passwordStrength) {
      setError('Password must be at least 8 characters, \n contain at least one lowercase letter, one uppercase letter, \n one digit, and one special character');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/users/signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userData.email,
          full_name: userData.full_name,
          company_name: userData.company_name,
          password: userData.password,
        }),
      });
      const data = await response.json();
      setLoading(false);
      if (response.status === 201) {
        setSuccess('User created successfully');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(data.email[0]);
      }
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  const validatePasswordStrength = (password) => {
    const rules = [
      (password) => password.length >= 8,
      (password) => /[a-z]/.test(password),
      (password) => /[A-Z]/.test(password),
      (password) => /[0-9]/.test(password),
      (password) => /[!@#$%^&*()_+=[\]{};':"\\|,.<>?]/.test(password),
    ];
    return rules.every((rule) => rule(password));
  };

  return (
    <div >

    <div className='signup-wrapper'>
    <img className='signup-logo' src={logo} alt='app-logo'/>

        <div className="signup-wrapper2">
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
      <h1>Create a free account</h1>
      <p>Create seamless invoices with an Invoicely-Pro.com account.</p>
        <div className="signup-input-box">
                <label>Email:</label>
                <input type="email" name="email" value={userData.email} onChange={handleChange} required/>
                <br />
        </div>
        <div className="signup-input-box">
                <label>Full Name:</label>
                <input type="text" name="full_name" value={userData.full_name} onChange={handleChange} required/>
                <br />
        </div>
        <div className="signup-input-box">
                <label>Company Name:</label>
                <input type="text" name="company_name" value={userData.company_name} onChange={handleChange} />
                <br />
        </div>
        <div className="signup-input-box">
                <label>Password:</label>
                <input type="password" name="password" value={userData.password} onChange={handleChange} required/>
                <br />
        </div>
        <div className="signup-input-box">
                <label>Confirm Password:</label>
                <input type="password" name="confirmPassword" value={userData.confirmPassword} onChange={handleChange} required/>
                <br />
        </div >
                <button type="submit" disabled={loading}>
                {loading ? 'Loading...' : 'Sign Up'}
                </button>
        <div className="signup-login">
            <p>Already have an account? <a href="/login">Sign In.</a></p>
        </div>
      </form>
      </div>
    </div>
    </div>
  );
}

export default SignUp;