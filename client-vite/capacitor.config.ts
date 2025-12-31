import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ductuan.hotelboutique',
  appName: ' Hotel Boutique',
  webDir: 'dist',
  server: {
    androidScheme: 'http'
  },
  android: {
    allowMixedContent: true,
    backgroundColor: '#ffffff'
  },
  plugins: {
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#ffffff',
      overlaysWebView: false
    },
    App: {
      launchUrl: 'hotelboutique://'
    },
    GoogleAuth: {
      scopes: ['profile', 'email'],
      // Web Client ID from Google Cloud Console (NOT Android Client ID)
      serverClientId: process.env.VITE_GOOGLE_CLIENT_ID || '',
      forceCodeForRefreshToken: true
    }
  }
};

export default config;
