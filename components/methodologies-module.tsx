"use client"

import React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useI18n } from "@/lib/i18n-context"
import {
  Leaf,
  TrendingUp,
  Zap,
  FileText,
  Droplets,
  Calculator,
  Info,
  CheckCircle2,
  BookOpen,
  Wrench,
  Wind,
  Recycle,
  TreePine,
  Factory,
  Waves,
  Mountain,
  Sprout,
  FlaskConical,
  BarChart3,
  Shield,
  Globe,
  Microscope,
  AlertTriangle,
  Building2,
} from "lucide-react"

export function MethodologiesModule() {
  const { language } = useI18n()
  const [selectedMethodology, setSelectedMethodology] = useState<string | null>(null)

  const methodologies = {
    biomimicry: {
      icon: Leaf,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      title: language === "es" ? "Biomímesis" : language === "en" ? "Biomimicry" : "Biomimética",
      description:
        language === "es"
          ? "Diseño inspirado en la naturaleza para soluciones sostenibles"
          : "Nature-inspired design for sustainable solutions",
      protocol: {
        steps: [
          language === "es"
            ? "1. Identificar el desafío ambiental específico"
            : "1. Identify specific environmental challenge",
          language === "es"
            ? "2. Buscar organismos que resuelvan problemas similares"
            : "2. Find organisms solving similar problems",
          language === "es"
            ? "3. Abstraer principios biológicos fundamentales"
            : "3. Abstract fundamental biological principles",
          language === "es" ? "4. Aplicar al diseño de ingeniería" : "4. Apply to engineering design",
          language === "es" ? "5. Evaluar, optimizar y escalar" : "5. Evaluate, optimize and scale",
        ],
        applications: [
          language === "es"
            ? "Humedales artificiales (filtración natural)"
            : "Constructed wetlands (natural filtration)",
          language === "es"
            ? "Sistemas de captación de niebla (escarabajos del desierto)"
            : "Fog harvesting (desert beetles)",
          language === "es" ? "Techos verdes (regulación térmica)" : "Green roofs (thermal regulation)",
          language === "es"
            ? "Biorremediación con plantas (fitorremediación)"
            : "Plant-based bioremediation (phytoremediation)",
          language === "es" ? "Estructuras autolimpiantes (efecto loto)" : "Self-cleaning structures (lotus effect)",
        ],
        tools: [
          "AskNature.org - Base de datos de estrategias biológicas",
          "Biomimicry Institute - Recursos y capacitación",
          "ISO 18458:2015 - Estándar de biomímesis",
          "Biomimicry 3.8 - Consultoría especializada",
        ],
      },
    },
    lca: {
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      title: language === "es" ? "Análisis de Ciclo de Vida (ACV)" : "Life Cycle Assessment (LCA)",
      description:
        language === "es"
          ? "Evaluación cuantitativa de impactos ambientales de productos/procesos"
          : "Quantitative environmental impact assessment of products/processes",
      protocol: {
        steps: [
          language === "es"
            ? "1. Definir objetivo, alcance y unidad funcional"
            : "1. Define goal, scope and functional unit",
          language === "es"
            ? "2. Análisis de inventario (LCI) - recopilar datos"
            : "2. Life cycle inventory (LCI) - collect data",
          language === "es"
            ? "3. Evaluación de impacto (LCIA) - categorías de impacto"
            : "3. Life cycle impact assessment (LCIA) - impact categories",
          language === "es"
            ? "4. Interpretación de resultados y puntos críticos"
            : "4. Interpretation of results and hotspots",
          language === "es" ? "5. Análisis de sensibilidad e incertidumbre" : "5. Sensitivity and uncertainty analysis",
        ],
        applications: [
          language === "es" ? "Comparación de alternativas de tratamiento" : "Treatment alternatives comparison",
          language === "es" ? "Evaluación de productos químicos" : "Chemical products evaluation",
          language === "es" ? "Análisis de sistemas energéticos" : "Energy systems analysis",
          language === "es" ? "Optimización de procesos industriales" : "Industrial process optimization",
          language === "es"
            ? "Ecoetiquetado y declaraciones ambientales"
            : "Eco-labeling and environmental declarations",
        ],
        tools: [
          "SimaPro - Software líder en ACV",
          "OpenLCA - Herramienta de código abierto",
          "ISO 14040:2006 - Principios y marco de referencia",
          "ISO 14044:2006 - Requisitos y directrices",
          "Ecoinvent Database - Base de datos de inventarios",
          "GaBi Software - Análisis de ciclo de vida",
        ],
      },
    },
    eia: {
      icon: Shield,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      title: language === "es" ? "Evaluación de Impacto Ambiental (EIA)" : "Environmental Impact Assessment (EIA)",
      description:
        language === "es"
          ? "Proceso sistemático para identificar, predecir y evaluar impactos ambientales"
          : "Systematic process to identify, predict and evaluate environmental impacts",
      protocol: {
        steps: [
          language === "es"
            ? "1. Screening - determinar si se requiere EIA"
            : "1. Screening - determine if EIA is required",
          language === "es"
            ? "2. Scoping - identificar impactos significativos"
            : "2. Scoping - identify significant impacts",
          language === "es"
            ? "3. Línea base ambiental - caracterización del área"
            : "3. Environmental baseline - area characterization",
          language === "es" ? "4. Predicción y evaluación de impactos" : "4. Impact prediction and evaluation",
          language === "es"
            ? "5. Medidas de mitigación y plan de manejo"
            : "5. Mitigation measures and management plan",
          language === "es" ? "6. Monitoreo y seguimiento" : "6. Monitoring and follow-up",
        ],
        applications: [
          language === "es" ? "Proyectos de infraestructura" : "Infrastructure projects",
          language === "es" ? "Plantas industriales" : "Industrial plants",
          language === "es" ? "Proyectos mineros" : "Mining projects",
          language === "es" ? "Desarrollos urbanos" : "Urban developments",
          language === "es" ? "Proyectos energéticos" : "Energy projects",
        ],
        tools: [
          "Matriz de Leopold - Identificación de impactos",
          "Método de Conesa - Valoración cuantitativa",
          "Software EIA - Gestión de estudios",
          "ISO 14001 - Sistema de gestión ambiental",
          "Directiva 2011/92/UE - Marco legal europeo",
        ],
      },
    },
    era: {
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      title: language === "es" ? "Evaluación de Riesgo Ambiental (ERA)" : "Environmental Risk Assessment (ERA)",
      description:
        language === "es"
          ? "Evaluación cuantitativa de riesgos para ecosistemas y salud humana"
          : "Quantitative assessment of risks to ecosystems and human health",
      protocol: {
        steps: [
          language === "es" ? "1. Identificación del peligro" : "1. Hazard identification",
          language === "es" ? "2. Evaluación de exposición" : "2. Exposure assessment",
          language === "es" ? "3. Evaluación de efectos (dosis-respuesta)" : "3. Effects assessment (dose-response)",
          language === "es" ? "4. Caracterización del riesgo" : "4. Risk characterization",
          language === "es" ? "5. Gestión y comunicación del riesgo" : "5. Risk management and communication",
        ],
        applications: [
          language === "es" ? "Sitios contaminados" : "Contaminated sites",
          language === "es" ? "Sustancias químicas peligrosas" : "Hazardous chemicals",
          language === "es" ? "Derrames y emergencias" : "Spills and emergencies",
          language === "es" ? "Evaluación de pesticidas" : "Pesticide assessment",
          language === "es" ? "Riesgo ecotoxicológico" : "Ecotoxicological risk",
        ],
        tools: [
          "USEPA Risk Assessment Guidelines",
          "RISC Software - Evaluación de riesgo",
          "CLEA Model - Contaminación de suelos",
          "EUSES - Evaluación de sustancias químicas",
          "ISO 31000 - Gestión de riesgos",
        ],
      },
    },
    mfa: {
      icon: Recycle,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
      borderColor: "border-cyan-200",
      title: language === "es" ? "Análisis de Flujo de Materiales (MFA)" : "Material Flow Analysis (MFA)",
      description:
        language === "es"
          ? "Cuantificación sistemática de flujos y stocks de materiales"
          : "Systematic quantification of material flows and stocks",
      protocol: {
        steps: [
          language === "es" ? "1. Definir sistema y límites" : "1. Define system and boundaries",
          language === "es" ? "2. Identificar procesos y flujos" : "2. Identify processes and flows",
          language === "es" ? "3. Cuantificar entradas y salidas" : "3. Quantify inputs and outputs",
          language === "es" ? "4. Balance de masas" : "4. Mass balance",
          language === "es" ? "5. Análisis de resultados e indicadores" : "5. Results analysis and indicators",
        ],
        applications: [
          language === "es" ? "Metabolismo urbano" : "Urban metabolism",
          language === "es" ? "Gestión de residuos" : "Waste management",
          language === "es" ? "Economía circular" : "Circular economy",
          language === "es" ? "Simbiosis industrial" : "Industrial symbiosis",
          language === "es" ? "Análisis de recursos" : "Resource analysis",
        ],
        tools: [
          "STAN Software - Análisis de flujos",
          "Umberto - Modelado de sistemas",
          "ISO 14051 - Contabilidad de flujos de materiales",
          "Eurostat MFA Methodology",
        ],
      },
    },
    phytoremediation: {
      icon: Sprout,
      color: "text-lime-600",
      bgColor: "bg-lime-50",
      borderColor: "border-lime-200",
      title: language === "es" ? "Fitorremediación" : "Phytoremediation",
      description:
        language === "es"
          ? "Uso de plantas para remover, degradar o estabilizar contaminantes"
          : "Use of plants to remove, degrade or stabilize contaminants",
      protocol: {
        steps: [
          language === "es" ? "1. Caracterización del sitio contaminado" : "1. Contaminated site characterization",
          language === "es"
            ? "2. Selección de especies vegetales apropiadas"
            : "2. Selection of appropriate plant species",
          language === "es" ? "3. Diseño del sistema de fitorremediación" : "3. Phytoremediation system design",
          language === "es" ? "4. Implementación y establecimiento" : "4. Implementation and establishment",
          language === "es" ? "5. Monitoreo de eficiencia y biomasa" : "5. Efficiency and biomass monitoring",
        ],
        applications: [
          language === "es" ? "Metales pesados en suelos" : "Heavy metals in soils",
          language === "es" ? "Hidrocarburos petroleros" : "Petroleum hydrocarbons",
          language === "es" ? "Aguas residuales (humedales)" : "Wastewater (wetlands)",
          language === "es" ? "Sitios mineros abandonados" : "Abandoned mining sites",
          language === "es" ? "Lixiviados de rellenos sanitarios" : "Landfill leachates",
        ],
        tools: [
          "PHYTOPET - Base de datos de plantas",
          "Interstate Technology Regulatory Council (ITRC) Guidelines",
          "USEPA Phytoremediation Resource Guide",
          "Phytoremediation Database",
        ],
      },
    },
    bioremediation: {
      icon: Microscope,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200",
      title: language === "es" ? "Biorremediación" : "Bioremediation",
      description:
        language === "es"
          ? "Uso de microorganismos para degradar contaminantes ambientales"
          : "Use of microorganisms to degrade environmental contaminants",
      protocol: {
        steps: [
          language === "es"
            ? "1. Caracterización microbiológica del sitio"
            : "1. Microbiological site characterization",
          language === "es" ? "2. Estudios de tratabilidad en laboratorio" : "2. Laboratory treatability studies",
          language === "es" ? "3. Diseño del sistema de biorremediación" : "3. Bioremediation system design",
          language === "es" ? "4. Bioaumentación o bioestimulación" : "4. Bioaugmentation or biostimulation",
          language === "es" ? "5. Monitoreo de degradación y parámetros" : "5. Degradation and parameters monitoring",
        ],
        applications: [
          language === "es" ? "Derrames de hidrocarburos" : "Hydrocarbon spills",
          language === "es" ? "Suelos contaminados con BTEX" : "BTEX contaminated soils",
          language === "es" ? "Aguas subterráneas contaminadas" : "Contaminated groundwater",
          language === "es" ? "Sedimentos contaminados" : "Contaminated sediments",
          language === "es" ? "Compuestos orgánicos persistentes" : "Persistent organic compounds",
        ],
        tools: [
          "BIOCHLOR - Modelado de atenuación natural",
          "BIOSCREEN - Evaluación de biorremediación",
          "USEPA Bioremediation Resource Guide",
          "ASTM E2893 - Estándar de biorremediación",
        ],
      },
    },
    carbonFootprint: {
      icon: Wind,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200",
      title: language === "es" ? "Huella de Carbono" : "Carbon Footprint",
      description:
        language === "es"
          ? "Cuantificación de emisiones de gases de efecto invernadero"
          : "Quantification of greenhouse gas emissions",
      protocol: {
        steps: [
          language === "es"
            ? "1. Definir alcances 1, 2 y 3 según GHG Protocol"
            : "1. Define scopes 1, 2 and 3 per GHG Protocol",
          language === "es" ? "2. Recopilar datos de actividad" : "2. Collect activity data",
          language === "es" ? "3. Aplicar factores de emisión" : "3. Apply emission factors",
          language === "es" ? "4. Calcular emisiones totales en CO₂e" : "4. Calculate total emissions in CO₂e",
          language === "es" ? "5. Verificación y reporte" : "5. Verification and reporting",
        ],
        applications: [
          language === "es" ? "Huella corporativa" : "Corporate footprint",
          language === "es" ? "Huella de producto" : "Product footprint",
          language === "es" ? "Huella de eventos" : "Event footprint",
          language === "es" ? "Inventarios nacionales GEI" : "National GHG inventories",
          language === "es" ? "Compensación de carbono" : "Carbon offsetting",
        ],
        tools: [
          "GHG Protocol - Estándar internacional",
          "ISO 14064 - Cuantificación de GEI",
          "PAS 2050 - Huella de carbono de productos",
          "SimaPro - Software de cálculo",
          "Carbon Trust Footprinting Tool",
        ],
      },
    },
    waterFootprint: {
      icon: Droplets,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      title: language === "es" ? "Huella Hídrica" : "Water Footprint",
      description:
        language === "es"
          ? "Medición del volumen total de agua dulce utilizada"
          : "Measurement of total freshwater volume used",
      protocol: {
        steps: [
          language === "es" ? "1. Definir alcance y límites del sistema" : "1. Define scope and system boundaries",
          language === "es" ? "2. Contabilizar agua verde, azul y gris" : "2. Account for green, blue and grey water",
          language === "es" ? "3. Evaluar sostenibilidad del uso de agua" : "3. Assess water use sustainability",
          language === "es" ? "4. Identificar puntos críticos" : "4. Identify hotspots",
          language === "es" ? "5. Formular estrategias de respuesta" : "5. Formulate response strategies",
        ],
        applications: [
          language === "es" ? "Huella de productos agrícolas" : "Agricultural product footprint",
          language === "es" ? "Huella de procesos industriales" : "Industrial process footprint",
          language === "es" ? "Huella de cuencas hidrográficas" : "River basin footprint",
          language === "es" ? "Evaluación de cadenas de suministro" : "Supply chain assessment",
          language === "es" ? "Gestión de recursos hídricos" : "Water resource management",
        ],
        tools: [
          "Water Footprint Network - Metodología oficial",
          "ISO 14046 - Huella de agua",
          "WFAT - Water Footprint Assessment Tool",
          "AWARE Method - Disponibilidad de agua",
        ],
      },
    },
    industrialEcology: {
      icon: Factory,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      title: language === "es" ? "Ecología Industrial" : "Industrial Ecology",
      description:
        language === "es"
          ? "Estudio de flujos de materiales y energía en sistemas industriales"
          : "Study of material and energy flows in industrial systems",
      protocol: {
        steps: [
          language === "es" ? "1. Mapear sistema industrial y actores" : "1. Map industrial system and actors",
          language === "es" ? "2. Analizar flujos de materiales y energía" : "2. Analyze material and energy flows",
          language === "es" ? "3. Identificar oportunidades de simbiosis" : "3. Identify symbiosis opportunities",
          language === "es" ? "4. Diseñar intercambios y sinergias" : "4. Design exchanges and synergies",
          language === "es" ? "5. Implementar y monitorear beneficios" : "5. Implement and monitor benefits",
        ],
        applications: [
          language === "es" ? "Parques eco-industriales" : "Eco-industrial parks",
          language === "es" ? "Simbiosis industrial" : "Industrial symbiosis",
          language === "es" ? "Valorización de subproductos" : "By-product valorization",
          language === "es" ? "Metabolismo industrial" : "Industrial metabolism",
          language === "es" ? "Diseño para el medio ambiente" : "Design for environment",
        ],
        tools: [
          "International Society for Industrial Ecology (ISIE)",
          "National Industrial Symbiosis Programme (NISP)",
          "Umberto Software - Modelado de flujos",
          "Journal of Industrial Ecology",
        ],
      },
    },
    greenChemistry: {
      icon: FlaskConical,
      color: "text-teal-600",
      bgColor: "bg-teal-50",
      borderColor: "border-teal-200",
      title: language === "es" ? "Química Verde" : "Green Chemistry",
      description:
        language === "es"
          ? "Diseño de productos y procesos químicos que reducen o eliminan sustancias peligrosas"
          : "Design of chemical products and processes that reduce or eliminate hazardous substances",
      protocol: {
        steps: [
          language === "es"
            ? "1. Aplicar los 12 principios de química verde"
            : "1. Apply the 12 principles of green chemistry",
          language === "es" ? "2. Prevención de residuos en origen" : "2. Waste prevention at source",
          language === "es" ? "3. Diseño de síntesis más seguras" : "3. Design safer syntheses",
          language === "es" ? "4. Uso de materias primas renovables" : "4. Use renewable feedstocks",
          language === "es" ? "5. Evaluación de métricas verdes" : "5. Evaluate green metrics",
        ],
        applications: [
          language === "es" ? "Síntesis orgánica sostenible" : "Sustainable organic synthesis",
          language === "es" ? "Catálisis verde" : "Green catalysis",
          language === "es" ? "Solventes alternativos" : "Alternative solvents",
          language === "es" ? "Química en agua" : "Chemistry in water",
          language === "es" ? "Biocatálisis enzimática" : "Enzymatic biocatalysis",
        ],
        tools: [
          "ACS Green Chemistry Institute",
          "Green Chemistry Metrics Calculator",
          "USEPA Green Chemistry Program",
          "Royal Society of Chemistry Green Chemistry Resources",
        ],
      },
    },
    sustainableAgriculture: {
      icon: TreePine,
      color: "text-green-700",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      title: language === "es" ? "Agricultura Sostenible" : "Sustainable Agriculture",
      description:
        language === "es"
          ? "Prácticas agrícolas que protegen el medio ambiente y son económicamente viables"
          : "Agricultural practices that protect the environment and are economically viable",
      protocol: {
        steps: [
          language === "es" ? "1. Evaluación de prácticas actuales" : "1. Current practices assessment",
          language === "es" ? "2. Manejo integrado de plagas (MIP)" : "2. Integrated pest management (IPM)",
          language === "es" ? "3. Conservación de suelos y agua" : "3. Soil and water conservation",
          language === "es" ? "4. Rotación de cultivos y diversificación" : "4. Crop rotation and diversification",
          language === "es"
            ? "5. Monitoreo de indicadores de sostenibilidad"
            : "5. Sustainability indicators monitoring",
        ],
        applications: [
          language === "es" ? "Agricultura orgánica" : "Organic farming",
          language === "es" ? "Agroforestería" : "Agroforestry",
          language === "es" ? "Agricultura de precisión" : "Precision agriculture",
          language === "es" ? "Permacultura" : "Permaculture",
          language === "es" ? "Agricultura regenerativa" : "Regenerative agriculture",
        ],
        tools: [
          "FAO Sustainable Agriculture Guidelines",
          "SAFA - Sustainability Assessment of Food and Agriculture",
          "RISE - Response-Inducing Sustainability Evaluation",
          "Cool Farm Tool - Huella de carbono agrícola",
        ],
      },
    },
    ecosystemServices: {
      icon: Globe,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      title: language === "es" ? "Servicios Ecosistémicos" : "Ecosystem Services",
      description:
        language === "es"
          ? "Valoración de beneficios que los ecosistemas proveen a la sociedad"
          : "Valuation of benefits that ecosystems provide to society",
      protocol: {
        steps: [
          language === "es"
            ? "1. Identificar servicios ecosistémicos relevantes"
            : "1. Identify relevant ecosystem services",
          language === "es" ? "2. Cuantificar provisión de servicios" : "2. Quantify service provision",
          language === "es" ? "3. Valoración económica (si aplica)" : "3. Economic valuation (if applicable)",
          language === "es" ? "4. Evaluar trade-offs y sinergias" : "4. Assess trade-offs and synergies",
          language === "es" ? "5. Integrar en toma de decisiones" : "5. Integrate into decision-making",
        ],
        applications: [
          language === "es" ? "Pagos por servicios ambientales (PSA)" : "Payments for ecosystem services (PES)",
          language === "es" ? "Evaluación de capital natural" : "Natural capital assessment",
          language === "es" ? "Compensación de biodiversidad" : "Biodiversity offsetting",
          language === "es" ? "Planificación territorial" : "Land use planning",
          language === "es" ? "Restauración ecológica" : "Ecological restoration",
        ],
        tools: [
          "InVEST - Integrated Valuation of Ecosystem Services and Tradeoffs",
          "ARIES - Artificial Intelligence for Ecosystem Services",
          "Natural Capital Protocol",
          "TEEB - The Economics of Ecosystems and Biodiversity",
        ],
      },
    },
    climateAdaptation: {
      icon: Mountain,
      color: "text-slate-600",
      bgColor: "bg-slate-50",
      borderColor: "border-slate-200",
      title: language === "es" ? "Adaptación al Cambio Climático" : "Climate Change Adaptation",
      description:
        language === "es"
          ? "Estrategias para reducir vulnerabilidad a impactos climáticos"
          : "Strategies to reduce vulnerability to climate impacts",
      protocol: {
        steps: [
          language === "es" ? "1. Evaluación de vulnerabilidad climática" : "1. Climate vulnerability assessment",
          language === "es" ? "2. Proyecciones climáticas locales" : "2. Local climate projections",
          language === "es" ? "3. Identificación de opciones de adaptación" : "3. Identification of adaptation options",
          language === "es" ? "4. Análisis costo-beneficio de medidas" : "4. Cost-benefit analysis of measures",
          language === "es" ? "5. Plan de adaptación y monitoreo" : "5. Adaptation plan and monitoring",
        ],
        applications: [
          language === "es" ? "Infraestructura resiliente" : "Resilient infrastructure",
          language === "es" ? "Gestión de recursos hídricos" : "Water resource management",
          language === "es" ? "Agricultura climáticamente inteligente" : "Climate-smart agriculture",
          language === "es" ? "Gestión de riesgos de desastres" : "Disaster risk management",
          language === "es" ? "Soluciones basadas en naturaleza" : "Nature-based solutions",
        ],
        tools: [
          "IPCC Assessment Reports",
          "Climate-ADAPT Platform",
          "USAID Climate Risk Screening Tools",
          "World Bank Climate Change Knowledge Portal",
        ],
      },
    },
    biodiversityAssessment: {
      icon: Leaf,
      color: "text-lime-700",
      bgColor: "bg-lime-50",
      borderColor: "border-lime-200",
      title: language === "es" ? "Evaluación de Biodiversidad" : "Biodiversity Assessment",
      description:
        language === "es"
          ? "Medición y monitoreo de diversidad biológica en ecosistemas"
          : "Measurement and monitoring of biological diversity in ecosystems",
      protocol: {
        steps: [
          language === "es" ? "1. Diseño de muestreo y transectos" : "1. Sampling design and transects",
          language === "es" ? "2. Inventario de especies (flora y fauna)" : "2. Species inventory (flora and fauna)",
          language === "es" ? "3. Cálculo de índices de diversidad" : "3. Diversity indices calculation",
          language === "es" ? "4. Evaluación de estado de conservación" : "4. Conservation status assessment",
          language === "es" ? "5. Recomendaciones de manejo" : "5. Management recommendations",
        ],
        applications: [
          language === "es" ? "Estudios de línea base" : "Baseline studies",
          language === "es" ? "Monitoreo de áreas protegidas" : "Protected areas monitoring",
          language === "es" ? "Evaluación de impacto en biodiversidad" : "Biodiversity impact assessment",
          language === "es" ? "Planes de conservación" : "Conservation plans",
          language === "es" ? "Restauración de hábitats" : "Habitat restoration",
        ],
        tools: [
          "Shannon-Wiener Index - Índice de diversidad",
          "Simpson's Index - Índice de dominancia",
          "EstimateS - Software de estimación de riqueza",
          "IUCN Red List - Estado de conservación",
          "eBird - Base de datos de aves",
        ],
      },
    },
    soilConservation: {
      icon: Mountain,
      color: "text-amber-700",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      title: language === "es" ? "Conservación de Suelos" : "Soil Conservation",
      description:
        language === "es"
          ? "Prácticas para prevenir erosión y degradación del suelo"
          : "Practices to prevent soil erosion and degradation",
      protocol: {
        steps: [
          language === "es"
            ? "1. Evaluación de erosión actual y potencial"
            : "1. Current and potential erosion assessment",
          language === "es" ? "2. Análisis de propiedades físico-químicas" : "2. Physical-chemical properties analysis",
          language === "es" ? "3. Diseño de prácticas de conservación" : "3. Conservation practices design",
          language === "es" ? "4. Implementación de medidas estructurales" : "4. Structural measures implementation",
          language === "es" ? "5. Monitoreo de efectividad" : "5. Effectiveness monitoring",
        ],
        applications: [
          language === "es" ? "Terrazas y curvas de nivel" : "Terraces and contour lines",
          language === "es" ? "Cultivos de cobertura" : "Cover crops",
          language === "es" ? "Barreras vivas" : "Living barriers",
          language === "es" ? "Labranza de conservación" : "Conservation tillage",
          language === "es" ? "Control de cárcavas" : "Gully control",
        ],
        tools: [
          "RUSLE - Revised Universal Soil Loss Equation",
          "WEPP - Water Erosion Prediction Project",
          "USDA NRCS Conservation Practice Standards",
          "FAO Soil Conservation Guidelines",
        ],
      },
    },
    wasteManagement: {
      icon: Recycle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      title: language === "es" ? "Gestión Integral de Residuos" : "Integrated Waste Management",
      description:
        language === "es"
          ? "Jerarquía de gestión: prevención, reutilización, reciclaje, valorización, disposición"
          : "Management hierarchy: prevention, reuse, recycling, recovery, disposal",
      protocol: {
        steps: [
          language === "es" ? "1. Caracterización de residuos generados" : "1. Generated waste characterization",
          language === "es" ? "2. Aplicar jerarquía de gestión" : "2. Apply management hierarchy",
          language === "es" ? "3. Diseño de sistema de recolección" : "3. Collection system design",
          language === "es" ? "4. Tratamiento y valorización" : "4. Treatment and recovery",
          language === "es" ? "5. Disposición final segura" : "5. Safe final disposal",
        ],
        applications: [
          language === "es" ? "Residuos sólidos urbanos" : "Municipal solid waste",
          language === "es" ? "Residuos peligrosos" : "Hazardous waste",
          language === "es" ? "Residuos de construcción" : "Construction waste",
          language === "es" ? "Residuos electrónicos (RAEE)" : "Electronic waste (WEEE)",
          language === "es" ? "Residuos orgánicos (compostaje)" : "Organic waste (composting)",
        ],
        tools: [
          "WARM - Waste Reduction Model",
          "IWM-2 - Integrated Waste Management Model",
          "Basel Convention - Residuos peligrosos",
          "ISO 14001 - Sistema de gestión ambiental",
        ],
      },
    },
    airQualityManagement: {
      icon: Wind,
      color: "text-sky-600",
      bgColor: "bg-sky-50",
      borderColor: "border-sky-200",
      title: language === "es" ? "Gestión de Calidad del Aire" : "Air Quality Management",
      description:
        language === "es"
          ? "Monitoreo, modelado y control de contaminantes atmosféricos"
          : "Monitoring, modeling and control of atmospheric pollutants",
      protocol: {
        steps: [
          language === "es" ? "1. Inventario de emisiones" : "1. Emissions inventory",
          language === "es" ? "2. Monitoreo de calidad del aire" : "2. Air quality monitoring",
          language === "es" ? "3. Modelado de dispersión" : "3. Dispersion modeling",
          language === "es" ? "4. Evaluación de cumplimiento normativo" : "4. Regulatory compliance assessment",
          language === "es" ? "5. Medidas de control y mitigación" : "5. Control and mitigation measures",
        ],
        applications: [
          language === "es" ? "Redes de monitoreo atmosférico" : "Atmospheric monitoring networks",
          language === "es" ? "Estudios de dispersión de chimeneas" : "Stack dispersion studies",
          language === "es" ? "Planes de descontaminación" : "Decontamination plans",
          language === "es" ? "Evaluación de olores" : "Odor assessment",
          language === "es" ? "Control de emisiones industriales" : "Industrial emissions control",
        ],
        tools: [
          "AERMOD - Modelo de dispersión atmosférica",
          "CALPUFF - Modelo de transporte de largo alcance",
          "USEPA Air Quality Index (AQI)",
          "WHO Air Quality Guidelines",
          "ISCST3 - Industrial Source Complex Model",
        ],
      },
    },
    waterResourcesManagement: {
      icon: Waves,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      title: language === "es" ? "Gestión de Recursos Hídricos" : "Water Resources Management",
      description:
        language === "es"
          ? "Planificación y gestión sostenible de recursos hídricos"
          : "Sustainable planning and management of water resources",
      protocol: {
        steps: [
          language === "es" ? "1. Evaluación de disponibilidad hídrica" : "1. Water availability assessment",
          language === "es" ? "2. Análisis de demanda actual y futura" : "2. Current and future demand analysis",
          language === "es" ? "3. Balance hídrico de cuenca" : "3. Basin water balance",
          language === "es"
            ? "4. Gestión integrada de recursos hídricos (GIRH)"
            : "4. Integrated water resources management (IWRM)",
          language === "es" ? "5. Plan de gestión y monitoreo" : "5. Management and monitoring plan",
        ],
        applications: [
          language === "es" ? "Planes de cuenca hidrográfica" : "River basin plans",
          language === "es" ? "Gestión de acuíferos" : "Aquifer management",
          language === "es" ? "Asignación de derechos de agua" : "Water rights allocation",
          language === "es" ? "Gestión de sequías" : "Drought management",
          language === "es" ? "Recarga artificial de acuíferos" : "Artificial aquifer recharge",
        ],
        tools: [
          "WEAP - Water Evaluation and Planning System",
          "MODFLOW - Modelado de aguas subterráneas",
          "HEC-HMS - Modelado hidrológico",
          "SWAT - Soil and Water Assessment Tool",
          "Global Water Partnership (GWP) Resources",
        ],
      },
    },
    energyEfficiency: {
      icon: Zap,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      title: language === "es" ? "Eficiencia Energética" : "Energy Efficiency",
      description:
        language === "es"
          ? "Optimización del uso de energía en procesos y edificaciones"
          : "Optimization of energy use in processes and buildings",
      protocol: {
        steps: [
          language === "es" ? "1. Auditoría energética" : "1. Energy audit",
          language === "es"
            ? "2. Identificación de oportunidades de ahorro"
            : "2. Savings opportunities identification",
          language === "es" ? "3. Análisis técnico-económico de medidas" : "3. Technical-economic analysis of measures",
          language === "es" ? "4. Implementación de mejoras" : "4. Improvements implementation",
          language === "es" ? "5. Medición y verificación de ahorros" : "5. Savings measurement and verification",
        ],
        applications: [
          language === "es" ? "Edificios verdes (LEED, BREEAM)" : "Green buildings (LEED, BREEAM)",
          language === "es" ? "Optimización de procesos industriales" : "Industrial process optimization",
          language === "es" ? "Sistemas de gestión energética ISO 50001" : "Energy management systems ISO 50001",
          language === "es" ? "Cogeneración y recuperación de calor" : "Cogeneration and heat recovery",
          language === "es" ? "Iluminación eficiente LED" : "Efficient LED lighting",
        ],
        tools: [
          "RETScreen - Análisis de proyectos de energía limpia",
          "EnergyPlus - Simulación energética de edificios",
          "ISO 50001 - Sistema de gestión de energía",
          "IPMVP - International Performance Measurement and Verification Protocol",
        ],
      },
    },
    sustainableUrbanPlanning: {
      icon: Building2,
      color: "text-violet-600",
      bgColor: "bg-violet-50",
      borderColor: "border-violet-200",
      title: language === "es" ? "Planificación Urbana Sostenible" : "Sustainable Urban Planning",
      description:
        language === "es"
          ? "Diseño de ciudades resilientes, inclusivas y ambientalmente sostenibles"
          : "Design of resilient, inclusive and environmentally sustainable cities",
      protocol: {
        steps: [
          language === "es" ? "1. Diagnóstico urbano integral" : "1. Comprehensive urban diagnosis",
          language === "es" ? "2. Participación ciudadana" : "2. Citizen participation",
          language === "es" ? "3. Zonificación y uso de suelo" : "3. Zoning and land use",
          language === "es" ? "4. Infraestructura verde y azul" : "4. Green and blue infrastructure",
          language === "es" ? "5. Plan de movilidad sostenible" : "5. Sustainable mobility plan",
        ],
        applications: [
          language === "es" ? "Ciudades compactas y mixtas" : "Compact and mixed-use cities",
          language === "es" ? "Transporte público eficiente" : "Efficient public transport",
          language === "es" ? "Espacios verdes urbanos" : "Urban green spaces",
          language === "es" ? "Gestión de aguas pluviales" : "Stormwater management",
          language === "es" ? "Edificación sostenible" : "Sustainable building",
        ],
        tools: [
          "UN-Habitat Urban Planning Guidelines",
          "LEED for Neighborhood Development",
          "CityEngine - Modelado urbano 3D",
          "UrbanSim - Simulación de desarrollo urbano",
        ],
      },
    },
    toxicologyAssessment: {
      icon: AlertTriangle,
      color: "text-rose-600",
      bgColor: "bg-rose-50",
      borderColor: "border-rose-200",
      title: language === "es" ? "Evaluación Toxicológica" : "Toxicological Assessment",
      description:
        language === "es"
          ? "Evaluación de efectos adversos de sustancias químicas en organismos"
          : "Assessment of adverse effects of chemical substances on organisms",
      protocol: {
        steps: [
          language === "es" ? "1. Identificación de sustancias de interés" : "1. Substances of interest identification",
          language === "es" ? "2. Revisión de datos toxicológicos" : "2. Toxicological data review",
          language === "es" ? "3. Ensayos de toxicidad (aguda, crónica)" : "3. Toxicity tests (acute, chronic)",
          language === "es" ? "4. Determinación de dosis-respuesta" : "4. Dose-response determination",
          language === "es" ? "5. Evaluación de riesgo para salud" : "5. Health risk assessment",
        ],
        applications: [
          language === "es" ? "Registro de sustancias químicas (REACH)" : "Chemical substances registration (REACH)",
          language === "es" ? "Evaluación de pesticidas" : "Pesticide assessment",
          language === "es" ? "Ecotoxicología acuática" : "Aquatic ecotoxicology",
          language === "es" ? "Toxicología de suelos" : "Soil toxicology",
          language === "es" ? "Bioensayos con organismos indicadores" : "Bioassays with indicator organisms",
        ],
        tools: [
          "OECD Test Guidelines - Protocolos estandarizados",
          "USEPA ECOTOX Database",
          "QSAR Toolbox - Predicción de toxicidad",
          "ToxCast - Evaluación de toxicidad de alto rendimiento",
        ],
      },
    },
    environmentalMonitoring: {
      icon: BarChart3,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200",
      title: language === "es" ? "Monitoreo Ambiental" : "Environmental Monitoring",
      description:
        language === "es"
          ? "Medición sistemática de parámetros ambientales para evaluar calidad"
          : "Systematic measurement of environmental parameters to assess quality",
      protocol: {
        steps: [
          language === "es" ? "1. Diseño de programa de monitoreo" : "1. Monitoring program design",
          language === "es" ? "2. Selección de puntos de muestreo" : "2. Sampling points selection",
          language === "es" ? "3. Métodos de muestreo y análisis" : "3. Sampling and analysis methods",
          language === "es"
            ? "4. Aseguramiento y control de calidad (QA/QC)"
            : "4. Quality assurance and control (QA/QC)",
          language === "es" ? "5. Análisis de datos y reporte" : "5. Data analysis and reporting",
        ],
        applications: [
          language === "es" ? "Monitoreo de efluentes industriales" : "Industrial effluent monitoring",
          language === "es" ? "Vigilancia de calidad de agua potable" : "Drinking water quality surveillance",
          language === "es" ? "Monitoreo de emisiones atmosféricas" : "Atmospheric emissions monitoring",
          language === "es" ? "Seguimiento de sitios contaminados" : "Contaminated sites follow-up",
          language === "es" ? "Monitoreo biológico (biomonitoreo)" : "Biological monitoring (biomonitoring)",
        ],
        tools: [
          "Standard Methods for Water and Wastewater",
          "USEPA Methods (SW-846, TO-series)",
          "ISO 17025 - Competencia de laboratorios",
          "LIMS - Laboratory Information Management System",
          "Sensores IoT para monitoreo continuo",
        ],
      },
    },
    ecoMapping: {
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      title: language === "es" ? "Ecomapas" : "Eco-mapping",
      description:
        language === "es"
          ? "Mapeo visual de flujos ambientales en instalaciones"
          : "Visual mapping of environmental flows in facilities",
      protocol: {
        steps: [
          language === "es" ? "Obtener plano de la instalación" : "Obtain facility layout",
          language === "es" ? "Identificar entradas y salidas" : "Identify inputs and outputs",
          language === "es" ? "Mapear flujos de recursos" : "Map resource flows",
          language === "es" ? "Identificar puntos críticos" : "Identify critical points",
          language === "es" ? "Proponer mejoras" : "Propose improvements",
        ],
        applications: [
          language === "es" ? "Auditorías ambientales" : "Environmental audits",
          language === "es" ? "Identificación de ineficiencias" : "Inefficiency identification",
          language === "es" ? "Planificación de mejoras" : "Improvement planning",
          language === "es" ? "Capacitación del personal" : "Staff training",
        ],
        tools: [
          "Green Dragon Environmental Standard",
          "ISO 14001 - Sistema de gestión ambiental",
          "Plantillas de ecomapas (descargables)",
          "Software de diagramación (Visio, Lucidchart)",
        ],
      },
    },
    greenTech: {
      icon: Droplets,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
      borderColor: "border-cyan-200",
      title: language === "es" ? "Tecnologías Verdes" : "Green Technologies",
      description:
        language === "es"
          ? "Soluciones tecnológicas ambientalmente sostenibles"
          : "Environmentally sustainable technological solutions",
      protocol: {
        steps: [
          language === "es" ? "Evaluar necesidades energéticas/ambientales" : "Assess energy/environmental needs",
          language === "es" ? "Seleccionar tecnología apropiada" : "Select appropriate technology",
          language === "es" ? "Análisis de viabilidad técnico-económica" : "Technical-economic feasibility analysis",
          language === "es" ? "Implementación y monitoreo" : "Implementation and monitoring",
          language === "es" ? "Optimización continua" : "Continuous optimization",
        ],
        applications: [
          language === "es" ? "Energía solar fotovoltaica" : "Solar photovoltaic energy",
          language === "es" ? "Tratamiento natural de aguas (humedales)" : "Natural water treatment (wetlands)",
          language === "es" ? "Biorremediación de suelos" : "Soil bioremediation",
          language === "es" ? "Digestión anaerobia para biogás" : "Anaerobic digestion for biogas",
        ],
        tools: [
          "HOMER - Diseño de sistemas renovables",
          "PVsyst - Diseño de sistemas solares",
          "RETScreen - Análisis de energías limpias",
          "PHREEQC - Modelado geoquímico",
        ],
      },
    },
    ecologicalFootprint: {
      icon: Calculator,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      title: language === "es" ? "Huella Ecológica" : "Ecological Footprint",
      description:
        language === "es" ? "Medición del impacto humano en el planeta" : "Measurement of human impact on the planet",
      protocol: {
        steps: [
          language === "es" ? "Definir límites del sistema" : "Define system boundaries",
          language === "es" ? "Recopilar datos de consumo" : "Collect consumption data",
          language === "es" ? "Calcular huellas específicas" : "Calculate specific footprints",
          language === "es" ? "Comparar con capacidad biológica" : "Compare with biocapacity",
          language === "es" ? "Identificar oportunidades de reducción" : "Identify reduction opportunities",
        ],
        applications: [
          language === "es" ? "Huella de carbono corporativa" : "Corporate carbon footprint",
          language === "es" ? "Huella hídrica de productos" : "Product water footprint",
          language === "es" ? "Huella de materiales" : "Material footprint",
          language === "es" ? "Evaluación de sostenibilidad" : "Sustainability assessment",
        ],
        tools: [
          "Global Footprint Network - Calculadoras oficiales",
          "Water Footprint Network - Metodología hídrica",
          "GHG Protocol - Estándar de huella de carbono",
          "ISO 14064 - Cuantificación de GEI",
          "ISO 14046 - Huella de agua",
        ],
      },
    },
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          {language === "es"
            ? "Metodologías Ambientales Completas"
            : language === "en"
              ? "Complete Environmental Methodologies"
              : "Metodologias Ambientais Completas"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {language === "es"
            ? "25+ metodologías con protocolos, herramientas y guías de aplicación profesional"
            : language === "en"
              ? "25+ methodologies with protocols, tools and professional application guides"
              : "25+ metodologias com protocolos, ferramentas e guias de aplicação profissional"}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(methodologies).map(([key, methodology]) => {
          const Icon = methodology.icon
          return (
            <Card
              key={key}
              className={`border-2 cursor-pointer transition-all hover:shadow-lg ${
                selectedMethodology === key ? methodology.borderColor : ""
              }`}
              onClick={() => setSelectedMethodology(selectedMethodology === key ? null : key)}
            >
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Icon className={`h-5 w-5 ${methodology.color}`} />
                  {methodology.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p className="text-muted-foreground">{methodology.description}</p>
                <Button variant="outline" size="sm" className="w-full mt-2 bg-transparent">
                  {selectedMethodology === key
                    ? language === "es"
                      ? "Ocultar detalles"
                      : "Hide details"
                    : language === "es"
                      ? "Ver protocolo"
                      : "View protocol"}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {selectedMethodology && (
        <Card className={`border-2 ${methodologies[selectedMethodology as keyof typeof methodologies].borderColor}`}>
          <CardHeader className={methodologies[selectedMethodology as keyof typeof methodologies].bgColor}>
            <CardTitle className="flex items-center gap-2">
              {React.createElement(methodologies[selectedMethodology as keyof typeof methodologies].icon, {
                className: `h-6 w-6 ${methodologies[selectedMethodology as keyof typeof methodologies].color}`,
              })}
              {methodologies[selectedMethodology as keyof typeof methodologies].title}
            </CardTitle>
            <CardDescription>
              {methodologies[selectedMethodology as keyof typeof methodologies].description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                {language === "es" ? "Protocolo de Aplicación" : "Application Protocol"}
              </h3>
              <ol className="space-y-2">
                {methodologies[selectedMethodology as keyof typeof methodologies].protocol.steps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Badge variant="outline" className="mt-0.5">
                      {idx + 1}
                    </Badge>
                    <span className="text-sm">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Wrench className="h-5 w-5 text-secondary" />
                {language === "es" ? "Aplicaciones Prácticas" : "Practical Applications"}
              </h3>
              <ul className="space-y-2">
                {methodologies[selectedMethodology as keyof typeof methodologies].protocol.applications.map(
                  (app, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <span className="text-primary">•</span>
                      <span>{app}</span>
                    </li>
                  ),
                )}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-accent" />
                {language === "es" ? "Herramientas y Recursos" : "Tools and Resources"}
              </h3>
              <div className="space-y-2">
                {methodologies[selectedMethodology as keyof typeof methodologies].protocol.tools.map((tool, idx) => (
                  <Alert key={idx} className="bg-muted/50">
                    <Info className="h-4 w-4" />
                    <AlertDescription className="text-sm">{tool}</AlertDescription>
                  </Alert>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
