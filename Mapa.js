import { auth, db } from "./firebase.js";
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

onAuthStateChanged(auth, async user => {
  if (!user) {
    location.replace("index.html");
    return;
  }

  const snap = await getDoc(doc(db, "usuarios", user.uid));
  const creditos = snap.exists() ? (snap.data().credito ?? 0) : 0;

  document.getElementById("saldo").innerText =
    creditos + " créditos";
});

document.getElementById("btnSair").onclick = async () => {
  if (!confirm("Deseja sair da conta?")) return;
  await signOut(auth);
  location.replace("index.html");
};

});





