(() => {
  const version = "Students";
  const versionnum = "0.0.9";
  const jsonVersion = 0.1;
  window.appVersion = version;
  document.getElementById("version").innerHTML =
    `${version} ${versionnum} - JSON ${jsonVersion}`;
})();

// --------------------------------------------------
// FETCHS
// --------------------------------------------------
let topicsData = {};
const simpleBreakdown = {
  Comparativos: "Comparar cosas o personas.",
  "Comparativos y Superlativos": "Comparar y decir el más o menos.",
  Condicionales: "Hablar de lo que pasa si ocurre algo.",
  "Condicionales mixtos":
    "Hablar de situaciones pasadas que afectan el presente.",
  "Demostrativos: These/Those": "Señalar cosas cerca o lejos.",
  "Demostrativos: This/That": "Señalar una cosa cerca o lejos.",
  Descripciones: "Describir personas, lugares o cosas.",
  "Deseos (I wish / If only)": "Expresar deseos u “ojalá”.",
  "Deseos en Presente y Futuro (I wish / If only)":
    "Expresar deseos sobre el presente o el futuro.",
  "Estilo Indirecto": "Contar lo que alguien dijo",
  "Expresiones idiomáticas": "Usar frases hechas comunes.",
  "Futuro Perfecto": "Hablar de algo que estará terminado.",
  "Futuro Perfecto Progresivo":
    "Hablar de algo en proceso hasta un momento futuro.",
  "Futuro Simple (Going to y Will)": "Hablar de planes o decisiones futuras",
  "Futuro Simple (Going to)":
    "Hablar de planes o predicciones basadas en evidencia.",
  "Futuro Simple (Will)": "Contar decisiones espontáneas o promesas.",
  Gerundios: "Hablar de acciones como actividades.",
  "Gerundios e infinitivos": "Hablar de acciones como actividad o intención.",
  "Habilidades y Hábitos (Can / Be Able To / Could / Used To)":
    "Hablar de lo que se puede hacer o se hacía.",
  "Información Personal": "Hablar sobre uno mismo.",
  "Información sobre terceras personas (Él/Ella)":
    "Hablar sobre otras personas.",
  Modales: "Decir habilidad, permiso u obligación.",
  "Modales perfectos": "Hablar de lo que alguien debió o pudo haber hecho.",
  "Modales Simples": "Decir habilidad, permiso u obligación.",
  "Modales: Can": "Decir lo que alguien puede hacer.",
  "Modales: Can / Could / Might / May":
    "Decir lo que alguien puede, podría o tal vez haga.",
  "Modales: Can / Should": "Decir lo que alguien puede o debería hacer.",
  "Modales: Might / May": "Decir lo que tal vez pueda pasar.",
  "Obligaciones (Have to / Must / Need to)": "Decir lo que es necesario hacer.",
  "Pasado Perfecto": "Hablar de algo que pasó antes de otra acción",
  "Pasado Progresivo": "Hablar de acciones en proceso en el pasado",
  "Pasado Progresivo (3ra persona)":
    "Hablar de lo que él/ella hacía en el pasado.",
  "Pasado Simple": "Hablar de acciones que ocurrieron y terminaron.",
  "Pasado Simple y Progresivo":
    "Hablar de acciones terminadas y en proceso en el pasado.",
  "Permiso y Solicitudes (Can / Could / May / Do you mind)":
    "Pedir permiso o favores.",
  "Posibilidades (Might / May / Could)": "Hablar de lo que podría pasar",
  "Preguntas Básicas": "Hacer preguntas simples",
  Preposiciones: "Usar palabras de lugar, tiempo o dirección",
  "Presente Perfecto": "Hablar de acciones pasadas que afectan el presente.",
  "Presente Perfecto Progresivo":
    "Hablar de acciones que siguen en el presente.",
  "Presente Progresivo (1ra persona)":
    "Hablar de lo que uno está haciendo ahora.",
  "Presente Progresivo (1ra y 3ra persona)":
    "Hablar de lo que alguien está haciendo ahora.",
  "Presente Progresivo (3ra persona)":
    "Hablar de lo que otros están haciendo ahora.",
  "Presente Simple": "Hablar de lo que uno hace regularmente.",
  "Presente Simple (1ra persona)": "Hablar de lo que uno hace regularmente.",
  "Presente Simple (1ra y 3ra persona)":
    "Hablar de lo que alguien hace regularmente.",
  "Presente Simple (3ra persona)": "Hablar de lo que otros hacen regularmente.",
  "Presente Simple y Progresivo":
    "Hablar de lo que alguien hace o está haciendo.",
  "Primer Condicional":
    "Hablar de lo que pasa si ocurre algo ahora o en el futuro.",
  "Repaso General": "Repasar y afianzar lo visto antes.",
  "Segundo Condicional":
    "Hablar de situaciones imaginarias presentes o futuras.",
  "Sugerencias (Should/ Have to)": "Dar consejos o indicaciones.",
  Superlativos: "Decir quién o qué es el más.",
  "Tercer Condicional": "Hablar de lo que habría pasado en el pasado.",
  "Tiempos Mixtos": "Hablar de pasado, presente y futuro juntos.",
  "Used to": "Hablar de hábitos del pasado.",
  "Verbo ser/estar": "Hablar de la identidad o estado de alguien o algo.",
  "Verbo ser/estar (1ra persona)": "Hablar de quién es uno o cómo está.",
  "Verbo ser/estar (3ra persona)": "Hablar de quiénes son otros o cómo están.",
  "Verbos frasales": "Hablar de acciones con verbos y palabras extras.",
  "Vocabulario básico": "Usar palabras esenciales.",
  "Vocabulario General": "Usar palabras comunes.",
  "Vocabulario General/ Preguntas Básicas":
    "Usar palabras y preguntas comunes.",
  "Voz Pasiva": "Decir lo que recibe la acción.",
  "Repaso de Tiempos Gramaticales Básicos": "Usar los tiempos más importantes.",
};
// Parche lowercase
const simpleBreakdownLower = {};
Object.keys(simpleBreakdown).forEach((key) => {
  simpleBreakdownLower[key.toLowerCase()] = simpleBreakdown[key];
});

