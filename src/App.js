// Main App component - wraps the entire application with authentication context
import React from 'react';
import AppRouter from './router/AppRouter';
import { AuthProvider } from './context/AuthContext';

function App(){
  return (
    // AuthProvider gives all child components access to authentication state
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
