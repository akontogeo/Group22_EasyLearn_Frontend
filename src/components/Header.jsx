import React from 'react';
import Logo from './Logo';
import SearchBar from './SearchBar';
import UserNavigation from './UserNavigation';

/**
 * Header - Main navigation bar with search, logo, and user navigation
 */
export default function Header() {
  return (
    <header
      style={{
        background: '#b8e6d5',
        padding: '16px 32px',
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
      }}
    >
      <Logo />
      <SearchBar />
      <UserNavigation />
    </header>
  );
}
