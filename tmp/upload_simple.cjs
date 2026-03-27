const { initializeApp } = require('firebase/app');
const { getDatabase, ref, set } = require('firebase/database');

const firebaseConfig = {
    apiKey: "AIzaSyApXd60ysu-n_8bcPU9x8ljDeKkLb-_jEA",
    authDomain: "wepp-es.firebaseapp.com",
    projectId: "wepp-es",
    storageBucket: "wepp-es.firebasestorage.app",
    messagingSenderId: "595894268262",
    appId: "1:595894268262:web:8598ea502ec2912c8e58a7",
    measurementId: "G-8Y02VS7DVC",
    databaseURL: "https://wepp-es-default-rtdb.europe-west1.firebasedatabase.app"
};

const PRODUCTS = [
    {
        id: '2010',
        name: 'WEPP 2010 Motor-System-Reiniger',
        category: 'Motor y Transmisión',
        description: 'Limpiador de alto rendimiento para el sistema del motor. Elimina depósitos y mejora el rendimiento.',
        price: 28.50,
        image: 'https://www.wepp.de/wepp/CustomUpload/374O357O340O370O356O369O350O342O324O335O335O350O326O364O353O327O/2010_7.jpg',
        features: ['Deposit Control Technology', 'Limpieza profunda', 'Mejora la compresión']
    }
];

async function upload() {
    try {
        const app = initializeApp(firebaseConfig);
        const db = getDatabase(app);
        console.log("Subiendo...");
        await set(ref(db, 'products'), PRODUCTS);
        console.log("Éxito!");
    } catch (e) {
        console.error("ERROR:", e);
    }
    process.exit(0);
}

upload();
