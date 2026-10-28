/**
 * Motor de cálculo científico y ambiental de Laboratorio Ambiental by GREEN OWL LABS.
 * Funciones puras (sin dependencias de React ni de red): funcionan offline y están verificadas con pruebas automatizadas.
 * Cada cálculo devuelve valor, errores, advertencias y metadatos (fórmula, fuentes normativas, unidades y versión).
 */

export const ENGINE_VERSION = "2.0.0"

export interface CalcMeta {
  id: string
  name: string
  formula: string
  source: string
  units: string
  version: string
}

export interface CalcOutcome<T> {
  ok: boolean
  value: T | null
  errors: string[]
  warnings: string[]
  meta: CalcMeta
}

const isNum = (n: unknown): n is number => typeof n === "number" && Number.isFinite(n)

function fail<T>(meta: CalcMeta, errors: string[], warnings: string[] = []): CalcOutcome<T> {
  return { ok: false, value: null, errors, warnings, meta }
}

/* ------------------------------------------------------------------ */
/* 1. DBO₅ — Standard Methods 5210 B                                  */
/* ------------------------------------------------------------------ */

export interface Dbo5Input {
  do1: number // OD inicial de la botella con muestra diluida (mg/L)
  do2: number // OD final al día 5 de incubación a 20 °C (mg/L)
  sampleMl: number // volumen de muestra en la botella (mL)
  bottleMl: number // volumen de la botella de DBO (mL), típicamente 300 mL
  seedCorrectionMgL?: number // (B1 − B2) × f, solo si se empleó semilla microbiana (mg/L)
}

export interface Dbo5Value {
  dbo: number // mg/L
  p: number // fracción volumétrica de muestra
  depletion: number // OD1 − OD2 (mg/L)
  valid: boolean // cumple criterios estrictos de validez de Standard Methods 5210 B
}

const DBO5_META: CalcMeta = {
  id: "dbo5",
  name: "Demanda Bioquímica de Oxígeno (DBO₅)",
  formula: "DBO₅ = [(OD₁ − OD₂) − corrección_semilla] / P ; P = V_muestra / V_botella",
  source: "Standard Methods for the Examination of Water and Wastewater, 5210 B",
  units: "mg O₂/L",
  version: ENGINE_VERSION,
}

export function dbo5(input: Dbo5Input): CalcOutcome<Dbo5Value> {
  const { do1, do2, sampleMl, bottleMl } = input
  const seed = input.seedCorrectionMgL ?? 0
  const errors: string[] = []
  const warnings: string[] = []

  if (![do1, do2, sampleMl, bottleMl, seed].every(isNum)) {
    return fail(DBO5_META, ["Complete todos los campos con números válidos."])
  }
  if (do1 <= 0) errors.push("El OD inicial debe ser mayor que 0 mg/L.")
  if (do2 < 0) errors.push("El OD final no puede ser negativo.")
  if (sampleMl <= 0) errors.push("El volumen de muestra debe ser mayor que 0 mL.")
  if (bottleMl <= 0) errors.push("El volumen de la botella debe ser mayor que 0 mL.")
  if (sampleMl > bottleMl) {
    errors.push("El volumen de muestra no puede superar el volumen de la botella de DBO.")
  }
  if (seed < 0) errors.push("La corrección por semilla no puede ser negativa.")
  if (do2 >= do1) errors.push("El OD final debe ser menor que el OD inicial (debe existir consumo de oxígeno).")
  if (errors.length) return fail(DBO5_META, errors)

  const p = sampleMl / bottleMl
  const depletion = do1 - do2
  const corrected = depletion - seed
  if (corrected <= 0) {
    return fail(DBO5_META, ["La corrección por semilla iguala o supera el consumo de OD de la muestra."])
  }

  let valid = true
  if (depletion < 2) {
    valid = false
    warnings.push("Resultado NO válido según SM 5210 B: el consumo de OD es menor a 2.0 mg/L. Requiere una dilución menor (más muestra).")
  }
  if (do2 < 1) {
    valid = false
    warnings.push("Resultado NO válido según SM 5210 B: el OD residual es menor a 1.0 mg/L. Requiere una dilución mayor (menos muestra).")
  }
  if (do1 > 9.2) {
    warnings.push("OD inicial superior a la saturación teórica a 20 °C a nivel del mar (~9.1 mg/L); verifique si hubo sobresaturación previa.")
  }

  return { ok: true, value: { dbo: corrected / p, p, depletion, valid }, errors, warnings, meta: DBO5_META }
}

/* ------------------------------------------------------------------ */
/* 2. DQO — Reflujo cerrado, titulación con FAS (SM 5220 C)            */
/* ------------------------------------------------------------------ */

export interface DqoInput {
  blankMl: number // A: mL de FAS gastados en el blanco de reactivos
  sampleTitrantMl: number // B: mL de FAS gastados en la muestra
  molarityFas: number // Concentración molar del FAS (mol/L)
  sampleMl: number // Volumen de la alícuota de muestra digerida (mL)
}

const DQO_META: CalcMeta = {
  id: "dqo-titrimetric",
  name: "Demanda Química de Oxígeno (DQO)",
  formula: "DQO = [(A − B) × M_FAS × 8000] / V_muestra",
  source: "Standard Methods for the Examination of Water and Wastewater, 5220 C (Reflujo cerrado titrimétrico)",
  units: "mg O₂/L",
  version: ENGINE_VERSION,
}

