import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from
"https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  doc, getDoc, updateDoc, increment
} from
"https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const saldoEl = document.getElementById("saldo");
const apostaEl = document.getElementById("apostaValor");
const msg = document.getElementById("msg");

const r1 = document.getElementById("r1");
const r2 = document.getElementById("r2");
const r3 = document.getElementById("r3");
const btn = document.getElementById("btnSpin");

const simbolos = ["🍒","🍋","🔔","⭐","💎"];

let uid = null;
let aposta = 2;

// 🔐 autenticação
onAuthStateChanged(auth, async user => {
  if (!user) return location.href = "index.html";

  uid = user.uid;
  const snap = await getDoc(doc(db, "usuarios", uid));
  saldoEl.innerText = snap.data().credito;
  apostaEl.innerText = aposta;
});

// ➕ aumentar aposta
window.aumentarAposta = async () => {
  const saldo = Number(saldoEl.innerText);
  if (aposta < 10 && aposta + 1 <= saldo) {
    aposta++;
    apostaEl.innerText = aposta;
  }
};

// ➖ diminuir aposta
window.diminuirAposta = () => {
  if (aposta > 1) {
    aposta--;
    apostaEl.innerText = aposta;
  }
};

// 🎲 jogar
window.jogar = async () => {
  if (!uid) return;

  btn.disabled = true;
  msg.innerText = "";

  const ref = doc(db, "usuarios", uid);
  const snap = await getDoc(ref);
  let saldo = snap.data().credito;

  if (saldo < aposta) {
    msg.innerText = "❌ Saldo insuficiente";
    btn.disabled = false;
    return;
  }

  // animação
  [r1,r2,r3].forEach(r => {
    r.classList.remove("win-slot");
    r.classList.add("girando");
  });

  setTimeout(async () => {
    [r1,r2,r3].forEach(r => r.classList.remove("girando"));

    const s1 = simbolos[Math.floor(Math.random()*simbolos.length)];
    const s2 = simbolos[Math.floor(Math.random()*simbolos.length)];
    const s3 = simbolos[Math.]()
