/**
 * Calculadora de Notas - Yeraldine
 * Versión limpia con simulador modal, Inter, design tokens
 */

import { CURSOS, STORAGE_KEY, NOTA_MINIMA_APROBAR, NOTA_MAX } from './data.js';

let state = { notas: {}, metas: {} };

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

function round2(val) { return Math.round(val * 100) / 100; }

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) { const p = JSON.parse(saved); state.notas = p.notas || {}; state.metas = p.metas || {}; }
  } catch (e) { console.warn('Error cargando localStorage:', e); }
}

function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { console.error('Error guardando:', e); }
}

function calcularNotaCurso(curso) {
  const notasCurso = state.notas[curso.id] || {};
  let sumaPonderada = 0, pesoIngresado = 0;
  for (const prod of curso.productos) {
    const nota = notasCurso[prod.id];
    if (nota !== undefined && nota !== null && nota !== '') {
      sumaPonderada += nota * prod.peso; pesoIngresado += prod.peso;
    }
  }
  if (pesoIngresado === 0) return { notaFinal: null, notaParcial: null, pesoIngresado: 0 };
  return { notaFinal: round2(sumaPonderada / 100), notaParcial: round2(sumaPonderada / pesoIngresado * 100), pesoIngresado };
}

function calcularSimulador(curso) {
  const meta = state.metas[curso.id] || NOTA_MINIMA_APROBAR;
  const calc = calcularNotaCurso(curso);
  const pesoPendiente = 100 - calc.pesoIngresado;
  if (pesoPendiente <= 0) return { mensaje: '✅ Todos los productos tienen nota', necesario: null, meta };
  const aporteActual = calc.notaParcial ? (calc.notaParcial * calc.pesoIngresado / 100) : 0;
  const necesario = round2((meta * 100 - aporteActual) / pesoPendiente);
  let mensaje = '';
  if (necesario <= 0) mensaje = `✅ Ya alcanzaste tu meta de ${meta} sin necesidad de más notas.`;
  else if (necesario > NOTA_MAX) mensaje = `❌ Necesitas <strong>${necesario}</strong> en lo pendiente (máx: ${NOTA_MAX}). Meta ${meta} inalcanzable.`;
  else if (necesario > 17) mensaje = `⚠️ Necesitas <strong>${necesario}</strong> en promedio en lo que falta. Muy exigente.`;
  else if (necesario >= NOTA_MINIMA_APROBAR) mensaje = `📝 Necesitas <strong>${necesario}</strong> en promedio en lo pendiente para llegar a ${meta}.`;
  else mensaje = `🎯 Necesitas <strong>${necesario}</strong> en promedio en lo pendiente. ¡Factible!`;
  return { mensaje, necesario, meta, pesoPendiente, notaActual: calc.notaParcial };
}

function calcularResumen() {
  let totalCreditos = 0, totalNotaCred = 0;
  const cursosResumen = CURSOS.map(curso => {
    const calc = calcularNotaCurso(curso);
    const notaFinal = calc.notaFinal, creditos = curso.creditos;
    if (notaFinal !== null) { totalCreditos += creditos; totalNotaCred += notaFinal * creditos; }
    return { curso, notaFinal, creditos, estado: notaFinal !== null ? (notaFinal >= 11 ? 'aprobado' : 'desaprobado') : 'pendiente', meta: state.metas[curso.id] || '' };
  });
  const promedioPonderado = totalCreditos > 0 ? round2(totalNotaCred / totalCreditos) : null;
  const estadoGeneral = promedioPonderado !== null ? (promedioPonderado >= 11 ? 'aprobado' : 'desaprobado') : 'pendiente';
  return { cursosResumen, totalCreditos, totalNotaCred: round2(totalNotaCred), promedioPonderado, estadoGeneral };
}

