import React from 'react';
import { Link } from 'react-router-dom';

const BackButton = () => {
  return (
    <div style={{ marginTop: '20px' }}>
      <Link to="/">
        <button style={{ padding: '10px 20px', fontSize: '1rem' }}>← Back to Home</button>
      </Link>
    </div>
  );
};

export default BackButton;
