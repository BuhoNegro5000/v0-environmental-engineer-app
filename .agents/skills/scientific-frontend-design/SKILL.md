---
name: scientific-frontend-design
description: |
  Especialista en arquitectura frontend, UX/UI científica y sistemas de diseño para
  aplicaciones ambientales, industriales y de instrumentación de laboratorio (Green Owl Labs).
  Usar siempre que se diseñe, modifique o audite la interfaz de usuario, hojas de estilo (Tailwind/CSS),
  componentes interactivos, barras de navegación, formularios analíticos y calculadoras.
license: Apache-2.0
metadata:
  version: v2.0
  publisher: green-owl-labs
---

# Scientific Frontend & UI/UX Design System
## Guía de Excelencia Visual e Integración para Green Owl Labs

Esta habilidad gobierna el diseño visual, la usabilidad táctil y la arquitectura frontend de aplicaciones científicas y de laboratorio para asegurar interfaces elegantes, profesionales, de alta densidad de información y libres de errores visuales.

---

## 🚫 1. Reglas Críticas Anti-Errores (Lo que NUNCA se debe hacer)

1. **PROHIBIDO selectores globales destructivos en `@layer base`:**
   - **NUNCA** aplicar `min-height: 44px; min-width: 44px;` a selectores globales `button`, `a`, `[role="button"]` o `[role="tab"]`.
   - *Por qué:* Destruye la altura de `TabsList` (Radix UI), estira los triggers a 44px desalineando el contenedor, convierte los enlaces inline en bloques gigantes y deforma los botones de cerrar `X`, estrellas de favoritos y badges.
   - *Solución:* Aplicar dimensiones táctiles mínimas **únicamente** a elementos de navegación primaria (ej. barra inferior móvil `.nav-item { min-height: 48px }`).

2. **PROHIBIDO forzar `font-size: 16px` global en botones y badges:**
   - Los chips de normativa, badges de métodos (`SM 5210 B`) y etiquetas técnicas requieren tamaños proporcionados (`text-xs` de 12px o `text-[10px]`). Forzar 16px en botones crea interfaces toscas y desproporcionadas.

3. **PROHIBIDO ocultar herramientas o enterrar funcionalidades:**
   - Ningún módulo de cálculo, conversor o herramienta de campo debe quedar inaccesible o requerir que el profesional "adivine" dónde encontrarlo.
   - Toda suite científica debe ofrecer navegación inmediata por pestañas segmentadas, buscador con filtrado en tiempo real y accesos rápidos en la pantalla de inicio.

---

## 🎨 2. Tokens del Sistema de Diseño Green Owl Labs

```css
:root {
  /* Paleta Científica de Alta Precisión */
  --gol-petroleum: #103B3A;      /* Verde Petróleo: Jerarquía principal, splash, cabeceras */
  --gol-lab-green: #008F72;      /* Verde Laboratorio: Botones de acción, cumplimiento, activos */
  --gol-mint: #BCE8D9;           /* Menta Científica: Badges técnicos, contrastes, retículas */
  --gol-mineral: #F4F8F5;        /* Fondo Marfil Mineral: Lectura cómoda bajo sol de campo */
  --gol-white: #FFFFFF;          /* Superficie de tarjetas e instrumentos */
  --gol-text: #253533;           /* Texto grafito oscuro: Máximo contraste WCAG AA */
  --gol-muted: #647773;          /* Metadatos, unidades y subtítulos */
  --gol-border: #DCE7E1;         /* Bordes definidos y sutiles */
  --gol-warning: #D99527;        /* Advertencias y umbrales de alerta */
  --gol-error: #C53030;          /* Errores analíticos reales (invalidez de ensayo) */
}
```

---

## 🧩 3. Anatomía Estándar de una Herramienta de Laboratorio

Cada herramienta o calculadora debe estructurarse con la siguiente jerarquía visual:

1. **Cabecera Técnica:**
   - Nombre técnico formal (ej. *Demanda Bioquímica de Oxígeno — DBO₅*).
   - Chip de norma oficial (ej. `Standard Methods 5210 B` o `D.S. 004-2017-MINAM`).
   - Breve descripción del principio físico/químico.
2. **Entrada de Parámetros con Unidades Explícitas:**
   - Cada campo debe incluir su unidad visible mediante un addon o etiqueta técnica (ej. `[ mg/L ]`, `[ mL ]`, `[ m³/h ]`, `[ °C ]`).
3. **Sección Plegable de Deducción y Variables:**
   - Desplegable con la fórmula matemática en KaTeX / notación formal y significado de cada variable.
4. **Validación Analítica Instantánea:**
   - Alertas específicas basadas en el método (ej. *Si el consumo de OD es < 2.0 mg/L, advertir que la prueba no cumple criterios analíticos oficiales*).
5. **Tarjeta de Resultado con Formato Monospace:**
   - Cifras con `font-mono tracking-tight font-bold text-2xl text-[#008F72]`.
   - Interpretación ambiental directa respecto al marco legal vigente.
6. **Acciones de Trazabilidad:**
   - Botón para guardar en historial local, copiar memoria de cálculo o exportar ficha técnica.

---

## 📱 4. Ergonomía Mobile-First para Trabajo de Campo

- **Barra de navegación fija inferior:** Altura de 60–64px + `padding-bottom: env(safe-area-inset-bottom)`.
- **Área segura de scroll:** El contenedor principal debe tener `pb-28` para evitar que el contenido inferior quede tapado por la barra de navegación.
- **Formularios con teclado numérico apropiado:** Usar `inputMode="decimal"` y `step="any"` para facilitar el ingreso de mediciones en smartphones.
