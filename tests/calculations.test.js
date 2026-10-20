import { describe, it, expect, vi } from 'vitest';
import { CURSOS } from '../data.js';
import { round2, calcularNotaCurso, calcularSimulador, calcularResumen } from '../calculations.js';

describe('round2', () => {
  it('redondea a 2 decimales', () => {
    expect(round2(1.005)).toBe(1.01);
    expect(round2(1.004)).toBe(1);
    expect(round2(1.555)).toBe(1.56);
    expect(round2(0)).toBe(0);
    expect(round2(-1.234)).toBe(-1.23);
  });
});

describe('calcularNotaCurso', () => {
  const curso = CURSOS.find(c => c.id === 'personalidad');

  it('retorna null cuando no hay notas', () => {
    const result = calcularNotaCurso(curso, {});
    expect(result.notaFinal).toBeNull();
    expect(result.notaParcial).toBeNull();
    expect(result.pesoIngresado).toBe(0);
  });

  it('calcula nota parcial con algunas notas', () => {
    const notas = { 'P1': 15, 'P2': 14 }; // 15% + 25% = 40% peso ingresado
    const result = calcularNotaCurso(curso, notas);
    // (15*15 + 14*25) / 40 = (225 + 350) / 40 = 575 / 40 = 14.375
    expect(result.notaParcial).toBe(14.38);
    expect(result.pesoIngresado).toBe(40);
    expect(result.notaFinal).toBeNull(); // peso < 100
  });

  it('calcula nota final cuando todas las notas están', () => {
    const notas = { 'P1': 15, 'P2': 14, 'P3': 16, 'P4': 13 }; // 100% peso
    const result = calcularNotaCurso(curso, notas);
    // (15*15 + 14*25 + 16*25 + 13*35) / 100 = (225 + 350 + 400 + 455) / 100 = 14.3
    expect(result.notaFinal).toBe(14.3);
    expect(result.notaParcial).toBe(14.3);
    expect(result.pesoIngresado).toBe(100);
  });

  it('ignora notas vacías/undefined', () => {
    const notas = { 'P1': 15, 'P2': '', 'P3': null, 'P4': undefined };
    const result = calcularNotaCurso(curso, notas);
    expect(result.pesoIngresado).toBe(15);
    expect(result.notaParcial).toBe(15);
  });
});

describe('calcularSimulador', () => {
  const curso = CURSOS.find(c => c.id === 'personalidad');
  const NOTA_MINIMA = 11;

  it('retorna mensaje completado cuando peso = 100%', () => {
    const notas = { 'P1': 15, 'P2': 14, 'P3': 16, 'P4': 13 };
    const result = calcularSimulador(curso, notas, 11);
    expect(result.mensaje).toContain('Todos los productos tienen nota');
    expect(result.necesario).toBeNull();
  });

  it('meta alcanzada sin más notas (necesario <= 0)', () => {
    const notas = { 'P1': 15, 'P2': 14 }; // peso 40%, nota parcial 14.38
    // meta 11, aporte actual = 14.38 * 40 / 100 = 5.752
    // necesario = (11*100 - 5.752) / 60 = 1042.48 / 60 = 17.37 > 0
    // probemos con notas más altas
    const notasAltas = { 'P1': 18, 'P2': 18 }; // parcial 18, aporte = 7.2
    const result = calcularSimulador(curso, notasAltas, 11);
    // necesario = (1100 - 7.2) / 60 = 18.21 > 0 aún
    // Para necesario <= 0, necesitamos aporteActual >= meta * 100
    const notasMuyAltas = { 'P1': 20, 'P2': 20, 'P3': 20 }; // peso 65, parcial 20, aporte = 13
    const result2 = calcularSimulador(curso, notasMuyAltas, 11);
    // 11*100 = 1100, aporte = 1300, necesario = (1100-1300)/35 = -5.71 <= 0
    expect(result2.necesario).toBeLessThanOrEqual(0);
    expect(result2.mensaje).toContain('Ya alcanzaste tu meta');
  });

  it('meta inalcanzable (necesario > 20)', () => {
    const notas = { 'P1': 5 }; // peso 15%, nota 5, aporte = 0.75
    const result = calcularSimulador(curso, notas, 18);
    // necesario = (1800 - 75) / 85 = 1725/85 = 20.29 > 20
    expect(result.necesario).toBeGreaterThan(20);
    expect(result.mensaje).toContain('inalcanzable');
  });

  it('muy exigente (necesario > 17)', () => {
    const notas = { 'P1': 10 }; // peso 15%, nota 10, aporte = 1.5
    const result = calcularSimulador(curso, notas, 16);
    // necesario = (1600 - 150) / 85 = 1450/85 = 17.06 > 17
    expect(result.necesario).toBeGreaterThan(17);
    expect(result.mensaje).toContain('Muy exigente');
  });

  it('mensaje simplificado cuando meta = nota mínima (11)', () => {
    const notas = { 'P1': 10 }; // peso 15%
    const result = calcularSimulador(curso, notas, 11);
    expect(result.necesario).toBeGreaterThanOrEqual(11);
    expect(result.mensaje).toContain('para aprobar');
    expect(result.mensaje).not.toContain('llegar a 11');
  });

  it('factible cuando necesario < 11', () => {
    const notas = { 'P1': 18, 'P2': 17 }; // peso 40%, parcial ~17.6, aporte = 7.04
    const result = calcularSimulador(curso, notas, 11);
    // necesario = (1100 - 704) / 60 = 396/60 = 6.6 < 11
    expect(result.necesario).toBeLessThan(11);
    expect(result.mensaje).toContain('¡Factible!');
  });
});

describe('calcularResumen', () => {
  it('promedio ponderado con un curso aprobado', () => {
    const notas = {
      personalidad: { 'P1': 15, 'P2': 14, 'P3': 16, 'P4': 13 } // final 14.3, 3 créditos
    };
    const metas = {};
    const result = calcularResumen(notas, metas);
    expect(result.promedioPonderado).toBe(14.3);
    expect(result.estadoGeneral).toBe('aprobado');
    expect(result.totalCreditos).toBe(3);
  });

  it('promedio ponderado con múltiples cursos', () => {
    const notas = {
      personalidad: { 'P1': 15, 'P2': 14, 'P3': 16, 'P4': 13 }, // 14.3 * 3 = 42.9
      desarrollo: { 'P1': 12, 'P2': 13, 'P3-ind': 14, 'P3-grupal': 15, 'P4-ind': 11, 'P4-grupal': 12, 'P5': 13 } // calcular...
    };
    const metas = {};
    const result = calcularResumen(notas, metas);
    expect(result.totalCreditos).toBeGreaterThan(0);
    expect(result.promedioPonderado).not.toBeNull();
  });

  it('estado general desaprobado si promedio < 11', () => {
    const notas = {
      personalidad: { 'P1': 5, 'P2': 5, 'P3': 5, 'P4': 5 } // final 5
    };
    const metas = {};
    const result = calcularResumen(notas, metas);
    expect(result.promedioPonderado).toBe(5);
    expect(result.estadoGeneral).toBe('desaprobado');
  });

  it('estado general pendiente sin notas', () => {
    const result = calcularResumen({}, {});
    expect(result.promedioPonderado).toBeNull();
    expect(result.estadoGeneral).toBe('pendiente');
    expect(result.totalCreditos).toBe(0);
  });

  it('incluye metas en resumen', () => {
    const metas = { personalidad: 15 };
    const result = calcularResumen({}, metas);
    const cursoResumen = result.cursosResumen.find(r => r.curso.id === 'personalidad');
    expect(cursoResumen.meta).toBe(15);
  });
});