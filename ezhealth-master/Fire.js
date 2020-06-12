import * as firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyCVVsbDEY13J7p8O5w6D_tdOtuTrLmxNoo",
  authDomain: "ez-health.firebaseapp.com",
  databaseURL: "https://ez-health.firebaseio.com",
  projectId: "ez-health",
  storageBucket: "ez-health.appspot.com",
  messagingSenderId: "405548770764",
  appId: "1:405548770764:web:b7b1e9b71190ac4a0c6969",
  measurementId: "G-SH60RG8GW0"
};
export default firebaseApp = firebase.initializeApp(firebaseConfig, 'Ez Health');