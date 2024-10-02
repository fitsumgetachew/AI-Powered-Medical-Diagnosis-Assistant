import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './PrivateLayout.css';

const PrivateLayout = ({ children }) => {
  return (
    <div className="private-layout">
      <Header />
      <main className="main-content">{children}</main>
      <Footer />
    </div>
  );
};

export default PrivateLayout;