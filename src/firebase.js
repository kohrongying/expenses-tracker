import firebase from 'firebase';

const env = process.env
const prodConfig = {
    apiKey: env.PROD_API_KEY,
    authDomain: env.PROD_AUTH_DOMAIN,
    databaseURL: env.PROD_DATABASE_URL,
    projectId: env.PROD_PROJECT_ID,
    storageBucket: env.PROD_STORAGE_BUCKET,
    messagingSenderId: env.PROD_MESSAGING_SENDER_ID
};

var devConfig = {
    apiKey: env.REACT_APP_STAGING_API_KEY,
    authDomain: env.REACT_APP_STAGING_AUTH_DOMAIN,
    databaseURL: env.REACT_APP_STAGING_DATABASE_URL,
    projectId: env.REACT_APP_STAGING_PROJECT_ID,
    storageBucket: env.REACT_APP_STAGING_STORAGE_BUCKET,
    messagingSenderId: env.REACT_APP_STAGING_MESSAGING_SENDER_ID
};

const config = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;

firebase.initializeApp(config);

export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export default firebase;