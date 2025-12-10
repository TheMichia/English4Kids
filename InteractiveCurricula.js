(() => {
  const version = "Students";
  const versionnum = "0.0.1";
  const jsonVersion = 0.1;
  window.appVersion = version;
  document.getElementById("version").innerHTML =
    `${version} ${versionnum} - JSON ${jsonVersion}`;
})();

let topicsData = {};
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

    // mostrar grid por defecto
    showSyllabusGrid();

    const params = new URLSearchParams(location.search);
    const syllabusParam = params.get("syllabus");
    if (syllabusParam && topicsData[syllabusParam]) {
      loadSyllabus(syllabusParam, false);
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
    topicsBreakdown = data["Topic Breakdown"] || data;
    console.log("Breakdown loaded:", topicsBreakdown);
  })
  .catch((err) => console.error("Error loading breakdown JSON:", err));

// --------------------------------------------------
// Variables usadas por la lógica de hover/timeout
let hoverCloseTimeout = null;
const HOVER_CLOSE_DELAY = 180; // ms (ajustable)
// --------------------------------------------------






// ==============================================
// FUNCIONES DE SYLLABUS & LEVELS
// ==============================================

// ----------------------
// Carga los levels del syllabus seleccionado
// ----------------------
function loadSyllabus(name, push = true) {
  const grid = document.getElementById("syllabusGrid");
  const container = document.getElementById("viewContainer");

  // Oculta el grid de syllabus y limpia el contenedor principal
  grid.style.display = "none";
  container.innerHTML = "";

  // Si push=true, agrega al historial del navegador
  if (push) {
    history.pushState(
      { syllabus: name },
      "",
      `?syllabus=${encodeURIComponent(name)}`,
    );
  }

  const data = topicsData[name];

  // Título del syllabus
  const title = document.createElement("h2");
  title.textContent = name;
  container.appendChild(title);

  // Contenedor de los botones de levels
  const levelWrap = document.createElement("div");
  levelWrap.className = "levels-grid";

  // Recorremos los levels del syllabus
  Object.keys(data).forEach((level) => {
    const btn = document.createElement("button");
    btn.className = "level-btn";
    btn.textContent = `Level ${level}`;

    const openLevel = (doPush = true) => {
      const modal = document.getElementById("modal");

      // Cancelar cierre pendiente
      if (hoverCloseTimeout) {
        clearTimeout(hoverCloseTimeout);
        hoverCloseTimeout = null;
      }

      // Si ya está abierto, cerrarlo primero
      if (modal.classList.contains("show")) {
        modal.classList.remove("show");
        // opcional: limpiar contenido antes de renderizar nuevo
        document.getElementById("modalContent").innerHTML = "";
      }

      // Abrir modal como si fuera click
      openLevelPopup(name, level, doPush, btn);
    };

    // Click = abre modal y actualiza historial
    btn.onclick = () => openLevel(true);

    // Hover = reemplaza modal actual, simulando click
    btn.onmouseenter = () => {
      // Cancelar cierre pendiente
      if (hoverCloseTimeout) {
        clearTimeout(hoverCloseTimeout);
        hoverCloseTimeout = null;
      }

      // Abrir modal
      openLevel(false);
    };

    btn.onmouseleave = () => {
      hoverCloseTimeout = setTimeout(() => {
        const modal = document.getElementById("modal");
        // Solo cerrar si el mouse NO está sobre el modal ni sobre el botón
        const isOverModal = modal && modal.matches(":hover");
        const isOverBtn = btn.matches(":hover");

        if (!isOverModal && !isOverBtn) {
          modal.classList.remove("show");
        }
        hoverCloseTimeout = null;
      }, HOVER_CLOSE_DELAY);
    };

    // Además, el modal también debe cancelar el cierre si entras sobre él
    modal.onmouseenter = () => {
      if (hoverCloseTimeout) {
        clearTimeout(hoverCloseTimeout);
        hoverCloseTimeout = null;
      }
    };

    // Y al salir del modal, intentar cerrarlo
    modal.onmouseleave = () => {
      hoverCloseTimeout = setTimeout(() => {
        const btns = document.querySelectorAll(".level-btn");
        const anyBtnHover = Array.from(btns).some(b => b.matches(":hover"));
        if (!anyBtnHover) {
          modal.classList.remove("show");
        }
        hoverCloseTimeout = null;
      }, HOVER_CLOSE_DELAY);
    };


    levelWrap.appendChild(btn);
  });


  container.appendChild(levelWrap);

  // Botón de Back para volver al grid de syllabus
  const back = document.createElement("button");
  back.textContent = "⟵ Back";
  back.onclick = resetView;
  container.prepend(back);
}

// ----------------------
// Normalización simple de strings
// ----------------------
function normalizeString(str) {
  return str.trim().normalize("NFC");
}

// ----------------------
// Abrir modal con los topics de un level
// push controla si se agrega al history
// triggeringBtn sirve para posicionar el modal según el botón
// ----------------------
function openLevelPopup(syllabus, level, push = true, triggeringBtn = null) {
  const modal = document.getElementById("modal");
  const content = document.getElementById("modalContent");
  const topics = topicsData[syllabus][level];

  // RENDER de topics dentro del modal
  content.innerHTML = `
    <h2 class="LevelTitle">Level ${level}</h2>
    <div class="topicsSpace">
      <table><tbody>
        ${topics.map(t => `
          <tr><td class="topic">${t}</td></tr>
          <tr><td class="topicDescription">${topicsBreakdown[t] || "No description available"}</td></tr>
        `).join("")}
      </tbody></table>
    </div>
    <button id="closeModal">X</button>
  `;

  // Posiciona modal según el botón del level (top, center, bottom)
  // if (triggeringBtn) {
  //   const rect = triggeringBtn.getBoundingClientRect();
  //   const btnY = rect.top + rect.height / 2;
  //   const center = window.innerHeight / 2;

  //   modal.classList.remove("modal-top", "modal-center", "modal-bottom");
  //   modal.classList.add(
  //     btnY < center * 0.75 ? "modal-top" :
  //     btnY > center * 1.25 ? "modal-bottom" :
  //     "modal-center"
  //   );
  // }

  // Muestra el modal
  modal.classList.add("show");

  // ----------------------
  // Cierre del modal
  // ----------------------
  // Botón X cierra modal
  document.getElementById("closeModal").onclick = () => modal.classList.remove("show");

  // Click fuera del contenido cierra modal
  modal.onclick = (e) => { 
    if (e.target === modal) modal.classList.remove("show"); 
  };
}

// this function resets the view to the grid overview.
function showSyllabusGrid() {
  const grid = document.getElementById("syllabusGrid");
  const container = document.getElementById("viewContainer");
  container.innerHTML = "";
  grid.style.display = "flex"; 
}


document.addEventListener("click", (e) => {
  if (e.target.classList.contains("open-topic")) {
    const syllabus = e.target.dataset.syllabus;
    const topic = e.target.dataset.topic;
    renderTopicPage(syllabus, topic);
  }
});


window.addEventListener("popstate", (e) => {
  if (e.state?.syllabus) {
    loadSyllabus(e.state.syllabus, false);
  } else {
    showSyllabusGrid();
  }
});


window.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const auto = urlParams.get("syllabus");

  if (auto && topicsData[auto]) {
    loadSyllabus(auto, false);
  }
});
