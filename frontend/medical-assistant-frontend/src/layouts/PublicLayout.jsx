import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const PublicLayout = ({ children }) => {
  return (
    <div className="public-layout">
      <main>{children}</main>
    </div>
  );
};

export default PublicLayout;