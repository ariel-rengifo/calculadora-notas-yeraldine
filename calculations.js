/**
 * Cálculos puros - Sin dependencias de DOM ni estado global
 * Basado en formulas_promedio_2026-2.md
 */

import { CURSOS, NOTA_MINIMA_APROBAR, NOTA_MAX } from './data.js';

export function round2(val) {
  return Math.round((val + Number.EPSILON) * 100) / 100;
}

/**
 * Calcula la nota de un curso según las fórmulas del semestre 2026-2
 * @param {Object} curso - Objeto curso de CURSOS
 * @param {Object} notasCurso - { productoId: nota } notas ya ingresadas
 * @returns {Object} { notaFinal, notaParcial, pesoIngresado, acumulado, pesoRestante }
 */
export function calcularNotaCurso(curso, notasCurso) {
  let sumaPonderada = 0;      // Σ(nota_i × peso_i)
  let pesoIngresado = 0;      // Σ(peso_i) de productos con nota

  for (const prod of curso.productos) {
    const nota = notasCurso[prod.id];
    if (nota !== undefined && nota !== null && nota !== '') {
      sumaPonderada += nota * prod.peso;
      pesoIngresado += prod.peso;
    }
  }

  if (pesoIngresado === 0) {
    return {
      notaFinal: null,
      notaParcial: null,
      pesoIngresado: 0,
      acumulado: 0,
      pesoRestante: 100
    };
  }

  // Promedio parcial = Σ(nota_i × peso_i) / Σ(peso_i)  -- solo productos con nota
  const notaParcial = round2(sumaPonderada / pesoIngresado);

  // Acumulado = Σ(nota_i × peso_i) / 100  -- puntos sobre la nota final
  const acumulado = round2(sumaPonderada / 100);

  // Nota final solo cuando están todos los productos (peso = 100)
  const notaFinal = pesoIngresado === 100 ? round2(sumaPonderada / 100) : null;

  return {
    notaFinal,
    notaParcial,
    pesoIngresado,
    acumulado,
    pesoRestante: 100 - pesoIngresado
  };
}

/**
 * Calcula la nota mínima necesaria en los productos pendientes para alcanzar una meta
 * Fórmula: (meta - acumulado) / (pesoRestante / 100)
 */
export function calcularSimulador(curso, notasCurso, meta) {
  const calc = calcularNotaCurso(curso, notasCurso);
  const { pesoIngresado, pesoRestante, acumulado, notaParcial } = calc;

  if (pesoRestante <= 0) {
    return {
      mensaje: '✅ Todos los productos tienen nota',
      necesario: null,
      meta,
      pesoPendiente: 0,
      notaActual: notaParcial,
      acumulado
    };
  }

  // Nota necesaria = (meta - acumulado) / (pesoRestante / 100)
  const necesario = round2((meta - acumulado) * 100 / pesoRestante);

  let mensaje = '';
  if (necesario <= 0) {
    mensaje = `✅ Ya alcanzaste tu meta de ${meta} sin necesidad de más notas.`;
  } else if (necesario > NOTA_MAX) {
    mensaje = `❌ Necesitas <strong>${necesario}</strong> en lo pendiente (máx: ${NOTA_MAX}). Meta ${meta} inalcanzable.`;
  } else if (necesario > 17) {
    mensaje = `⚠️ Necesitas <strong>${necesario}</strong> en promedio en lo que falta. Muy exigente.`;
  } else if (necesario < 11) {
    mensaje = `🎯 Necesitas <strong>${necesario}</strong> en lo pendiente. ¡Factible!`;
  } else if (meta === NOTA_MINIMA_APROBAR) {
    mensaje = `🎯 Necesitas <strong>${necesario}</strong> en lo pendiente para aprobar.`;
  } else {
    mensaje = `🎯 Necesitas <strong>${necesario}</strong> en promedio en lo pendiente para llegar a ${meta}.`;
  }

  return { mensaje, necesario, meta, pesoPendiente: pesoRestante, notaActual: notaParcial, acumulado };
}

/**
 * Calcula el resumen del semestre (promedio ponderado por créditos)
 */
export function calcularResumen(notas, metas) {
  let totalCreditos = 0;
  let totalNotaCred = 0;

  const cursosResumen = CURSOS.map(curso => {
    const notasCurso = notas[curso.id] || {};
    const calc = calcularNotaCurso(curso, notasCurso);
    const notaFinal = calc.notaFinal;
    const creditos = curso.creditos;

    if (notaFinal !== null) {
      totalCreditos += creditos;
      totalNotaCred += notaFinal * creditos;
    }

    return {
      curso,
      notaFinal,
      creditos,
      estado: notaFinal !== null ? (notaFinal >= 11 ? 'aprobado' : 'desaprobado') : 'pendiente',
      meta: metas[curso.id] || '',
      acumulado: calc.acumulado,
      pesoIngresado: calc.pesoIngresado
    };
  });

  const promedioPonderado = totalCreditos > 0 ? round2(totalNotaCred / totalCreditos) : null;
  const estadoGeneral = promedioPonderado !== null
    ? (promedioPonderado >= 11 ? 'aprobado' : 'desaprobado')
    : 'pendiente';

  return {
    cursosResumen,
    totalCreditos,
    totalNotaCred: round2(totalNotaCred),
    promedioPonderado,
    estadoGeneral
  };
}