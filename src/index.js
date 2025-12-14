// Entry point - renders the React application
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// Get the root DOM element and render the application
const container = document.getElementById('root');
const root = createRoot(container);
// BrowserRouter enables routing throughout the application
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
