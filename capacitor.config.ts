import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'million-chat',
  // webDir: 'public',
  server: {
    url: 'https://your-nextjs-app.com',
    androidScheme: 'https'
  }
};

export default config;
