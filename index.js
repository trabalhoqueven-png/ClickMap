import { auth, db, app } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


window.login = () => {
  signInWithEmailAndPassword(auth, email.value, senha.value)
    .then(() => {
      document.body.classList.add("saindo");

      setTimeout(() => {
        location.href = "Mapa.html";
      }, 600);
    })
    .catch(() => msg("Email ou senha inválidos", "red"));
};

window.cadastrar = async () => {
  try {
    const cred = await createUserWithEmailAndPassword(
      auth,
      email.value,
      senha.value
    );

    // 🔥 cria usuário com crédito inicial
    await setDoc(doc(db, "usuarios", cred.user.uid), {
      email: cred.user.email,
      credito: 1,
      criadoEm: new Date()
    });
    msg("Cadastro criado com R$ 1 de crédito!", "green");

  } catch (e) {
    msg(e.message, "red");
  }
};

function msg(t, c) {
  const m = document.getElementById("msg");
  m.innerText = t;
  m.style.color = c;
}










