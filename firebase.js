import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCai7P5axNyYt2g9x9wqsU7DaA_tNZ3Pnc",
  authDomain: "casa-d5eae.appspot.com",
  projectId: "casa-d5eae",
  storageBucket: "casa-d5eae.appspot.com",
  messagingSenderId: "295692575488",
  appId: "1:295692575488:web:8a3446d5a58a5e720b89e5"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);