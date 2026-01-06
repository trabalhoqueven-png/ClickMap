import { auth, db } from "./firebase.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

onAuthStateChanged(auth, async user => {
  if (!user) return location.href = "index.html";

  const snap = await getDoc(doc(db, "usuarios", user.uid));

  if (!snap.exists()) {
    alert("Usuário sem crédito!");
    return;
  }

  document.getElementById("credito").innerText =
    "Créditos: " + snap.data().credito;
});

window.logout = async () => {
  await signOut(auth);
  location.href = "index.html";
};
