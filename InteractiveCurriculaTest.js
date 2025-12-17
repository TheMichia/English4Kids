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
const BREAKDOWN_URL =
  "https://raw.githubusercontent.com/TheMichia/evals4coaches/refs/heads/main/topicsBreakdown.json?v=" +
  Date.now();

Promise.all([
  fetch(`InteractiveCurricula.json?v=${Date.now()}`).then((res) => res.json()),
  fetch(BREAKDOWN_URL).then((res) => res.json()),
])
  .then(([dataJSON, dataBreakdown]) => {
    topicsData = dataJSON;
    topicsBreakdown = dataBreakdown["Topic Breakdown"] || dataBreakdown;

    // Ahora sí podemos crear los botones y usar topicsBreakdown
    loadKidsIntensivoTest();
  })
  .catch((err) => console.error("Error loading JSONs:", err));

// ----------------------
// Cargar solo Kids Intensivo y levels dinámicos
// ----------------------

function loadKidsIntensivoTest() {
  const data = topicsData[syllabusName];
  if (!data) return console.error("No se encontró Kids Intensivo en el JSON");

  const levelsGrid = document.getElementById("levelsGrid");
  levelsGrid.innerHTML = ""; // limpiar botones previos

  // Crear botones dinámicos según keys del JSON (0-10)
  Object.keys(data)
    .sort((a, b) => parseInt(a) - parseInt(b))
    .forEach((level) => {
      const btn = document.createElement("button");
      btn.className = "level-btn";
      btn.dataset.level = level;

      // const numLevel = parseInt(level);
      //  const filtroLevels = [2, 4, 7, 9];
      // // Textos especiales
      // if (filtroLevels.includes(numLevel)) {
      //   btn.innerHTML = `<button>¿Qué es un nivel filtro?</button>`;
      // } else if (numLevel === 10) {
      //   btn.innerHTML = ``;
      // } else {
      //   btn.textContent = ``;
      // }

      btn.onclick = () => openTopics(level);
      levelsGrid.appendChild(btn);
    });
}

// ----------------------
// Abrir topics en el div #Topics

const CEFRInfo = [
  {
    range: [0, 0],
    cefr: "Pre-A1",
    desc: "Puede reconoce palabras y frases básicas, saluda y se presenta.",
    duracion: "6",
  },
  {
    range: [1, 1],
    cefr: "A1",
    desc: "Puede usa frases simples sobre sí mismo, familia y rutinas diarias.",
    duracion: "14",
  },
  {
    range: [2, 5],
    cefr: "A2",
    desc: "Puede describir experiencias, gustos, planes y situaciones cotidianas.",
    duracion: "14",
  },
  {
    range: [6, 10],
    cefr: "B1",
    desc: "Puede explicar opiniones, experiencias y planes con cierta fluidez.",
    duracion: "14",
  },
];

function getCEFR(level) {
  return CEFRInfo.find(
    (item) => level >= item.range[0] && level <= item.range[1],
  );
}

// ----------------------
function openTopics(level) {
  const topics = topicsData[syllabusName][level];
  const container = document.getElementById("Topics");
  const MainContainer = document.getElementById("MainContainer");
  if (!container) return;

  container.classList.remove("hidden", "out", "in");
  container.classList.add("in");
  container.innerHTML = "";

  // Título Level
  const titlediv = document.createElement("div");

  // FILTER WARNING
  const numLevel = parseInt(level);
  const filtroLevels = [2, 4, 7, 9];

  const filterwarning = document.createElement("div");
  const extrainfo = document.createElement("div");
  extrainfo.className = "extrainfo";
  filterwarning.className = "filterwarning";
  // Textos especiales
  if (filtroLevels.includes(numLevel)) {
    filterwarning.innerHTML = `<H3>🚨 Este es un nivel filtro</H3>
    <button onclick="FilterWarning()">¿Qué es un nivel filtro?</button>`;
  } else {
    filterwarning.textContent = ``;
  }
  titlediv.appendChild(filterwarning);

  const title = document.createElement("h2");
  title.className = "LevelTitle";
  title.textContent = `Level ${level}`;
  container.appendChild(titlediv);
  titlediv.appendChild(title);
  titlediv.classname = "titlediv";

  // CEFR INFO
  const cefrData = getCEFR(level);
  if (cefrData) {
    const cefrBox = document.createElement("div");
    cefrBox.className = "CEFRBox";
    cefrBox.innerHTML = `
    <h3 class="CEFRDur">Duración: <strong>${cefrData.duracion}</strong> semanas</h3>`;
    if (numLevel === 10) {
      cefrBox.insertAdjacentHTML(
        "beforeend",
        `
        <div class="extrainfo"> 
          <h3>Al terminar este nivel estará listo/a para ir a Kids Masters.</h3>
        </div>
      `
      );

        cefrBox.insertAdjacentHTML(
        "beforeend",
        `
        <button class="hoveringbutton" onclick="">¿Qué aprenderá en Masters?</button>
      `
      );

    }
    cefrBox.innerHTML += `
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
      <td class="TopicName">✅ ${t}</td>
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
  // if (container) container.classList.add("hidden");
  container.classList.remove("in");
  container.classList.add("out");

  setTimeout(() => {
    container.classList.add("hidden");
  }, 300);

  document.querySelector(".levels-container").classList.remove("compressed");
  document.querySelector(".levels-container").classList.add("expanded");
}

function FilterWarning() {
  const MainContainer = document.getElementById("MainContainer");
  const FilterExplbefore = document.createElement("div");
  FilterExplbefore.className = "FilterExplbefore";
  MainContainer.appendChild(FilterExplbefore);
  const FilterExpl = document.createElement("div");
  FilterExpl.className = "FilterExpl";
  FilterExpl.innerHTML = `
    <h1>¿Qué es un nivel Filtro?</h1>
    <div class="Filtercontent">
    <p>
    Un <strong>nivel filtro</strong> es un punto de control que nos permite verificar que cada estudiante tenga las habilidades necesarias para avanzar al siguiente nivel de inglés. Evaluamos <strong>gramática, comprensión, fluidez y entonación</strong>.
  </p>

  <ul>
    <li>Si el estudiante <strong>aprueba</strong>, continúa al siguiente nivel.</li>
    <li>Si <strong>no aprueba</strong>, se <strong>reforzará y repasará</strong> el aprendizaje: en <strong>cursos intensivos</strong> retomará el nivel desde la mitad, y en <strong>los demás cursos</strong> desde el inicio, <strong>preparándose para intentarlo nuevamente con confianza</strong>. Esto asegura que avance de manera sólida y sin vacíos en su aprendizaje, en un ambiente de apoyo y motivación.</li>
  </ul>
    </div>
    <button onclick="CloseFilterWarning()">¡Entendido!</button>
    `;
    FilterExplbefore.appendChild(FilterExpl);
}

function CloseFilterWarning() {
  const FilterExpl = document.querySelector(".FilterExpl");
  const FilterExplbefore = document.querySelector(".FilterExplbefore");

  // animación de salida
  FilterExpl.classList.add("fadepopout");
  FilterExplbefore.classList.add("fadeout");

  setTimeout(() => {
    FilterExpl.remove();
    FilterExplbefore.remove();
  }, 300);
}

