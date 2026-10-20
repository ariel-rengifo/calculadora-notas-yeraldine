/**
 * Calculadora de Notas - Yeraldine
 * Capa de orquestación: estado, persistencia, render, eventos
 */

import { CURSOS, STORAGE_KEY, NOTA_MINIMA_APROBAR, NOTA_MAX } from './data.js';
import { calcularNotaCurso, calcularSimulador, calcularResumen, round2 } from './calculations.js';

let state = { notas: {}, metas: {} };

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const p = JSON.parse(saved);
      state.notas = (p.notas && typeof p.notas === 'object') ? p.notas : {};
      state.metas = (p.metas && typeof p.metas === 'object') ? p.metas : {};
    }
  } catch (e) { console.warn('Error cargando localStorage:', e); }
}

function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { console.error('Error guardando:', e); }
}

// ========== RENDER ==========
function renderResumen() {
  const { cursosResumen, promedioPonderado, estadoGeneral } = calcularResumen(state.notas, state.metas);
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
}

function renderCursos() {
  const container = $('#cursos-container'); container.innerHTML = '';
  CURSOS.forEach(curso => {
    const notasCurso = state.notas[curso.id] || {};
    const calc = calcularNotaCurso(curso, notasCurso);
    const sim = calcularSimulador(curso, notasCurso, state.metas[curso.id] || NOTA_MINIMA_APROBAR);
    let filas = '';

    // Agrupar productos por "familia" para Aprendizaje (P3 y P6 son alternativas)
    const grupos = agruparProductos(curso.productos);

    grupos.forEach(grupo => {
      if (grupo.esAlternativa) {
        // Mostrar como fila con dos inputs alternativos
        const prodA = grupo.productos[0];
        const prodB = grupo.productos[1];
        const notaA = notasCurso[prodA.id];
        const notaB = notasCurso[prodB.id];
        const aporteA = notaA !== undefined && notaA !== null && notaA !== '' ? round2(notaA * prodA.peso / 100) : '';
        const aporteB = notaB !== undefined && notaB !== null && notaB !== '' ? round2(notaB * prodB.peso / 100) : '';
        const estadoA = notaA !== undefined && notaA !== null && notaA !== '' ? (notaA >= 11 ? 'ok' : 'no') : '';
        const estadoB = notaB !== undefined && notaB !== null && notaB !== '' ? (notaB >= 11 ? 'ok' : 'no') : '';
        const estadoTxtA = estadoA === 'ok' ? '✓' : estadoA === 'no' ? '✗' : '⏳';
        const estadoTxtB = estadoB === 'ok' ? '✓' : estadoB === 'no' ? '✗' : '⏳';

        filas += `<tr class="alternativa-row">
          <td><strong>${grupo.nombre}</strong></td>
          <td>${prodA.peso}% c/u</td>
          <td>
            <div class="alt-inputs">
              <label>${prodA.nombre.replace('Informe parcial - ', '').replace('Evaluación ', '')}
                <input type="number" class="nota-input" data-curso="${curso.id}" data-producto="${prodA.id}" value="${notaA !== undefined && notaA !== null && notaA !== '' ? notaA : ''}" min="0" max="${NOTA_MAX}" step="0.1" placeholder="0-20" aria-label="Nota para ${prodA.nombre}">
              </label>
              <span class="o-separador">o</span>
              <label>${prodB.nombre.replace('Informe final y ', '').replace('Evaluación ', '')}
                <input type="number" class="nota-input" data-curso="${curso.id}" data-producto="${prodB.id}" value="${notaB !== undefined && notaB !== null && notaB !== '' ? notaB : ''}" min="0" max="${NOTA_MAX}" step="0.1" placeholder="0-20" aria-label="Nota para ${prodB.nombre}">
              </label>
            </div>
          </td>
          <td class="aporte">${aporteA !== '' ? aporteA.toFixed(2) : (aporteB !== '' ? aporteB.toFixed(2) : '—')}</td>
          <td class="estado">${estadoTxtA || estadoTxtB || '⏳'}</td>
        </tr>`;
      } else {
        // Productos normales
        grupo.productos.forEach(prod => {
          const nota = notasCurso[prod.id];
          const aporte = nota !== undefined && nota !== null && nota !== '' ? round2(nota * prod.peso / 100) : '';
          const estado = nota !== undefined && nota !== null && nota !== '' ? (nota >= 11 ? 'ok' : 'no') : '';
          const estadoTxt = estado === 'ok' ? '✓' : estado === 'no' ? '✗' : '⏳';
          const tipoBadge = prod.tipo ? `<span class="tipo-badge ${prod.tipo.toLowerCase()}">${prod.tipo}</span>` : '';
          filas += `<tr><td>${tipoBadge} ${prod.id} - ${prod.nombre}</td><td>${prod.peso}%</td><td><input type="number" class="nota-input" data-curso="${curso.id}" data-producto="${prod.id}" value="${nota !== undefined && nota !== null && nota !== '' ? nota : ''}" min="0" max="${NOTA_MAX}" step="0.1" placeholder="0-20" aria-label="Nota para ${prod.nombre}"></td><td class="aporte">${aporte !== '' ? aporte.toFixed(2) : '—'}</td><td class="estado ${estado}">${estadoTxt}</td></tr>`;
        });
      }
    });

    const notaFinalClass = calc.notaFinal !== null ? (calc.notaFinal >= 11 ? 'aprobado' : 'desaprobado') : '';
    const notaFinalIcon = calc.notaFinal !== null ? (calc.notaFinal >= 11 ? '✓' : '✗') : '⏳';
    const notaFinalTexto = calc.notaFinal !== null ? (calc.notaFinal >= 11 ? 'APROBADO' : 'DESAPROBADO') : 'PENDIENTE';
    filas += `<tr class="nota-final-row ${notaFinalClass}"><td colspan="2"><strong>NOTA FINAL DEL CURSO</strong></td><td class="nota-final ${notaFinalClass}">${calc.notaFinal !== null ? calc.notaFinal.toFixed(2) : '—'}</td><td></td><td><span class="estado ${notaFinalClass}">${notaFinalIcon} ${notaFinalTexto}</span></td></tr>`;
    filas += `<tr class="simulador-row"><td colspan="5"><div class="simulador-row-content"><strong>Simulador:</strong> Meta <strong>${sim.meta}</strong> · Peso ingresado <strong>${calc.pesoIngresado}%</strong> · Pendiente <strong>${sim.pesoPendiente || 0}%</strong> · Nota actual <strong>${calc.notaParcial !== null ? calc.notaParcial.toFixed(2) : '—'}</strong> · Acumulado <strong>${sim.acumulado !== undefined ? sim.acumulado.toFixed(2) : '—'}</strong></div></td></tr>`;
    const cardEl = document.createElement('section'); cardEl.className = 'card'; cardEl.id = `curso-${curso.id}`;
    cardEl.innerHTML = `<div class="curso-header"><h3>${curso.nombre} <small>(${curso.codigo})</small></h3><div class="curso-meta"><label for="meta-${curso.id}">Mi meta: <input type="number" id="meta-${curso.id}" class="meta-input" data-curso="${curso.id}" value="${state.metas[curso.id] || ''}" min="0" max="20" step="0.1" inputmode="decimal"></label></div></div><table class="tabla-curso" aria-label="Productos de ${curso.nombre}"><thead><tr><th>Producto</th><th>Peso</th><th>Nota (0-20)</th><th>Aporte</th><th>Estado</th></tr></thead><tbody>${filas}</tbody></table>`;
    container.appendChild(cardEl);
  });
  $$('.nota-input').forEach(input => {
    input.addEventListener('input', e => {
      const val = e.target.value === '' ? null : parseFloat(e.target.value);
      const cursoId = e.target.dataset.curso;
      const prodId = e.target.dataset.producto;
      if (val !== null && (isNaN(val) || val < 0 || val > NOTA_MAX)) {
        e.target.classList.add('invalid'); e.target.classList.remove('valid');
      } else {
        e.target.classList.remove('invalid');
        if (val !== null) e.target.classList.add('valid');
      }
      if (!state.notas[cursoId]) state.notas[cursoId] = {};
      state.notas[cursoId][prodId] = val;
      saveState(); renderAll();
    });
    input.addEventListener('blur', e => { if (e.target.value === '') e.target.classList.remove('valid', 'invalid'); });
  });
}

