import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  doc,
  updateDoc,
  increment
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_DOMINIO",
  projectId: "SEU_PROJECT_ID"
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
    `Confirma compra de ${qtd} créditos?\n\nPIX será exibido em seguida.`
  );

  if (!confirmar) return;

  // 🔴 AQUI entra o PIX (manual no início)
  alert("📲 Faça o PIX e aguarde a liberação.");

  // 🔥 SIMULA LIBERAÇÃO (remova quando automatizar)
  await updateDoc(
    doc(db, "usuarios", usuarioAtual.uid),
    { credito: increment(qtd) }
  );

  document.getElementById("msg").innerText =
    `✅ ${qtd} créditos adicionados com sucesso!`;
};
