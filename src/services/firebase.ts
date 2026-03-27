import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyApXd60ysu-n_8bcPU9x8ljDeKkLb-_jEA",
    authDomain: "wepp-es.firebaseapp.com",
    projectId: "wepp-es",
    storageBucket: "wepp-es.firebasestorage.app",
    messagingSenderId: "595894268262",
    appId: "1:595894268262:web:8598ea502ec2912c8e58a7",
    measurementId: "G-8Y02VS7DVC",
    databaseURL: "https://wepp-es-default-rtdb.europe-west1.firebasedatabase.app" // Probable default URL for Europe regions
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
