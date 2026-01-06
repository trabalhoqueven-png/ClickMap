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
  apiKey: "AIzaSyCai7P5axNyYt2g9x9wqsU7DaA_tNZ3Pnc",
  authDomain: "casa-d5eae.appspot.com",
  projectId: "casa-d5eae"
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

  // 🔹 SOMENTE PLANO DE 9,90
  if (qtd === 5) {

    const confirmar = confirm(
      "Você será redirecionado para o pagamento via PIX (R$ 9,90).\n\nApós o pagamento, seus créditos serão liberados."
    );

    if (!confirmar) return;

    // 🔗 LINK MERCADO PAGO
    window.open(
      "https://mpago.la/12KQxs2",
      "_blank"
    );

    document.getElementById("msg").innerText =
      "⏳ Após o pagamento, aguarde a liberação dos 5 créditos.";

    return;
  }

  // 🔒 OUTROS PLANOS BLOQUEADOS (por enquanto)
  alert("🚧 Este plano ainda não está disponível.");
};
