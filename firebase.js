import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyC5TlYdXT6Y0keGZY_DVXPeE9Ru4NqhHzY",
  authDomain: "qcassino-227ab.firebaseapp.com",
  projectId: "qcassino-227ab",
  storageBucket: "qcassino-227ab.firebasestorage.app",
  messagingSenderId: "575212961704",
  appId: "1:575212961704:web:49ff445136e10f025fa79d"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const storage = getStorage(app);

