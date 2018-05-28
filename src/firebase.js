import firebase from 'firebase';

const prodConfig = {
    apiKey: "AIzaSyA13YWJu9WAgRU4R-j3tZC3H3azfu_Dqnw",
    authDomain: "expenses-tracker-11e62.firebaseapp.com",
    databaseURL: "https://expenses-tracker-11e62.firebaseio.com",
    projectId: "expenses-tracker-11e62",
    storageBucket: "expenses-tracker-11e62.appspot.com",
    messagingSenderId: "107052167269"
};

var devConfig = {
    apiKey: "AIzaSyCzOE9yP4_3Q6qRK3KlM_-yq8dWkPx7ZyI",
    authDomain: "expenses-tracker-staging.firebaseapp.com",
    databaseURL: "https://expenses-tracker-staging.firebaseio.com",
    projectId: "expenses-tracker-staging",
    storageBucket: "expenses-tracker-staging.appspot.com",
    messagingSenderId: "402057216109"
};

const config = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;

firebase.initializeApp(config);

export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export default firebase;