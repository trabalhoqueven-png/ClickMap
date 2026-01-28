import { auth, db } from "./firebase.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  doc, getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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






