import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const saldoEl = document.getElementById("saldo");
const sairBtn = document.getElementById("sair");

onAuthStateChanged(auth, async user => {
  if (!user) {
    location.replace("index.html");
    return;
  }

  const snap = await getDoc(doc(db, "usuarios", user.uid));

  if (!snap.exists()) {
    saldoEl.innerText = "0";
    return;
  }

  saldoEl.innerText = snap.data().credito;
});

sairBtn.onclick = async () => {
  await signOut(auth);
  location.replace("index.html");
};;
history.pushState(null, "", location.href);
window.onpopstate = () => {
  history.pushState(null, "", location.href);
};



