import { createRoot } from 'react-dom/client';
import { ConfigProvider } from 'antd';
import '@/index.css';
import App from '@/App.tsx';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'antd/dist/reset.css';
import theme from '@/config/theme';

createRoot(document.getElementById('root')!).render(
  <ConfigProvider theme={theme}>
    <App />
  </ConfigProvider>,
);