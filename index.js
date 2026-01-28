import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  doc, setDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

window.cadastrar = async () => {
  try {
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    const cred = await createUserWithEmailAndPassword(auth, email, senha);

    // 📧 envia verificação
    await sendEmailVerification(cred.user);

    // 💰 cria créditos iniciais
    await setDoc(doc(db, "usuarios", cred.user.uid), {
      email: cred.user.email,
      credito: 10, // 👈 CRÉDITO INICIAL
      criadoEm: serverTimestamp()
    });

    // 🔒 força sair
    await signOut(auth);

    alert("📧 Verifique seu email (SPAM também) para entrar!");

  } catch (e) {
    alert(e.message);
  }
};
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

    location.href = "lobby.html";

  } catch {
    alert("❌ Email ou senha inválidos");
  }
};
