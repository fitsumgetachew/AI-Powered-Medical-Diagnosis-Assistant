import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const PrivateLayout = ({ children }) => {
  return (
    <div className="private-layout">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default PrivateLayout;