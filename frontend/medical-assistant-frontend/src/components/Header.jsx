import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/medical-image", label: "Medical Image Analysis" },
    { to: "/symptom-analysis", label: "Symptom Analysis" },
    { to: "/prescription", label: "Prescription" },
    { to: "/drug-management", label: "Drug Management" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg">
      <div className="max-w-7xl mx-auto">
        <nav className="flex items-center justify-between p-4 lg:px-8" aria-label="Global">
          {/* Logo */}
          <div className="flex lg:flex-1">
            <Link to="/" className="flex items-center gap-x-2">
              <span className="text-2xl font-bold text-white">
                Medi<span className="text-blue-200">AI</span>
              </span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2.5 text-white hover:bg-blue-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M3 12h18M3 6h18M3 18h18"}
                />
              </svg>
            </button>
          </div>

          {/* Desktop navigation */}
          <div className="hidden lg:flex lg:gap-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-semibold leading-6 text-white hover:text-blue-200 px-3 py-2 rounded-md transition duration-150 ease-in-out hover:bg-blue-700"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Profile link - desktop */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <Link
              to="/profile"
              className="flex items-center gap-x-2 text-sm font-semibold leading-6 text-white hover:text-blue-200"
            >
              <span className="px-3 py-2 rounded-full bg-blue-700 hover:bg-blue-600 transition duration-150 ease-in-out">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </span>
              <span>Profile</span>
            </Link>
          </div>
        </nav>

        {/* Mobile menu, show/hide based on menu state */}
        <div className={`lg:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
          <div className="space-y-1 px-4 pb-3 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-blue-700 hover:text-blue-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/profile"
              className="flex items-center gap-x-2 rounded-md px-3 py-2 text-base font-medium text-white hover:bg-blue-700 hover:text-blue-200"
              onClick={() => setIsMenuOpen(false)}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Profile
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;