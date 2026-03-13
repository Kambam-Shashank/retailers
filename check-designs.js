// Quick Firestore diagnostic — run with: node check-designs.js
// Checks if designs exist for a retailer ID in Firebase

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, query, where, getDocs } = require('firebase/firestore');

const firebaseConfig = {
    apiKey: "AIzaSyBK0-9ktTVvlAb7E4s1XHAo7kpnrqvsJIw",
    authDomain: "karatpay-retailers.firebaseapp.com",
    projectId: "karatpay-retailers",
    storageBucket: "karatpay-retailers.firebasestorage.app",
    messagingSenderId: "157158381492",
    appId: "1:157158381492:web:d9d4cfb4e8a7907a43c4e1",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkDesigns(retailerId) {
    console.log(`\n=== Checking designs for retailerId: "${retailerId}" ===\n`);
    try {
        const q = query(
            collection(db, 'designs'),
            where('retailerId', '==', retailerId)
        );
        const snap = await getDocs(q);
        console.log(`Found ${snap.size} design(s)`);
        snap.docs.forEach(doc => {
            const d = doc.data();
            console.log(` - ID: ${doc.id} | name: ${d.name} | retailerId: "${d.retailerId}"`);
        });
    } catch (err) {
        console.error('Query failed:', err.message || err);
    }
}

async function listAllDesigns() {
    console.log('\n=== Listing ALL designs in collection ===\n');
    try {
        const snap = await getDocs(collection(db, 'designs'));
        console.log(`Total designs in collection: ${snap.size}`);
        snap.docs.forEach(doc => {
            const d = doc.data();
            console.log(` - ID: ${doc.id} | name: ${d.name} | retailerId: "${d.retailerId}"`);
        });
    } catch (err) {
        console.error('List failed:', err.message || err);
    }
}

(async () => {
    // Check the specific retailer from the screenshot
    await checkDesigns('qq9JTCMCRPYSAGzpdD7WSnGe59v2');
    await listAllDesigns();
    process.exit(0);
})();