export function dqoTitration(input: DqoInput): CalcOutcome<{ dqo: number }> {
  const { blankMl, sampleTitrantMl, molarityFas, sampleMl } = input
  if (![blankMl, sampleTitrantMl, molarityFas, sampleMl].every(isNum)) {
    return fail(DQO_META, ["Complete todos los campos con números válidos."])
  }
  const errors: string[] = []
  if (blankMl < 0 || sampleTitrantMl < 0) errors.push("Los volúmenes de FAS no pueden ser negativos.")
  if (molarityFas <= 0) errors.push("La molaridad del FAS debe ser mayor que 0.")
  if (sampleMl <= 0) errors.push("El volumen de muestra debe ser mayor que 0 mL.")
  if (blankMl < sampleTitrantMl) {
    errors.push("El FAS gastado en el blanco debe ser mayor o igual al de la muestra; revise la titulación.")
  }
  if (errors.length) return fail(DQO_META, errors)

  const warnings: string[] = []
  if (sampleMl > 20) {
    warnings.push("Verifique que el volumen de muestra corresponda al vial o tubo de digestión (típicamente 2.5 a 10 mL).")
  }
  const dqo = ((blankMl - sampleTitrantMl) * molarityFas * 8000) / sampleMl

  return { ok: true, value: { dqo }, errors: [], warnings, meta: DQO_META }
}

/* ------------------------------------------------------------------ */
/* 3. Dimensionamiento preliminar de reactores biológicos              */
/* ------------------------------------------------------------------ */

export type ReactorType = "activated-sludge" | "extended-aeration" | "uasb" | "trickling-filter" | "lagoon"

interface ReactorParams {
  hrtH: number | null // TRH de diseño (horas); null = gobernado por carga
  srtD: number // Edad de lodos (días)
  loadKgM3d: number // Carga orgánica volumétrica máxima (kg/m³·d)
  loadBasis: "DBO" | "DQO"
  depthM: [number, number]
}

export const REACTOR_PARAMS: Record<ReactorType, ReactorParams> = {
  "activated-sludge": { hrtH: 8, srtD: 15, loadKgM3d: 0.4, loadBasis: "DBO", depthM: [4, 5] },
  "extended-aeration": { hrtH: 24, srtD: 25, loadKgM3d: 0.15, loadBasis: "DBO", depthM: [4, 5] },
  uasb: { hrtH: 8, srtD: 30, loadKgM3d: 4.0, loadBasis: "DQO", depthM: [4, 6] },
  "trickling-filter": { hrtH: null, srtD: 0, loadKgM3d: 0.8, loadBasis: "DBO", depthM: [1.8, 2.5] },
  lagoon: { hrtH: 480, srtD: 20, loadKgM3d: 0.05, loadBasis: "DBO", depthM: [1.5, 2.0] },
}

export interface ReactorInput {
  type: ReactorType
  flowM3h: number // Caudal de diseño horario (m³/h)
  influentMgL: number // DBO₅ o DQO afluente (mg/L)
}

export interface ReactorValue {
  volume: number // Volumen total requerido (m³)
  hrt: number // TRH efectivo = V / Q (horas)
  srt: number // Edad del lodo (días)
  dimensions: { length: number; width: number; depth: number }
  governing: "TRH" | "carga orgánica"
  volumeByHrt: number
  volumeByLoad: number
  loadKgPerDay: number
  appliedLoadKgM3d: number
  formula: string
}

const REACTOR_META: CalcMeta = {
  id: "reactor-sizing",
  name: "Dimensionamiento preliminar de biorreactores",
  formula: "V = máx( Q × TRH ; Q × S₀ / COV )",
  source: "Metcalf & Eddy (Wastewater Engineering); Norma Peruana OS.090 (Plantas de Tratamiento de Aguas Residuales)",
  units: "m³, horas, kg/m³·d",
  version: ENGINE_VERSION,
}

export function reactorSizing(input: ReactorInput): CalcOutcome<ReactorValue> {
  const { type, flowM3h, influentMgL } = input
  const p = REACTOR_PARAMS[type]
  if (!p) return fail(REACTOR_META, ["Tipo de biorreactor no reconocido."])
  if (!isNum(flowM3h) || !isNum(influentMgL)) {
    return fail(REACTOR_META, ["Complete caudal y concentración afluente con números válidos."])
  }
  const errors: string[] = []
  if (flowM3h <= 0) errors.push("El caudal de diseño debe ser mayor que 0 m³/h.")
  if (influentMgL <= 0) errors.push(`La concentración afluente de ${p.loadBasis} debe ser mayor que 0 mg/L.`)
  if (errors.length) return fail(REACTOR_META, errors)

  const warnings: string[] = []
  const qd = flowM3h * 24 // m³/d
  const loadKgPerDay = (qd * influentMgL) / 1000
  const volumeByLoad = loadKgPerDay / p.loadKgM3d
  const volumeByHrt = p.hrtH === null ? 0 : flowM3h * p.hrtH
  const governing = volumeByLoad > volumeByHrt ? "carga orgánica" : "TRH"
  const volume = Math.max(volumeByLoad, volumeByHrt)

  const depth = (p.depthM[0] + p.depthM[1]) / 2
  const area = volume / depth
  const length = Math.sqrt(area * 2)
  const width = area / length

  if (p.loadBasis === "DQO") {
    warnings.push("Para reactores anaerobios UASB la carga se diseña con DQO (kg DQO/m³·d): verifique que ingresó DQO.")
  }
  warnings.push("Dimensionamiento preliminar para ingeniería básica. Verifique sedimentabilidad, recirculación y temperatura de diseño.")

  return {
    ok: true,
    value: {
      volume,
      hrt: volume / flowM3h,
      srt: p.srtD,
      dimensions: { length, width, depth },
      governing,
      volumeByHrt,
      volumeByLoad,
      loadKgPerDay,
      appliedLoadKgM3d: loadKgPerDay / volume,
      formula:
        p.hrtH === null
          ? `V = Q × S₀ / COV  (COV = ${p.loadKgM3d} kg ${p.loadBasis}/m³·d)`
          : `V = máx( Q × TRH ; Q × S₀ / COV )  (TRH = ${p.hrtH} h, COV = ${p.loadKgM3d} kg ${p.loadBasis}/m³·d)`,
    },
    errors: [],
    warnings,
    meta: REACTOR_META,
  }
}

