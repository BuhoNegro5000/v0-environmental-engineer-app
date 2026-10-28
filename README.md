# Laboratorio Ambiental
### by GREEN OWL LABS

> **Descriptor:** Laboratorio ambiental digital para profesionales  
> **Eslogan:** *«La ciencia ambiental, en tu bolsillo»*

---

## 🔬 Descripción General

**Laboratorio Ambiental** es una plataforma digital científica diseñada para ingenieros ambientales, especialistas en calidad ambiental, consultores y laboratorios analíticos. Proporciona un conjunto integral de calculadoras estequiométricas, convertidores termodinámicos, dimensionamiento de plantas de tratamiento (PTAR), modelos de dispersión de contaminantes atmosféricos, metodologías internacionales y compendio de normativas oficiales vigentes con citas legales.

---

## 🎨 Identidad & Sistema de Diseño

La interfaz ha sido diseñada bajo un sistema visual de precisión científica, contemporáneo y optimizado para su uso en campo y dispositivos móviles (*mobile-first*):

- **Verde Petróleo:** `#103B3A` (identidad institucional y jerarquías clave)
- **Verde Laboratorio:** `#008F72` (acciones primarias e indicadores de cumplimiento)
- **Menta Científica:** `#BCE8D9` (acentos, etiquetas y contraste técnico)
- **Fondo Marfil Mineral:** `#F4F8F5` (fondo de alta legibilidad en exteriores)
- **Superficie Blanca:** `#FFFFFF` (tarjetas limpias y estructuradas)
- **Texto Principal:** `#253533` (legibilidad contrastada WCAG AA)
- **Texto Secundario:** `#647773` (metadatos y subtítulos técnicos)
- **Bordes:** `#DCE7E1` (delimitación geométrica sutil)
- **Advertencias:** `#D99527` (zonas de alerta de calidad de agua o efluentes)
- **Errores:** Rojo accesible (reservado para validaciones reales)

---

## 📱 Arquitectura de Navegación Móvil

La aplicación cuenta con una barra de navegación inferior fija de **5 destinos principales**:

1. **Inicio:** Panel operativo diario con acceso rápido a herramientas principales, buscador universal, métricas de memoria local y favoritos.
2. **Laboratorio:** Espacio de trabajo técnico con selector segmentado:
   - *Calculadoras:* DBO₅, DQO, WQI / ICA-NSF.
   - *Conversor:* Gases ideales (T y P reales), turbidez óptica (NTU/FNU/EBC) y conductividad/TDS.
   - *Reactores PTAR:* Lodos activados, filtros percoladores, lagunas facultativas y UASB.
   - *Campo:* Mediciones in-situ y monitoreo rápido.
3. **Herramientas (Botón Central Destacado):** Despliega un **Bottom Sheet (cajón inferior accesible)** con arrastre táctil, cierre por ESC y búsqueda en tiempo real, agrupado en la taxonomía estándar:
   - **A.** Calculadoras científicas
   - **B.** Agua y aguas residuales
   - **C.** Calidad del aire
   - **D.** Suelos y caracterización ambiental
   - **E.** Herramientas de campo
   - **F.** Análisis y visualización de datos
   - **G.** Métodos y metodologías
   - **H.** Inteligencia artificial ambiental
   - **I.** Normativa y estándares
   - **J.** Informes y reportes
   - **K.** Historial y favoritos
4. **Normativa:** Acceso directo a los Decretos Supremos vigentes y al Glosario Técnico de ingeniería ambiental.
5. **Perfil:** Configuración de credenciales del especialista (CIP, organización), selector de país rector (Perú MINAM por defecto), exportación de respaldo JSON y estado de memoria local offline.

---

## 📐 Fundamento Técnico y Fórmulas Validadas

Todas las fórmulas y cálculos han sido auditados contra métodos oficiales y cuentan con un suite de pruebas automatizadas al 100%:

