import { auth, db } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  doc, setDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const email = document.getElementById("email");
const senha = document.getElementById("senha");
const msg = document.getElementById("msg");

window.login = async () => {
  try {
    await signInWithEmailAndPassword(auth, email.value, senha.value);
    location.href = "lobby.html";
  } catch {
    msg.innerText = "Erro no login";
  }
};

window.cadastrar = async () => {
  try {
    const cred = await createUserWithEmailAndPassword(
      auth, email.value, senha.value
    );

    await setDoc(doc(db, "usuarios", cred.user.uid), {
      credito: 10
    });

    location.href = "lobby.html";
  } catch {
    msg.innerText = "Erro no cadastro";
  }
};

onAuthStateChanged(auth, user => {
  if (user) location.href = "lobby.html";
});