/* ------------------------------------------------------------------ */
/* 4. Índice de Calidad del Agua (ICA-NSF / ICA-PE)                   */
/* ------------------------------------------------------------------ */

export interface WqiInput {
  doSaturationPercent?: number // % de saturación de Oxígeno Disuelto
  doMgL?: number // OD en mg/L (si no se dispone de % de saturación)
  temperatureC?: number // Temperatura del agua en °C (por defecto 20 °C)
  ph?: number // Unidades de pH (0 - 14)
  turbidityNtu?: number // Turbidez en NTU
  bod5MgL?: number // DBO₅ en mg/L
  fecalColiformsNmp?: number // Coliformes fecales o termotolerantes (NMP/100 mL)
  nitratesMgL?: number // Nitratos (NO₃⁻) en mg/L
  totalPhosphorusMgL?: number // Fósforo total en mg/L
  tdsMgL?: number // Sólidos Disueltos Totales en mg/L
}

export type WqiQualityClass = "Excelente" | "Buena" | "Regular" | "Mala" | "Pésima"

export interface WqiParameterBreakdown {
  id: string
  name: string
  inputValue: number
  subindex: number // q_i de 0 a 100
  weight: number // peso asignado w_i
  normalizedWeight: number // peso normalizado w_i'
}

export interface WqiValue {
  score: number // Índice ponderado de 0 a 100
  classification: WqiQualityClass
  color: string
  parametersEvaluated: number
  breakdown: WqiParameterBreakdown[]
}

const WQI_META: CalcMeta = {
  id: "wqi-nsf",
  name: "Índice de Calidad del Agua (ICA-NSF / Brown et al.)",
  formula: "ICA = ∑ (wᵢ × qᵢ) / ∑ wᵢ",
  source: "National Sanitation Foundation (NSF WQI); Brown et al. (1970); adaptado por la Autoridad Nacional del Agua (ANA, R.J. N° 056-2018-ANA)",
  units: "Puntos (escala 0 - 100)",
  version: ENGINE_VERSION,
}

// Funciones subíndice (q_i) basadas en las curvas empíricas de NSF (Brown et al., 1970)
function subindexDO(sat: number): number {
  if (sat < 0) return 0
  if (sat <= 40) return Math.min(100, Math.max(0, sat * 0.5))
  if (sat <= 100) return Math.min(100, Math.max(0, 20 + (sat - 40) * (80 / 60)))
  if (sat <= 140) return Math.min(100, Math.max(0, 100 - (sat - 100) * 0.7))
  return 72 // sobresaturación extrema
}

function subindexPH(ph: number): number {
  if (ph <= 2 || ph >= 12) return 0
  if (ph >= 7.0 && ph <= 7.4) return 100
  if (ph < 7.0) {
    if (ph >= 6.5) return 80 + (ph - 6.5) * 40
    if (ph >= 5.0) return 30 + (ph - 5.0) * (50 / 1.5)
    return Math.max(0, (ph - 2.0) * 10)
  }
  // ph > 7.4
  if (ph <= 8.5) return 100 - (ph - 7.4) * (35 / 1.1)
  if (ph <= 10.0) return 65 - (ph - 8.5) * (45 / 1.5)
  return Math.max(0, 20 - (ph - 10.0) * 10)
}

function subindexTurbidity(ntu: number): number {
  if (ntu <= 0) return 100
  if (ntu <= 10) return 100 - ntu * 2.5
  if (ntu <= 50) return 75 - (ntu - 10) * (30 / 40)
  if (ntu <= 100) return 45 - (ntu - 50) * (20 / 50)
  return Math.max(5, 25 - (ntu - 100) * 0.1)
}

function subindexBOD5(bod: number): number {
  if (bod <= 0) return 100
  if (bod <= 2) return 100 - bod * 10
  if (bod <= 5) return 80 - (bod - 2) * (30 / 3)
  if (bod <= 10) return 50 - (bod - 5) * (30 / 5)
  if (bod <= 20) return 20 - (bod - 10) * (15 / 10)
  return Math.max(2, 5 - (bod - 20) * 0.2)
}

function subindexColiforms(cf: number): number {
  if (cf <= 1) return 100
  const log = Math.log10(cf)
  if (log <= 1) return 100 - (log - 0) * 20
  if (log <= 3) return 80 - (log - 1) * 25
  if (log <= 5) return 30 - (log - 3) * 12
  return Math.max(2, 6 - (log - 5) * 2)
}

function subindexNitrates(n: number): number {
  if (n <= 0) return 100
  if (n <= 1) return 100 - n * 8
  if (n <= 5) return 92 - (n - 1) * (25 / 4)
  if (n <= 20) return 67 - (n - 5) * (35 / 15)
  if (n <= 50) return 32 - (n - 20) * (22 / 30)
  return Math.max(2, 10 - (n - 50) * 0.1)
}

function subindexPhosphorus(p: number): number {
  if (p <= 0) return 100
  if (p <= 0.1) return 100 - p * 150
  if (p <= 0.5) return 85 - (p - 0.1) * (35 / 0.4)
  if (p <= 2.0) return 50 - (p - 0.5) * (35 / 1.5)
  return Math.max(2, 15 - (p - 2.0) * 2)
}

function subindexTDS(tds: number): number {
  if (tds <= 50) return 95
  if (tds <= 200) return 95 - (tds - 50) * (15 / 150)
  if (tds <= 500) return 80 - (tds - 200) * (30 / 300)
  if (tds <= 1000) return 50 - (tds - 500) * (30 / 500)
  return Math.max(5, 20 - (tds - 1000) * 0.02)
}

