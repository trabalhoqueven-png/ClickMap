import { auth, db, app } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  singOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

window.login = async () => {
  try {
    const cred = await signInWithEmailAndPassword(
      auth,
      email.value,
      senha.value
    );

    if (!cred.user.emailVerified) {
      await signOut(auth);
      msg(
        "❌ Confirme seu email antes de entrar.",
        "red"
      );
      return;
    }

    location.href = "Mapa.html";

  } catch {
    msg("Email ou senha inválidos", "red");
  }
};

window.cadastrar = async () => {
  try {
    const cred = await createUserWithEmailAndPassword(
      auth,
      email.value,
      senha.value
    );

    // 📧 Enviar verificação de email
    await sendEmailVerification(cred.user);

    // 🔥 Criar usuário no Firestore
    await setDoc(doc(db, "usuarios", cred.user.uid), {
      email: cred.user.email,
      credito: 1,
      criadoEm: new Date(),
      verificado: false
    });

    msg(
      "📧 Enviamos um email de verificação. Confirme antes de entrar!",
      "green"
    );

  } catch (e) {
    msg(e.message, "red");
  }
};