1. **DBO₅ (Demanda Bioquímica de Oxígeno):**
   - Método: *Standard Methods for the Examination of Water and Wastewater (23rd Ed.) 5210 B*.
   - Fórmulas:
     $$\text{DBO}_5 = \frac{OD_1 - OD_5}{P}$$
     $$\text{DBO}_5 = \frac{(OD_1 - OD_5) - (B_1 - B_5) \cdot (1 - P)}{P}$$
   - Reglas de validez analítica: $OD_1 - OD_5 \ge 2.0\text{ mg/L}$ y $OD_5 \ge 1.0\text{ mg/L}$.

2. **DQO (Demanda Química de Oxígeno por Titulación):**
   - Método: *Standard Methods 5220 C y 5220 D*.
   - Fórmula:
     $$\text{DQO} = \frac{(V_{\text{blanco}} - V_{\text{muestra}}) \cdot N_{\text{FAS}} \cdot 8000}{V_{\text{muestra}}}$$

3. **Índice de Calidad del Agua (ICA-NSF / ANA Perú):**
   - Norma: *R.J. 056-2018-ANA* y curvas NSF modificadas.
   - 9 parámetros ponderados con cálculo dinámico de saturación de oxígeno a temperatura real.

4. **Conversor Termodinámico de Gases:**
   - Ley de gases ideales bajo temperatura y presión reales:
     $$C\,(\text{mg/m}^3) = C\,(\text{ppm}) \cdot \frac{PM}{22.414} \cdot \left(\frac{273.15}{T}\right) \cdot \left(\frac{P}{1.0}\right)$$

5. **Dimensionamiento de Reactores Biológicos:**
   - Basado en *Metcalf & Eddy (4th/5th Ed.)* y norma técnica peruana de PTAR.
   - Lodos Activados, Filtros Percoladores, Lagunas Facultativas y Reactores Anaerobios UASB.

6. **Huella de Carbono y Red Eléctrica:**
   - *GHG Protocol Corporate Standard* (Alcances 1, 2 y 3).
   - Factor de emisión de red eléctrica del Sistema Eléctrico Interconectado Nacional (SEIN) de Perú.

7. **Biorremediación de Suelos (Biopilas):**
   - Geometría de prisma trapezoidal, balance C:N:P (100:10:1 o 100:5:1) y dosificación de urea y superfosfato triple.
   - Estimación de plazos y costos de capital/operación (*AACE International Class 4/5*).

---

## 🏛️ Normativa Peruana Integrada

- **ECA Agua:** *D.S. N° 004-2017-MINAM* (Categorías 1, 2, 3 y 4 con subclases).
- **LMP Efluentes PTAR:** *D.S. N° 003-2010-MINAM* (DBO 100 mg/L, DQO 200 mg/L, SST 100 mg/L, Aceites 20 mg/L).
- **ECA Aire:** *D.S. N° 003-2017-MINAM* (SO₂, PM₁₀, PM₂.₅, NO₂, O₃, CO, Plomo y Benceno).
- **ECA Suelo:** *D.S. N° 011-2017-MINAM* (Suelo agrícola, residencial/parques y comercial/industrial).
- **ECA Ruido:** *D.S. N° 085-2003-PCM* (Zonas de protección especial, residencial, comercial e industrial diurno/nocturno).

---

## 🛠️ Tecnologías

- **Framework:** Next.js 15 (App Router)
- **Lenguaje:** TypeScript 5
- **Estilos:** Tailwind CSS v4 con variables CSS semánticas
- **Iconografía:** Lucide React
- **Componentes UI:** Radix UI Primitives & Tailwind Animate
- **Motor de Cálculo:** Pure functions con TypeScript (`lib/calc-engine.ts`)
- **Suite de Pruebas:** Node.js native test runner (`lib/calc-engine.test.mts`)

---

## 💻 Desarrollo Local

```bash
# Instalar dependencias
npm install # o bun install

# Ejecutar suite de pruebas de cálculos analíticos
node --experimental-strip-types --test lib/calc-engine.test.mts

# Servidor de desarrollo
npm run dev
```

---

*Desarrollado con rigurosidad científica por el equipo de **Green Owl Labs**.*  
*Green Owl Labs © 2026. Todos los derechos reservados.*