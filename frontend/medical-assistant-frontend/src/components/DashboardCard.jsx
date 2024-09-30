import React from 'react';
import { Link } from 'react-router-dom';

function DashboardCard({ title, items, itemType, ctaLink, ctaText }) {
  return (
    <div className="dashboard-card">
      <h2>{title}</h2>
      {items.map((item, index) => (
        <div key={index} className="history-item">
          <p><strong>Date:</strong> {item.date}</p>
          {itemType === 'image' && (
            <>
              <p><strong>Type:</strong> {item.type}</p>
              <p><strong>Result:</strong> {item.result}</p>
            </>
          )}
          {itemType === 'symptom' && (
            <>
              <p><strong>Symptoms:</strong> {item.symptoms}</p>
              <p><strong>Suggested Condition:</strong> {item.condition}</p>
            </>
          )}
          {itemType === 'prescription' && (
            <>
              <p><strong>Medication:</strong> {item.medication}</p>
              <p><strong>Dosage:</strong> {item.dosage}</p>
            </>
          )}
        </div>
      ))}
      <Link to={ctaLink} className="cta-button">{ctaText}</Link>
    </div>
  );
}

export default DashboardCard;