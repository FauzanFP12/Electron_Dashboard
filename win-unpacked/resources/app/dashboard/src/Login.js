import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isRegistering, setIsRegistering] = useState(false); // State to toggle between login and register
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/login`, { username, password });
        const { token } = response.data;
        // Store token in localStorage
        localStorage.setItem('token', token);
        // Redirect to the dashboard on successful login
        navigate('dashboard');
      } catch (error) {
        if (error.response) {
          // Jika ada respons dari server
          setErrorMessage(error.response.data.message || 'Login failed');
        } else if (error.request) {
          // Jika permintaan tidak dikirim atau masalah jaringan
          setErrorMessage('Network error, please try again');
        } else {
          // Jika terjadi error lainnya
          setErrorMessage('An unexpected error occurred');
        }
        console.log('Login data:', { username, password });

      }
      
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, { username, password });
      // After successful registration, you can navigate to login or auto-login
      setIsRegistering(false);
      alert('Registration successful, you can now log in.');
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Error occurred during registration');
    }
  };

  return (
    <div className="login-container">
      <h2>{isRegistering ? 'Register' : 'Login'} to Dashboard</h2>
      {errorMessage && <p className="error">{errorMessage}</p>}
      <form onSubmit={isRegistering ? handleRegisterSubmit : handleLoginSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Enter your username"
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
        </div>
        <button type="submit">{isRegistering ? 'Register' : 'Login'}</button>
      </form>
      <p>
        {isRegistering ? 'Already have an account?' : 'Don\'t have an account?'}
        <span onClick={() => setIsRegistering(!isRegistering)} className="toggle-form">
          {isRegistering ? 'Login' : 'Register'}
        </span>
      </p>
    </div>
  );
};

export default Login;