export function calculateWqi(input: WqiInput): CalcOutcome<WqiValue> {
  const items: WqiParameterBreakdown[] = []
  const errors: string[] = []
  const warnings: string[] = []

  // 1. Oxígeno Disuelto
  let doSat = input.doSaturationPercent
  if (!isNum(doSat) && isNum(input.doMgL)) {
    const temp = isNum(input.temperatureC) ? input.temperatureC : 20
    // Saturación a nivel del mar según fórmula estándar de Benson-Krause
    const cs = 14.652 - 0.41022 * temp + 0.007991 * temp * temp - 0.000077774 * Math.pow(temp, 3)
    doSat = (input.doMgL / cs) * 100
  }

  if (isNum(doSat)) {
    if (doSat < 0) errors.push("La saturación de OD no puede ser negativa.")
    else {
      items.push({
        id: "do",
        name: "Oxígeno Disuelto",
        inputValue: doSat,
        subindex: subindexDO(doSat),
        weight: 0.17,
        normalizedWeight: 0,
      })
    }
  }

  // 2. pH
  if (isNum(input.ph)) {
    if (input.ph < 0 || input.ph > 14) errors.push("El pH debe encontrarse entre 0 y 14 unidades.")
    else {
      items.push({
        id: "ph",
        name: "pH",
        inputValue: input.ph,
        subindex: subindexPH(input.ph),
        weight: 0.11,
        normalizedWeight: 0,
      })
    }
  }

  // 3. Turbidez
  if (isNum(input.turbidityNtu)) {
    if (input.turbidityNtu < 0) errors.push("La turbidez no puede ser negativa.")
    else {
      items.push({
        id: "turbidity",
        name: "Turbidez",
        inputValue: input.turbidityNtu,
        subindex: subindexTurbidity(input.turbidityNtu),
        weight: 0.08,
        normalizedWeight: 0,
      })
    }
  }

  // 4. DBO₅
  if (isNum(input.bod5MgL)) {
    if (input.bod5MgL < 0) errors.push("La DBO₅ no puede ser negativa.")
    else {
      items.push({
        id: "bod5",
        name: "DBO₅",
        inputValue: input.bod5MgL,
        subindex: subindexBOD5(input.bod5MgL),
        weight: 0.11,
        normalizedWeight: 0,
      })
    }
  }

  // 5. Coliformes Fecales
  if (isNum(input.fecalColiformsNmp)) {
    if (input.fecalColiformsNmp < 0) errors.push("Los coliformes no pueden ser negativos.")
    else {
      items.push({
        id: "coliforms",
        name: "Coliformes Fecales",
        inputValue: input.fecalColiformsNmp,
        subindex: subindexColiforms(input.fecalColiformsNmp),
        weight: 0.16,
        normalizedWeight: 0,
      })
    }
  }

  // 6. Nitratos
  if (isNum(input.nitratesMgL)) {
    if (input.nitratesMgL < 0) errors.push("La concentración de nitratos no puede ser negativa.")
    else {
      items.push({
        id: "nitrates",
        name: "Nitratos (NO₃⁻)",
        inputValue: input.nitratesMgL,
        subindex: subindexNitrates(input.nitratesMgL),
        weight: 0.10,
        normalizedWeight: 0,
      })
    }
  }

  // 7. Fósforo Total
  if (isNum(input.totalPhosphorusMgL)) {
    if (input.totalPhosphorusMgL < 0) errors.push("El fósforo total no puede ser negativo.")
    else {
      items.push({
        id: "phosphorus",
        name: "Fósforo Total",
        inputValue: input.totalPhosphorusMgL,
        subindex: subindexPhosphorus(input.totalPhosphorusMgL),
        weight: 0.10,
        normalizedWeight: 0,
      })
    }
  }

  // 8. Sólidos Disueltos Totales
  if (isNum(input.tdsMgL)) {
    if (input.tdsMgL < 0) errors.push("Los TDS no pueden ser negativos.")
    else {
      items.push({
        id: "tds",
        name: "Sólidos Disueltos Totales (TDS)",
        inputValue: input.tdsMgL,
        subindex: subindexTDS(input.tdsMgL),
        weight: 0.08,
        normalizedWeight: 0,
      })
    }
  }

  if (errors.length) return fail(WQI_META, errors)
  if (items.length < 3) {
    return fail(WQI_META, ["Ingrese al menos 3 parámetros válidos (ej. OD, pH y Turbidez) para computar el ICA."])
  }

  // Normalizar los pesos de los parámetros ingresados para que sumen exactamente 1.0
  const totalWeight = items.reduce((acc, it) => acc + it.weight, 0)
  let score = 0
  for (const item of items) {
    item.normalizedWeight = item.weight / totalWeight
    score += item.subindex * item.normalizedWeight
  }

  let classification: WqiQualityClass = "Regular"
  let color = "text-yellow-600"

  if (score >= 91) {
    classification = "Excelente"
    color = "text-emerald-600"
  } else if (score >= 71) {
    classification = "Buena"
    color = "text-green-600"
  } else if (score >= 51) {
    classification = "Regular"
    color = "text-amber-600"
  } else if (score >= 26) {
    classification = "Mala"
    color = "text-orange-600"
  } else {
    classification = "Pésima"
    color = "text-red-600"
  }

  if (items.length < 9) {
    warnings.push(`ICA calculado con ${items.length} de los 9 parámetros NSF estándar. Los pesos fueron normalizados proporcionalmente.`)
  }

  return {
    ok: true,
    value: {
      score: Math.round(score * 10) / 10,
      classification,
      color,
      parametersEvaluated: items.length,
      breakdown: items,
    },
    errors: [],
    warnings,
    meta: WQI_META,
  }
}

/* ------------------------------------------------------------------ */
/* 5. Conversor de Concentración de Gases (mg/m³ ⟷ ppm)             */
/* ------------------------------------------------------------------ */

export interface GasDefinition {
  id: string
  name: string
  molecularWeight: number // g/mol
}

