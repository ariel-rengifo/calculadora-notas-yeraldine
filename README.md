# Calculadora de Notas - Semestre 2026-2

Calculadora de notas semestral para la **Facultad de Psicología PUCP**. Permite registrar cada ítem evaluable individual, calcular promedios parciales/finales, simular notas necesarias para alcanzar una meta, y exportar/importar backups.

🔗 **Demo:** https://ariel-rengifo.github.io/calculadora-notas-yeraldine/

---

## ✨ Características

- **48 ítems registrables** — Cada sub-componente evaluable (Individual/Grupal) tiene su propio input
- **Cálculos exactos** — Basados en fórmulas oficiales de los sílabos PUCP 2026-2
- **Simulador inteligente** — Calcula nota mínima necesaria en lo pendiente para aprobar (11) o tu meta personal
- **Promedio ponderado por créditos** — 20 créditos totales (6 cursos × 3-4 créditos)
- **Persistencia local** — Guarda automáticamente en `localStorage`
- **Backup portátil** — Exporta/importa JSON para respaldar en Drive/OneDrive
- **Accesible** — Navegación por teclado, ARIA labels, skip link, contraste WCAG AA
- **Responsive** — Funciona en móvil, tablet y desktop

---

## 📚 Cursos y estructura

| Curso | Código | Créditos | Ítems | Total peso |
|-------|--------|----------|-------|------------|
| Personalidad | PSG206 | 3 | 4 | 100% |
| Desarrollo Humano 2 | PSG205 | 3 | 7 | 100% |
| Motivación y Emoción | PSB229 | 3 | 8 | 100% |
| Investigación Cualitativa | PSG216 | 4 | 17 | 100% |
| Construcción de Instrumentos | PSG207 | 4 | 9 | 100% |
| Psicología del Aprendizaje | PSB209 | 3 | 8* | 100% |

*Psicología del Aprendizaje tiene 2 pares de ítems alternativos (P3 y P6): solo se califica uno de cada par.

### Detalle de ítems por curso

**Personalidad** — 4 items (todos Individual)
- P1: Análisis de rasgos en caso (15%)
- P2: Perspectiva Psicoanalítica - Caso (25%)
- P3: Perspectiva Cognitivo-Conductual - Caso (25%)
- P4: Examen Final Oral (35%)

**Desarrollo Humano 2** — 7 items
- P1: Evaluación Escrita - Individual (10%)
- P2: Control Cognitivo - Individual (15%)
- P3-ind: Análisis de casos - Individual (5%)
- P3-grup: Análisis de casos - Grupal (10%)
- P4-ind: Eval. desarrollo psicosocial - Individual (10%)
- P4-grup: Eval. desarrollo psicosocial - Grupal (15%)
- P5: Examen Integrador Oral - Individual (35%)

**Motivación y Emoción** — 8 items
- P1: Portafolio Teoría Autodeterminación - Individual (25%)
- P2-conc: Evaluación Oral - Conceptual (12.5%)
- P2-casos: Evaluación Oral - Casos/Película (12.5%)
- P3: Caso Hugo - Grupal (10%)
- P4-oral: Presentación Trabajo Final - Oral (7.5%)
- P4-part: Presentación Trabajo Final - Participación (7.5%)
- P5-conc: Evaluación Final Oral - Conceptual (12.5%)
- P5-casos: Evaluación Final Oral - Casos (12.5%)

**Investigación Cualitativa** — 17 items (totalmente descompuestos)
- P1: CHIP (4%), EPI (4%), EXP1-ind (1.8%), EXP1-grup (4.2%), DOC1 (6%)
- P2: EXP2-ind (3%), EXP2-grup (7%), DOC2 (10%)
- P3: BIT-ind (1.6%), BIT-grup (6.4%), MAT (2%)
- P4: AT (5%), ESQ-ind (4.5%), ESQ-grup (10.5%)
- P5: EXP5-ind (4.5%), EXP5-grup (10.5%), DOC5 (15%)

**Construcción de Instrumentos** — 9 items
- P1: Informe 1 - Grupal (5%)
- P2: Control 1 - Individual (15%)
- P3: Informe 2 - Grupal (5%)
- P4: Control 2 - Individual (15%)
- P5: Informe 3 - Grupal (5%)
- P6: Informe 4 - Grupal (10%)
- P7: Práctica calificada - Individual (20%)
- P8: Exposición final - Individual (15%)
- P9: Trabajo Final - Grupal (10%)

**Psicología del Aprendizaje** — 8 items (6 efectivos)
- P1: Informe Habituación - Grupal (10%)
- P2: Control de lectura - Individual (12%)
- P3-peli: Informe parcial - Película **o** P3-escrit: Evaluación escrita (30%)
- P4: Análisis caso - Grupal (9%)
- P5: Rompecabezas - Grupal (9%)
- P6-final: Informe final **o** P6-oral: Evaluación oral final (30%)

---

## 🚀 Instalación y uso local

