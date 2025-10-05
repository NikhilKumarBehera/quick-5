import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.quick5.brain',
  appName: 'Quick 5',
  webDir: 'www',
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000, // 3 seconds
      launchAutoHide: true,
      backgroundColor: '#ffffff', // Match your splash background
      androidScaleType: 'CENTER_CROP', // Fit correctly on Android
      showSpinner: false,
      androidSpinnerStyle: 'large',
      iosSpinnerStyle: 'small',
      spinnerColor: '#999999',
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#9333ea',
      overlaysWebView: true,
    },
  },
  ios: {
    contentInset: 'never',
    allowsLinkPreview: false,
    scrollEnabled: false,
  },
};

export default config;