export const STANDARD_GASES: Record<string, GasDefinition> = {
  co: { id: "co", name: "Monóxido de Carbono (CO)", molecularWeight: 28.01 },
  no2: { id: "no2", name: "Dióxido de Nitrógeno (NO₂)", molecularWeight: 46.01 },
  so2: { id: "so2", name: "Dióxido de Azufre (SO₂)", molecularWeight: 64.07 },
  o3: { id: "o3", name: "Ozono (O₃)", molecularWeight: 48.00 },
  h2s: { id: "h2s", name: "Sulfuro de Hidrógeno (H₂S)", molecularWeight: 34.08 },
  nh3: { id: "nh3", name: "Amoníaco (NH₃)", molecularWeight: 17.03 },
  ch4: { id: "ch4", name: "Metano (CH₄)", molecularWeight: 16.04 },
  co2: { id: "co2", name: "Dióxido de Carbono (CO₂)", molecularWeight: 44.01 },
  toluene: { id: "toluene", name: "Tolueno (VOC)", molecularWeight: 92.14 },
}

export interface GasConversionInput {
  value: number
  fromUnit: "ppm" | "ppb" | "mg_m3" | "ug_m3"
  toUnit: "ppm" | "ppb" | "mg_m3" | "ug_m3"
  gasKey?: string // clave de STANDARD_GASES o 'custom'
  customMolecularWeight?: number // g/mol si gasKey === 'custom'
  temperatureC?: number // Temperatura (°C), por defecto 25 °C
  pressureAtm?: number // Presión (atm), por defecto 1.0 atm
}

const GAS_CONV_META: CalcMeta = {
  id: "gas-conversion",
  name: "Conversión de Gases según Ley de Gases Ideales",
  formula: "ppm = [C(mg/m³) × R × (T + 273.15)] / [P × PM] ; R = 0.082057 L·atm/(mol·K)",
  source: "EPA 40 CFR Part 50; Perry's Chemical Engineers' Handbook",
  units: "ppm, ppb, mg/m³, µg/m³",
  version: ENGINE_VERSION,
}

export function convertGasConcentration(input: GasConversionInput): CalcOutcome<{ result: number; molarVolumeL: number }> {
  const { value, fromUnit, toUnit, gasKey = "co" } = input
  const tempC = isNum(input.temperatureC) ? input.temperatureC : 25
  const pressAtm = isNum(input.pressureAtm) ? input.pressureAtm : 1.0

  if (!isNum(value)) {
    return fail(GAS_CONV_META, ["Ingrese un valor numérico para la conversión."])
  }
  if (value < 0) {
    return fail(GAS_CONV_META, ["La concentración de un gas no puede ser negativa."])
  }
  if (pressAtm <= 0) {
    return fail(GAS_CONV_META, ["La presión atmosférica debe ser mayor que 0 atm."])
  }
  if (tempC < -273.15) {
    return fail(GAS_CONV_META, ["La temperatura no puede ser inferior al cero absoluto (-273.15 °C)."])
  }

  let mw = 28.01
  if (gasKey === "custom") {
    if (!isNum(input.customMolecularWeight) || input.customMolecularWeight <= 0) {
      return fail(GAS_CONV_META, ["Ingrese un peso molecular válido (mayor que 0 g/mol)."])
    }
    mw = input.customMolecularWeight
  } else {
    const gas = STANDARD_GASES[gasKey]
    if (!gas) return fail(GAS_CONV_META, ["Gas no reconocido."])
    mw = gas.molecularWeight
  }

  // Volumen molar a T y P: V_m = (R × T) / P en L/mol
  const R = 0.0820574
  const tempK = tempC + 273.15
  const molarVolume = (R * tempK) / pressAtm // Típicamente ~24.465 L/mol a 25 °C y 1 atm

  // Convertir primero la unidad de entrada a ppm:
  let inPpm = 0
  switch (fromUnit) {
    case "ppm":
      inPpm = value
      break
    case "ppb":
      inPpm = value / 1000
      break
    case "mg_m3":
      inPpm = (value * molarVolume) / mw
      break
    case "ug_m3":
      inPpm = ((value / 1000) * molarVolume) / mw
      break
  }

  // Convertir de ppm a la unidad de salida:
  let result = 0
  switch (toUnit) {
    case "ppm":
      result = inPpm
      break
    case "ppb":
      result = inPpm * 1000
      break
    case "mg_m3":
      result = (inPpm * mw) / molarVolume
      break
    case "ug_m3":
      result = ((inPpm * mw) / molarVolume) * 1000
      break
  }

  return {
    ok: true,
    value: { result, molarVolumeL: molarVolume },
    errors: [],
    warnings: [],
    meta: GAS_CONV_META,
  }
}

/* ------------------------------------------------------------------ */
/* 6. Huella de Carbono Corporativa (GHG Protocol - Alcances 1, 2 y 3) */
/* ------------------------------------------------------------------ */

export type GridRegion = "peru_sein" | "mexico_sen" | "chile_sen" | "colombia_sin" | "global_average" | "usa_average" | "custom"

export const GRID_EMISSION_FACTORS: Record<GridRegion, { name: string; factorKgKwh: number }> = {
  peru_sein: { name: "Perú - SEIN (MINAM / COES 2023)", factorKgKwh: 0.212 },
  mexico_sen: { name: "México - SEN (CRE 2023)", factorKgKwh: 0.438 },
  chile_sen: { name: "Chile - SEN (CNE 2023)", factorKgKwh: 0.290 },
  colombia_sin: { name: "Colombia - SIN (UPME 2023)", factorKgKwh: 0.165 },
  global_average: { name: "Promedio Global (IEA)", factorKgKwh: 0.475 },
  usa_average: { name: "Estados Unidos - eGRID", factorKgKwh: 0.385 },
  custom: { name: "Personalizado", factorKgKwh: 0.400 },
}