fetch(`InteractiveCurricula.json?v=${Date.now()}`)
  .then((res) => res.json())
  .then((data) => {
    topicsData = data;

    const grid = document.getElementById("syllabusGrid");
    grid.innerHTML = "";

    // Crear contenedores por categoría
    const categories = ["Juniors", "Kids", "Teens", "Adults"];
    const containers = {};

    categories.forEach((cat) => {
      const div = document.createElement("div");
      div.className = "syllabus-category";
      div.id = `category-${cat.toLowerCase()}`;
      const h = document.createElement("h3");
      h.textContent = cat;
      div.appendChild(h);
      grid.appendChild(div);
      containers[cat] = div;
    });

    // Crear los botones y asignarlos según categoría
    Object.keys(data).forEach((syllabus) => {
      const btn = document.createElement("button");
      btn.className = "syllabus-btn";
      btn.textContent = syllabus;
      btn.onclick = () => loadSyllabus(syllabus);

      // Encontrar la categoría
      let added = false;
      categories.forEach((cat) => {
        if (syllabus.toLowerCase().includes(cat.toLowerCase())) {
          containers[cat].appendChild(btn);
          added = true;
        }
      });

      // Si no coincide con ninguna categoría ponerlo en "Otros"
      if (!added) {
        if (!containers["Others"]) {
          const div = document.createElement("div");
          div.className = "syllabus-category";
          div.id = "category-others";
          const h = document.createElement("h3");
          h.textContent = "Others";
          div.appendChild(h);
          grid.appendChild(div);
          containers["Others"] = div;
        }
        containers["Others"].appendChild(btn);
      }
    });

    const params = new URLSearchParams(location.search);
    const syllabusParam = params.get("syllabus");

    if (syllabusParam) {
      const normalizedParam = normalizeString(syllabusParam);

      const matchedKey = Object.keys(topicsData).find(
        (key) => normalizeString(key) === normalizedParam,
      );

      if (matchedKey) {
        loadSyllabus(matchedKey, false);
      } else {
        showSyllabusGrid();
      }
    } else {
      showSyllabusGrid();
    }
  })
  .catch((err) => console.error("Error al cargar JSON:", err));

