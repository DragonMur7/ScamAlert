// src/config/firebaseConfig.jsx
import { firebase } from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore'

const firebaseConfig = {
    apiKey: 'AIzaSyBGKzfVeaQS6Npdlt1cE9SO-yDVykjF9qc',
    authDomain: 'scamalert-3e1dc.firebaseapp.com',
    projectId: 'scamalert-3e1dc',
    storageBucket: 'scamalert-3e1dc.appspot.com',
    messagingSenderId: '78989433990',
    appId: '1:78989433990:android:69d299582ee9058c1ac507',
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}


export { firebase, auth, firestore };