export interface CarbonFootprintInput {
  // Alcance 1: Emisiones Directas
  naturalGasM3?: number // Factor: 2.03 kg CO₂e/m³
  dieselGal?: number // Factor: 10.21 kg CO₂e/gal
  gasolineGal?: number // Factor: 8.78 kg CO₂e/gal
  lpgKg?: number // Factor: 2.98 kg CO₂e/kg
  // Alcance 2: Electricidad
  electricityKwh?: number
  gridRegion?: GridRegion
  customGridFactor?: number
  // Alcance 3: Otras Emisiones Indirectas
  vehicleKm?: number // Transporte en auto (promedio 0.171 kg CO₂e/km)
  busKm?: number // Transporte en autobús (0.089 kg CO₂e/km-pasajero)
  flightKm?: number // Vuelos comerciales (0.195 kg CO₂e/km-pasajero)
  wasteLandfillKg?: number // Residuos sólidos a relleno (0.460 kg CO₂e/kg)
}

export interface CarbonFootprintValue {
  totalKgCo2e: number
  totalTonCo2e: number
  scope1Kg: number
  scope2Kg: number
  scope3Kg: number
  percentages: { scope1: number; scope2: number; scope3: number }
  treesNeededOffset: number // Árboles promedio para compensar (1 árbol absorbe ~22 kg CO₂/año)
}

const CARBON_META: CalcMeta = {
  id: "carbon-footprint-ghg",
  name: "Huella de Carbono Organizacional (GHG Protocol)",
  formula: "Emisiones = ∑ (Dato de Actividad × Factor de Emisión) para Alcances 1, 2 y 3",
  source: "GHG Protocol Corporate Accounting Standard; Factores IPCC 2021; Factores Oficiales SEIN Perú (MINAM/COES)",
  units: "kg CO₂e, tCO₂e",
  version: ENGINE_VERSION,
}

export function calculateCarbonFootprint(input: CarbonFootprintInput): CalcOutcome<CarbonFootprintValue> {
  const ngM3 = input.naturalGasM3 || 0
  const dGal = input.dieselGal || 0
  const gGal = input.gasolineGal || 0
  const lpg = input.lpgKg || 0
  const elec = input.electricityKwh || 0
  const vKm = input.vehicleKm || 0
  const bKm = input.busKm || 0
  const fKm = input.flightKm || 0
  const waste = input.wasteLandfillKg || 0

  if ([ngM3, dGal, gGal, lpg, elec, vKm, bKm, fKm, waste].some((n) => n < 0)) {
    return fail(CARBON_META, ["Ninguna cantidad de consumo o actividad puede ser negativa."])
  }

  // Alcance 1
  const scope1 = ngM3 * 2.03 + dGal * 10.21 + gGal * 8.78 + lpg * 2.98

  // Alcance 2
  let gridFactor = 0.212
  if (input.gridRegion === "custom") {
    gridFactor = isNum(input.customGridFactor) && input.customGridFactor >= 0 ? input.customGridFactor : 0.4
  } else if (input.gridRegion && GRID_EMISSION_FACTORS[input.gridRegion]) {
    gridFactor = GRID_EMISSION_FACTORS[input.gridRegion].factorKgKwh
  }
  const scope2 = elec * gridFactor

  // Alcance 3
  const scope3 = vKm * 0.171 + bKm * 0.089 + fKm * 0.195 + waste * 0.46

  const totalKg = scope1 + scope2 + scope3
  const totalTon = totalKg / 1000

  const p1 = totalKg > 0 ? (scope1 / totalKg) * 100 : 0
  const p2 = totalKg > 0 ? (scope2 / totalKg) * 100 : 0
  const p3 = totalKg > 0 ? (scope3 / totalKg) * 100 : 0

  // 1 árbol maduro fija aprox. 22 kg CO₂/año
  const treesNeeded = Math.ceil(totalKg / 22)

  return {
    ok: true,
    value: {
      totalKgCo2e: Math.round(totalKg * 10) / 10,
      totalTonCo2e: Math.round(totalTon * 100) / 100,
      scope1Kg: Math.round(scope1 * 10) / 10,
      scope2Kg: Math.round(scope2 * 10) / 10,
      scope3Kg: Math.round(scope3 * 10) / 10,
      percentages: {
        scope1: Math.round(p1 * 10) / 10,
        scope2: Math.round(p2 * 10) / 10,
        scope3: Math.round(p3 * 10) / 10,
      },
      treesNeededOffset: treesNeeded,
    },
    errors: [],
    warnings: [],
    meta: CARBON_META,
  }
}

/* ------------------------------------------------------------------ */
/* 7. Huella Hídrica (Metodología WFN / Hoekstra et al.)               */
/* ------------------------------------------------------------------ */

export interface WaterFootprintInput {
  surfaceWaterConsumedM3?: number // Huella Azul: Agua superficial extraída no retornada
  groundwaterConsumedM3?: number // Huella Azul: Agua subterránea extraída no retornada
  rainwaterEvapotranspiredM3?: number // Huella Verde: Agua de lluvia incorporada/evapotranspirada
  // Huella Gris: Dilución de contaminante crítico
  effluentDischargeM3?: number // Caudal de vertimiento en el período (m³)
  effluentConcentrationMgL?: number // Concentración del parámetro más crítico en el efluente (mg/L)
  standardLimitMgL?: number // Límite de calidad ambiental en el cuerpo receptor (ECA, C_max) en mg/L
  naturalBackgroundMgL?: number // Concentración de fondo natural (C_nat) en mg/L (típicamente 0)
}

export interface WaterFootprintValue {
  totalM3: number
  blueM3: number
  greenM3: number
  greyM3: number
  percentages: { blue: number; green: number; grey: number }
  greyWaterDetails?: {
    criticalLoadKg: number
    dilutionFactor: number
  }
}

const WATER_FP_META: CalcMeta = {
  id: "water-footprint-wfn",
  name: "Huella Hídrica Total (Water Footprint Network)",
  formula: "HH = HH_Azul + HH_Verde + HH_Gris ; HH_Gris = L / (C_máx − C_nat)",
  source: "The Water Footprint Assessment Manual (Hoekstra et al., 2011; Water Footprint Network / ISO 14046)",
  units: "m³",
  version: ENGINE_VERSION,
}

