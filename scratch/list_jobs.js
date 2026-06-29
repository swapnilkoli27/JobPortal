import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDtE4Tfx2T7V2yR-eNrXOPwkq52-_Yy4Do",
  authDomain: "jobportal-2db7b.firebaseapp.com",
  projectId: "jobportal-2db7b",
  storageBucket: "jobportal-2db7b.firebasestorage.app",
  messagingSenderId: "200131552686",
  appId: "1:200131552686:web:2ee1b54b1f9895f50ad43f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

try {
  const snap = await getDocs(collection(db, 'jobs'));
  console.log('Total jobs:', snap.size);
  snap.docs.forEach(d => {
    const data = d.data();
    console.log(`ID: ${d.id} | Title: ${data.title} | Status: ${data.status} | PostedAt: ${data.postedAt ? (data.postedAt.toDate ? data.postedAt.toDate().toISOString() : data.postedAt) : 'N/A'}`);
  });
} catch (e) {
  console.error('Error fetching jobs:', e);
}
