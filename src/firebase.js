import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

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

const config = import.meta.env.PROD ? prodConfig : devConfig;

const app = initializeApp(config);

export const auth = getAuth(app);
export const db = getDatabase(app);
export default app;