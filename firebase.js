import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import { getAuth } from
"https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import { getFirestore } from
"https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey:"AIzaSyC5TlYdXT6Y0keGZY_DVXPeE9Ru4NqhHzY",
  authDomain: "qcassino-227ab.firebaseapp.com",
  projectId: "qcassino-227ab"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

