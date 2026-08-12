/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly VITE_PROD_API_KEY: string;
  readonly VITE_PROD_AUTH_DOMAIN: string;
  readonly VITE_PROD_DATABASE_URL: string;
  readonly VITE_PROD_PROJECT_ID: string;
  readonly VITE_PROD_STORAGE_BUCKET: string;
  readonly VITE_PROD_MESSAGING_SENDER_ID: string;
  readonly VITE_PROD_APP_ID: string;
  readonly VITE_STAGING_API_KEY: string;
  readonly VITE_STAGING_AUTH_DOMAIN: string;
  readonly VITE_STAGING_DATABASE_URL: string;
  readonly VITE_STAGING_PROJECT_ID: string;
  readonly VITE_STAGING_STORAGE_BUCKET: string;
  readonly VITE_STAGING_MESSAGING_SENDER_ID: string;
  readonly VITE_STAGING_APP_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