const BREAKDOWN_URL =
  "https://raw.githubusercontent.com/TheMichia/evals4coaches/refs/heads/main/topicsBreakdown.json?v=" +
  Date.now();

let topicsBreakdown = {};

fetch(BREAKDOWN_URL)
  .then((res) => res.json())
  .then((data) => {
    // convertir todas las keys a lowercase
    const rawBreakdown = data["Topic Breakdown"] || data;
    topicsBreakdown = {};
    Object.keys(rawBreakdown).forEach((key) => {
      topicsBreakdown[key.toLowerCase()] = rawBreakdown[key];
    });
    console.log("Breakdown loaded:", topicsBreakdown);
  })
  .catch((err) => console.error("Error loading breakdown JSON:", err));

//////////////////////////////////////////////////

// info about levels
const syllabusConfig = {
  "Juniors 5-7": {
    duracionCurso: 20,
    levelDurationWeeks: 8,
    filterLevels: [7, 9],
    nextsyllabus: "Kids (Intensivo) 8-12",
    finalcefrhtml: `<h3> Al final de este nivel tu hijo/a alcanzará un nivel de inglés elemental (A2).</h3> 
    <em>Según el Marco Común Europeo (CEFR)</em>`,
  },
  "Kids (Intensivo) 8-12": {
    duracionCurso: 36.5,
    level0DurationWeeks: 6,
    levelDurationWeeks: 14,
    filterLevels: [2, 4, 7, 9],
    nextsyllabus: "Kids Masters",
    finalcefrhtml: `<h3> Al final de este nivel tu hijo/a alcanzará un nivel de inglés intermedio (B1-B2)</h3> 
    <em>Según el Marco Común Europeo (CEFR)</em>`,
  },
  "Kids (Super Intensivo) 8-12": {
    duracionCurso: 21,
    level0DurationWeeks: 4,
    levelDurationWeeks: 8,
    filterLevels: [4, 7, 9],
    nextsyllabus: "Kids Masters",
    finalcefrhtml: `<h3> Al final de este nivel tu hijo/a alcanzará un nivel de inglés intermedio (B1-B2)</h3> 
    <em>Según el Marco Común Europeo (CEFR)</em>`,
  },
  "Kids Masters": {
    duracionCurso: 10,
    levelDurationWeeks: 4,
    filterLevels: [4, 8],
    nextsyllabus: "Kids Masters 2",
    finalcefrhtml: `<h3> Al final de este nivel tu hijo/a alcanzará un nivel de inglés Avanzado (C1)</h3> 
    <em>Según el Marco Común Europeo (CEFR)</em>`,
  },
  "Kids Masters 2": {
    duracionCurso: 10,
    levelDurationWeeks: 4,
    filterLevels: [4, 8],
    finalcefrhtml: `<h3> Al final de este nivel tu hijo/a alcanzará un nivel de inglés Avanzado (C1)</h3> 
    <em>Según el Marco Común Europeo (CEFR)</em>`,
  },
  "Teens 13-17 (3 horas/semana)": {
    duracionCurso: 24,
    level0DurationWeeks: 6,
    levelDurationWeeks: 14,
    filterLevels: [2, 4, 7, 9],
    nextsyllabus: "Teens Masters",
    finalcefrhtml: `<h3> Al final de este nivel tu hijo/a alcanzará un nivel de inglés intermedio (B1-B2)</h3> 
    <em>Según el Marco Común Europeo (CEFR)</em>`,
  },
  "Teens 13-17 (5 horas/semana)": {
    duracionCurso: 36.5,
    level0DurationWeeks: 4,
    levelDurationWeeks: 8,
    filterLevels: [4, 7, 9],
    nextsyllabus: "Teens Masters",
    finalcefrhtml: `<h3> Al final de este nivel tu hijo/a alcanzará un nivel de inglés intermedio (B1-B2)</h3> 
    <em>Según el Marco Común Europeo (CEFR)</em>`,
  },
  "Teens Masters": {
    duracionCurso: 10,
    levelDurationWeeks: 4,
    filterLevels: [4, 8],
    nextsyllabus: "Teens Masters 2",
    finalcefrhtml: `<h3> Al final de este nivel tu hijo/a alcanzará un nivel de inglés Avanzado (C1)</h3> 
    <em>Según el Marco Común Europeo (CEFR)</em>`,
  },
  "Teens Masters 2": {
    duracionCurso: 10,
    levelDurationWeeks: 4,
    filterLevels: [4, 8],
    finalcefrhtml: `<h3> Al final de este nivel tu hijo/a alcanzará un nivel de inglés Avanzado (C1)</h3> 
    <em>Según el Marco Común Europeo (CEFR)</em>`,
  },
  "Adults (3hrs/week)": {
    duracionCurso: 12,
    levelDurationWeeks: 4,
    filterLevels: [5, 8],
    nextsyllabus: "Adults Masters (3hrs/week)",
    finalcefrhtml: `<h3> Al final de este nivel alcanzarás un nivel de inglés elemental (A2).</h3> 
    <em>Según el Marco Común Europeo (CEFR)</em>`,
  },
  "Adults (5hrs/week)": {
    duracionCurso: 10,
    levelDurationWeeks: 4,
    filterLevels: [5, 8],
    nextsyllabus: "Adults Masters (3hrs/week)",
    finalcefrhtml: `<h3> Al final de este nivel alcanzarás un nivel de inglés elemental (A2).</h3> 
    <em>Según el Marco Común Europeo (CEFR)</em>`,
  },
  "Adults Masters (3hrs/week)": {
    duracionCurso: 12,
    levelDurationWeeks: 4,
    filterLevels: [5, 8],
    finalcefrhtml: `<h3> Al final de este nivel alcanzarás un nivel de inglés intermedio (B1-B2)</h3> 
    <em>Según el Marco Común Europeo (CEFR)</em>`,
  },
  "Adults Masters (5hrs/week)": {
    duracionCurso: 10,
    levelDurationWeeks: 4,
    filterLevels: [5, 8],
    finalcefrhtml: `<h3> Al final de este nivel alcanzarás un nivel de inglés intermedio (B1-B2)</h3> 
    <em>Según el Marco Común Europeo (CEFR)</em>`,
  },
};
//////////////////////////////////////////////////

