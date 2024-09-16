import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.projeto23.economize',
  appName: 'economize-023',
  webDir: 'build',
  androidClientId: '1060980321728-sk75uec3bca29iiigfau6doohgnc9bum.apps.googleusercontent.com',
  clientId: '1060980321728-sk75uec3bca29iiigfau6doohgnc9bum.apps.googleusercontent.com',
  plugins: {
     CapacitorHttp: {
        enabled: true,
     },
     GoogleAuth: {
       scopes: ["profile", "email"],
       androidClientId: "1060980321728-6pug209r5kbchm2nffvaunbq3uoluagb.apps.googleusercontent.com",
       serverClientId: "1060980321728-6pug209r5kbchm2nffvaunbq3uoluagb.apps.googleusercontent.com",
       clientId: "1060980321728-6pug209r5kbchm2nffvaunbq3uoluagb.apps.googleusercontent.com",
       forceCodeForRefreshToken: true
     }
   },
};

export default config;
