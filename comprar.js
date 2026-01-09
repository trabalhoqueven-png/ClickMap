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
  apiKey: "AIzaSyDxY7bW7ywWgxPRfosKNSl8_2gyzGRQ3eY",
  authDomain: "clickmap-ae0ca.firebaseapp.com",
  projectId: "clickmap-ae0ca"
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
  const linkPix = "https://mpago.la/12KQxs2";

  localStorage.setItem("compra_pendente", qtd);
  window.location.href = "https://mpago.la/12KQxs2";
  );

  document.getElementById("msg").innerText =
    `✅ ${qtd} créditos adicionados com sucesso!`;
};