// ==============================================
// FUNCIONES DE SYLLABUS & LEVELS
// ==============================================
function loadSyllabus(name, push = true) {
  topicsopened = false;
  // contains all syllabus options
  const grid = document.getElementById("syllabusGrid");
  const container = document.getElementById("MainContainer");
  const header = document.createElement("div");
  header.classList.add("header");
  // create topics element
  const topics = document.createElement("div");
  topics.classList.add("Topics");
  topics.classList.add("hidden");
  topics.id = "Topics";

  // Oculta el grid de syllabus y limpia el contenedor principal
  grid.classList.add("hidden");
  grid.classList.remove("show");
  container.classList.remove("hidden");
  container.innerHTML = "";

  if (push) {
    const url = new URL(window.location.href);
    url.searchParams.set("syllabus", name);
    history.pushState({ syllabus: name }, "", url.toString());
  }

  const data = topicsData[name];
  if (!data) return;

  // ----------------------
  // Carga the view and los levels del syllabus seleccionado
  // ----------------------
  container.appendChild(header);
  container.appendChild(topics);
  const titlediv = document.createElement("div");
  titlediv.className = "HEaderText";
  header.appendChild(titlediv);
  const title = document.createElement("h2");
  title.className = "SyllabusTitle";
  title.id = "Syllabus";
  title.textContent = name;
  if (name.includes("8-12") || name.includes("5-7")) {
    title.textContent += " años";
  } else if (name.includes("13-17")) {
    title.textContent = title.textContent.replace(/13-17/, "13-17 años");
    title.innerHTML = title.textContent.replace(
      /(\(.*?\))/,
      '<br><span style="font-size: 1.7rem; padding:-2.5rem 0; margin: -2rem 0;">$1</span>',
    );
  }
  // ===============
  // customize headers
  // ===============
  // title.textContent += " años";
  titlediv.appendChild(title);
  const cfg = syllabusConfig[name] || {};
  const filterLevels = cfg.filterLevels || [];
  const duracionCurso = cfg.duracionCurso || "--";
  const levelDurationWeeks = cfg.levelDurationWeeks || "--";

  const subtitle = document.createElement("h4");

  subtitle.textContent = `Este curso tiene una duración de ${duracionCurso} meses, haz click en cada nivel para conocer más.`;
  titlediv.appendChild(subtitle);
  const logo = document.createElement("img");
  logo.src =
    "https://raw.githubusercontent.com/TheMichia/database/refs/heads/main/logos/Logo_0000_english4kids-vector.png";
  header.appendChild(logo);
  //----------------//

  // ===============
  // LEVELS BUTTONS RENDER
  // ===============

  // Contenedor de los botones de levels
  const levelWrap = document.createElement("div");
  levelWrap.classList.add("levels-grid", "expanded");
  levelWrap.id = "levels-grid";

  // Crea los botones de niveles

  const levelButtons = [];
  Object.keys(data).forEach((levelStr) => {
    const levelNum = parseInt(levelStr, 10);

    let levelInfo = ``;
    if (filterLevels.includes(levelNum)) levelInfo = "*Nivel Filtro";

    const btn = document.createElement("button");
    btn.className = "level-btn";
    btn.dataset.level = levelNum;
    btn.onclick = () => OpenTopics(name, levelNum);

    const isMobile = mobileQuery.matches;

    renderLevelButton(btn, levelNum, levelInfo, isMobile);

    levelButtons.push({ btn, levelNum, levelInfo });
    levelWrap.appendChild(btn);
  });

  container.appendChild(levelWrap);

  const guaranteeDiv = document.createElement("div");
  guaranteeDiv.className = "Guarantee";
  guaranteeDiv.innerHTML = `
    <p class="Guarantee-Preview">
      Nuestra currícula integra los principios de <b>TPR</b><sup>1</sup>, <b>Spiral Curriculum</b> y <b>CLT</b><sup>2</sup>. Diseñada bajo estándares internacionales y respaldada por <b>metodólogos de clase mundial</b>, totalmente alineada con el <b>CEFR</b><sup>3</sup>. 
    </p>
<button class="openGuarantee" onclick="openGuarantee()">Haz clic aquí para conocer más sobre nuestra currícula</button>.
    
  `;
  container.appendChild(guaranteeDiv);
}