export function calculateWaterFootprint(input: WaterFootprintInput): CalcOutcome<WaterFootprintValue> {
  const blueSurf = input.surfaceWaterConsumedM3 || 0
  const blueGround = input.groundwaterConsumedM3 || 0
  const green = input.rainwaterEvapotranspiredM3 || 0
  const errors: string[] = []

  if (blueSurf < 0 || blueGround < 0 || green < 0) {
    errors.push("Los consumos de agua no pueden ser negativos.")
  }

  const blueTotal = blueSurf + blueGround
  let greyTotal = 0
  let greyDetails: { criticalLoadKg: number; dilutionFactor: number } | undefined

  if (isNum(input.effluentDischargeM3) && input.effluentDischargeM3 > 0) {
    const qEff = input.effluentDischargeM3
    const cEff = input.effluentConcentrationMgL || 0
    const cMax = input.standardLimitMgL || 0
    const cNat = input.naturalBackgroundMgL || 0

    if (cMax <= 0) {
      errors.push("Para calcular la Huella Gris, el estándar ambiental receptor (C_máx) debe ser mayor que 0 mg/L.")
    }
    if (cNat >= cMax) {
      errors.push("La concentración natural de fondo (C_nat) no puede igualar ni superar el estándar ambiental (C_máx).")
    }

    if (errors.length === 0) {
      if (cEff > cMax) {
        // Carga contaminante neta: L = Q × (C_eff - C_nat) en g -> dividir entre 1000 para kg
        const loadKg = (qEff * Math.max(0, cEff - cNat)) / 1000
        // Volumen de dilución: V_gris = (Q × (C_eff - C_nat)) / (C_max - C_nat)
        greyTotal = (qEff * (cEff - cNat)) / (cMax - cNat)
        greyDetails = {
          criticalLoadKg: Math.round(loadKg * 10) / 10,
          dilutionFactor: Math.round((greyTotal / qEff) * 10) / 10,
        }
      } else {
        greyTotal = 0 // El vertimiento cumple el estándar de calidad ambiental del cuerpo receptor
      }
    }
  }

  if (errors.length) return fail(WATER_FP_META, errors)

  const total = blueTotal + green + greyTotal
  const pBlue = total > 0 ? (blueTotal / total) * 100 : 0
  const pGreen = total > 0 ? (green / total) * 100 : 0
  const pGrey = total > 0 ? (greyTotal / total) * 100 : 0

  return {
    ok: true,
    value: {
      totalM3: Math.round(total * 10) / 10,
      blueM3: Math.round(blueTotal * 10) / 10,
      greenM3: Math.round(green * 10) / 10,
      greyM3: Math.round(greyTotal * 10) / 10,
      percentages: {
        blue: Math.round(pBlue * 10) / 10,
        green: Math.round(pGreen * 10) / 10,
        grey: Math.round(pGrey * 10) / 10,
      },
      greyWaterDetails: greyDetails,
    },
    errors: [],
    warnings: [],
    meta: WATER_FP_META,
  }
}

/* ------------------------------------------------------------------ */
/* 8. Ingeniería y Costos de Remediación de Suelos                    */
/* ------------------------------------------------------------------ */

export type RemediationTechnology =
  | "biopiles" // Biorremediación / Biopilas aireadas
  | "thermal_desorption" // Desorción térmica (baja/alta temperatura)
  | "soil_washing" // Lavado de suelos
  | "phytoremediation" // Fitorremediación
  | "isco" // Oxidación química in situ (Fenton, Persulfato)
  | "secure_landfill" // Excavación y disposición en relleno de seguridad

export interface SoilRemediationInput {
  technology: RemediationTechnology
  areaM2: number // Área contaminada (m²)
  depthM: number // Profundidad promedio (m)
  soilDensityTonM3?: number // Densidad aparente del suelo (t/m³), típicamente 1.5 - 1.8
  bulkingFactor?: number // Factor de esponjamiento al excavar (ej. 1.20)
  initialConcentrationMgKg?: number // Concentración inicial de contaminante (mg/kg)
  targetConcentrationMgKg?: number // Concentración objetivo (ECA Suelo D.S. 011-2017-MINAM) (mg/kg)
}

export interface TechnologyCostProfile {
  name: string
  typicalCostPerTonUsd: number
  costRangeUsd: [number, number]
  durationMonths: number
  capexPercent: number
  opexPercent: number
  notes: string
}

export const REMEDIATION_PROFILES: Record<RemediationTechnology, TechnologyCostProfile> = {
  biopiles: {
    name: "Biorremediación en Biopilas Aireadas",
    typicalCostPerTonUsd: 55,
    costRangeUsd: [40, 85],
    durationMonths: 6,
    capexPercent: 35,
    opexPercent: 65,
    notes: "Óptimo para hidrocarburos F2 y F3. Requiere adición de nitrógeno (urea) y fósforo (DAP) según relación C:N:P ≈ 100:10:1.",
  },
  thermal_desorption: {
    name: "Desorción Térmica Ex-Situ",
    typicalCostPerTonUsd: 160,
    costRangeUsd: [120, 240],
    durationMonths: 3,
    capexPercent: 45,
    opexPercent: 55,
    notes: "Altamente efectiva para hidrocarburos pesados, fenoles y plaguicidas orgánicos persistentes. Alto consumo de combustible.",
  },
  soil_washing: {
    name: "Lavado de Suelos con Surfactantes",
    typicalCostPerTonUsd: 140,
    costRangeUsd: [95, 210],
    durationMonths: 4,
    capexPercent: 50,
    opexPercent: 50,
    notes: "Excelente para separar fracciones arenosas contaminadas con metales pesados o hidrocarburos pesados.",
  },
  phytoremediation: {
    name: "Fitorremediación",
    typicalCostPerTonUsd: 35,
    costRangeUsd: [20, 60],
    durationMonths: 24,
    capexPercent: 30,
    opexPercent: 70,
    notes: "Técnica in-situ de bajo costo para profundidades someras (<1.2 m). Apta para Pb, Cd, As y metales mediante hiperacumuladoras.",
  },
  isco: {
    name: "Oxidación Química In-Situ (ISCO)",
    typicalCostPerTonUsd: 130,
    costRangeUsd: [85, 190],
    durationMonths: 4,
    capexPercent: 40,
    opexPercent: 60,
    notes: "Inyección de reactivo Fenton, ozono o persulfato activado para destruir VOCs, solventes clorados y BTEX rápidamente.",
  },
  secure_landfill: {
    name: "Excavación y Confinamiento en Relleno de Seguridad",
    typicalCostPerTonUsd: 220,
    costRangeUsd: [160, 320],
    durationMonths: 1,
    capexPercent: 20,
    opexPercent: 80,
    notes: "Solución inmediata para suelos catalogados como residuos peligrosos no tratables in-situ según D.L. 1278 (Ley de Residuos Sólidos).",
  },
}