// ========== RENDER ==========
function renderResumen() {
  const { cursosResumen, totalCreditos, totalNotaCred, promedioPonderado, estadoGeneral } = calcularResumen();
  const tbody = $('#tbody-resumen'); tbody.innerHTML = '';
  cursosResumen.forEach(({ curso, notaFinal, creditos, estado, meta }) => {
    const tr = document.createElement('tr');
    const notaClass = notaFinal !== null ? (notaFinal >= 11 ? 'aprobado' : 'desaprobado') : '';
    const estadoTexto = estado === 'aprobado' ? 'APROBADO' : estado === 'desaprobado' ? 'DESAPROBADO' : 'PENDIENTE';
    const estadoIcon = estado === 'aprobado' ? '✓' : estado === 'desaprobado' ? '✗' : '⏳';
    tr.innerHTML = `<td><strong>${curso.nombre}</strong><br><small>${curso.codigo}</small></td><td class="numeric">${creditos}</td><td class="numeric ${notaClass}">${notaFinal !== null ? notaFinal.toFixed(2) : '—'}</td><td><span class="estado ${estado}">${estadoIcon} ${estadoTexto}</span></td><td class="numeric"><input type="number" class="meta-input" data-curso="${curso.id}" value="${meta}" min="0" max="20" step="0.1" inputmode="decimal" aria-label="Meta para ${curso.nombre}"></td>`;
    tbody.appendChild(tr);
  });
  $('#promedio-ponderado').textContent = promedioPonderado !== null ? promedioPonderado.toFixed(2) : '—';
  $('#promedio-ponderado').className = 'promedio-ponderado ' + (promedioPonderado !== null ? (promedioPonderado >= 11 ? 'aprobado' : 'desaprobado') : '');
  $('#estado-general').innerHTML = `<span class="estado ${estadoGeneral}">${estadoGeneral === 'aprobado' ? '✓ APROBADO' : estadoGeneral === 'desaprobado' ? '✗ DESAPROBADO' : '⏳ PENDIENTE'}</span>`;
  $('#total-creditos').textContent = totalCreditos;
  $$('.meta-input').forEach(input => input.addEventListener('change', e => { state.metas[e.target.dataset.curso] = parseFloat(e.target.value) || ''; saveState(); renderResumen(); }));
}

