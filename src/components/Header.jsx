import { useState } from 'react';
import './Header.css';

function Header() {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="header">
      <div className="header-left">
        <div className="logo">
          <svg className="logo-icon" width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z" fill="#2D3748"/>
          </svg>
          <span className="logo-text">LMS Admin</span>
        </div>
      </div>
      <nav className="header-center">
        <a href="#" className="nav-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z"/>
          </svg>
          <span>Dashboard</span>
        </a>
        <a href="#" className="nav-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/>
          </svg>
          <span>Tests</span>
        </a>
        <a href="#" className="nav-item active">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/>
          </svg>
          <span>Question Banks</span>
        </a>
        <a href="#" className="nav-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
          </svg>
          <span>Classes</span>
        </a>
        <a href="#" className="nav-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
          <span>Teachers</span>
        </a>
      </nav>
      <div className="header-right">
        <div className="admin-menu" onClick={() => setShowDropdown(!showDropdown)}>
          <div className="admin-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
          <span>Admin</span>
          {showDropdown && (
            <div className="admin-dropdown">
              <a href="#">My Profile</a>
              <a href="#">Account Settings</a>
              <a href="#">Dashboard</a>
              <a href="#">My Courses</a>
              <hr />
              <a href="#">Help Center</a>
              <a href="#" className="logout">Logout</a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
