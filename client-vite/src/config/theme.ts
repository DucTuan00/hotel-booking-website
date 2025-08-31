import { ThemeConfig } from 'antd';

const theme: ThemeConfig = {
  token: {
    // Primary colors
    colorPrimary: '#667eea',
    colorPrimaryHover: '#764ba2',
    
    // Error/Danger colors
    colorError: '#ff4d4f',
    colorErrorHover: '#ff7875',
    
    // Success colors
    colorSuccess: '#52c41a',
    colorSuccessHover: '#73d13d',
    
    // Background colors
    colorBgContainer: '#ffffff',
    colorBgLayout: '#f5f5f5',
    
    // Border
    borderRadius: 8,
    colorBorder: '#f0f0f0',
    
    // Typography
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    fontSize: 14,
    
    // Spacing
    paddingLG: 24,
    paddingMD: 16,
    paddingSM: 12,
    
    // Shadow
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
    boxShadowSecondary: '0 4px 12px rgba(0, 0, 0, 0.15)',
  },
  components: {
    Layout: {
      siderBg: '#ffffff',
      triggerBg: '#fafafa',
      triggerColor: '#667eea',
    },
    Menu: {
      itemBg: 'transparent',
      itemSelectedBg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      itemSelectedColor: '#ffffff',
      itemHoverBg: 'rgba(102, 126, 234, 0.1)',
      itemHoverColor: '#667eea',
      iconSize: 16,
      itemHeight: 48,
      itemMarginInline: 8,
      itemBorderRadius: 8,
    },
    Button: {
      borderRadius: 8,
      fontWeight: 500,
    },
    Notification: {
      zIndexPopup: 2000,
    },
  },
};

export default theme;
