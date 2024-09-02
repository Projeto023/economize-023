import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.projeto23.economize',
  appName: 'economize-023',
  webDir: 'build',
  plugins: {
     CapacitorHttp: {
        enabled: true,
     },
   },
};

export default config;
