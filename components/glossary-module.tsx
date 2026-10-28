"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, BookOpen } from "lucide-react"
import { useI18n } from "@/lib/i18n-context"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface GlossaryTerm {
  term: string
  definition: string
  detailedInfo: string
  category: string
  relatedTerms?: string[]
  methodology?: string
  protocol?: string
}

export function GlossaryModule() {
  const { language } = useI18n()
  const [searchTerm, setSearchTerm] = useState("")

  const glossaryTerms: GlossaryTerm[] = [
    {
      term: "DBO (Demanda Bioquímica de Oxígeno)",
      definition:
        "Cantidad de oxígeno que requieren los microorganismos para degradar la materia orgánica presente en el agua.",
      detailedInfo:
        "Se mide típicamente a 5 días (DBO₅) a 20°C en condiciones de oscuridad. Es un indicador fundamental de contaminación orgánica. Valores altos indican presencia significativa de materia orgánica biodegradable. Método estándar: SM 5210 B. Rango típico en aguas residuales domésticas: 100-400 mg/L. La relación DBO/DQO indica biodegradabilidad: >0.5 es altamente biodegradable.",
      category: "Calidad de Agua",
      relatedTerms: ["DQO", "OD", "Materia Orgánica"],
      methodology: "Standard Methods 5210 B - Método de dilución e incubación a 5 días",
      protocol: "Incubar muestra diluida a 20°C por 5 días, medir OD inicial y final",
    },
    {
      term: "DQO (Demanda Química de Oxígeno)",
      definition:
        "Cantidad de oxígeno necesaria para oxidar químicamente la materia orgánica e inorgánica presente en el agua mediante un agente oxidante fuerte.",
      detailedInfo:
        "Utiliza dicromato de potasio como oxidante en medio ácido. Mide tanto materia biodegradable como no biodegradable. La relación DQO/DBO indica la biodegradabilidad: >2.5 indica baja biodegradabilidad. Método estándar: SM 5220 D. Tiempo de análisis: 2-3 horas vs 5 días de DBO. Rango típico aguas residuales: 250-1000 mg/L.",
      category: "Calidad de Agua",
      relatedTerms: ["DBO", "Oxidación", "Materia Orgánica"],
      methodology: "Standard Methods 5220 D - Método de reflujo cerrado",
      protocol: "Digestión con dicromato de potasio a 150°C por 2 horas, medición espectrofotométrica",
    },
    {
      term: "ICA (Índice de Calidad del Agua)",
      definition:
        "Indicador numérico que integra varios parámetros físicos, químicos y biológicos para evaluar la calidad general del agua.",
      detailedInfo:
        "Escala típica de 0-100 donde valores mayores indican mejor calidad. Parámetros comunes: OD, pH, turbidez, coliformes, nitratos, fosfatos, temperatura, sólidos disueltos. Metodologías: NSF-WQI, CCME-WQI. Interpretación: >90 Excelente, 70-90 Buena, 50-70 Regular, 25-50 Mala, <25 Muy mala. Cada parámetro tiene peso específico según su importancia.",
      category: "Calidad de Agua",
      relatedTerms: ["pH", "OD", "Turbidez", "Coliformes"],
      methodology: "NSF Water Quality Index - Promedio ponderado de 9 parámetros",
      protocol: "Medir 9 parámetros, aplicar curvas de función, calcular promedio geométrico ponderado",
    },
    {
      term: "pH",
      definition: "Medida de la acidez o alcalinidad del agua en una escala de 0 a 14, donde 7 es neutro.",
      detailedInfo:
        "Escala logarítmica: cada unidad representa cambio de 10x en concentración de H+. Afecta solubilidad de metales, toxicidad de compuestos, eficiencia de desinfección. Rango óptimo para vida acuática: 6.5-8.5. Método de medición: potenciométrico con electrodo de vidrio. Temperatura afecta la medición: pH disminuye 0.03 unidades por cada °C de aumento.",
      category: "Parámetros Físico-Químicos",
      relatedTerms: ["Acidez", "Alcalinidad", "ICA"],
      methodology: "SM 4500-H+ B - Método electrométrico",
      protocol: "Calibrar electrodo con buffers pH 4, 7 y 10, medir muestra a temperatura constante",
    },
    {
      term: "OD (Oxígeno Disuelto)",
      definition: "Cantidad de oxígeno molecular disuelto en el agua, esencial para la vida acuática.",
      detailedInfo:
        "Expresado en mg/L o % saturación. Saturación depende de temperatura (inversamente), presión (directamente), salinidad (inversamente). Valores críticos: <2 mg/L hipoxia, <0.5 mg/L anoxia. Fuentes: fotosíntesis, aireación atmosférica. Consumo: respiración, oxidación materia orgánica. Métodos: Winkler (químico), electrodo de membrana, óptico (luminiscencia).",
      category: "Calidad de Agua",
      relatedTerms: ["DBO", "Eutrofización", "Hipoxia"],
      methodology: "SM 4500-O - Método Winkler modificado con azida",
      protocol: "Fijar OD con MnSO4 y álcali-yoduro-azida, titular con tiosulfato",
    },
    {
      term: "Turbidez",
      definition:
        "Medida de la claridad del agua, determinada por la cantidad de partículas suspendidas que dispersan la luz.",
      detailedInfo:
        "Unidades: NTU (Nephelometric Turbidity Units) o FNU (Formazin Nephelometric Units). Causas: arcilla, limo, materia orgánica, microorganismos, algas. Límite agua potable: <5 NTU (OMS), <1 NTU (EPA). Afecta: penetración de luz, fotosíntesis, eficiencia de desinfección, estética. Método: nefelométrico a 90° con luz blanca.",
      category: "Parámetros Físico-Químicos",
      relatedTerms: ["SST", "Claridad", "Calidad de Agua"],
      methodology: "SM 2130 B - Método nefelométrico",
      protocol: "Medir dispersión de luz a 90° usando turbidímetro calibrado con formazina",
    },
    {
      term: "Conductividad",
      definition: "Capacidad del agua para conducir electricidad, relacionada con la concentración de iones disueltos.",
      detailedInfo:
        "Unidades: µS/cm o mS/cm. Indica salinidad total. Factores: temperatura (aumenta 2%/°C), tipo y concentración de iones. Rangos típicos: agua destilada <1 µS/cm, agua potable 50-1500 µS/cm, agua de mar ~50,000 µS/cm. Relación aproximada: TDS (mg/L) ≈ Conductividad (µS/cm) × 0.5-0.7. Se reporta a 25°C.",
      category: "Parámetros Físico-Químicos",
      relatedTerms: ["TDS", "Salinidad", "Iones"],
      methodology: "SM 2510 B - Método de laboratorio",
      protocol: "Medir con conductímetro calibrado, compensar temperatura a 25°C",
    },
    {
      term: "Eutrofización",
      definition: "Enriquecimiento excesivo de nutrientes (nitrógeno y fósforo) en cuerpos de agua.",
      detailedInfo:
        "Proceso: exceso nutrientes → proliferación algas (bloom) → muerte algas → descomposición → consumo OD → hipoxia/anoxia → muerte fauna. Fuentes: escorrentía agrícola (fertilizantes), aguas residuales, detergentes con fosfatos. Indicadores: clorofila-a >10 µg/L, transparencia Secchi <1m, OD <2 mg/L. Control: reducción nutrientes en fuente, aireación artificial, biomanipulación (control biológico).",
      category: "Procesos Ambientales",
      relatedTerms: ["Nitrógeno", "Fósforo", "Algas", "Hipoxia"],
      methodology: "Índice de Estado Trófico de Carlson",
      protocol: "Medir fósforo total, clorofila-a y transparencia Secchi, calcular TSI",
    },
    {
      term: "Bioacumulación",
      definition:
        "Proceso por el cual los organismos acumulan sustancias químicas en concentraciones mayores que las presentes en el ambiente.",
      detailedInfo:
        "Factor de bioacumulación (BAF) = Concentración en organismo / Concentración en agua. Sustancias lipofílicas (PCBs, DDT, mercurio metílico) se acumulan en tejido graso. Biomagnificación: aumento concentración en niveles tróficos superiores (factor 10x por nivel). Riesgos: toxicidad crónica, efectos reproductivos, transferencia a humanos vía cadena alimentaria. Regulado por coeficiente de partición octanol-agua (Kow).",
      category: "Procesos Ambientales",
      relatedTerms: ["Biomagnificación", "Contaminantes Persistentes", "Cadena Trófica"],
      methodology: "EPA Method 1668 - Análisis de PCBs en tejido",
      protocol: "Extracción Soxhlet, limpieza con columna, análisis por GC-MS",
    },
    {
      term: "Remediación",
      definition:
        "Conjunto de técnicas y procesos para eliminar, reducir o neutralizar contaminantes en suelos, aguas o aire contaminados.",
      detailedInfo:
        "Técnicas in-situ: biorremediación (microorganismos), fitorremediación (plantas), oxidación química (peróxido, ozono), extracción vapor (VOCs), lavado suelo. Técnicas ex-situ: excavación y disposición, lavado suelo, incineración, estabilización/solidificación. Selección depende de: tipo contaminante, concentración, matriz, profundidad, costo ($50-500/m³), tiempo (meses-años). Objetivos: cumplir estándares ambientales, proteger salud humana y ecosistemas.",
      category: "Gestión Ambiental",
      relatedTerms: ["Biorremediación", "Fitorremediación", "Contaminación"],
      methodology: "ASTM E1739 - Guía para evaluación de riesgo en sitios contaminados",
      protocol: "Caracterización sitio, análisis riesgo, selección tecnología, implementación, monitoreo",
    },
    {
      term: "SST (Sólidos Suspendidos Totales)",
      definition: "Partículas sólidas que quedan retenidas en un filtro de 0.45 µm.",
      detailedInfo:
        "Incluye materia orgánica e inorgánica en suspensión. Método: filtración por membrana, secado a 103-105°C, pesado. Afecta turbidez, penetración de luz, calidad estética. Límite agua potable: <5 mg/L. Aguas residuales domésticas: 100-350 mg/L. Relación con turbidez: aproximadamente 1 NTU = 1-2 mg/L SST.",
      category: "Parámetros Físico-Químicos",
      relatedTerms: ["Turbidez", "SDT", "Filtración"],
      methodology: "SM 2540 D - Método gravimétrico",
      protocol: "Filtrar volumen conocido, secar filtro a 103-105°C, pesar diferencia",
    },
    {
      term: "TDS (Sólidos Disueltos Totales)",
      definition: "Suma de todos los minerales, sales, metales y cationes disueltos en el agua.",
      detailedInfo:
        "Pasan a través de filtro 0.45 µm. Método directo: evaporación y pesado. Método indirecto: conductividad × factor (0.5-0.7). Afecta sabor, corrosión, incrustación. Límite agua potable: <500 mg/L (OMS), <1000 mg/L (EPA). Clasificación: <1000 agua dulce, 1000-3000 ligeramente salobre, >3000 salobre.",
      category: "Parámetros Físico-Químicos",
      relatedTerms: ["Conductividad", "Salinidad", "Dureza"],
      methodology: "SM 2540 C - Método gravimétrico",
      protocol: "Filtrar muestra, evaporar filtrado a 180°C, pesar residuo",
    },
    {
      term: "Coliformes",
      definition: "Grupo de bacterias indicadoras de contaminación fecal en agua.",
      detailedInfo:
        "Coliformes totales: incluyen especies ambientales y fecales. Coliformes fecales (termotolerantes): principalmente E. coli, indican contaminación fecal reciente. Método: filtración por membrana, incubación 35-37°C (totales) o 44.5°C (fecales), conteo UFC/100mL. Límite agua potable: 0 UFC/100mL. Presencia indica riesgo de patógenos (Salmonella, Shigella, virus).",
      category: "Microbiología",
      relatedTerms: ["E. coli", "Patógenos", "Desinfección"],
      methodology: "SM 9222 B - Técnica de filtración por membrana",
      protocol: "Filtrar 100 mL, incubar en medio selectivo, contar colonias características",
    },
    {
      term: "Nitrógeno Total",
      definition: "Suma de todas las formas de nitrógeno en agua: orgánico, amoniacal, nitritos y nitratos.",
      detailedInfo:
        "Formas: N-orgánico (proteínas, urea), N-amoniacal (NH₃/NH₄⁺), N-nitritos (NO₂⁻), N-nitratos (NO₃⁻). Ciclo: amonificación → nitrificación → desnitrificación. Fuentes: fertilizantes, aguas residuales, escorrentía. Eutrofización: >0.3 mg/L N-total. Método: digestión Kjeldahl + análisis colorimétrico. Límite agua potable: 10 mg/L NO₃-N.",
      category: "Nutrientes",
      relatedTerms: ["Fósforo", "Eutrofización", "Nitrificación"],
      methodology: "SM 4500-N - Nitrógeno total Kjeldahl",
      protocol: "Digestión ácida, destilación, titulación o colorimetría",
    },
    {
      term: "Fósforo Total",
      definition: "Suma de todas las formas de fósforo: ortofosfatos, polifosfatos y fósforo orgánico.",
      detailedInfo:
        "Formas: ortofosfatos (PO₄³⁻, disponible), polifosfatos (detergentes), P-orgánico. Nutriente limitante en agua dulce. Eutrofización: >0.025 mg/L P-total. Fuentes: detergentes, fertilizantes, erosión. Remoción: precipitación química (alumbre, cal), biológica (EBPR). Método: digestión ácida + análisis colorimétrico (azul de molibdeno).",
      category: "Nutrientes",
      relatedTerms: ["Nitrógeno", "Eutrofización", "Ortofosfatos"],
      methodology: "SM 4500-P - Fósforo total",
      protocol: "Digestión con persulfato, análisis colorimétrico con molibdato de amonio",
    },
    {
      term: "Alcalinidad",
      definition: "Capacidad del agua para neutralizar ácidos, principalmente por carbonatos y bicarbonatos.",
      detailedInfo:
        "Expresada como mg/L CaCO₃. Formas: alcalinidad de carbonatos (CO₃²⁻), bicarbonatos (HCO₃⁻), hidróxidos (OH⁻). Función: buffer de pH, protección contra cambios bruscos. Método: titulación con H₂SO₄ a pH 4.5. Rango típico agua natural: 50-200 mg/L. Relación con dureza: agua dura generalmente tiene alta alcalinidad.",
      category: "Parámetros Físico-Químicos",
      relatedTerms: ["pH", "Dureza", "Carbonatos"],
      methodology: "SM 2320 B - Método de titulación",
      protocol: "Titular con H₂SO₄ 0.02N hasta pH 4.5, calcular como CaCO₃",
    },
    {
      term: "Dureza",
      definition: "Concentración de cationes metálicos multivalentes, principalmente calcio y magnesio.",
      detailedInfo:
        "Expresada como mg/L CaCO₃. Tipos: dureza temporal (carbonatos, removible por ebullición), dureza permanente (sulfatos, cloruros). Clasificación: <75 blanda, 75-150 moderada, 150-300 dura, >300 muy dura. Efectos: incrustación en tuberías, consumo excesivo de jabón, sabor. Método: titulación con EDTA. Ablandamiento: intercambio iónico, precipitación con cal-soda.",
      category: "Parámetros Físico-Químicos",
      relatedTerms: ["Calcio", "Magnesio", "Alcalinidad"],
      methodology: "SM 2340 C - Método EDTA",
      protocol: "Titular con EDTA usando indicador eriocromo negro T",
    },
    {
      term: "Cloruros",
      definition: "Iones de cloro (Cl⁻) disueltos en agua, indicadores de salinidad y contaminación.",
      detailedInfo:
        "Fuentes naturales: disolución de minerales, intrusión salina. Fuentes antropogénicas: aguas residuales, sal de deshielo, procesos industriales. Límite agua potable: 250 mg/L (sabor). Corrosivo para metales. Método: titulación argentométrica (Mohr) o electrodo selectivo. Rango agua dulce: <50 mg/L, agua de mar: ~19,000 mg/L.",
      category: "Parámetros Químicos",
      relatedTerms: ["Salinidad", "Conductividad", "Corrosión"],
      methodology: "SM 4500-Cl⁻ B - Método argentométrico",
      protocol: "Titular con AgNO₃ usando cromato de potasio como indicador",
    },
    {
      term: "Sulfatos",
      definition: "Iones de sulfato (SO₄²⁻) presentes en agua, pueden causar efectos laxantes.",
      detailedInfo:
        "Fuentes: disolución de yeso y otros minerales, oxidación de sulfuros, aguas residuales industriales. Límite agua potable: 250 mg/L (sabor y efecto laxante). Reducción bacteriana a sulfuros causa olor a huevo podrido. Método: turbidimétrico (precipitación con BaCl₂) o cromatografía iónica. Rango típico: 10-50 mg/L.",
      category: "Parámetros Químicos",
      relatedTerms: ["Sulfuros", "Corrosión", "Sabor"],
      methodology: "SM 4500-SO₄²⁻ E - Método turbidimétrico",
      protocol: "Precipitar con cloruro de bario, medir turbidez a 420 nm",
    },
    {
      term: "Metales Pesados",
      definition: "Elementos metálicos de alta densidad y toxicidad: Pb, Cd, Hg, Cr, As.",
      detailedInfo:
        "Fuentes: minería, industria, baterías, pinturas, combustibles. Efectos: neurotoxicidad (Pb, Hg), carcinogénicos (As, Cr⁶⁺), nefrotoxicidad (Cd). Bioacumulación en cadena alimentaria. Límites agua potable (µg/L): Pb <10, Cd <3, Hg <1, As <10, Cr <50. Métodos: ICP-MS, AAS, ICP-OES. Remoción: precipitación, intercambio iónico, ósmosis inversa.",
      category: "Contaminantes",
      relatedTerms: ["Toxicidad", "Bioacumulación", "Tratamiento"],
      methodology: "EPA Method 200.8 - ICP-MS",
      protocol: "Digestión ácida, análisis por espectrometría de masas con plasma acoplado inductivamente",
    },
    {
      term: "COVs (Compuestos Orgánicos Volátiles)",
      definition: "Compuestos orgánicos con alta presión de vapor: benceno, tolueno, xileno, TCE.",
      detailedInfo:
        "Fuentes: combustibles, solventes, pinturas, productos de limpieza. Efectos: irritación, carcinogénicos (benceno), daño hepático. Volatilización rápida. Límites agua potable (µg/L): benceno <5, tolueno <1000, TCE <5. Método: purga y trampa + GC-MS. Remoción: aireación, carbón activado, oxidación avanzada.",
      category: "Contaminantes",
      relatedTerms: ["BTEX", "Solventes", "Tratamiento"],
      methodology: "EPA Method 524.2 - Purga y trampa GC-MS",
      protocol: "Purga con helio, trampa en adsorbente, desorción térmica, análisis GC-MS",
    },
    {
      term: "Pesticidas",
      definition: "Sustancias químicas para control de plagas: insecticidas, herbicidas, fungicidas.",
      detailedInfo:
        "Tipos: organoclorados (DDT, prohibidos), organofosforados (malatión), carbamatos, piretroides. Fuentes: agricultura, control de vectores. Efectos: neurotoxicidad, disrupción endocrina, persistencia ambiental. Límites: suma de pesticidas <0.5 µg/L. Método: extracción líquido-líquido + GC-MS. Remoción: carbón activado, oxidación avanzada.",
      category: "Contaminantes",
      relatedTerms: ["Agricultura", "Toxicidad", "Persistencia"],
      methodology: "EPA Method 8081 - Pesticidas organoclorados por GC",
      protocol: "Extracción con diclorometano, limpieza, análisis por cromatografía de gases",
    },
    {
      term: "Cloración",
      definition: "Proceso de desinfección mediante adición de cloro o compuestos clorados.",
      detailedInfo:
        "Formas: cloro gas (Cl₂), hipoclorito de sodio (NaOCl), hipoclorito de calcio (Ca(OCl)₂). Dosis típica: 1-3 mg/L, residual: 0.2-0.5 mg/L. Tiempo de contacto: 30 min. Efectivo contra bacterias, virus, algunos protozoos. Subproductos: trihalometanos (THMs), ácidos haloacéticos (HAAs), carcinogénicos. Alternativas: UV, ozono, cloraminas.",
      category: "Tratamiento",
      relatedTerms: ["Desinfección", "Cloro Residual", "THMs"],
      methodology: "SM 4500-Cl - Cloro residual",
      protocol: "Método DPD colorimétrico, medir cloro libre y total",
    },
    {
      term: "Coagulación-Floculación",
      definition: "Proceso de desestabilización y agregación de partículas coloidales para su remoción.",
      detailedInfo:
        "Coagulantes: sulfato de aluminio (alumbre), cloruro férrico, PAC. Dosis: 20-50 mg/L. Mecanismo: neutralización de carga, barrido. Floculación: agitación lenta para formar flóculos grandes. Parámetros: pH óptimo (6-7.5 para alumbre), tiempo de mezcla rápida (1-3 min), lenta (20-30 min). Remueve: turbidez, color, microorganismos, metales.",
      category: "Tratamiento",
      relatedTerms: ["Alumbre", "Floculantes", "Sedimentación"],
      methodology: "Jar Test - ASTM D2035",
      protocol: "Prueba de jarras con diferentes dosis, agitación rápida y lenta, sedimentación",
    },
    {
      term: "Filtración",
      definition: "Proceso de separación de partículas mediante paso a través de medio poroso.",
      detailedInfo:
        "Tipos: filtración rápida (arena, 5-15 m/h), lenta (arena, 0.1-0.3 m/h), multimedia (arena-antracita-granate). Mecanismos: cribado, sedimentación, intercepción, adsorción. Remueve: SST, turbidez, microorganismos. Retrolavado: cuando pérdida de carga >2 m o turbidez efluente >0.3 NTU. Medios: arena (0.5-1 mm), antracita (1-2 mm), profundidad 0.6-1.2 m.",
      category: "Tratamiento",
      relatedTerms: ["Arena", "Turbidez", "Retrolavado"],
      methodology: "SM 2120 - Turbidez del efluente",
      protocol: "Monitorear turbidez efluente continuamente, <0.3 NTU para agua potable",
    },
    {
      term: "Lodos Activados",
      definition: "Proceso biológico aerobio de tratamiento de aguas residuales con biomasa en suspensión.",
      detailedInfo:
        "Componentes: reactor de aireación, sedimentador secundario, recirculación de lodos. Parámetros: TRH 6-8 h, TRS 10-15 días, SSLM 2000-4000 mg/L, F/M 0.2-0.4 kg DBO/kg SSLM·día. Remoción: 85-95% DBO, 85-95% SST. Variantes: aireación extendida (TRH 18-36 h), contacto-estabilización, zanjas de oxidación. Requiere: aireación (1-2 kWh/kg DBO removido).",
      category: "Tratamiento Biológico",
      relatedTerms: ["Aireación", "Biomasa", "Sedimentación"],
      methodology: "Diseño según Metcalf & Eddy",
      protocol: "Calcular volumen por TRH, dimensionar aireación por demanda de O₂, diseñar sedimentador",
    },
    {
      term: "UASB (Reactor Anaerobio de Flujo Ascendente)",
      definition: "Reactor anaerobio de alta tasa con manto de lodos granulares.",
      detailedInfo:
        "Ventajas: bajo consumo energético, producción de biogás (CH₄), menor producción de lodos. Parámetros: TRH 6-12 h, carga orgánica 4-6 kg DQO/m³·día, temperatura >20°C. Remoción: 65-80% DQO. Aplicaciones: aguas residuales domésticas e industriales (cervecerías, alimentos). Limitaciones: requiere post-tratamiento, sensible a tóxicos, arranque lento (3-6 meses).",
      category: "Tratamiento Biológico",
      relatedTerms: ["Anaerobio", "Biogás", "Metano"],
      methodology: "Diseño según Lettinga",
      protocol: "Calcular volumen por carga orgánica, diseñar separador gas-sólido-líquido",
    },
    {
      term: "Humedales Construidos",
      definition: "Sistemas de tratamiento que simulan procesos naturales de humedales.",
      detailedInfo:
        "Tipos: flujo superficial (FWS), flujo subsuperficial horizontal (HSSF), vertical (VSSF). Plantas: Typha, Phragmites, Scirpus. Mecanismos: sedimentación, filtración, adsorción, degradación microbiana, absorción por plantas. Remoción: 70-90% DBO, 80-95% SST, 40-60% N, 40-70% P. Diseño: carga hidráulica 5-10 cm/día, profundidad 0.3-0.6 m, tiempo de retención 5-7 días.",
      category: "Tratamiento Natural",
      relatedTerms: ["Fitorremediación", "Tratamiento Natural", "Plantas Acuáticas"],
      methodology: "Diseño según EPA",
      protocol: "Calcular área por carga orgánica, seleccionar plantas nativas, diseñar impermeabilización",
    },
    {
      term: "Ósmosis Inversa",
      definition: "Proceso de separación mediante membranas semipermeables bajo presión.",
      detailedInfo:
        "Principio: aplicar presión >presión osmótica para forzar paso de agua pura. Presión: 15-25 bar (agua salobre), 55-85 bar (agua de mar). Membranas: poliamida, acetato de celulosa, poro <0.001 µm. Remoción: >95% sales, >99% bacterias/virus, metales, pesticidas. Recuperación: 50-85%. Aplicaciones: desalinización, agua ultrapura, tratamiento de efluentes. Pretratamiento crítico: filtración, antincrustantes.",
      category: "Tratamiento Avanzado",
      relatedTerms: ["Desalinización", "Membranas", "TDS"],
      methodology: "Diseño según fabricante de membranas",
      protocol: "Calcular flujo por área de membrana, presión por salinidad, pretratamiento necesario",
    },
    {
      term: "Carbón Activado",
      definition: "Material adsorbente de alta porosidad para remoción de contaminantes orgánicos.",
      detailedInfo:
        "Tipos: granular (GAC), polvo (PAC). Área superficial: 500-1500 m²/g. Aplicaciones: remoción de COVs, pesticidas, color, sabor, olor, THMs. Dosis PAC: 5-20 mg/L. Tiempo de contacto GAC: 10-30 min. Regeneración: térmica (800-900°C) o química. Capacidad: 0.1-0.5 kg contaminante/kg carbón. Vida útil: 6-24 meses según carga orgánica.",
      category: "Tratamiento Avanzado",
      relatedTerms: ["Adsorción", "COVs", "Regeneración"],
      methodology: "Isotermas de Freundlich y Langmuir",
      protocol: "Determinar capacidad de adsorción, calcular dosis, diseñar columnas o contactores",
    },
    {
      term: "Oxidación Avanzada (POA)",
      definition: "Procesos que generan radicales hidroxilo (•OH) para degradar contaminantes orgánicos.",
      detailedInfo:
        "Procesos: UV/H₂O₂, O₃/UV, Fenton (Fe²⁺/H₂O₂), fotocatálisis (TiO₂/UV). Radical •OH: segundo oxidante más fuerte (E° = 2.8 V). Aplicaciones: contaminantes recalcitrantes, pesticidas, fármacos, colorantes. Ventajas: mineralización completa, sin lodos. Desventajas: alto costo energético, requiere pretratamiento. Dosis H₂O₂: 50-200 mg/L, UV: 40-100 mJ/cm².",
      category: "Tratamiento Avanzado",
      relatedTerms: ["Radicales Libres", "UV", "Ozono"],
      methodology: "Diseño según tipo de contaminante",
      protocol: "Determinar dosis de oxidante, tiempo de contacto, intensidad UV necesaria",
    },
    {
      term: "Electrocoagulación",
      definition: "Proceso de coagulación mediante generación electroquímica de coagulantes.",
      detailedInfo:
        "Principio: electrodos de Al o Fe generan iones metálicos in-situ. Ventajas: no requiere químicos, menor producción de lodos, automatizable. Parámetros: densidad de corriente 10-100 A/m², voltaje 5-15 V, tiempo 10-30 min. Aplicaciones: metales pesados, colorantes, emulsiones, aguas residuales industriales. Consumo energético: 0.5-3 kWh/m³. Electrodo: consumo 0.1-1 kg/m³.",
      category: "Tratamiento Electroquímico",
      relatedTerms: ["Coagulación", "Electroquímica", "Metales"],
      methodology: "Diseño experimental",
      protocol: "Optimizar densidad de corriente, pH, tiempo de retención, configuración de electrodos",
    },
    {
      term: "Biorremediación",
      definition: "Uso de microorganismos para degradar contaminantes ambientales.",
      detailedInfo:
        "Tipos: bioestimulación (nutrientes), bioaumentación (inoculación), atenuación natural. Contaminantes: hidrocarburos, BTEX, PAHs, PCBs, pesticidas. Condiciones: O₂ (aerobio) o anóxico/anaerobio, nutrientes (N:P = 100:10:1), pH 6-8, temperatura 20-30°C. Tiempo: meses a años. Monitoreo: concentración contaminante, CO₂/CH₄, población microbiana. Ventajas: bajo costo, in-situ, ambientalmente amigable.",
      category: "Remediación",
      relatedTerms: ["Microorganismos", "Hidrocarburos", "Biodegradación"],
      methodology: "ASTM E2893 - Biorremediación de suelos",
      protocol: "Caracterizar sitio, diseñar estrategia, implementar, monitorear eficacia",
    },
    {
      term: "Fitorremediación",
      definition: "Uso de plantas para remover, degradar o estabilizar contaminantes.",
      detailedInfo:
        "Mecanismos: fitoextracción (absorción en tejido), fitodegradación (degradación enzimática), fitoestabilización (inmovilización), fitovolatilización (volatilización). Plantas hiperacumuladoras: Thlaspi (Zn, Cd), Pteris (As), girasol (Pb). Aplicaciones: metales pesados, hidrocarburos, nutrientes. Ventajas: bajo costo, estético, sostenible. Limitaciones: lento (años), profundidad limitada (<1 m), disposición de biomasa contaminada.",
      category: "Remediación",
      relatedTerms: ["Plantas", "Metales Pesados", "Hiperacumuladoras"],
      methodology: "ITRC Phytotechnology Guide",
      protocol: "Seleccionar especies apropiadas, preparar suelo, plantar, monitorear crecimiento y acumulación",
    },
    {
      term: "Análisis de Ciclo de Vida (ACV)",
      definition: "Evaluación sistemática de impactos ambientales de un producto/proceso desde la cuna hasta la tumba.",
      detailedInfo:
        "Fases: definición de objetivo y alcance, inventario (entradas/salidas), evaluación de impacto, interpretación. Categorías de impacto: cambio climático (kg CO₂ eq), acidificación (kg SO₂ eq), eutrofización (kg PO₄ eq), toxicidad, agotamiento de recursos. Normas: ISO 14040-14044. Software: SimaPro, GaBi, OpenLCA. Aplicaciones: ecodiseño, comparación de alternativas, declaraciones ambientales.",
      category: "Metodologías",
      relatedTerms: ["Impacto Ambiental", "Huella de Carbono", "Sostenibilidad"],
      methodology: "ISO 14040:2006 - Principios y marco de referencia",
      protocol: "Definir unidad funcional, recopilar datos de inventario, calcular impactos, interpretar resultados",
    },
    {
      term: "Huella de Carbono",
      definition: "Cantidad total de emisiones de GEI causadas directa e indirectamente por una actividad.",
      detailedInfo:
        "Alcances: 1 (emisiones directas), 2 (energía comprada), 3 (cadena de valor). Expresada en kg o ton CO₂ equivalente. Factores de emisión: electricidad 0.5-1 kg CO₂/kWh, gasolina 2.3 kg CO₂/L, gas natural 2 kg CO₂/m³. Metodologías: GHG Protocol, ISO 14064, PAS 2050. Reducción: eficiencia energética, renovables, compensación (bonos de carbono).",
      category: "Indicadores Ambientales",
      relatedTerms: ["GEI", "Cambio Climático", "CO₂"],
      methodology: "GHG Protocol Corporate Standard",
      protocol: "Identificar fuentes de emisión, calcular por alcance, reportar y verificar",
    },
    {
      term: "Huella Hídrica",
      definition: "Volumen total de agua dulce utilizada para producir bienes y servicios.",
      detailedInfo:
        "Componentes: agua azul (superficial/subterránea), verde (lluvia), gris (contaminada). Expresada en L o m³. Ejemplos: 1 kg carne 15,000 L, 1 kg arroz 2,500 L, 1 L leche 1,000 L. Metodología: Water Footprint Network. Aplicaciones: gestión de recursos hídricos, ecodiseño, etiquetado. Reducción: eficiencia en uso, reciclaje, tratamiento de efluentes.",
      category: "Indicadores Ambientales",
      relatedTerms: ["Agua Virtual", "Recursos Hídricos", "Sostenibilidad"],
      methodology: "Water Footprint Assessment Manual",
      protocol: "Cuantificar consumo directo e indirecto, clasificar por tipo, evaluar sostenibilidad",
    },
    {
      term: "Economía Circular",
      definition:
        "Modelo económico que busca mantener productos, materiales y recursos en uso el mayor tiempo posible.",
      detailedInfo:
        "Principios: diseñar sin residuos, mantener productos y materiales en uso, regenerar sistemas naturales. Estrategias: reducir, reusar, reparar, remanufacturar, reciclar. Contrasta con economía lineal (extraer-producir-desechar). Beneficios: reducción de residuos, menor extracción de recursos, creación de empleo, innovación. Ejemplos: simbiosis industrial, producto como servicio, upcycling.",
      category: "Gestión Ambiental",
      relatedTerms: ["Reciclaje", "Simbiosis Industrial", "Sostenibilidad"],
      methodology: "Ellen MacArthur Foundation Framework",
      protocol: "Mapear flujos de materiales, identificar oportunidades de circularidad, implementar estrategias",
    },
    {
      term: "Evaluación de Impacto Ambiental (EIA)",
      definition: "Proceso sistemático para identificar, predecir y evaluar impactos ambientales de proyectos.",
      detailedInfo:
        "Etapas: screening (determinar si requiere EIA), scoping (definir alcance), línea base, identificación de impactos, evaluación de significancia, medidas de mitigación, plan de manejo ambiental, monitoreo. Métodos: matrices (Leopold), redes, superposición de mapas, modelos. Participación pública obligatoria. Resultado: Declaración de Impacto Ambiental (DIA) aprobada o rechazada.",
      category: "Gestión Ambiental",
      relatedTerms: ["Impacto Ambiental", "Mitigación", "Línea Base"],
      methodology: "Ley de EIA de cada país",
      protocol: "Seguir términos de referencia, realizar estudios, consulta pública, obtener aprobación",
    },
    {
      term: "ISO 14001",
      definition: "Norma internacional para Sistemas de Gestión Ambiental (SGA).",
      detailedInfo:
        "Estructura: contexto de la organización, liderazgo, planificación, apoyo, operación, evaluación del desempeño, mejora. Ciclo PDCA: Planificar-Hacer-Verificar-Actuar. Requisitos: política ambiental, objetivos, identificación de aspectos e impactos, cumplimiento legal, competencia, comunicación, control operacional, auditorías internas, revisión por la dirección. Beneficios: reducción de costos, cumplimiento legal, mejora de imagen.",
      category: "Gestión Ambiental",
      relatedTerms: ["SGA", "Certificación", "Mejora Continua"],
      methodology: "ISO 14001:2015",
      protocol: "Implementar requisitos de la norma, auditoría interna, certificación por tercera parte",
    },
  ]

  const filteredTerms = glossaryTerms.filter(
    (item) =>
      item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.detailedInfo.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const categories = Array.from(new Set(glossaryTerms.map((t) => t.category)))

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2 flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          {language === "es"
            ? "Glosario Ambiental Completo"
            : language === "en"
              ? "Complete Environmental Glossary"
              : "Glossário Ambiental Completo"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {language === "es"
            ? `${glossaryTerms.length} términos con definiciones detalladas, metodologías y protocolos`
            : language === "en"
              ? `${glossaryTerms.length} terms with detailed definitions, methodologies and protocols`
              : `${glossaryTerms.length} termos com definições detalhadas, metodologias e protocolos`}
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={
            language === "es" ? "Buscar término..." : language === "en" ? "Search term..." : "Pesquisar termo..."
          }
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-12"
          aria-label="Buscar en glosario"
        />
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 gap-1 h-auto p-1">
          <TabsTrigger value="all" className="min-h-[44px] text-xs">
            {language === "es" ? "Todos" : language === "en" ? "All" : "Todos"} ({filteredTerms.length})
          </TabsTrigger>
          <TabsTrigger value="water" className="min-h-[44px] text-xs">
            {language === "es" ? "Agua" : language === "en" ? "Water" : "Água"}
          </TabsTrigger>
          <TabsTrigger value="treatment" className="min-h-[44px] text-xs">
            {language === "es" ? "Tratamiento" : language === "en" ? "Treatment" : "Tratamento"}
          </TabsTrigger>
          <TabsTrigger value="management" className="min-h-[44px] text-xs">
            {language === "es" ? "Gestión" : language === "en" ? "Management" : "Gestão"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <div className="grid gap-4">
            {categories.map((category) => {
              const termsInCategory = filteredTerms.filter((t) => t.category === category)
              if (termsInCategory.length === 0) return null

              return (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="text-lg">{category}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {termsInCategory.map((item, index) => (
                      <div key={index} className="space-y-3">
                        <h3 className="font-semibold text-primary text-base">{item.term}</h3>
                        <p className="text-sm text-foreground leading-relaxed">{item.definition}</p>
                        <div className="bg-muted/50 p-3 rounded-md space-y-2">
                          <p className="text-xs text-muted-foreground leading-relaxed">{item.detailedInfo}</p>
                          {item.methodology && (
                            <div className="pt-2 border-t border-border">
                              <p className="text-xs font-semibold text-foreground">
                                {language === "es"
                                  ? "Metodología:"
                                  : language === "en"
                                    ? "Methodology:"
                                    : "Metodologia:"}
                              </p>
                              <p className="text-xs text-muted-foreground">{item.methodology}</p>
                            </div>
                          )}
                          {item.protocol && (
                            <div className="pt-2 border-t border-border">
                              <p className="text-xs font-semibold text-foreground">
                                {language === "es" ? "Protocolo:" : language === "en" ? "Protocol:" : "Protocolo:"}
                              </p>
                              <p className="text-xs text-muted-foreground">{item.protocol}</p>
                            </div>
                          )}
                        </div>
                        {item.relatedTerms && item.relatedTerms.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            <span className="text-xs text-muted-foreground">
                              {language === "es"
                                ? "Términos relacionados:"
                                : language === "en"
                                  ? "Related terms:"
                                  : "Termos relacionados:"}
                            </span>
                            {item.relatedTerms.map((related, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {related}
                              </Badge>
                            ))}
                          </div>
                        )}
                        {index < termsInCategory.length - 1 && <div className="border-t border-border mt-4" />}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="water" className="mt-4">
          {/* Similar structure for water-specific terms */}
        </TabsContent>

        <TabsContent value="treatment" className="mt-4">
          {/* Similar structure for treatment-specific terms */}
        </TabsContent>

        <TabsContent value="management" className="mt-4">
          {/* Similar structure for management-specific terms */}
        </TabsContent>
      </Tabs>

      {filteredTerms.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            {language === "es"
              ? "No se encontraron términos que coincidan con tu búsqueda"
              : language === "en"
                ? "No terms found matching your search"
                : "Nenhum termo encontrado correspondente à sua pesquisa"}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
