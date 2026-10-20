/**
 * Configuración de cursos - Semestre 2026-2
 * Facultad de Psicología PUCP
 */

export const CURSOS = [
  {
    id: 'personalidad',
    nombre: 'Personalidad',
    codigo: 'PSG206',
    creditos: 3,
    productos: [
      { id: 'P1', nombre: 'Análisis de rasgos en caso (Individual)', peso: 15 },
      { id: 'P2', nombre: 'Perspectiva Psicoanalítica - Caso (Individual)', peso: 25 },
      { id: 'P3', nombre: 'Perspectiva Cognitivo-Conductual - Caso (Individual)', peso: 25 },
      { id: 'P4', nombre: 'Examen Final Oral - Todo el curso (Individual)', peso: 35 },
    ]
  },
  {
    id: 'desarrollo',
    nombre: 'Desarrollo Humano 2',
    codigo: 'PSG205',
    creditos: 3,
    productos: [
      { id: 'P1', nombre: 'Evaluación Escrita (Individual)', peso: 10 },
      { id: 'P2', nombre: 'Control Cognitivo (Individual)', peso: 15 },
      { id: 'P3-ind', nombre: 'Análisis de casos - Individual', peso: 5 },
      { id: 'P3-grupal', nombre: 'Análisis de casos - Grupal', peso: 10 },
      { id: 'P4-ind', nombre: 'Eval. desarrollo psicosocial - Individual', peso: 10 },
      { id: 'P4-grupal', nombre: 'Eval. desarrollo psicosocial - Grupal', peso: 15 },
      { id: 'P5', nombre: 'Examen Integrador Oral (Individual)', peso: 35 },
    ]
  },
  {
    id: 'motivacion',
    nombre: 'Motivación y Emoción',
    codigo: 'PSB229',
    creditos: 3,
    productos: [
      { id: 'P1', nombre: 'Portafolio Teoría Autodeterminación (Individual)', peso: 25 },
      { id: 'P2', nombre: 'Evaluación Oral: Conceptual + Casos/Película (Individual)', peso: 25 },
      { id: 'P3', nombre: 'Caso Hugo - Análisis creencias control (Grupal)', peso: 10 },
      { id: 'P4', nombre: 'Presentación Trabajo Final: Oral + PPT (Individual)', peso: 15 },
      { id: 'P5', nombre: 'Evaluación Final Oral: Conceptual + Casos + Integración (Individual)', peso: 25 },
    ]
  },
  {
    id: 'investigacion',
    nombre: 'Investigación Cualitativa',
    codigo: 'PSG216',
    creditos: 4,
    productos: [
      { id: 'P1', nombre: 'Planteamiento problema (CHIP 20% + Epist 20% + Exp 30% + Doc 30%)', peso: 20 },
      { id: 'P2', nombre: 'Metodología (Exp 50% + Doc 50%)', peso: 20 },
      { id: 'P3', nombre: 'Trabajo de campo (Piloto+Bitácora 80% + Material 20%)', peso: 10 },
      { id: 'P4', nombre: 'Análisis información (Temático 25% + Proceso+Exp 75%)', peso: 20 },
      { id: 'P5', nombre: 'Discusión y reporte final (Exp 50% + Doc 50%)', peso: 30 },
    ]
  },
  {
    id: 'instrumentos',
    nombre: 'Construcción de Instrumentos',
    codigo: 'PSG207',
    creditos: 4,
    productos: [
      { id: 'P1', nombre: 'Informe 1: Introducción y consentimiento (Grupal)', peso: 5 },
      { id: 'P2', nombre: 'Control 1: Conceptos básicos (Individual)', peso: 15 },
      { id: 'P3', nombre: 'Informe 2: Correcciones, propuesta, jueces (Grupal)', peso: 5 },
      { id: 'P4', nombre: 'Control 2: Validez y confiabilidad (Individual)', peso: 15 },
      { id: 'P5', nombre: 'Informe 3: Método con descriptivos (Grupal)', peso: 5 },
      { id: 'P6', nombre: 'Informe 4: Resultados validez/confiabilidad (Grupal)', peso: 10 },
      { id: 'P7', nombre: 'Práctica calificada: Análisis psicométricos (Individual)', peso: 20 },
      { id: 'P8', nombre: 'Exposición final (Individual)', peso: 15 },
      { id: 'P9', nombre: 'Trabajo Final: Entrega completa (Grupal)', peso: 10 },
    ]
  },
  {
    id: 'aprendizaje',
    nombre: 'Psicología del Aprendizaje',
    codigo: 'PSB209',
    creditos: 3,
    productos: [
      { id: 'P1', nombre: 'Informe: Habituación y sensibilización (Grupal)', peso: 10 },
      { id: 'P2', nombre: 'Control de lectura (Individual)', peso: 12 },
      { id: 'P3', nombre: 'Informe parcial: Película / Evaluación escrita (Individual)', peso: 30 },
      { id: 'P4', nombre: 'Análisis caso procesamiento información (Grupal)', peso: 9 },
      { id: 'P5', nombre: 'Rompecabezas aprendizaje cognitivo (Grupal)', peso: 9 },
      { id: 'P6', nombre: 'Informe final y exposición / Evaluación oral final (Individual)', peso: 30 },
    ]
  }
];

export const STORAGE_KEY = 'notas-yeraldine-2026-2';
export const NOTA_MINIMA_APROBAR = 11;
export const NOTA_MAX = 20;