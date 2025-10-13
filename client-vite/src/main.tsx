import { createRoot } from 'react-dom/client';
import { ConfigProvider } from 'antd';
import '@/index.css';
import App from '@/App.tsx';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'antd/dist/reset.css';
import theme from '@/config/theme';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';

// Configure Status Bar for mobile app
const initializeApp = async () => {
  if (Capacitor.isNativePlatform()) {
    document.body.classList.add('capacitor');
    
    try {
      await StatusBar.setStyle({ style: Style.Light });
      
      await StatusBar.setBackgroundColor({ color: '#ffffff' });
      
      await StatusBar.setOverlaysWebView({ overlay: false });
    } catch (error) {
      console.warn('Status bar configuration failed:', error);
    }
  }
};

initializeApp();

createRoot(document.getElementById('root')!).render(
  <ConfigProvider theme={theme}>
    <App />
  </ConfigProvider>,
);