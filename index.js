import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 🔥 CONFIG FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyDxY7bW7ywWgxPRfosKNSl8_2gyzGRQ3eY",
  authDomain: "clickmap-ae0ca.firebaseapp.com",
  projectId: "clickmap-ae0ca"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 🔹 ELEMENTOS
const email = document.getElementById("email");
const senha = document.getElementById("senha");
const msgEl = document.getElementById("msg");

// 🔹 FUNÇÃO DE MENSAGEM
function msg(texto, cor) {
  msgEl.innerText = texto;
  msgEl.style.color = cor;
}

// 🔐 LOGIN
window.login = async () => {
  try {
    const cred = await signInWithEmailAndPassword(
      auth,
      email.value,
      senha.value
    );

    if (!cred.user.emailVerified) {
      await signOut(auth);
      msg("❌ Confirme seu email antes de entrar.", "red");
      return;
    }

    document.body.classList.add("saindo");
    setTimeout(() => {
      location.href = "Mapa.html";
    }, 500);

  } catch {
    msg("❌ Email ou senha inválidos.", "red");
  }
};

// 🆕 CADASTRO
window.cadastrar = async () => {
  try {
    const cred = await createUserWithEmailAndPassword(
      auth,
      email.value,
      senha.value
    );

    // 📧 VERIFICAÇÃO
    await sendEmailVerification(cred.user);

    // 💾 FIRESTORE
    await setDoc(doc(db, "usuarios", cred.user.uid), {
      email: cred.user.email,
      credito: 1,
      criadoEm: serverTimestamp()
    });

    // 🚪 DESLOGA (IMPEDIR AUTO LOGIN)
    await signOut(auth);

    msg(
      "📧 Cadastro criado! Verifique seu email para entrar.",
      "lime"
    );

  } catch (e) {
    msg(e.message, "red");
  }
};

// 🚧 BLOQUEAR USUÁRIO LOGADO NO INDEX
onAuthStateChanged(auth, user => {
  if (user && user.emailVerified) {
    location.href = "Mapa.html";
  }
});
