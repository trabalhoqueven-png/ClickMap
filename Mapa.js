import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  increment
  
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
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
let coordenadas = null;
let creditoUsuario = 0; // 🔥 AGORA EXISTE

let marcadorUsuario = null;
let circuloPrecisao = null;
let ultimaPosicaoUsuario = null; 

function getUltimaPosicao() {
  const salvo = localStorage.getItem("ultimaPosicaoMapa");
  if (!salvo) return null;
  return JSON.parse(salvo);
}

// 🔐 Login + crédito
onAuthStateChanged(auth, async user => {
  if (!user) {
    location.href = "index.html";
  } else {
    usuarioAtual = user;

    await carregarCredito(); // 🔥 AGUARDA
    carregarCasas();

    onAuthStateChanged(auth, async user => {
  if (!user) {
    location.href = "index.html";
  } else {
    usuarioAtual = user;

    await carregarCredito();
    carregarCasas();

    iniciarChatGlobal(); // 🔥 AQUI
  }
});

  }
});

// 💰 buscar crédito
async function carregarCredito() {
  const ref = doc(db, "usuarios", usuarioAtual.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    alert("Usuário sem crédito cadastrado!");
    creditoUsuario = 0;
    atualizarCreditoTela();
    return;
  }

  creditoUsuario = snap.data().credito; atualizarCreditoTela();
  console.log("💰 Crédito atual:", creditoUsuario);
};

function atualizarCreditoTela() {
  const el = document.getElementById("creditoValor");
  if (el) {
    el.innerText = creditoUsuario;
  }
}

// 🗺️ MAPA
const ultimaPosicao = getUltimaPosicao();

const map = L.map("map").setView(
  ultimaPosicao ? [ultimaPosicao.lat, ultimaPosicao.lng] : [-23.55, -46.63],
  ultimaPosicao ? ultimaPosicao.zoom : 13
);

// 🗺️ MAPA RUAS (OpenStreetMap)
const mapaRuas = L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    attribution: "© OpenStreetMap",
    maxZoom: 19,
    minZoom: 3
  }
);

// 🛰️ SATÉLITE (Esri)
const mapaSatelite = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    attribution: "© Esri",
    maxZoom: 19,
    minZoom: 3
  }
);

// 🌍 HÍBRIDO (SATÉLITE + NOMES)
const mapaHibrido = L.layerGroup([
  L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    { maxZoom: 19, minZoom: 3 }
  ),
  L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png",
    { maxZoom: 19, minZoom: 3 }
  )
]);

// 🔥 MAPA INICIAL
mapaRuas.addTo(map);

// 🎛️ CONTROLE
L.control.layers(
  {
    "🗺️ Mapa": mapaRuas,
    "🛰️ Satélite": mapaSatelite,
    "🌍 Híbrido": mapaHibrido
  },
  null,
  { position: "topright" }
).addTo(map);


map.on("click", e => {
  coordenadas = e.latlng;

  L.popup()
    .setLatLng(e.latlng)
    .setContent("📍 Local selecionado! Agora salve a casa 👇")
    .openOn(map);
});
document.getElementById("btnCredito").onclick = () => {
  window.location.href = "comprar.html";
};
// 💾 SALVAR CASA (CONSOME CRÉDITO)
document.getElementById("salvar").onclick = async () => {

   if (!coordenadas) {
    alert("Clique no mapa primeiro");
    return;
    }

  if (creditoUsuario <= 0) {
    alert("😅 Ops… seu saldo acabou. Recarregue para continuar!");
    return;
  }


  const titulo = document.getElementById("titulo").value.trim();
  const preco = document.getElementById("preco").value.trim();
  const descricao = document.getElementById("descricao").value.trim();
  const publico = document.getElementById("publico").checked;
  const foto = document.getElementById("foto").files[0];

  if (!titulo || !preco || !descricao || !foto) {
    alert("Preencha todos os campos");
    return;
  }

  const reader = new FileReader();

   reader.onload = async () => {
       try {
         // 🔥 SALVA CASA
         await addDoc(collection(db, "casas"), {
           titulo,
           preco,
           descricao,
           fotoBase64: reader.result,
           lat: coordenadas.lat,
           lng: coordenadas.lng,
           usuario: usuarioAtual.uid,
           publico,
           criadoEm: new Date(),
           
        reacoes: {
  like: {},
  love: {},
  laugh: {},
  wow: {}
}

           
         });

      // 💸 DESCONTA CRÉDITO
      creditoUsuario--;
    await updateDoc(doc(db, "usuarios", usuarioAtual.uid), {
      credito: creditoUsuario
    });
        atualizarCreditoTela();
      alert(`✅ Casa marcada!\n💰 Crédito restante: ${creditoUsuario}`);

      limparMapa();
      carregarCasas();

    } catch (e) {
      console.error(e);
      alert("Erro ao salvar a casa");
    }
  };

  reader.readAsDataURL(foto);
};

