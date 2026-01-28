import { auth, db } from "./firebase.js";
import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  doc, getDoc, updateDoc, increment
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const saldoEl = document.getElementById("saldo");
const msg = document.getElementById("msg");

const r1 = document.getElementById("r1");
const r2 = document.getElementById("r2");
const r3 = document.getElementById("r3");

const simbolos = ["🍒","🍋","🔔","⭐","💎"];
let uid = null;

onAuthStateChanged(auth, async user => {
  if (!user) return location.replace("index.html");

  uid = user.uid;
  const snap = await getDoc(doc(db, "usuarios", uid));
  saldoEl.innerText = snap.data().credito;
});

window.jogar = async () => {
  if (!uid) return;

  const ref = doc(db, "usuarios", uid);
  const snap = await getDoc(ref);
  let saldo = snap.data().credito;

  if (saldo < 1) {
    msg.innerText = "❌ Saldo insuficiente";
    return;
  }

  // 🎲 sorteio
  const s1 = simbolos[Math.floor(Math.random()*simbolos.length)];
  const s2 = simbolos[Math.floor(Math.random()*simbolos.length)];
  const s3 = simbolos[Math.floor(Math.random()*simbolos.length)];

  r1.innerText = s1;
  r2.innerText = s2;
  r3.innerText = s3;

  // perde 1 crédito
  await updateDoc(ref, { credito: increment(-1) });

  // vitória
  if (s1 === s2 || s2 === s3 || s1 === s3) {
    await updateDoc(ref, { credito: increment(2) });
    msg.innerText = "🎉 VOCÊ GANHOU +2!";
  } else {
    msg.innerText = "😢 Não foi dessa vez";
  }

  const novoSnap = await getDoc(ref);
  saldoEl.innerText = novoSnap.data().credito;
};

window.voltar = () => {
  location.replace("lobby.html");
};
