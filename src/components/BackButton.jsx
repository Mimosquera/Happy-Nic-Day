import React from 'react';
import { Link } from 'react-router-dom';

const BackButton = () => {
  return (
    <div className="back-button-wrap">
      <Link to="/">
        <button className="btn-home">← Back</button>
      </Link>
    </div>
  );
};

export default BackButton;
