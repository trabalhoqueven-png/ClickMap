import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDxY7bW7ywWgxPRfosKNSl8_2gyzGRQ3eY",
  authDomain: "clickmap-ae0ca.firebaseapp.com",
  projectId: "clickmap-ae0ca"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

onAuthStateChanged(auth, async user => {
  if (!user) return location.href = "index.html";

  const snap = await getDoc(doc(db, "users", user.uid));
  const credits = snap.exists() ? (snap.data().credits ?? 0) : 0;

  document.getElementById("saldo").innerText =
    credits + " créditos";
});

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btnSair").addEventListener("click", async () => {
    if (!confirm("Deseja sair da conta?")) return;
    await signOut(auth);
    location.href = "index.html";
  });
});

});




