
import React from 'react';
import { Navigate } from 'react-router-dom';

// Redirect from the old template index page to our new home page
const Index = () => {
  return <Navigate to="/" replace />;
};

export default Index;
