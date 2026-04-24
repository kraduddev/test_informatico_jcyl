/**
 * app.js
 * Punto de entrada principal.
 * Gestiona la navegación entre pantallas y conecta los módulos.
 */

import { initManifest } from './manifest.js';
import {
  startQuiz, nextCard, retryQuiz,
  selectAllTopics, getCurrentTest, handleBlank
} from './quiz.js';
import { renderStats, handleClearHistory } from './stats.js';
import { renderPorExamen, renderPorCategoria } from './supuestos.js';

// ─── Pantallas donde se oculta el botón de estadísticas ───────────────────────
const SUPUESTOS_SCREENS = ['supuestos-menu', 'supuestos-examenes', 'supuestos-categorias'];

// ─── Navegación entre pantallas ───────────────────────────────────────────────

export function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(`screen-${name}`);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  // Mostrar/ocultar botón de estadísticas
  const btnStats = document.getElementById('btn-go-stats');
  if (btnStats) {
    btnStats.style.display = SUPUESTOS_SCREENS.includes(name) ? 'none' : '';
  }
}

// ─── Bootstrap ────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {

  // Pantalla inicial
  showScreen('dashboard');

  // Logo → volver al dashboard desde cualquier pantalla
  document.getElementById('btn-logo').addEventListener('click', e => {
    e.preventDefault();
    import('./manifest.js').then(m => m.clearSessionState());
    showScreen('dashboard');
  });

  // ── Dashboard ─────────────────────────────────────────────────────────────
  document.getElementById('btn-go-tests').addEventListener('click', () => {
    showScreen('tests');
    initManifest();
  });

  document.getElementById('btn-go-supuestos').addEventListener('click', () => {
    showScreen('supuestos-menu');
  });

  // ── Selector de tests ─────────────────────────────────────────────────────
  document.getElementById('btn-back-from-tests').addEventListener('click', () => {
    showScreen('dashboard');
  });

  document.getElementById('btn-go-stats').addEventListener('click', () => {
    renderStats();
    showScreen('stats');
  });

  // ── Supuestos: menú ───────────────────────────────────────────────────────
  document.getElementById('btn-back-from-supuestos-menu').addEventListener('click', () => {
    showScreen('dashboard');
  });

  document.getElementById('btn-go-examenes').addEventListener('click', () => {
    showScreen('supuestos-examenes');
    renderPorExamen();
  });

  document.getElementById('btn-go-categorias').addEventListener('click', () => {
    showScreen('supuestos-categorias');
    renderPorCategoria();
  });

  // ── Supuestos: por examen ─────────────────────────────────────────────────
  document.getElementById('btn-back-from-examenes').addEventListener('click', () => {
    showScreen('supuestos-menu');
  });

  // ── Supuestos: por categoría ──────────────────────────────────────────────
  document.getElementById('btn-back-from-categorias').addEventListener('click', () => {
    showScreen('supuestos-menu');
  });

  // ── Configuración ─────────────────────────────────────────────────────────
  document.getElementById('btn-select-all').addEventListener('click', () => selectAllTopics(true));
  document.getElementById('btn-deselect-all').addEventListener('click', () => selectAllTopics(false));
  document.getElementById('btn-start-quiz').addEventListener('click', startQuiz);
  document.getElementById('btn-back-from-config').addEventListener('click', () => {
    showScreen('tests');
    initManifest();
  });

  // ── Quiz ──────────────────────────────────────────────────────────────────
  document.getElementById('btn-next').addEventListener('click', nextCard);
  document.getElementById('btn-blank').addEventListener('click', handleBlank);
  document.getElementById('btn-quit-quiz').addEventListener('click', () => {
    if (confirm('¿Salir del test actual? El progreso de esta sesión se perderá.')) {
      import('./manifest.js').then(m => m.clearSessionState());
      showScreen('tests');
      initManifest();
    }
  });

  // ── Resultados ────────────────────────────────────────────────────────────
  document.getElementById('btn-retry').addEventListener('click', retryQuiz);
  document.getElementById('btn-back-from-results').addEventListener('click', () => {
    showScreen('dashboard');
  });
  document.getElementById('btn-results-go-stats').addEventListener('click', () => {
    renderStats();
    showScreen('stats');
  });

  // ── Estadísticas ──────────────────────────────────────────────────────────
  document.getElementById('btn-clear-history').addEventListener('click', handleClearHistory);
  document.getElementById('btn-back-from-stats').addEventListener('click', () => {
    showScreen('dashboard');
  });
});
