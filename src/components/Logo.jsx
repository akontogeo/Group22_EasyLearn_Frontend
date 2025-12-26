import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Logo - EasyLearn logo and branding
 */
export default function Logo() {
  return (
    <Link
      to="/"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        textDecoration: 'none',
        color: '#2ea67a',
        fontWeight: 700,
        fontSize: '18px',
        whiteSpace: 'nowrap',
      }}
    >
      <img
        src="/Logo.png"
        alt="EasyLearn"
        style={{ width: 40, height: 40, objectFit: 'contain' }}
      />
      EasyLearn
    </Link>
  );
}