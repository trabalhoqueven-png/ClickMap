import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  doc, getDoc, setDoc, updateDoc, increment
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
  const ref = doc(db, "usuarios", uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, { credito: 10 });
    saldoEl.innerText = 10;
  } else {
    saldoEl.innerText = snap.data().credito;
  }
});

window.jogar = async () => {
  if (!uid) return;

  msg.innerText = "";
  msg.className = "";

  const btn = document.getElementById("btnSpin");
  btn.disabled = true;

  const ref = doc(db, "usuarios", uid);
  const snap = await getDoc(ref);
  let saldo = snap.data().credito;

  if (saldo < 1) {
    msg.innerText = "❌ Saldo insuficiente";
    btn.disabled = false;
    return;
  }

  r1.classList.add("girando");
  r2.classList.add("girando");
  r3.classList.add("girando");

  const s1 = simbolos[Math.floor(Math.random()*simbolos.length)];
  const s2 = simbolos[Math.floor(Math.random()*simbolos.length)];
  const s3 = simbolos[Math.floor(Math.random()*simbolos.length)];

  setTimeout(async () => {
    r1.classList.remove("girando");
    r2.classList.remove("girando");
    r3.classList.remove("girando");

    r1.innerText = s1;
    r2.innerText = s2;
    r3.innerText = s3;

    await updateDoc(ref, { credito: increment(-1) });

    if (s1 === s2 || s2 === s3 || s1 === s3) {
      await updateDoc(ref, { credito: increment(2) });
      msg.innerText = "🎉 VOCÊ GANHOU +2!";
      msg.classList.add("win");
    } else {
      msg.innerText = "😢 Não foi dessa vez";
      msg.classList.add("lose");
    }

    const novoSnap = await getDoc(ref);
    saldoEl.innerText = novoSnap.data().credito;

    btn.disabled = false;
  }, 1000);
};

window.voltar = () => {
  location.replace("lobby.html");
};