function renderCursos() {
  const container = $('#cursos-container'); container.innerHTML = '';
  CURSOS.forEach(curso => {
    const calc = calcularNotaCurso(curso); const sim = calcularSimulador(curso); const notasCurso = state.notas[curso.id] || {};
    const card = document.createElement('section'); card.className = 'card'; card.id = `curso-${curso.id}`;
    let filas = '';
    curso.productos.forEach(prod => {
      const nota = notasCurso[prod.id]; const aporte = nota !== undefined && nota !== null && nota !== '' ? round2(nota * prod.peso / 100) : '';
      const estado = nota !== undefined && nota !== null && nota !== '' ? (nota >= 11 ? 'ok' : 'no') : '';
      const estadoTxt = estado === 'ok' ? '✓' : estado === 'no' ? '✗' : '⏳';
      filas += `<tr><td>${prod.id} - ${prod.nombre}</td><td>${prod.peso}%</td><td><input type="number" class="nota-input" data-curso="${curso.id}" data-producto="${prod.id}" value="${nota !== undefined && nota !== null && nota !== '' ? nota : ''}" min="0" max="${NOTA_MAX}" step="0.1" placeholder="0-20" aria-label="Nota para ${prod.nombre}"></td><td class="aporte">${aporte !== '' ? aporte.toFixed(2) : '—'}</td><td class="estado ${estado}">${estadoTxt}</td></tr>`;
    });
    const notaFinalClass = calc.notaFinal !== null ? (calc.notaFinal >= 11 ? 'aprobado' : 'desaprobado') : '';
    const notaFinalIcon = calc.notaFinal !== null ? (calc.notaFinal >= 11 ? '✓' : '✗') : '⏳';
    const notaFinalTexto = calc.notaFinal !== null ? (calc.notaFinal >= 11 ? 'APROBADO' : 'DESAPROBADO') : 'PENDIENTE';
    filas += `<tr class="nota-final-row ${notaFinalClass}"><td colspan="2"><strong>NOTA FINAL DEL CURSO</strong></td><td class="nota-final ${notaFinalClass}">${calc.notaFinal !== null ? calc.notaFinal.toFixed(2) : '—'}</td><td></td><td><span class="estado ${notaFinalClass}">${notaFinalIcon} ${notaFinalTexto}</span></td></tr>`;
    filas += `<tr class="simulador-row"><td colspan="5"><div class="simulador-row-content"><strong>Simulador:</strong> Meta <strong>${sim.meta}</strong> · Peso ingresado <strong>${calc.pesoIngresado}%</strong> · Pendiente <strong>${sim.pesoPendiente || 0}%</strong> · Nota actual <strong>${calc.notaParcial !== null ? calc.notaParcial.toFixed(2) : '—'}</strong></div></td></tr>`;
    const cardEl = document.createElement('section'); cardEl.className = 'card'; cardEl.id = `curso-${curso.id}`;
    cardEl.innerHTML = `<div class="curso-header"><h3>${curso.nombre} <small>(${curso.codigo})</small></h3><div class="curso-meta"><label for="meta-${curso.id}">Mi meta: <input type="number" id="meta-${curso.id}" class="meta-input" data-curso="${curso.id}" value="${state.metas[curso.id] || ''}" min="0" max="20" step="0.1" inputmode="decimal"></label></div></div><table class="tabla-curso" aria-label="Productos de ${curso.nombre}"><thead><tr><th>Producto</th><th>Peso</th><th>Nota (0-20)</th><th>Aporte</th><th>Estado</th></tr></thead><tbody>${filas}</tbody></table>`;
    container.appendChild(cardEl);
  });
  $$('.nota-input').forEach(input => { input.addEventListener('input', e => { const val = e.target.value === '' ? null : parseFloat(e.target.value); const cursoId = e.target.dataset.curso; const prodId = e.target.dataset.producto; if (val !== null && (isNaN(val) || val < 0 || val > NOTA_MAX)) { e.target.classList.add('invalid'); e.target.classList.remove('valid'); } else { e.target.classList.remove('invalid'); if (val !== null) e.target.classList.add('valid'); } if (!state.notas[cursoId]) state.notas[cursoId] = {}; state.notas[cursoId][prodId] = val; saveState(); renderAll(); }); input.addEventListener('blur', e => { if (e.target.value === '') e.target.classList.remove('valid', 'invalid'); }); });
  $$('.meta-input').forEach(input => input.addEventListener('change', e => { state.metas[e.target.dataset.curso] = parseFloat(e.target.value) || ''; saveState(); renderResumen(); }));
}

function renderAll() { renderResumen(); renderCursos(); }

// ========== EXPORT / IMPORT / RESET ==========
$('#btn-export').addEventListener('click', () => { const data = { version: '1.0', fecha: new Date().toISOString(), semestre: '2026-2', notas: state.notas, metas: state.metas }; const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `notas-yeraldine-${new Date().toISOString().split('T')[0]}.json`; a.click(); URL.revokeObjectURL(url); });
$('#btn-import').addEventListener('click', () => $('#file-import').click());
$('#file-import').addEventListener('change', e => { const file = e.target.files[0]; if (!file) return; const reader = new FileReader(); reader.onload = ev => { try { const data = JSON.parse(ev.target.result); if (data.notas) state.notas = data.notas; if (data.metas) state.metas = data.metas; saveState(); renderAll(); alert('✅ Backup restaurado correctamente'); } catch (err) { alert('❌ Error: ' + err.message); } e.target.value = ''; }; reader.readAsText(file); });
$('#btn-reset').addEventListener('click', () => { if (confirm('¿Borrar TODAS las notas y metas? No se puede deshacer.')) { state.notas = {}; state.metas = {}; saveState(); renderAll(); } });

// ========== INIT ==========
loadState(); renderAll();
console.log('✅ Calculadora de Notas cargada'); console.log('💾 Datos en localStorage:', STORAGE_KEY);