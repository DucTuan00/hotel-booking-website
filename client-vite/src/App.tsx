import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import AppRoutes from '@/routes/AppRoutes';
import ScrollToTop from '@/components/ScrollToTop';

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <AppRoutes />
    </Router>
  );
};

export default App;