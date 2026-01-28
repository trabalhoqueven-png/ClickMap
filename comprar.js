import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import {
  getFirestore,
  doc,
  updateDoc,
  increment,
  addDoc,
  collection,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js"

const firebaseConfig = { 
  apiKey: "AIzaSyC5TlYdXT6Y0keGZY_DVXPeE9Ru4NqhHzY",
  authDomain: "qcassino-227ab.firebaseapp.com",
  projectId: "qcassino-227ab"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

let usuarioAtual = null;

onAuthStateChanged(auth, user => {
  if (!user) location.href = "index.html";
  else usuarioAtual = user;
});

window.comprar = async function(qtd) {
  if (!usuarioAtual) return;

  const confirmar = confirm(
    `Confirma compra de ${qtd} créditos por PIX?`
  );
  if (!confirmar) return;

  // 🔥 REGISTRA PEDIDO
  await addDoc(collection(db, "compras"), {
    uid: usuarioAtual.uid,
    quantidade: qtd,
    status: "pendente",
    data: serverTimestamp()
  });

  // 🔗 PIX
  window.open("https://mpago.la/12KQxs2", "_blank");

  msg.innerText =
    "📲 PIX gerado. Após o pagamento, aguarde a liberação dos créditos.";
};