const mobileQuery = window.matchMedia("(max-width: 768px)");

function renderLevelButton(btn, levelNum, levelInfo, isMobile) {
  if (isMobile) {
    btn.innerHTML = `
      <div class="vLine"></div>
      <div class="levelPreview">
        <h1 class="level">Nivel ${levelNum}</h1>
        <p class="filterWarningPreview">${levelInfo}</p>
      </div>
    `;
  } else {
    btn.innerHTML = `
      <div class="WebLevelHolder">
        <div class="WebLevelSquare">
          <h1 class="level">Nivel <br> ${levelNum}</h1>
        </div>
        <p class="filterWarningPreview">${levelInfo}</p>
      </div>
    `;
  }
}

mobileQuery.addEventListener("change", (e) => {
  const buttons = document.querySelectorAll(".level-btn");

  buttons.forEach((btn) => {
    const levelNum = btn.dataset.level;
    const levelInfo =
      btn.querySelector(".filterWarningPreview")?.textContent || "";
    renderLevelButton(btn, levelNum, levelInfo, e.matches);
  });
});

//////////////////////////////////////////////////
let GuaranteeOpen = false;
function openGuarantee() {
  const MainContainer = document.getElementById("MainContainer");
  const GuaranteeExplbefore = document.createElement("div");
  GuaranteeExplbefore.className = "GuaranteeExplbefore";
  MainContainer.appendChild(GuaranteeExplbefore);
  const GuaranteeExpl = document.createElement("div");
  GuaranteeExpl.className = "GuaranteeExpl";
  GuaranteeExpl.innerHTML = `
<h1>🚀 Currícula English4Kids: Aprender Inglés Activamente</h1>

<h2>💪 Aprendizaje Activo</h2>
<p>
  Nuestra currícula Kids integra los principios de 
  <b>TPR</b> (<i>Total Physical Response</i>), 
  <b>Spiral Curriculum</b> y 
  <b>CLT</b> (<i>Communicative Language Teaching</i>).
  Esto significa que los estudiantes <b>aprenden activamente</b>: 
  escuchan, se mueven, interactúan y usan el idioma en <b>situaciones reales</b>, reforzando la comprensión y la retención del contenido.
</p>

<h2>🔄 Aprendizaje en Espiral</h2>
<p>
  Además, la currícula está diseñado en <b>espiral</b>, de manera que los temas se revisitan continuamente, <b>profundizando cada vez más</b> y permitiendo que todos los niños avancen <b>a su propio ritmo</b> sin quedarse atrás.
</p>

<h2>🌐 Estándares Internacionales</h2>
<p>
  La currícula también incorpora <b>estándares internacionales</b> desarrollados por <b>metodólogos de clase mundial</b> y se encuentra alineada con el 
  <b>Marco Común Europeo de Referencia</b> (<i>CEFR</i>), lo que nos permite <b>medir el progreso real de cada estudiante</b> y garantizar que cada nivel esté validado según criterios internacionales.
</p>

<h2>🎯 Clases Transformadoras</h2>
<p>
  En conjunto, estas metodologías aseguran que las clases sean <b>efectivas, dinámicas y transformadoras</b>, enfocadas en la acción, la comunicación y el aprendizaje significativo.
</p>



<button class="closeGuarantee" onclick="closeGuarantee()">¡Entendido!</button>`;

  GuaranteeExplbefore.appendChild(GuaranteeExpl);
}

