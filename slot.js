import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

/* ====== ELEMENTOS ====== */
const saldoEl = document.getElementById("saldo");
const apostaEl = document.getElementById("apostaValor");
const msg = document.getElementById("msg");

const r1 = document.getElementById("r1");
const r2 = document.getElementById("r2");
const r3 = document.getElementById("r3");

const btnSpin = document.getElementById("btnSpin");

/* ====== CONFIG ====== */
const simbolos = ["🍒","🍋","🔔","⭐","💎"];
let uid = null;
let aposta = 2;

/* ====== AUTH ====== */
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    location.replace("index.html");
    return;
  }

  uid = user.uid;

  const ref = doc(db, "usuarios", uid);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    saldoEl.innerText = snap.data().credito;
  } else {
    saldoEl.innerText = 0;
  }

  apostaEl.innerText = aposta;
});

/* ====== APOSTA ====== */
window.aumentarAposta = () => {
  if (aposta < 10) {
    aposta++;
    apostaEl.innerText = aposta;
  }
};

window.diminuirAposta = () => {
  if (aposta > 1) {
    aposta--;
    apostaEl.innerText = aposta;
  }
};

/* ====== JOGO ====== */
window.jogar = async () => {
  if (!uid) return;

  btnSpin.disabled = true;
  msg.innerText = "";
  msg.className = "";

  const ref = doc(db, "usuarios", uid);
  const snap = await getDoc(ref);
  const saldoAtual = snap.data().credito;

  if (saldoAtual < aposta) {
    msg.innerText = "❌ Saldo insuficiente";
    btnSpin.disabled = false;
    return;
  }

  // animação
  [r1, r2, r3].forEach(r => {
    r.classList.remove("win-slot");
    r.classList.add("girando");
  });

  setTimeout(async () => {
    [r1, r2, r3].forEach(r => r.classList.remove("girando"));

    const s1 = simbolos[Math.floor(Math.random() * simbolos.length)];
    const s2 = simbolos[Math.floor(Math.random() * simbolos.length)];
    const s3 = simbolos[Math.floor(Math.random() * simbolos.length)];

    r1.innerText = s1;
    r2.innerText = s2;
    r3.innerText = s3;

    // perde aposta
    await updateDoc(ref, { credito: increment(-aposta) });

    // vitória (qualquer par)
    if (s1 === s2 || s2 === s3 || s1 === s3) {
      const ganho = aposta * 2; // lucro = aposta
      await updateDoc(ref, { credito: increment(ganho) });

      msg.innerText = `🎉 VOCÊ GANHOU +${ganho - aposta}!`;
      msg.classList.add("win");

      if (s1 === s2) { r1.classList.add("win-slot"); r2.classList.add("win-slot"); }
      if (s2 === s3) { r2.classList.add("win-slot"); r3.classList.add("win-slot"); }
      if (s1 === s3) { r1.classList.add("win-slot"); r3.classList.add("win-slot"); }

    } else {
      msg.innerText = "😢 Não foi dessa vez";
      msg.classList.add("lose");
    }

    const novoSnap = await getDoc(ref);
    saldoEl.innerText = novoSnap.data().credito;

    btnSpin.disabled = false;
  }, 900);
};

/* ====== VOLTAR ====== */
window.voltar = () => {
  location.replace("lobby.html");
};
