import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyC5TlYdXT6Y0keGZY_DVXPeE9Ru4NqhHzY",
  authDomain: "qcassino-227ab.firebaseapp.com",
  projectId: "qcassino-227ab"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

updateDoc(doc(db, "users", uid), {
  credits: increment(qtd)
});

onAuthStateChanged(auth, async user => {
  if (!user) return location.href = "index.html";

  const snap = await getDoc(doc(db, "users", user.uid));
  document.getElementById("saldo").innerText =
    snap.data().credits + " créditos";
});