function closeGuarantee() {
  const GuaranteeExpl = document.querySelector(".GuaranteeExpl");
  const GuaranteeExplbefore = document.querySelector(".GuaranteeExplbefore");

  if (!GuaranteeExpl || !GuaranteeExplbefore) return;

  GuaranteeExpl.classList.add("fadepopout");
  GuaranteeExplbefore.classList.add("fadeout");

  setTimeout(() => {
    GuaranteeExpl.remove();
    GuaranteeExplbefore.remove();
  }, 300);
}

// ==============================================
// CEFR INFO
// ==============================================
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
//////////////////////////////////////////////////

// ==============================================
// Normalización simple de strings 4 push links
// ==============================================
function normalizeString(str) {
  return str.trim().normalize("NFC");
}
//////////////////////////////////////////////////

// ==============================================
// ----------------------
// Abrir modal con los topics de un level
// push controla si se agrega al history
// ----------------------
// lee si está abierto para agregar animación
// ==============================================
let topicsopened = false;
function OpenTopics(syllabus, level) {
  const levelsGrid = document.getElementById("levels-grid");
  const container = document.getElementById("Topics");
  if (!container) return;

  const topics = topicsData[syllabus][level] || [];

  levelsGrid.classList.add("compressed");
  levelsGrid.classList.remove("expanded");
  container.classList.remove("hidden");

  if (topicsopened) {
    container.classList.add("out");
    setTimeout(() => {
      container.classList.remove("hidden", "out", "in");
      container.classList.add("in");
    }, 200);
  } else {
    container.classList.remove("hidden", "out", "in");
    container.classList.add("in");
  }

  topicsopened = true;
  container.innerHTML = "";

  // --------------------------
  // Título y advertencia
  // --------------------------
  const titlediv = document.createElement("div");
  const filterwarning = document.createElement("div");
  const numLevel = parseInt(level);
  const filtroLevels = syllabusConfig[syllabus]?.filterLevels || [];
  filterwarning.className = "filterwarning";
  if (filtroLevels.includes(numLevel)) {
    filterwarning.innerHTML = `
      <h3>🚨 Este es un nivel filtro</h3>
      <button onclick="FilterWarning()">¿Qué es un nivel filtro?</button>
    `;
  }
  titlediv.appendChild(filterwarning);

  const title = document.createElement("h2");
  title.className = "LevelTitle";
  title.textContent = `Nivel ${level}`;
  titlediv.appendChild(title);
  titlediv.className = "titlediv";
  container.appendChild(titlediv);

  // --------------------------
  // Duración según syllabusConfig
  // --------------------------
  const durationDiv = document.createElement("div");
  durationDiv.className = "CEFRBox";
  const config = syllabusConfig[syllabus];
  let duracion =
      numLevel === 0 ? config.level0DurationWeeks : config.levelDurationWeeks;
  durationDiv.innerHTML = `<h3 class="CEFRDur">Duración: <strong>${duracion || "-"} semanas</strong></h3>`;
  container.appendChild(durationDiv);
  // --------------------------
  // CEFR final solo en último nivel
  // --------------------------
  const levels = Object.keys(topicsData[syllabus]).map((l) => parseInt(l, 10));
  const lastLevel = levels.length ? Math.max(...levels) : 0;


console.log(levels, lastLevel)

  if (numLevel === lastLevel) {
    // 1️⃣ Add CEFR final if exists
    if (config.finalcefrhtml) {
      const cefrExtra = document.createElement("div");
      cefrExtra.className = "CEFRExtra";
      cefrExtra.innerHTML = config.finalcefrhtml;
      durationDiv.appendChild(cefrExtra);
    }

    // 2️⃣ Add Next Syllabus Button if exists
    if (config.nextsyllabus) {
      const nextBtnDiv = document.createElement("div");
      nextBtnDiv.className = "NextSyllabusButton";
      let syllabusTitle = config.nextsyllabus;
      //KIDS
      if (config.nextsyllabus.includes("Kids")) {
        //MASTERS FOR KIDS
        if (config.nextsyllabus.includes("Masters")) {
          nextBtnDiv.innerHTML += `
        <h3>También estará listo/a para nuestro curso Masters.</h3>
            <button onclick="loadSyllabus('${config.nextsyllabus}')">
              🚀  Ver lo que aprenderá en ${syllabusTitle}
            </button>
          `;
        }
        //KIDS FOR JUNIORS
        else {
          syllabusTitle = config.nextsyllabus.replace(/8-12/, "");
          nextBtnDiv.innerHTML += `
        <h3>También estará listo/a para nuestro cursos de 8 a 12 años:</h3>
        <div class="nextBtns2Options">
            <button onclick="loadSyllabus('${config.nextsyllabus}')">
               Kids (3h/semana)
            </button>
            <button onclick="loadSyllabus('Kids (Super Intensivo) 8-12')">
               Kids (5h/semana)
            </button>
            </div>
          `;
        }
      }
      //TEENS - ONLY MASTERS
      else if (config.nextsyllabus.includes("Teens")) {
        nextBtnDiv.innerHTML += `
        <h3>También estará listo/a para nuestro curso Masters.</h3>
            <button onclick="loadSyllabus('${config.nextsyllabus}')">
              🚀  Ver lo que aprenderá en ${syllabusTitle}
            </button>
          `;
      }
      //ADULTS - ONLY MASTERS - 2 OPTIONS
      else {
        nextBtnDiv.innerHTML += `  
        <h3>También estarás listo/a para uno de nuestros cursos Masters.</h3>
        <button onclick="loadSyllabus('${config.nextsyllabus}')">
          🚀  Explora ${config.nextsyllabus}
          </button>
        <button onclick="loadSyllabus('Adults Masters (5hrs/week)')">
          🚀  Explora Adults Masters (5hrs/week)
          </button>
          `;
      }

      durationDiv.appendChild(nextBtnDiv);
      container.appendChild(durationDiv);
    }
  }

  // --------------------------
  // Subtítulo
  // --------------------------
  const H3 = document.createElement("h3");
  H3.className = "LevelSubtitle";
  H3.textContent = `En este nivel aprenderá a:`;
  container.appendChild(H3);

  // --------------------------
  // Topics table
  // --------------------------
  const topicsSpace = document.createElement("div");
  topicsSpace.className = "topicsSpace";
  const table = document.createElement("table");
  const tbody = document.createElement("tbody");

  topics.forEach((t) => {
    const simpleText = simpleBreakdownLower[t.toLowerCase()] || t;
    const desc = topicsBreakdown[t.toLowerCase()] || "-";

    const trTopic = document.createElement("tr");
    trTopic.innerHTML = `<td class="TopicName">● ${simpleText}</td>`;

    const trDesc = document.createElement("tr");
    trDesc.classList.add("description-row");
    trDesc.innerHTML = `<td class="TopicsDescription compressed">${desc}</td>`;

    const toggleBtn = document.createElement("tr");
    toggleBtn.innerHTML = `<td><span class="toggle-desc">▼ Conocer más</span></td>`;
    const toggle = toggleBtn.querySelector(".toggle-desc");
    const descCell = trDesc.querySelector(".TopicsDescription");

    toggle.onclick = () => {
      const isOpen = descCell.classList.toggle("expanded");
      descCell.classList.toggle("compressed", !isOpen);
      toggle.textContent = isOpen ? "▲ Contraer" : "▼ Conocer más";
    };

    tbody.appendChild(trTopic);
    tbody.appendChild(trDesc);
    tbody.appendChild(toggleBtn);
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
}

//////////////////////////////////////////////////

// ----------------------
// Cerrar topics
// ----------------------
function closeTopics() {
  const container = document.getElementById("Topics");
  if (!container) return; 

  const levelsGrid = document.getElementById("levels-grid");
  if (levelsGrid) {
    levelsGrid.classList.remove("compressed");
    levelsGrid.classList.add("expanded");
  }

  container.classList.remove("in");
  container.classList.add("out");

  topicsopened = false;

  setTimeout(() => {
    container.classList.add("hidden");
  }, 300);

  const levelsContainer = document.querySelector(".levels-container");
  if (levelsContainer) {
    levelsContainer.classList.remove("compressed");
    levelsContainer.classList.add("expanded");
  }
}

//////////////////////////////////////////////////

// ==============================================
// this function resets the view to the grid overview
// ==============================================
function showSyllabusGrid() {
  const grid = document.getElementById("syllabusGrid");
  const container = document.getElementById("viewContainer");
  container.innerHTML = "";
  grid.style.display = "flex";
}
//////////////////////////////////////////////////

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
    Un <strong>nivel filtro</strong> es un punto de control que nos permite verificar que cada estudiante tenga las habilidades necesarias para avanzar al siguiente nivel de inglés. Evaluamos <strong>gramática, comprensión, pronunciacón, fluidez y entonación</strong>.
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

// ==============================================
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("open-topic")) {
    const syllabus = e.target.dataset.syllabus;
    const topic = e.target.dataset.topic;
    renderTopicPage(syllabus, topic);
  }
});
//////////////////////////////////////////////////

// ==============================================
window.addEventListener("popstate", () => {
  const params = new URLSearchParams(location.search);
  const syllabusParam = params.get("syllabus");

  if (syllabusParam) {
    const normalizedParam = normalizeString(syllabusParam);
    const matchedKey = Object.keys(topicsData).find(
      (key) => normalizeString(key) === normalizedParam,
    );

    if (matchedKey) {
      loadSyllabus(matchedKey, false);
      return;
    }
  }

  showSyllabusGrid();
});

//////////////////////////////////////////////////

// Espera a que Animate termine de cargar
window.addEventListener("load", () => {
  const canvas = document.getElementById("canvas");

  // exportRoot lo crea Animate (ya existe)
  exportRoot.gotoAndStop("idle");

  let isHovering = false;

  canvas.addEventListener("mouseenter", () => {
    if (isHovering) return;
    isHovering = true;
    exportRoot.gotoAndPlay("hover");
  });

  canvas.addEventListener("mouseleave", () => {
    if (!isHovering) return;
    isHovering = false;
    exportRoot.gotoAndPlay("out");
  });
});
