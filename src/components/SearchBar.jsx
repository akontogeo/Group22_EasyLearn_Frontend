import React, { useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

/**
 * SearchBar - Search input with debounced search functionality
 * Provides real-time course search with 300ms delay to avoid excessive API calls
 * Automatically updates URL parameters and synchronizes with browser navigation
 * @returns {JSX.Element} Search form with input field and submit button
 */
export default function SearchBar() {
  // State for managing the search input value
  const [searchKeyword, setSearchKeyword] = useState('');
  // Navigation hook for programmatic routing
  const navigate = useNavigate();
  // URL search parameters for reading current query string
  const [searchParams] = useSearchParams();
  // Timer reference for implementing search debouncing
  const debounceTimer = useRef(null);

  // Initialize search keyword from URL params on component mount
  React.useEffect(() => {
    const keyword = searchParams.get('keyword');
    // Decode URI component to handle special characters properly
    if (keyword) {
      setSearchKeyword(decodeURIComponent(keyword));
    }
  }, [searchParams]);

  // Navigate to courses page with search term or clear filters
  const performSearch = (searchTerm) => {
    // Remove leading/trailing whitespace from search term
    const trimmed = searchTerm.trim();
    // Navigate with encoded search parameter or clear search
    if (trimmed) {
      navigate(`/courses?keyword=${encodeURIComponent(trimmed)}`);
    } else {
      // Return to courses page without search filters
      navigate('/courses');
    }
  };

  // Debounced search - waits 300ms after user stops typing
  const handleSearchChange = (e) => {
    // Update input field value immediately for responsive UI
    const newValue = e.target.value;
    setSearchKeyword(newValue);

    // Clear any existing timer to reset the debounce delay
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new timer to trigger search after 300ms of inactivity
    debounceTimer.current = setTimeout(() => {
      performSearch(newValue);
    }, 300);
  };

  // Immediate search on form submit (Enter key or button click)
  const handleSearch = (e) => {
    // Prevent form from submitting and refreshing page
    e.preventDefault();
    // Cancel any pending debounced search
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    performSearch(searchKeyword);
  };

  // Clear search and return to courses page
  const handleSearchClear = () => {
    setSearchKeyword('');
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    navigate('/courses');
  };

  return (
    <form
      onSubmit={handleSearch}
      data-cy="search-form"
      style={{
        flex: 1,
        maxWidth: '600px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      <div style={{
        flex: 1,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
      }}>
        <input
          data-cy="search-input"
          type="text"
          value={searchKeyword}
          onChange={handleSearchChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearch(e);
          }}
          placeholder="What do you want to learn today?"
          style={{
            width: '100%',
            padding: '10px 40px 10px 16px',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            outline: 'none',
            background: 'white',
          }}
        />
        {searchKeyword && (
          <button
            type="button"
            onClick={handleSearchClear}
            style={{
              position: 'absolute',
              right: '40px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              color: '#999',
              fontSize: '18px',
              lineHeight: 1,
            }}
            title="Clear search"
          >
            ×
          </button>
        )}
        <button
          type="submit"
          style={{
            position: 'absolute',
            right: '8px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </button>
      </div>
    </form>
  );
}