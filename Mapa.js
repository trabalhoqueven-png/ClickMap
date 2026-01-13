import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
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
           
           reacoes: 
           {
          like: 0,
          love: 0,
          laugh: 0,
          wow: 0
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

     L.marker([d.lat, d.lng]).addTo(map).bindPopup(`
  <strong>${d.titulo}</strong><br>
  💰 R$ ${d.preco}<br>
  <img src="${d.fotoBase64}" width="180"><br>
  ${d.descricao}<br><br>

  👍 ${likes}
  <button onclick="reagir('${id}', 'like')">👍</button>

  ❤️ ${loves}
  <button onclick="reagir('${id}', 'love')">❤️</button>

  😂 ${hahas}
  <button onclick="reagir('${id}', 'haha')">😂</button>

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

  // 🔥 remove reação antiga do usuário
  Object.keys(reacoes).forEach(r => {
    if (reacoes[r]?.[usuarioAtual.uid]) {
      delete reacoes[r][usuarioAtual.uid];
    }
  });

  // 🔥 adiciona nova reação
  if (!reacoes[tipo]) reacoes[tipo] = {};
  reacoes[tipo][usuarioAtual.uid] = true;

  await updateDoc(ref, { reacoes });

  limparMapa();
  carregarCasas();
};



















