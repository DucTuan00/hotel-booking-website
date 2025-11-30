import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import AppRoutes from '@/routes/AppRoutes';
import ScrollToTop from '@/components/ScrollToTop';
import DeepLinkHandler from '@/components/DeepLinkHandler';

const App: React.FC = () => {
  return (
    <Router>
      <DeepLinkHandler />
      <ScrollToTop />
      <AppRoutes />
    </Router>
  );
};

export default App;