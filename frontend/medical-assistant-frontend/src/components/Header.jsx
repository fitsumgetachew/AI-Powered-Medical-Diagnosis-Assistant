import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // Importing CSS for styling

function Header() {
  return (
    <header>
      <nav className="navbar">
        <div className="logo">MediAI</div>
        <div className="nav-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/medical-image">Medical Image Analysis</Link>
          <Link to="/symptom-analysis">Symptom Analysis</Link>
          <Link to="/prescription">Prescription</Link>
          <Link to="/drug-management">Drug Management</Link> {/* New Drug Management link */}
        </div>
        <div className="user-actions">
          <Link to="/profile">Profile</Link>
        </div>
      </nav>
    </header>
  );
}

export default Header;
