import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Edit2, LogOut, Award, FileText, Clock } from 'lucide-react';
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

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    otp: '',
    isDoctor: false,
    specialization: '',
    licenseNumber: '',
    yearsOfExperience: '',
  });
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSendOtp = async () => {
    try {
      const response = await sendRequest('users/send_otp/', 'POST', { email: formData.email });
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
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    const registrationData = {
      email: formData.email,
      password: formData.password,
      confirm_password:formData.confirmPassword,
      first_name: formData.firstName,
      last_name: formData.lastName,
      otp: formData.otp,
      is_doctor: formData.isDoctor
    };

    if (formData.isDoctor) {
      registrationData.specialization = formData.specialization;
      registrationData.license_number = formData.licenseNumber;
      registrationData.years_of_experience = parseInt(formData.yearsOfExperience);
    }

    try {
      const response = await sendRequest('users/register/', 'POST', registrationData);
      if (response.ok) {
        alert('Account created successfully. Please log in.');
        navigate('/login');
      } else {
        alert(response.data.message || 'Registration failed. Please check your information and try again.');
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
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleInputChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        {!otpSent ? (
          <button type="button" onClick={handleSendOtp}>Send OTP</button>
        ) : (
          <input
            type="text"
            name="otp"
            placeholder="OTP"
            value={formData.otp}
            onChange={handleInputChange}
            required
          />
        )}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          required
        />
        <div className="checkbox-container">
          <input
            type="checkbox"
            id="is_doctor"
            name="isDoctor"
            checked={formData.isDoctor}
            onChange={handleInputChange}
          />
          <label htmlFor="is_doctor">I am a doctor</label>
        </div>

        {formData.isDoctor && (
          <div className="doctor-fields">
            <input
              type="text"
              name="specialization"
              placeholder="Specialization"
              value={formData.specialization}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="licenseNumber"
              placeholder="License Number"
              value={formData.licenseNumber}
              onChange={handleInputChange}
              required
            />
            <input
              type="number"
              name="yearsOfExperience"
              placeholder="Years of Experience"
              value={formData.yearsOfExperience}
              onChange={handleInputChange}
              required
              min="0"
            />
          </div>
        )}

        <button type="submit" disabled={!otpSent}>Register</button>
      </form>

      <div className="login-link">
        <p>Already have an account? <a href="/login">Log in</a></p>
      </div>
    </div>
  );
};


const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    specialization: '',
    licenseNumber: '',
    yearsOfExperience: '',
  });
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const response = await sendRequest('users/profile/', 'GET');
      if (response.ok) {
        setProfile(response.data);
        setFormData({
          firstName: response.data.first_name,
          lastName: response.data.last_name,
          specialization: response.data.doctor_profile?.specialization || '',
          licenseNumber: response.data.doctor_profile?.license_number || '',
          yearsOfExperience: response.data.doctor_profile?.years_of_experience || '',
        });
      } else {
        alert('Failed to fetch profile. Please try again.');
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const updateData = {
      first_name: formData.firstName,
      last_name: formData.lastName,
    };

    if (profile.doctor_profile) {
      updateData.doctor_profile = {
        specialization: formData.specialization,
        license_number: formData.licenseNumber,
        years_of_experience: parseInt(formData.yearsOfExperience),
      };
    }

    try {
      const response = await sendRequest('users/profile/', 'PUT', updateData);
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
    navigate('/');
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!profile) return (
    <div className="profile-loading">
      <div className="loading-spinner"></div>
      <p>Loading profile...</p>
    </div>
  );

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          {profile.profile_picture ? (
            <img src={profile.profile_picture} alt="Profile" />
          ) : (
            <User size={40} />
          )}
        </div>
        <h1>{profile.first_name} {profile.last_name}</h1>
        <p className="email">{profile.email}</p>
      </div>

      {editing ? (
        <form onSubmit={handleUpdateProfile} className="edit-form">
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />
          </div>

          {profile.doctor_profile && (
            <>
              <div className="form-group">
                <label>Specialization</label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>License Number</label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Years of Experience</label>
                <input
                  type="number"
                  name="yearsOfExperience"
                  value={formData.yearsOfExperience}
                  onChange={handleInputChange}
                  required
                  min="0"
                />
              </div>
            </>
          )}

          <div className="button-group">
            <button type="submit" className="save-button">Save Changes</button>
            <button type="button" className="cancel-button" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </form>
      ) : (
        <div className="profile-content">
          <div className="profile-section">
            <h2>Personal Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <strong>First Name:</strong>
                <span>{profile.first_name}</span>
              </div>
              <div className="info-item">
                <strong>Last Name:</strong>
                <span>{profile.last_name}</span>
              </div>
              <div className="info-item">
                <strong>Email:</strong>
                <span>{profile.email}</span>
              </div>
            </div>
          </div>

          {profile.doctor_profile && (
            <div className="profile-section doctor-info">
              <h2>Doctor Information</h2>
              <div className="info-grid">
                <div className="info-item">
                  <Award className="icon" />
                  <div>
                    <strong>Specialization</strong>
                    <span>{profile.doctor_profile.specialization}</span>
                  </div>
                </div>
                <div className="info-item">
                  <FileText className="icon" />
                  <div>
                    <strong>License Number</strong>
                    <span>{profile.doctor_profile.license_number}</span>
                  </div>
                </div>
                <div className="info-item">
                  <Clock className="icon" />
                  <div>
                    <strong>Years of Experience</strong>
                    <span>{profile.doctor_profile.years_of_experience}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="button-group">
            <button onClick={() => setEditing(true)} className="edit-button">
              <Edit2 size={16} />
              Edit Profile
            </button>
            <button onClick={handleLogout} className="logout-button">
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export { Login, Register, UserProfile };