export interface SoilRemediationValue {
  inSituVolumeM3: number
  exSituVolumeM3: number
  soilMassTonnes: number
  contaminantRemovedKg: number | null
  requiredEfficiencyPercent: number | null
  technology: TechnologyCostProfile
  costs: {
    totalEstimatedUsd: number
    minCostUsd: number
    maxCostUsd: number
    costPerM3Usd: number
    capexUsd: number
    opexUsd: number
  }
  nutrientRequirementsKg?: {
    nitrogenKg: number
    phosphorusKg: number
  }
}

const SOIL_META: CalcMeta = {
  id: "soil-remediation-engineering",
  name: "Ingeniería y Costos de Remediación de Suelos",
  formula: "Masa = V_insitu × Densidad ; Costo = Masa × Costo_Unitario",
  source: "EPA 542-R-05-012 (Remediation Cost Guidance); D.S. N° 011-2017-MINAM (ECA Suelo Perú)",
  units: "m³, Toneladas, USD ($)",
  version: ENGINE_VERSION,
}

export function calculateSoilRemediation(input: SoilRemediationInput): CalcOutcome<SoilRemediationValue> {
  const { areaM2, depthM, technology } = input
  const density = isNum(input.soilDensityTonM3) && input.soilDensityTonM3 > 0 ? input.soilDensityTonM3 : 1.6
  const bulking = isNum(input.bulkingFactor) && input.bulkingFactor >= 1.0 ? input.bulkingFactor : 1.2
  const profile = REMEDIATION_PROFILES[technology]

  if (!profile) return fail(SOIL_META, ["Tecnología de remediación no reconocida."])
  if (!isNum(areaM2) || !isNum(depthM)) return fail(SOIL_META, ["Ingrese área y profundidad con números válidos."])

  const errors: string[] = []
  if (areaM2 <= 0) errors.push("El área contaminada debe ser mayor que 0 m².")
  if (depthM <= 0) errors.push("La profundidad del suelo debe ser mayor que 0 m.")
  if (errors.length) return fail(SOIL_META, errors)

  const inSituV = areaM2 * depthM
  const exSituV = inSituV * bulking
  const massTon = inSituV * density

  let contaminantRemovedKg: number | null = null
  let efficiency: number | null = null
  let nutrients: { nitrogenKg: number; phosphorusKg: number } | undefined

  if (isNum(input.initialConcentrationMgKg) && isNum(input.targetConcentrationMgKg)) {
    const c0 = input.initialConcentrationMgKg
    const cf = input.targetConcentrationMgKg
    if (c0 > cf && c0 > 0) {
      contaminantRemovedKg = (massTon * 1000 * (c0 - cf)) / 1_000_000
      efficiency = ((c0 - cf) / c0) * 100

      // Si es biorremediación, calcular requerimiento C:N:P
      if (technology === "biopiles") {
        // Se asume hidrocarburo con ~85% C
        const carbonKg = contaminantRemovedKg * 0.85
        nutrients = {
          nitrogenKg: Math.round((carbonKg / 10) * 10) / 10,
          phosphorusKg: Math.round((carbonKg / 100) * 10) / 10,
        }
      }
    }
  }

  const totalUsd = massTon * profile.typicalCostPerTonUsd
  const minUsd = massTon * profile.costRangeUsd[0]
  const maxUsd = massTon * profile.costRangeUsd[1]
  const capexUsd = totalUsd * (profile.capexPercent / 100)
  const opexUsd = totalUsd * (profile.opexPercent / 100)

  return {
    ok: true,
    value: {
      inSituVolumeM3: Math.round(inSituV * 10) / 10,
      exSituVolumeM3: Math.round(exSituV * 10) / 10,
      soilMassTonnes: Math.round(massTon * 10) / 10,
      contaminantRemovedKg: contaminantRemovedKg !== null ? Math.round(contaminantRemovedKg * 10) / 10 : null,
      requiredEfficiencyPercent: efficiency !== null ? Math.round(efficiency * 10) / 10 : null,
      technology: profile,
      costs: {
        totalEstimatedUsd: Math.round(totalUsd),
        minCostUsd: Math.round(minUsd),
        maxCostUsd: Math.round(maxUsd),
        costPerM3Usd: Math.round((totalUsd / inSituV) * 10) / 10,
        capexUsd: Math.round(capexUsd),
        opexUsd: Math.round(opexUsd),
      },
      nutrientRequirementsKg: nutrients,
    },
    errors: [],
    warnings: [
      `Costos y plazos son estimaciones de ingeniería preliminar (precisión clase 4/5 AACE). Requiere ensayos de tratabilidad y caracterización previa según Guía del MINAM.`,
    ],
    meta: SOIL_META,
  }
}
