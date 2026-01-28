import { auth, db } from "./firebase.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  doc, getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const saldoEl = document.getElementById("saldo");
const sairBtn = document.getElementById("sair");

onAuthStateChanged(auth, async user => {
  if (!user) return location.href = "index.html";

  const snap = await getDoc(doc(db, "usuarios", user.uid));
  saldoEl.innerText = snap.data().credito;
});

sairBtn.onclick = async () => {
  await signOut(auth);
  location.href = "index.html";
};
