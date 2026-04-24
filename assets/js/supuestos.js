/**
 * supuestos.js
 * Gestiona la carga y renderizado de supuestos prácticos.
 * Modos: por examen (agrupado por origen) y por categoría.
 */

const DATA_URL = 'supuestos/categorias.json';
let cachedData = null;

async function loadData() {
  if (cachedData) return cachedData;
  const res = await fetch(DATA_URL);
  if (!res.ok) throw new Error('No se pudo cargar los supuestos prácticos.');
  cachedData = await res.json();
  return cachedData;
}

// ─── Renderizado por EXAMEN ────────────────────────────────────────────────────

export async function renderPorExamen() {
  const container = document.getElementById('examenes-content');
  container.innerHTML = '<div class="loader-wrap"><div class="loader"></div></div>';

  try {
    const { categorias } = await loadData();

    // Agrupar todas las preguntas de todas las categorías por origen
    const grupos = {}; // { origen: [ { ...pregunta, categoria } ] }
    categorias.forEach(cat => {
      cat.preguntas.forEach(p => {
        if (!grupos[p.origen]) grupos[p.origen] = [];
        grupos[p.origen].push({ ...p, categoria: cat });
      });
    });

    // Ordenar orígenes cronológicamente (por el año que aparece en el string)
    const origenesOrdenados = Object.keys(grupos).sort((a, b) => {
      const yearA = parseInt(a.match(/\d{4}/)?.[0] || '0');
      const yearB = parseInt(b.match(/\d{4}/)?.[0] || '0');
      if (yearA !== yearB) return yearA - yearB;
      return a.localeCompare(b);
    });

    if (!origenesOrdenados.length) {
      container.innerHTML = '<p class="supuestos-empty">No hay supuestos disponibles.</p>';
      return;
    }

    container.innerHTML = origenesOrdenados.map((origen, idx) => {
      const preguntas = grupos[origen];
      return `
        <div class="supuesto-group">
          <button class="supuesto-group-header" data-group="${idx}" aria-expanded="false">
            <span class="supuesto-group-title">
              <span class="supuesto-origen-badge">${origen}</span>
              <span class="supuesto-group-count">${preguntas.length} pregunta${preguntas.length !== 1 ? 's' : ''}</span>
            </span>
            <svg class="chevron" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                 fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          <div class="supuesto-group-body" id="group-body-${idx}">
            ${preguntas.map((p, pi) => renderPreguntaCard(p, pi, true)).join('')}
          </div>
        </div>
      `;
    }).join('');

    bindAccordions(container);
  } catch (err) {
    container.innerHTML = `<p class="supuestos-error">${err.message}</p>`;
  }
}

// ─── Renderizado por CATEGORÍA ─────────────────────────────────────────────────

export async function renderPorCategoria() {
  const container = document.getElementById('categorias-content');
  container.innerHTML = '<div class="loader-wrap"><div class="loader"></div></div>';

  try {
    const { categorias } = await loadData();

    if (!categorias.length) {
      container.innerHTML = '<p class="supuestos-empty">No hay categorías disponibles.</p>';
      return;
    }

    container.innerHTML = categorias.map((cat, idx) => `
      <div class="supuesto-group">
        <button class="supuesto-group-header" data-group="cat-${idx}" aria-expanded="false">
          <span class="supuesto-group-title">
            <span class="supuesto-cat-name">${cat.nombre}</span>
            <span class="supuesto-group-count">${cat.preguntas.length} pregunta${cat.preguntas.length !== 1 ? 's' : ''}</span>
          </span>
          <svg class="chevron" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
        <div class="supuesto-group-body" id="group-body-cat-${idx}">
          <!-- Meta de la categoría -->
          <div class="supuesto-cat-meta">
            <div class="supuesto-meta-block">
              <span class="supuesto-meta-label">Conceptos core</span>
              <div class="supuesto-tags">
                ${cat.conceptos_core.map(c => `<span class="tag tag-core">${c}</span>`).join('')}
              </div>
            </div>
            <div class="supuesto-meta-block">
              <span class="supuesto-meta-label">Leyes relacionadas</span>
              <div class="supuesto-tags">
                ${cat.leyes_relacionadas.map(l => `<span class="tag tag-ley">${l}</span>`).join('')}
              </div>
            </div>
          </div>
          <!-- Preguntas de la categoría -->
          ${cat.preguntas.map((p, pi) => renderPreguntaCard(p, pi, false)).join('')}
        </div>
      </div>
    `).join('');

    bindAccordions(container);
  } catch (err) {
    container.innerHTML = `<p class="supuestos-error">${err.message}</p>`;
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function renderPreguntaCard(pregunta, idx, showCategoria) {
  const { origen, enunciado, plantilla_solucion, categoria } = pregunta;
  return `
    <div class="pregunta-card">
      <div class="pregunta-card-header">
        <span class="supuesto-origen-badge">${origen}</span>
        ${showCategoria ? `<span class="tag tag-core" style="margin-left:.5rem">${categoria.nombre}</span>` : ''}
        <span class="pregunta-num">P${idx + 1}</span>
      </div>
      <p class="pregunta-enunciado">${enunciado}</p>

      ${showCategoria ? `
      <div class="supuesto-meta-inline">
        <div class="supuesto-meta-block">
          <span class="supuesto-meta-label">Conceptos core</span>
          <div class="supuesto-tags">
            ${categoria.conceptos_core.map(c => `<span class="tag tag-core">${c}</span>`).join('')}
          </div>
        </div>
        <div class="supuesto-meta-block">
          <span class="supuesto-meta-label">Leyes relacionadas</span>
          <div class="supuesto-tags">
            ${categoria.leyes_relacionadas.map(l => `<span class="tag tag-ley">${l}</span>`).join('')}
          </div>
        </div>
      </div>
      ` : ''}

      <button class="pregunta-plantilla-toggle" data-pi="${idx}">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
             fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
        Ver plantilla de respuesta
      </button>
      <div class="pregunta-plantilla" style="display:none">
        <strong>💡 Plantilla de respuesta</strong>
        <p>${plantilla_solucion}</p>
      </div>
    </div>
  `;
}

function bindAccordions(container) {
  // Acordeones de grupos (examen / categoría)
  container.querySelectorAll('.supuesto-group-header').forEach(btn => {
    btn.addEventListener('click', () => {
      const bodyId = `group-body-${btn.dataset.group}`;
      const body = document.getElementById(bodyId);
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      body.classList.toggle('open', !expanded);
    });
  });

  // Toggles de plantilla de respuesta dentro de preguntas
  container.querySelectorAll('.pregunta-plantilla-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const plantilla = btn.nextElementSibling;
      const open = plantilla.style.display !== 'none';
      plantilla.style.display = open ? 'none' : 'block';
      btn.classList.toggle('active', !open);
      btn.querySelector('svg').style.transform = open ? '' : 'rotate(180deg)';
    });
  });
}