// 🧹 limpar marcadores
function limparMapa() {
  map.eachLayer(l => {
    if (l instanceof L.Marker) map.removeLayer(l);
  });
}

// 👁️ carregar casas
async function carregarCasas() {
  const snap = await getDocs(collection(db, "casas"));

  snap.forEach(item => {
    const d = item.data();
    const id = item.id;

    if (d.publico || d.usuario === usuarioAtual.uid) {

      let excluir = "";
      if (d.usuario === usuarioAtual.uid) {
        excluir = `<button class="btn-excluir" onclick="excluirCasa('${id}')">🗑️ Excluir</button>`;
      }

      const likes  = d.reacoes?.like  ? Object.keys(d.reacoes.like).length  : 0;
      const loves  = d.reacoes?.love  ? Object.keys(d.reacoes.love).length  : 0;
      const laughs = d.reacoes?.laugh ? Object.keys(d.reacoes.laugh).length : 0;
      const wows   = d.reacoes?.wow   ? Object.keys(d.reacoes.wow).length   : 0;

      L.marker([d.lat, d.lng]).addTo(map).bindPopup(`
        <strong>${d.titulo}</strong><br>
        💰 R$ ${d.preco}<br>
        <img src="${d.fotoBase64}" width="180"><br>
        ${d.descricao}<br><br>

        <div class="reacoes">
          <button onclick="reagir('${id}','like')">👍 ${likes}</button>
          <button onclick="reagir('${id}','love')">❤️ ${loves}</button>
          <button onclick="reagir('${id}','laugh')">😂 ${laughs}</button>
          <button onclick="reagir('${id}','wow')">😮 ${wows}</button>
        </div>

        ${excluir}
      `);
    }
  });
}
// ❌ excluir casa
window.excluirCasa = async (id) => {
  if (!confirm("Excluir esta casa?")) return;

  await deleteDoc(doc(db, "casas", id));
  limparMapa();
  carregarCasas();
};


