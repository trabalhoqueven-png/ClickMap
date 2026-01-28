import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 🔐 CADASTRO
window.cadastrar = async () => {
  try {
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    const cred = await createUserWithEmailAndPassword(auth, email, senha);

    await sendEmailVerification(cred.user);

    await setDoc(doc(db, "usuarios", cred.user.uid), {
      email: cred.user.email,
      credito: 10,
      criadoEm: serverTimestamp()
    });

    await signOut(auth);

    alert("📧 Cadastro criado! Verifique seu email (SPAM também).");

  } catch (e) {
    alert(e.message);
  }
};

// 🔑 LOGIN
window.login = async () => {
  try {
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    const cred = await signInWithEmailAndPassword(auth, email, senha);

    if (!cred.user.emailVerified) {
      await signOut(auth);
      alert("❌ Confirme seu email antes de entrar");
      return;
    }

    location.replace("lobby.html");

  } catch {
    alert("❌ Email ou senha inválidos");
  }
};

// 🚧 BLOQUEIA LOGIN SE JÁ ESTIVER LOGADO
onAuthStateChanged(auth, user => {
  if (user && user.emailVerified) {
    location.replace("lobby.html");
  }
});
