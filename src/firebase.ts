import { initializeApp } from "firebase/app";
import { browserLocalPersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const env = import.meta.env;

const prodConfig = {
  apiKey: env.VITE_PROD_API_KEY,
  authDomain: env.VITE_PROD_AUTH_DOMAIN,
  databaseURL: env.VITE_PROD_DATABASE_URL,
  projectId: env.VITE_PROD_PROJECT_ID,
  storageBucket: env.VITE_PROD_STORAGE_BUCKET,
  messagingSenderId: env.VITE_PROD_MESSAGING_SENDER_ID,
  appId: env.VITE_PROD_APP_ID,
};

const devConfig = {
  apiKey: env.VITE_STAGING_API_KEY,
  authDomain: env.VITE_STAGING_AUTH_DOMAIN,
  databaseURL: env.VITE_STAGING_DATABASE_URL,
  projectId: env.VITE_STAGING_PROJECT_ID,
  storageBucket: env.VITE_STAGING_STORAGE_BUCKET,
  messagingSenderId: env.VITE_STAGING_MESSAGING_SENDER_ID,
  appId: env.VITE_STAGING_APP_ID,
};

// process.env.CONTEXT is set by Netlify to indicate the context of the build (production, deploy-preview, branch-deploy)
const shouldDeployProd = import.meta.env.PROD && import.meta.env.VITE_NETLIFY_CONTEXT === 'production';
const config = shouldDeployProd ? prodConfig : devConfig;

const app = initializeApp(config);

// Default indexedDBLocalPersistence throws "Database is closing/hidden" when
// signInWithPopup blurs the tab mid-write (firebase-js-sdk#6935); localStorage
// persistence doesn't have that race.
export const auth = initializeAuth(app, {
  persistence: browserLocalPersistence,
});
export const db = getFirestore(app);

export default app;
