import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

window.login = async () => {
  try {
    await signInWithEmailAndPassword(auth, email.value, senha.value);
    location.href = "Mapa.html";
  } catch {
    msg.innerText = "❌ Login inválido";
  }
};

window.cadastrar = async () => {
  try {
    const cred = await createUserWithEmailAndPassword(
      auth,
      email.value,
      senha.value
    );

    await setDoc(doc(db, "usuarios", cred.user.uid), {
      email: cred.user.email,
      credito: 1,
      criadoEm: new Date()
    });

    msg.innerText = "✅ Conta criada com 1 crédito!";
  } catch (e) {
    msg.innerText = e.message;
  }
};