```bash
# Clonar
git clone https://github.com/ariel-rengifo/calculadora-notas-yeraldine.git
cd calculadora-notas-yeraldine

# Servir localmente (cualquier servidor estático)
npx serve .          # http://localhost:3000
# o
python -m http.server 8000
# o
php -S localhost:8000
```

Abrir `index.html` en el navegador.

---

## 🧪 Tests

```bash
# Instalar dependencias
npm install

# Ejecutar tests
npm test

# Con coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

**Cobertura:** 100% en `calculations.js` (lógica de negocio pura).

---

## 🏗️ Arquitectura

```
calculadora-notas-yeraldine/
├── index.html          # Estructura HTML + accesibilidad
├── styles.css          # Design system (custom properties, Inter/JetBrains Mono)
├── data.js             # Configuración: 6 cursos, 48 items, constantes
├── calculations.js     # Lógica pura (testeable, sin DOM)
├── app.js              # Orquestación: estado, render, eventos, localStorage
├── tests/
│   └── calculations.test.js
├── vitest.config.js
└── package.json
```

### Separación de responsabilidades

| Módulo | Responsabilidad |
|--------|-----------------|
| `data.js` | Datos estáticos (cursos, items, pesos, constantes) |
| `calculations.js` | **Lógica pura**: `calcularNotaCurso`, `calcularSimulador`, `calcularResumen`, `round2` |
| `app.js` | Estado reactivo, persistencia, renderizado DOM, delegación de eventos |
| `styles.css` | Design tokens, componentes, responsive, temas |

> **Decisión:** Sin build step, sin bundler, sin framework. ES Modules nativos + GitHub Pages nativo. Ver [ADR-001](docs/decisions/ADR-001.md).

---

## 📐 Fórmulas implementadas

Basadas en `formulas_promedio_2026-2.md` (sílabos oficiales PUCP):

### Por curso
- **Promedio parcial** = Σ(notaᵢ × pesoᵢ) / Σ(pesoᵢ) — solo ítems con nota
- **Acumulado** = Σ(notaᵢ × pesoᵢ) / 100 — puntos sobre la nota final
- **Nota final** = Acumulado (cuando peso ingresado = 100%)

### Simulador
- **Nota necesaria** = (meta − Acumulado) / (Peso_restante / 100)
- Clasifica: ✅ Ya alcanzada · ❌ Inalcanzable (>20) · ⚠️ Exigente (>17) · 🎯 Factible (<11) · 🎯 Para aprobar (meta=11)

### Semestre
- **Promedio ponderado** = Σ(PF_curso × créditos) / Σ(créditos) = 20 créditos totales

---

## 💾 Formato de backup (JSON)

```json
{
  "version": "1.0",
  "fecha": "2026-10-20T15:30:00.000Z",
  "semestre": "2026-2",
  "notas": {
    "personalidad": { "P1": 15, "P2": 14, "P3": 16, "P4": 13 },
    "desarrollo": { "P1": 13, "P3-ind": 15, "P3-grup": 16, ... }
  },
  "metas": {
    "personalidad": 15,
    "desarrollo": 14
  }
}
```

Ver [ADR-002](docs/decisions/ADR-002.md) para versionado de schema.

---

## 🔧 Desarrollo

### Agregar un curso
1. Editar `data.js`: agregar objeto a `CURSOS` con `id`, `nombre`, `codigo`, `creditos`, `productos[]`
2. Cada producto: `id`, `nombre`, `peso` (suma 100 por curso), `tipo` ('Individual'|'Grupal')
3. Tests: agregar casos en `tests/calculations.test.js`

### Estilo de código
- ES Modules (`import`/`export`)
- Funciones puras en `calculations.js` (sin side effects)
- `round2()` para redondeo a 2 decimales (evita floating point errors)
- Custom properties CSS para theming
- Nombres descriptivos, sin abreviaturas crípticas

---

## 📝 Decisiones de arquitectura (ADRs)

| ADR | Título | Estado |
|-----|--------|--------|
| [ADR-001](docs/decisions/ADR-001.md) | Arquitectura vanilla ES Modules sin build | Aceptado |
| [ADR-002](docs/decisions/ADR-002.md) | localStorage schema v1 + versionado export | Aceptado |

---

## 🏷️ Release

```bash
# Tag release
git tag -a v1.0.0 -m "Release 1.0.0: 48 items registrables, fórmulas PUCP, tests, docs"
git push origin v1.0.0
```

---

## 📄 Licencia

Uso académico personal. Basado en sílabos oficiales PUCP 2026-2.

---

## 🙋‍♀️ Para Yeraldine

Esta calculadora está hecha a medida para tu semestre 2026-2. Cada input corresponde a una nota real que recibirás. Úsala para:
1. Registrar notas apenas salgan
2. Ver tu promedio parcial en tiempo real
3. Usar el simulador para saber qué necesitas en lo que falta
4. Exportar backup semanal (botón 💾 Exportar)
5. Llegar a fin de semestre sin sorpresas

¡Éxitos en el semestre! 🎓