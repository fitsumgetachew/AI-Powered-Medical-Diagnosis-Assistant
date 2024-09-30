import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AuthComponents.css'; // Import the stylesheet

// Login Component
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/users/login/', { email, password });
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      localStorage.setItem('is_doctor', response.data.is_doctor);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error.response.data);
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="auth-form login-form">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <button className="forgot-button" onClick={() => navigate('/register')}>Register</button>
      <button className="forgot-button" onClick={() => navigate('/forgot-password')}>Forgot Password</button>
    </div>
  );
};

// Registration Component
const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    try {
      await axios.post('http://127.0.0.1:8000/users/send_otp/', { email });
      setOtpSent(true);
      alert('OTP sent to your email.');
    } catch (error) {
      console.error('OTP send error:', error.response.data);
      alert('Failed to send OTP. Please try again.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/users/register/', {
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        otp
      });
      alert('Account created successfully. Please login.');
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error.response.data);
      alert('Registration failed. Please check your information and try again.');
    }
  };

  return (
    <div className="auth-form register-form">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        {!otpSent ? (
          <button type="button" onClick={handleSendOtp}>Send OTP</button>
        ) : (
          <input
            type="text"
            placeholder="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        )}
        <button type="submit" disabled={!otpSent}>Register</button>
      </form>
    </div>
  );
};

// User Profile Component
const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/users/profile/', {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
      });
      setProfile(response.data);
      setFirstName(response.data.first_name);
      setLastName(response.data.last_name);
    } catch (error) {
      console.error('Profile fetch error:', error.response.data);
      alert('Failed to fetch profile. Please try again.');
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await axios.put('http://127.0.0.1:8000/users/profile/',
        { first_name: firstName, last_name: lastName },
        { headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` } }
      );
      alert('Profile updated successfully.');
      setEditing(false);
      fetchProfile();
    } catch (error) {
      console.error('Profile update error:', error.response.data);
      alert('Failed to update profile. Please try again.');
    }
  };

  React.useEffect(() => {
    fetchProfile();
  }, []);

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="user-profile">
      <h2>User Profile</h2>
      {editing ? (
        <form onSubmit={handleUpdateProfile}>
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <button type="submit">Save Changes</button>
          <button type="button" className="cancel-button" onClick={() => setEditing(false)}>Cancel</button>
        </form>
      ) : (
        <div>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>First Name:</strong> {profile.first_name}</p>
          <p><strong>Last Name:</strong> {profile.last_name}</p>
          <button onClick={() => setEditing(true)}>Edit Profile</button>
        </div>
      )}
    </div>
  );
};

export { Login, Register, UserProfile };
