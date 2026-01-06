import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyAcA7OgB2HYUFKYb7hthdGS86kLMn1ASBY",
  authDomain: "clickmap-483501.firebaseapp.com",
  projectId: "clickmap-483501",
  storageBucket: "clickmap-483501.firebasestorage.app",
  messagingSenderId: "879441067528",
  appId: "1:879441067528:web:426f7fe43a0464acd59bbd"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const storage = getStorage(app);
