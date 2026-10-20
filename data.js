/**
 * Configuración de cursos - Semestre 2026-2
 * Facultad de Psicología PUCP
 * Cada producto = item registrable individual (hoja del árbol de evaluación)
 * peso = porcentaje sobre la nota final del curso (suma 100 por curso)
 */

export const CURSOS = [
  {
    id: 'personalidad',
    nombre: 'Personalidad',
    codigo: 'PSG206',
    creditos: 3,
    productos: [
      { id: 'P1', nombre: 'Análisis de rasgos en caso', peso: 15, tipo: 'Individual' },
      { id: 'P2', nombre: 'Perspectiva Psicoanalítica - Caso', peso: 25, tipo: 'Individual' },
      { id: 'P3', nombre: 'Perspectiva Cognitivo-Conductual - Caso', peso: 25, tipo: 'Individual' },
      { id: 'P4', nombre: 'Examen Final Oral - Todo el curso', peso: 35, tipo: 'Individual' },
    ]
  },
  {
    id: 'desarrollo',
    nombre: 'Desarrollo Humano 2',
    codigo: 'PSG205',
    creditos: 3,
    productos: [
      { id: 'P1', nombre: 'Evaluación Escrita', peso: 10, tipo: 'Individual' },
      { id: 'P2', nombre: 'Control Cognitivo', peso: 15, tipo: 'Individual' },
      { id: 'P3-ind', nombre: 'Análisis de casos - Individual', peso: 5, tipo: 'Individual' },
      { id: 'P3-grup', nombre: 'Análisis de casos - Grupal', peso: 10, tipo: 'Grupal' },
      { id: 'P4-ind', nombre: 'Eval. desarrollo psicosocial - Individual', peso: 10, tipo: 'Individual' },
      { id: 'P4-grup', nombre: 'Eval. desarrollo psicosocial - Grupal', peso: 15, tipo: 'Grupal' },
      { id: 'P5', nombre: 'Examen Integrador Oral', peso: 35, tipo: 'Individual' },
    ]
  },
  {
    id: 'motivacion',
    nombre: 'Motivación y Emoción',
    codigo: 'PSB229',
    creditos: 3,
    productos: [
      { id: 'P1', nombre: 'Portafolio Teoría Autodeterminación', peso: 25, tipo: 'Individual' },
      { id: 'P2-conc', nombre: 'Evaluación Oral - Conceptual', peso: 12.5, tipo: 'Individual' },
      { id: 'P2-casos', nombre: 'Evaluación Oral - Casos/Película', peso: 12.5, tipo: 'Individual' },
      { id: 'P3', nombre: 'Caso Hugo - Análisis creencias control', peso: 10, tipo: 'Grupal' },
      { id: 'P4-oral', nombre: 'Presentación Trabajo Final - Oral', peso: 7.5, tipo: 'Individual' },
      { id: 'P4-part', nombre: 'Presentación Trabajo Final - Participación', peso: 7.5, tipo: 'Individual' },
      { id: 'P5-conc', nombre: 'Evaluación Final Oral - Conceptual', peso: 12.5, tipo: 'Individual' },
      { id: 'P5-casos', nombre: 'Evaluación Final Oral - Casos', peso: 12.5, tipo: 'Individual' },
    ]
  },
  {
    id: 'investigacion',
    nombre: 'Investigación Cualitativa',
    codigo: 'PSG216',
    creditos: 4,
    productos: [
      // P1 = 20%: CHIP 4%, EPI 4%, EXP1_ind 1.8%, EXP1_grup 4.2%, DOC1 6%
      { id: 'P1-CHIP', nombre: 'CHIP cualitativo', peso: 4, tipo: 'Individual' },
      { id: 'P1-EPI', nombre: 'Epistemología investigación cualitativa', peso: 4, tipo: 'Individual' },
      { id: 'P1-EXP1-ind', nombre: 'Exposición introducción - Individual', peso: 1.8, tipo: 'Individual' },
      { id: 'P1-EXP1-grup', nombre: 'Exposición introducción - Grupal', peso: 4.2, tipo: 'Grupal' },
      { id: 'P1-DOC1', nombre: 'Documento escrito introducción', peso: 6, tipo: 'Grupal' },

      // P2 = 20%: EXP2_ind 3%, EXP2_grup 7%, DOC2 10%
      { id: 'P2-EXP2-ind', nombre: 'Exposición metodología - Individual', peso: 3, tipo: 'Individual' },
      { id: 'P2-EXP2-grup', nombre: 'Exposición metodología - Grupal', peso: 7, tipo: 'Grupal' },
      { id: 'P2-DOC2', nombre: 'Documento escrito metodología', peso: 10, tipo: 'Grupal' },

      // P3 = 10%: BIT 8% (BIT_ind 1.6%, BIT_grup 6.4%), MAT 2%
      { id: 'P3-BIT-ind', nombre: 'Bitácora/Piloto - Individual', peso: 1.6, tipo: 'Individual' },
      { id: 'P3-BIT-grup', nombre: 'Bitácora/Piloto - Grupal', peso: 6.4, tipo: 'Grupal' },
      { id: 'P3-MAT', nombre: 'Material de campo por integrante', peso: 2, tipo: 'Individual' },

      // P4 = 20%: AT 5%, ESQ 15% (ESQ_ind 4.5%, ESQ_grup 10.5%)
      { id: 'P4-AT', nombre: 'Evaluación Análisis Temático', peso: 5, tipo: 'Individual' },
      { id: 'P4-ESQ-ind', nombre: 'Esquema resultados - Individual', peso: 4.5, tipo: 'Individual' },
      { id: 'P4-ESQ-grup', nombre: 'Esquema resultados - Grupal', peso: 10.5, tipo: 'Grupal' },

      // P5 = 30%: EXP5 15% (EXP5_ind 4.5%, EXP5_grup 10.5%), DOC5 15%
      { id: 'P5-EXP5-ind', nombre: 'Exposición final - Individual', peso: 4.5, tipo: 'Individual' },
      { id: 'P5-EXP5-grup', nombre: 'Exposición final - Grupal', peso: 10.5, tipo: 'Grupal' },
      { id: 'P5-DOC5', nombre: 'Documento escrito trabajo final', peso: 15, tipo: 'Grupal' },
    ]
  },
  {
    id: 'instrumentos',
    nombre: 'Construcción de Instrumentos',
    codigo: 'PSG207',
    creditos: 4,
    productos: [
      { id: 'P1', nombre: 'Informe 1: Introducción y consentimiento', peso: 5, tipo: 'Grupal' },
      { id: 'P2', nombre: 'Control 1: Conceptos básicos', peso: 15, tipo: 'Individual' },
      { id: 'P3', nombre: 'Informe 2: Correcciones, propuesta, jueces', peso: 5, tipo: 'Grupal' },
      { id: 'P4', nombre: 'Control 2: Validez y confiabilidad', peso: 15, tipo: 'Individual' },
      { id: 'P5', nombre: 'Informe 3: Método con descriptivos', peso: 5, tipo: 'Grupal' },
      { id: 'P6', nombre: 'Informe 4: Resultados validez/confiabilidad', peso: 10, tipo: 'Grupal' },
      { id: 'P7', nombre: 'Práctica calificada: Análisis psicométricos', peso: 20, tipo: 'Individual' },
      { id: 'P8', nombre: 'Exposición final', peso: 15, tipo: 'Individual' },
      { id: 'P9', nombre: 'Trabajo Final: Entrega completa', peso: 10, tipo: 'Grupal' },
    ]
  },
  {
    id: 'aprendizaje',
    nombre: 'Psicología del Aprendizaje',
    codigo: 'PSB209',
    creditos: 3,
    productos: [
      { id: 'P1', nombre: 'Informe: Habituación y sensibilización', peso: 10, tipo: 'Grupal' },
      { id: 'P2', nombre: 'Control de lectura', peso: 12, tipo: 'Individual' },
      { id: 'P3-peli', nombre: 'Informe parcial - Película', peso: 30, tipo: 'Individual' },
      { id: 'P3-escrit', nombre: 'Evaluación escrita parcial', peso: 30, tipo: 'Individual' },
      { id: 'P4', nombre: 'Análisis caso procesamiento información', peso: 9, tipo: 'Grupal' },
      { id: 'P5', nombre: 'Rompecabezas aprendizaje cognitivo', peso: 9, tipo: 'Grupal' },
      { id: 'P6-final', nombre: 'Informe final y exposición', peso: 30, tipo: 'Individual' },
      { id: 'P6-oral', nombre: 'Evaluación oral final', peso: 30, tipo: 'Individual' },
    ]
  }
];

export const STORAGE_KEY = 'notas-yeraldine-2026-2';
export const NOTA_MINIMA_APROBAR = 11;
export const NOTA_MAX = 20;