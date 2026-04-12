/**
 * app.js
 * Punto de entrada principal.
 * Gestiona la navegación entre pantallas y conecta los módulos.
 */

import { initManifest } from './manifest.js';
import {
  startQuiz, nextCard, retryQuiz,
  selectAllTopics, getCurrentTest
} from './quiz.js';
import { renderStats, handleClearHistory } from './stats.js';

// ─── Navegación entre pantallas ───────────────────────────────────────────────

export function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(`screen-${name}`);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// ─── Bootstrap ────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {

  // Pantalla inicial
  showScreen('selector');
  initManifest();

  // Logo → volver al inicio desde cualquier pantalla
  document.getElementById('btn-logo').addEventListener('click', e => {
    e.preventDefault();
    import('./manifest.js').then(m => m.clearSessionState());
    showScreen('selector');
    initManifest();
  });

  // ── Selector ──────────────────────────────────────────────────────────────
  document.getElementById('btn-go-stats').addEventListener('click', () => {
    renderStats();
    showScreen('stats');
  });

  // ── Configuración ─────────────────────────────────────────────────────────
  document.getElementById('btn-select-all').addEventListener('click', () => selectAllTopics(true));
  document.getElementById('btn-deselect-all').addEventListener('click', () => selectAllTopics(false));
  document.getElementById('btn-start-quiz').addEventListener('click', startQuiz);
  document.getElementById('btn-back-from-config').addEventListener('click', () => {
    showScreen('selector');
    initManifest();
  });

  // ── Quiz ──────────────────────────────────────────────────────────────────
  document.getElementById('btn-next').addEventListener('click', nextCard);
  document.getElementById('btn-quit-quiz').addEventListener('click', () => {
    if (confirm('¿Salir del test actual? El progreso de esta sesión se perderá.')) {
      // Limpiar sesión en curso
      import('./manifest.js').then(m => m.clearSessionState());
      showScreen('selector');
      initManifest();
    }
  });

  // ── Resultados ────────────────────────────────────────────────────────────
  document.getElementById('btn-retry').addEventListener('click', retryQuiz);
  document.getElementById('btn-back-from-results').addEventListener('click', () => {
    showScreen('selector');
    initManifest();
  });
  document.getElementById('btn-results-go-stats').addEventListener('click', () => {
    renderStats();
    showScreen('stats');
  });

  // ── Estadísticas ──────────────────────────────────────────────────────────
  document.getElementById('btn-clear-history').addEventListener('click', handleClearHistory);
  document.getElementById('btn-back-from-stats').addEventListener('click', () => {
    showScreen('selector');
    initManifest();
  });
});