function agruparProductos(productos) {
  const grupos = [];
  const vistos = new Set();

  for (const prod of productos) {
    if (vistos.has(prod.id)) continue;

    // Detectar pares alternativos en Aprendizaje
    if (prod.id.startsWith('P3-') && prod.id.includes('peli')) {
      const alt = productos.find(p => p.id === 'P3-escrit');
      if (alt) {
        grupos.push({
          nombre: 'Informe parcial / Evaluación escrita',
          esAlternativa: true,
          productos: [prod, alt]
        });
        vistos.add(prod.id);
        vistos.add(alt.id);
        continue;
      }
    }
    if (prod.id.startsWith('P6-') && prod.id.includes('final')) {
      const alt = productos.find(p => p.id === 'P6-oral');
      if (alt) {
        grupos.push({
          nombre: 'Informe final / Evaluación oral',
          esAlternativa: true,
          productos: [prod, alt]
        });
        vistos.add(prod.id);
        vistos.add(alt.id);
        continue;
      }
    }

    // Producto normal
    grupos.push({ nombre: prod.nombre, esAlternativa: false, productos: [prod] });
    vistos.add(prod.id);
  }

  return grupos;
}

function renderAll() { renderResumen(); renderCursos(); }

// ========== EXPORT / IMPORT / RESET ==========
$('#btn-export').addEventListener('click', () => {
  const data = { version: '1.0', fecha: new Date().toISOString(), semestre: '2026-2', notas: state.notas, metas: state.metas };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url;
  a.download = `notas-yeraldine-${new Date().toISOString().split('T')[0]}.json`;
  a.click(); URL.revokeObjectURL(url);
});

$('#btn-import').addEventListener('click', () => $('#file-import').click());

$('#file-import').addEventListener('change', e => {
  const file = e.target.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    try {
      const data = JSON.parse(ev.target.result);
      if (data.notas) state.notas = data.notas;
      if (data.metas) state.metas = data.metas;
      saveState(); renderAll(); alert('✅ Backup restaurado correctamente');
    } catch (err) { alert('❌ Error: ' + err.message); }
    e.target.value = '';
  };
  reader.readAsText(file);
});

$('#btn-reset').addEventListener('click', () => {
  if (confirm('¿Borrar TODAS las notas y metas? No se puede deshacer.')) {
    state.notas = {}; state.metas = {}; saveState(); renderAll();
  }
});

// ========== INIT ==========
loadState(); renderAll();

document.addEventListener('change', e => {
  if (e.target.matches('.meta-input')) {
    state.metas[e.target.dataset.curso] = parseFloat(e.target.value) || '';
    saveState(); renderResumen();
  }
});

console.log('✅ Calculadora de Notas cargada'); console.log('💾 Datos en localStorage:', STORAGE_KEY);