import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyA13YWJu9WAgRU4R-j3tZC3H3azfu_Dqnw",
    authDomain: "expenses-tracker-11e62.firebaseapp.com",
    databaseURL: "https://expenses-tracker-11e62.firebaseio.com",
    projectId: "expenses-tracker-11e62",
    storageBucket: "expenses-tracker-11e62.appspot.com",
    messagingSenderId: "107052167269"
};
firebase.initializeApp(config);

export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export default firebase;