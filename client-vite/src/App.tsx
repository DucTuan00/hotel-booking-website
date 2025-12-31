import { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import AppRoutes from '@/routes/AppRoutes';
import ScrollToTop from '@/components/ScrollToTop';
import DeepLinkHandler from '@/components/DeepLinkHandler';
import { initGoogleAuth } from '@/services/auth/googleAuthService';

const App: React.FC = () => {
  // Initialize Google Auth for mobile native sign-in
  useEffect(() => {
    initGoogleAuth();
  }, []);

  return (
    <Router>
      <DeepLinkHandler />
      <ScrollToTop />
      <AppRoutes />
    </Router>
  );
};

export default App;