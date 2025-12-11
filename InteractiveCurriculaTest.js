
(() => {
  const version = "Curricula";
  const versionnum = "0.0.1";
  const jsonVersion = 0.1;
  window.appVersion = version;
  document.getElementById("version").innerHTML =
    `${version} ${versionnum} - JSON ${jsonVersion}`;
})();

// Referencia al botón
const btns = document.querySelectorAll(".level-btn");

const explode = "https://i.imgur.com/weBr6yz.gif";
const idleColor = "red";

btns.forEach((btn) => {
  let idleTimeout;

  // EXPLODE cuando entra el mouse
  btn.addEventListener("mouseenter", () => {
    clearTimeout(idleTimeout);

    // btn.style.transition = "none"; 
    btn.style.transform = "scale(1.2)";
    // btn.style.backgroundColor = "yellow";
      btn.style.backgroundImage = `url(${explode})`;

    // Cambia a IDLE después de 1s
    idleTimeout = setTimeout(() => {
      btn.style.transition = "all 0.3s ease";
      btn.style.transform = "scale(1.2)";
      btn.style.backgroundColor = idleColor;
    }, 500);
  });

  // OUTRO cuando sale el mouse
  btn.addEventListener("mouseleave", () => {
    clearTimeout(idleTimeout);

    btn.style.transition = "all 0.3s ease";
    btn.style.transform = "scale(0.9)";

    // mini fade-out
    setTimeout(() => {
      btn.style.transform = "scale(1)";
      btn.style.backgroundColor = "transparent";
        btn.style.backgroundImage = "";
    }, 200);
  });
});

// ==================================================================
// ==================================================================
// ==================================================================
// ==================================================================
// ==================================================================


let topicsData = {};
let topicsBreakdown = {};
const syllabusName = "Kids (Intensivo) 8-12";
const BREAKDOWN_URL = "https://raw.githubusercontent.com/TheMichia/evals4coaches/refs/heads/main/topicsBreakdown.json?v=" + Date.now();

Promise.all([
  fetch(`InteractiveCurricula.json?v=${Date.now()}`).then(res => res.json()),
  fetch(BREAKDOWN_URL).then(res => res.json())
])
.then(([dataJSON, dataBreakdown]) => {
  topicsData = dataJSON;
  topicsBreakdown = dataBreakdown["Topic Breakdown"] || dataBreakdown;

  // Ahora sí podemos crear los botones y usar topicsBreakdown
  loadKidsIntensivoTest();
})
.catch(err => console.error("Error loading JSONs:", err));

// ----------------------
// Cargar solo Kids Intensivo y levels dinámicos
// ----------------------


function loadKidsIntensivoTest() {
  const data = topicsData[syllabusName];
  if (!data) return console.error("No se encontró Kids Intensivo en el JSON");

  const levelsGrid = document.getElementById("levelsGrid");
  levelsGrid.innerHTML = ""; // limpiar botones previos

  const filtroLevels = [2, 4, 7, 9];

  // Crear botones dinámicos según keys del JSON (0-10)
  Object.keys(data)
    .sort((a, b) => parseInt(a) - parseInt(b))
    .forEach((level) => {
      const btn = document.createElement("button");
      btn.className = "level-btn";
      btn.dataset.level = level;

      const numLevel = parseInt(level);

      // Textos especiales
      if (filtroLevels.includes(numLevel)) {
        btn.textContent = ``;
      } else if (numLevel === 10) {
        btn.innerHTML = ``;
      } else {
        btn.textContent = ``;
      }

      btn.onclick = () => openTopics(level);
      levelsGrid.appendChild(btn);
    });
}


// ----------------------
// Abrir topics en el div #Topics

const CEFRInfo = [
  { range: [0, 2], cefr: "Pre-A1", desc: "Puede entender palabras y frases básicas y usar saludos simples." },
  { range: [3, 5], cefr: "A1", desc: "Puede comunicarse en situaciones sencillas y cotidianas; entiende frases básicas." },
  { range: [6, 8], cefr: "A2", desc: "Puede manejar conversaciones simples y describir su entorno y actividades." },
  { range: [9, 10], cefr: "Pre-B1", desc: "Puede interactuar en situaciones conocidas y expresar opiniones." }
];

function getCEFR(level) {
  return CEFRInfo.find(item => level >= item.range[0] && level <= item.range[1]);
}


// ----------------------
function openTopics(level) {
  const topics = topicsData[syllabusName][level];
  const container = document.getElementById("Topics");
  if (!container) return;

  container.classList.remove("hidden", "out", "in");
  container.classList.add("in");
  container.innerHTML = "";

  // Título Level
  const title = document.createElement("h2");
  title.className = "LevelTitle";
  title.textContent = `Level ${level}`;
  container.appendChild(title);

  // CEFR INFO
  const cefrData = getCEFR(level);
  if (cefrData) {
    const cefrBox = document.createElement("div");
    cefrBox.className = "CEFRBox";
    cefrBox.innerHTML = `
      <h3 class="CEFRTitle">Equivalencia CEFR: <strong>${cefrData.cefr}</strong></h3>
      <p class="CEFRDesc">${cefrData.desc}</p>
    `;
    container.appendChild(cefrBox);
  }

  // Subtítulo
  const H3 = document.createElement("h3");
  H3.className = "LevelSubtitle";
  H3.textContent = `En este Nivel tu hijo/a aprenderá:`;
  container.appendChild(H3);

  // Contenedor topics
  const topicsSpace = document.createElement("div");
  topicsSpace.className = "topicsSpace";
  const table = document.createElement("table");
  const tbody = document.createElement("tbody");

  topics.forEach((t) => {
    const desc = topicsBreakdown[t] || "No description available";

    const trTopic = document.createElement("tr");
    trTopic.innerHTML = `
      <td class="TopicName">&#9989; ${t}</td>
    `;

    const trDesc = document.createElement("tr");
    trDesc.innerHTML = `
      <td class="TopicsDescription">${desc}<br /></td>
    `;

    tbody.appendChild(trTopic);
    tbody.appendChild(trDesc);
  });

  table.appendChild(tbody);
  topicsSpace.appendChild(table);
  container.appendChild(topicsSpace);

  // Botón cerrar
  const closeBtn = document.createElement("button");
  closeBtn.className = "closeTopics";
  closeBtn.textContent = "X";
  closeBtn.onclick = closeTopics;
  container.appendChild(closeBtn);

  document.querySelector(".Topics").classList.remove("hidden");
  document.querySelector(".levels-container").classList.add("compressed");
  document.querySelector(".levels-container").classList.remove("expanded");
}


// ----------------------
// Cerrar topics
// ----------------------
function closeTopics() {
  const container = document.getElementById("Topics");
  if (container) container.classList.add("hidden");
  container.classList.remove("in");
  container.classList.add("out");
      document.querySelector(".Topics").classList.add("hidden");
      document.querySelector(".levels-container").classList.remove("compressed");
      document.querySelector(".levels-container").classList.add("expanded");
}