async function buscarLocal() {
  const texto = document.getElementById("buscar").value.trim();

  if (!texto) {
    alert("Digite um bairro ou cidade");
    return;
  }

  try {
    const resposta = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(texto)}&countrycodes=br&limit=1`,
      {
        headers: {
          "Accept": "application/json"
        }
      }
    );

    if (!resposta.ok) {
      throw new Error("Erro na busca");
    }

    const dados = await resposta.json();

    if (!dados.length) {
      alert("Local não encontrado");
      return;
    }

    const { lat, lon, display_name } = dados[0];

    map.setView([lat, lon], 15);
    alert(`📍 Local encontrado:\n${display_name}`);

  } catch (erro) {
    console.error("Erro ao buscar local:", erro);
    alert("❌ Não foi possível buscar o local. Tente novamente.");
  }
}

document.getElementById("btnBuscar")
  .addEventListener("click", buscarLocal);

document.getElementById("buscar")
  .addEventListener("keydown", (e) => {
    if (e.key === "Enter") buscarLocal();
  });
  map.on("moveend", () => {
  const centro = map.getCenter();
  const zoom = map.getZoom();

  localStorage.setItem(
    "ultimaPosicaoMapa",
    JSON.stringify({
      lat: centro.lat,
      lng: centro.lng,
      zoom
    })
  );
});

map.whenReady(() => {
  document.body.classList.add("mapa-ok");
  iniciarLocalizacaoTempoReal();
});
document.getElementById("btnSair").addEventListener("click", async () => {
  try {
    await signOut(auth);

    // limpa dados locais
    localStorage.clear();
    sessionStorage.clear();

    // remove histórico (PWA + navegador)
    window.location.replace("index.html");

  } catch (e) {
    console.error("Erro ao sair:", e);
  }
});
    
window.reagir = async (casaId, tipo) => {
  if (!usuarioAtual) {
    alert("Faça login para reagir");
    return;
  }

  const ref = doc(db, "casas", casaId);
  const snap = await getDoc(ref);

  if (!snap.exists()) return;

  const dados = snap.data();
  const reacoes = dados.reacoes || {};

  // 🔁 remove reação anterior do usuário
  Object.keys(reacoes).forEach(r => {
    if (reacoes[r]?.[usuarioAtual.uid]) {
      delete reacoes[r][usuarioAtual.uid];
    }
  });

  // ➕ adiciona nova reação
  if (!reacoes[tipo]) reacoes[tipo] = {};
  reacoes[tipo][usuarioAtual.uid] = true;

  await updateDoc(ref, { reacoes });

  limparMapa();
  carregarCasas();
};
function iniciarLocalizacaoTempoReal() {
  if (!navigator.geolocation) {
    alert("Geolocalização não suportada");
    return;
  }

  navigator.geolocation.watchPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      const precisao = pos.coords.accuracy;

      ultimaPosicaoUsuario = [lat, lng];

      if (!marcadorUsuario) {
        marcadorUsuario = L.circleMarker(ultimaPosicaoUsuario, {
          radius: 8,
          color: "#00aaff",
          fillColor: "#00aaff",
          fillOpacity: 1
        }).addTo(map);

        circuloPrecisao = L.circle(ultimaPosicaoUsuario, {
          radius: precisao,
          color: "#00aaff",
          fillColor: "#00aaff",
          fillOpacity: 0.15
        }).addTo(map);
      } else {
        marcadorUsuario.setLatLng(ultimaPosicaoUsuario);
        circuloPrecisao.setLatLng(ultimaPosicaoUsuario);
        circuloPrecisao.setRadius(precisao);
      }
    },
    (erro) => {
      console.error("Erro de localização:", erro);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 10000,
      timeout: 15000
    }
  );
}
document
  .getElementById("btnMinhaLocalizacao")
  .addEventListener("click", () => {
    if (!ultimaPosicaoUsuario) {
      alert("Localização ainda não disponível");
      return;
    }

    map.setView(ultimaPosicaoUsuario, 17, {
      animate: true
    });
  });

document.getElementById("btnEnviarChat").onclick = async () => {
  const texto = document.getElementById("chatTexto").value.trim();

  if (!texto || texto.length < 2) return;

  await addDoc(collection(db, "chatGlobal"), {
    uid: usuarioAtual.uid,
    email: usuarioAtual.email,
    mensagem: texto,
    criadoEm: serverTimestamp()
  });

  document.getElementById("chatTexto").value = "";
};
function iniciarChatGlobal() {
  const chatBox = document.getElementById("chatMensagens");

  if (!chatBox) {
    console.warn("Chat não encontrado no HTML");
    return;
  }

  const q = query(
    collection(db, "chatGlobal"),
    orderBy("criadoEm", "asc"),
    limit(50)
  );

  onSnapshot(q, (snapshot) => {
    chatBox.innerHTML = "";

    snapshot.forEach(doc => {
      const d = doc.data();

      const div = document.createElement("div");
      div.className = "msg-chat";

      div.innerHTML = `
        <strong>${d.email}</strong><br>
        <span>${d.mensagem}</span>
      `;

      chatBox.appendChild(div);
    });

    chatBox.scrollTop = chatBox.scrollHeight;
  });
}





























