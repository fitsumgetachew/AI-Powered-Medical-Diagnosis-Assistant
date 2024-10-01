import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthComponents.css'; // Import the stylesheet

const API_BASE_URL = 'http://localhost:8000/';

// Helper function to handle API requests
async function sendRequest(endpoint, method = 'GET', data = null) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
  };

  // Check if there's an access token and include it in headers
  const token = localStorage.getItem('access_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
    body: data ? JSON.stringify(data) : null,
  };

  try {
    const response = await fetch(url, options);
    const responseData = await response.json();
    return { ok: response.ok, status: response.status, data: responseData };
  } catch (error) {
    console.error('API request error:', error);
    return { ok: false, status: 500, data: { message: 'An error occurred while processing your request.' } };
  }
}

// Login Component
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await sendRequest('users/login/', 'POST', { email, password }); // Removed hardcoded URL
      if (response.ok) {
        // Store tokens and user information
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        localStorage.setItem('is_doctor', response.data.is_doctor);
        localStorage.setItem('userInfo', JSON.stringify(response.data.user)); // Assuming you get user info in response
        navigate('/dashboard');
      } else {
        alert('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
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
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isDoctor, setIsDoctor] = useState(false);
  const navigate = useNavigate();

  // Load Google Sign-In script dynamically
  useEffect(() => {
    const loadGoogleSignInScript = () => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleSignIn;
      document.body.appendChild(script);
    };

    const initializeGoogleSignIn = () => {
      google.accounts.id.initialize({
        client_id: 'YOUR_CLIENT_ID.apps.googleusercontent.com', // Replace with your actual client ID
        callback: handleCredentialResponse,
      });

      google.accounts.id.renderButton(
        document.getElementById('buttonDiv'),
        { theme: 'outline', size: 'large' }
      );

      google.accounts.id.prompt();
    };

    const handleCredentialResponse = (response) => {
      const idToken = response.credential;
      sendRequest('users/google_auth/', 'POST', { idToken })
        .then(res => {
          if (res.ok) {
            localStorage.setItem('access_token', res.data.access);
            localStorage.setItem('refresh_token', res.data.refresh);
            localStorage.setItem('is_doctor', res.data.is_doctor);
            alert('Login successful!');
            navigate(res.data.is_doctor ? '/doctor_dashboard' : '/patient_dashboard');
          } else {
            alert('Error: ' + res.data.message);
          }
        })
        .catch(error => console.error('Error during sign-in:', error));
    };

    loadGoogleSignInScript();
  }, [navigate]);

  const handleSendOtp = async () => {
    try {
      const response = await sendRequest('users/send_otp/', 'POST', { email });
      if (response.ok) {
        setOtpSent(true);
        alert('OTP sent to your email.');
      } else {
        alert('Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.error('OTP send error:', error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const response = await sendRequest('users/register/', 'POST', {
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        otp,
        is_doctor: isDoctor
      });
      if (response.ok) {
        alert('Account created successfully. Please log in.');
        navigate('/login');
      } else {
        alert('Registration failed. Please check your information and try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="auth-form register-form">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
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
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <div className="checkbox-container">
          <input
            type="checkbox"
            id="is_doctor"
            checked={isDoctor}
            onChange={() => setIsDoctor(!isDoctor)}
          />
          <label htmlFor="is_doctor">I am a doctor</label>
        </div>
        <button type="submit" disabled={!otpSent}>Register</button>
      </form>

      <div className="google-btn" id="buttonDiv"></div>

      <div className="login-link">
        <p>Already have an account? <a href="/login">Log in</a></p>
      </div>
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
      const response = await sendRequest('users/profile/', 'GET');
      if (response.ok) {
        setProfile(response.data);
        setFirstName(response.data.first_name);
        setLastName(response.data.last_name);
      } else {
        alert('Failed to fetch profile. Please try again.');
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await sendRequest('users/profile/', 'PUT', {
        first_name: firstName,
        last_name: lastName,
      });
      if (response.ok) {
        alert('Profile updated successfully.');
        setEditing(false);
        fetchProfile();
      } else {
        alert('Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Profile update error:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('is_doctor');
    localStorage.removeItem('userInfo');
    navigate('/login'); // Redirect to login page
  };

  useEffect(() => {
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
      <button onClick={handleLogout} className="logout-button">Logout</button> {/* Logout button */}
    </div>
  );
};

export { Login, Register, UserProfile };
