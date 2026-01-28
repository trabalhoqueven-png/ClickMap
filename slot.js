import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from
"https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  doc, getDoc, updateDoc, increment
} from
"https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

let aposta = 1;
const apostaEl = document.getElementById("apostaValor");

const saldoEl = document.getElementById("saldo");
const msg = document.getElementById("msg");
const r1 = document.getElementById("r1");
const r2 = document.getElementById("r2");
const r3 = document.getElementById("r3");
const btn = document.getElementById("btnSpin");

const simbolos = ["🍒","🍋","🔔","⭐","💎"];
let uid = null;

onAuthStateChanged(auth, async user => {
  if (!user) return location.href = "index.html";
  uid = user.uid;
  const snap = await getDoc(doc(db, "usuarios", uid));
  saldoEl.innerText = snap.data().credito;
});
window.alterarAposta = (valor) => {
  aposta += valor;

 if (saldo < aposta)
  msg.innerText = "❌ Saldo insuficiente";
  btn.disabled = false;
  return;

};

window.jogar = async () => {
  btn.disabled = true;
  msg.innerText = "";

  [r1,r2,r3].forEach(r => {
    r.classList.remove("win-slot");
    r.classList.add("girando");
  });

  setTimeout(async () => {
    [r1,r2,r3].forEach(r => r.classList.remove("girando"));

    const s1 = simbolos[Math.floor(Math.random()*simbolos.length)];
    const s2 = simbolos[Math.floor(Math.random()*simbolos.length)];
    const s3 = simbolos[Math.floor(Math.random()*simbolos.length)];

    r1.innerText = s1;
    r2.innerText = s2;
    r3.innerText = s3;

    const ref = doc(db, "usuarios", uid);
    await updateDoc(ref, { credito: increment(-aposta) });

    if (s1 === s2 || s2 === s3 || s1 === s3) {
      const ganho = aposta * 2;
      await updateDoc(ref, { credito: increment(ganho) });

      msg.innerText = `🎉 VOCÊ GANHOU +${ganho}!`;
      msg.classList.add("win");
      
      if (s1 === s2) { r1.classList.add("win-slot"); r2.classList.add("win-slot"); }
      if (s2 === s3) { r2.classList.add("win-slot"); r3.classList.add("win-slot"); }
      if (s1 === s3) { r1.classList.add("win-slot"); r3.classList.add("win-slot"); }
    } else {
      msg.innerText = "😢 Perdeu";
    }

    const novo = await getDoc(ref);
    saldoEl.innerText = novo.data().credito;
    btn.disabled = false;
  }, 900);
};

window.voltar = () => {
  location.href = "lobby.html";
};
