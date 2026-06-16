import { initializeApp } from 'firebase/app';
import { isSupported, getAnalytics, type Analytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: 'AIzaSyAdJrI-hhjrHj_4NPUVpDIaH1k4_zliPrk',
  authDomain: 'wepp-85e38.firebaseapp.com',
  projectId: 'wepp-85e38',
  storageBucket: 'wepp-85e38.firebasestorage.app',
  messagingSenderId: '1063038586013',
  appId: '1:1063038586013:web:f2f7a60ff9c45d81cb9874',
  measurementId: 'G-76SPCDWG39',
};

export const firebaseApp = initializeApp(firebaseConfig);

export let analytics: Analytics | undefined;

if (typeof window !== 'undefined') {
  isSupported()
    .then((supported) => {
      if (supported) analytics = getAnalytics(firebaseApp);
    })
    .catch(() => {
      // Analytics no soportado (p. ej. bloqueado por el navegador) — se ignora.
    });
}
