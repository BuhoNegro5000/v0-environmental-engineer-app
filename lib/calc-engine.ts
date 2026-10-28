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

function outcome<T>(
  ok: boolean,
  value: T | null,
  errors: string[],
  warnings: string[],
  meta: CalcMeta,
): CalcOutcome<T> {
  return { ok, value, errors, warnings, meta }
}

export interface Dbo5Inputs {
  d1: number
  d5: number
  sampleVolumeMl: number
  bottleVolumeMl?: number
  b1?: number
  b5?: number
}

export function dbo5(inputs: Dbo5Inputs): CalcOutcome<number> {
  const errors: string[] = []
  const warnings: string[] = []
  const meta: CalcMeta = {
    id: "dbo5_standard_methods",
    name: "Demanda Bioquímica de Oxígeno (5 días, 20 °C)",
    formula: "DBO5 = [(D1 - D5) - (B1 - B5) * (1 - P)] / P ; P = V_muestra / V_botella",
    source: "Standard Methods for the Examination of Water and Wastewater (23rd Ed.) 5210 B",
    units: "mg/L O2",
    version: ENGINE_VERSION,
  }

  const { d1, d5, sampleVolumeMl } = inputs
  const bottleVolumeMl = inputs.bottleVolumeMl ?? 300
  const b1 = inputs.b1 ?? 0
  const b5 = inputs.b5 ?? 0

  if (!Number.isFinite(d1) || !Number.isFinite(d5) || !Number.isFinite(sampleVolumeMl)) {
    errors.push("Los valores de oxígeno inicial, final y volumen de muestra deben ser números válidos.")
    return outcome(false, null, errors, warnings, meta)
  }

  if (d1 <= 0 || d5 < 0 || sampleVolumeMl <= 0 || bottleVolumeMl <= 0) {
    errors.push("Las concentraciones de OD y los volúmenes deben ser mayores que cero.")
    return outcome(false, null, errors, warnings, meta)
  }

  if (sampleVolumeMl > bottleVolumeMl) {
    errors.push("El volumen de muestra no puede exceder el volumen de la botella de DBO.")
    return outcome(false, null, errors, warnings, meta)
  }

  if (d5 > d1) {
    errors.push("El OD final no puede ser mayor que el OD inicial (producción neta de O2 no válida en incubación a oscuras).")
    return outcome(false, null, errors, warnings, meta)
  }

  const P = sampleVolumeMl / bottleVolumeMl
  const depletion = d1 - d5

  if (depletion < 2.0) {
    warnings.push("Consumo de OD inferior a 2.0 mg/L: resultado analítico con baja precisión según SM 5210 B. Se sugiere usar menor dilución (mayor volumen de muestra).")
  }

  if (d5 < 1.0) {
    warnings.push("OD residual inferior a 1.0 mg/L: posible agotamiento de oxígeno en la botella. Se sugiere mayor dilución (menor volumen de muestra).")
  }

  const seedDepletion = b1 - b5
  if (seedDepletion < 0) {
    errors.push("El blanco/semilla final no puede tener mayor OD que el inicial.")
    return outcome(false, null, errors, warnings, meta)
  }

  const seedCorrection = seedDepletion * (1 - P)
  const netDepletion = depletion - seedCorrection

  if (netDepletion < 0) {
    warnings.push("La corrección de semilla supera el consumo observado en la muestra diluida.")
  }

  const result = Math.max(0, netDepletion / P)
  const rounded = Number(result.toFixed(2))

  return outcome(errors.length === 0, rounded, errors, warnings, meta)
}

export interface DqoTitrationInputs {
  blankMl: number
  sampleMl: number
  sampleVolumeMl: number
  fasNormality: number
}

export function dqoTitration(inputs: DqoTitrationInputs): CalcOutcome<number> {
  const errors: string[] = []
  const warnings: string[] = []
  const meta: CalcMeta = {
    id: "dqo_titration_standard_methods",
    name: "Demanda Química de Oxígeno por Titulación con FAS",
    formula: "DQO = (V_blanco - V_muestra) * N_FAS * 8000 / V_muestra_mL",
    source: "Standard Methods for the Examination of Water and Wastewater (23rd Ed.) 5220 C/D",
    units: "mg/L O2",
    version: ENGINE_VERSION,
  }

  const { blankMl, sampleMl, sampleVolumeMl, fasNormality } = inputs

  if (!Number.isFinite(blankMl) || !Number.isFinite(sampleMl) || !Number.isFinite(sampleVolumeMl) || !Number.isFinite(fasNormality)) {
    errors.push("Todos los parámetros volumétricos y de normalidad deben ser números válidos.")
    return outcome(false, null, errors, warnings, meta)
  }

  if (blankMl <= 0 || sampleVolumeMl <= 0 || fasNormality <= 0) {
    errors.push("El volumen de blanco, el volumen de muestra y la normalidad del FAS deben ser mayores que cero.")
    return outcome(false, null, errors, warnings, meta)
  }

  if (sampleMl < 0) {
    errors.push("El volumen gastado de FAS en la muestra no puede ser negativo.")
    return outcome(false, null, errors, warnings, meta)
  }

  if (blankMl < sampleMl) {
    errors.push("El volumen gastado en la muestra no puede ser mayor que el volumen gastado en el blanco (el dicromato se consume por la materia orgánica).")
    return outcome(false, null, errors, warnings, meta)
  }

  const dqo = ((blankMl - sampleMl) * fasNormality * 8000) / sampleVolumeMl
  const rounded = Number(dqo.toFixed(2))

  if (sampleMl < 0.5 && blankMl > 5) {
    warnings.push("Consumo casi total del dicromato: se recomienda diluir la muestra y repetir la digestión para evitar subestimación.")
  }

  return outcome(true, rounded, errors, warnings, meta)
}

export type WqiParameterKey =
  | "doSat"
  | "fc"
  | "ph"
  | "bod"
  | "tempDiff"
  | "tp"
  | "no3"
  | "turbidity"
  | "tds"

export interface WqiInputs {
  doSat?: number
  doMgL?: number
  waterTempC?: number
  fc?: number
  ph?: number
  bod?: number
  tempDiff?: number
  tp?: number
  no3?: number
  turbidity?: number
  tds?: number
  conductivityUsCm?: number
}

export interface WqiValue {
  score: number
  classification: "Excelente" | "Buena" | "Regular" | "Mala" | "Pésima"
  color: string
  subIndices: Record<string, number>
  usedWeights: Record<string, number>
}

const WQI_WEIGHTS: Record<WqiParameterKey, number> = {
  doSat: 0.17,
  fc: 0.16,
  ph: 0.11,
  bod: 0.11,
  tempDiff: 0.1,
  tp: 0.1,
  no3: 0.1,
  turbidity: 0.08,
  tds: 0.07,
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val))
}

function subIndexDo(sat: number): number {
  if (sat < 0) return 0
  if (sat <= 40) return clamp(0.7 * sat + 2, 0, 100)
  if (sat <= 100) return clamp(100 - 0.25 * Math.abs(100 - sat), 50, 100)
  if (sat <= 140) return clamp(100 - 0.5 * (sat - 100), 50, 100)
  return clamp(80 - (sat - 140), 10, 80)
}

function subIndexFc(fc: number): number {
  if (fc <= 1) return 100
  const logFc = Math.log10(Math.max(1, fc))
  return clamp(98 - 22 * logFc, 2, 100)
}

function subIndexPh(ph: number): number {
  if (ph < 2 || ph > 12) return 0
  if (ph >= 6.5 && ph <= 8.5) {
    return clamp(100 - 15 * Math.abs(ph - 7.4), 85, 100)
  }
  if (ph < 6.5) {
    return clamp(85 - 25 * (6.5 - ph), 2, 85)
  }
  return clamp(85 - 25 * (ph - 8.5), 2, 85)
}

function subIndexBod(bod: number): number {
  if (bod <= 0) return 100
  if (bod <= 2) return clamp(100 - 10 * bod, 80, 100)
  if (bod <= 10) return clamp(80 - 6 * (bod - 2), 30, 80)
  if (bod <= 30) return clamp(30 - 1 * (bod - 10), 5, 30)
  return 2
}

function subIndexTemp(diff: number): number {
  const d = Math.abs(diff)
  if (d <= 0.5) return 100
  if (d <= 5) return clamp(100 - 8 * d, 60, 100)
  if (d <= 15) return clamp(60 - 3.5 * (d - 5), 10, 60)
  return 5
}

function subIndexTp(tp: number): number {
  if (tp <= 0.05) return 100
  if (tp <= 0.5) return clamp(100 - 80 * (tp - 0.05), 60, 100)
  if (tp <= 2.0) return clamp(60 - 25 * (tp - 0.5), 20, 60)
  return clamp(20 - 5 * (tp - 2.0), 2, 20)
}

function subIndexNo3(no3: number): number {
  if (no3 <= 1) return 100
  if (no3 <= 5) return clamp(100 - 8 * (no3 - 1), 70, 100)
  if (no3 <= 20) return clamp(70 - 2.5 * (no3 - 5), 30, 70)
  if (no3 <= 50) return clamp(30 - 0.6 * (no3 - 20), 10, 30)
  return 2
}

function subIndexTurbidity(turb: number): number {
  if (turb <= 5) return 100
  if (turb <= 25) return clamp(100 - 1.5 * (turb - 5), 70, 100)
  if (turb <= 100) return clamp(70 - 0.5 * (turb - 25), 30, 70)
  return clamp(30 - 0.15 * (turb - 100), 5, 30)
}

function subIndexTds(tds: number): number {
  if (tds <= 100) return 100
  if (tds <= 500) return clamp(100 - 0.075 * (tds - 100), 70, 100)
  if (tds <= 1500) return clamp(70 - 0.04 * (tds - 500), 30, 70)
  return clamp(30 - 0.01 * (tds - 1500), 5, 30)
}

export function oxygenSaturationSolubility(tempC: number, pressureAtm = 1.0): number {
  const T = tempC + 273.15
  const lnC = -139.34411 + (1.575701e5 / T) - (6.642308e7 / (T * T)) + (1.2438e10 / (T * T * T)) - (8.621949e11 / (T * T * T * T))
  return Math.exp(lnC) * pressureAtm
}

export function calculateWqi(inputs: WqiInputs): CalcOutcome<WqiValue> {
  const errors: string[] = []
  const warnings: string[] = []
  const meta: CalcMeta = {
    id: "wqi_nsf_brown",
    name: "Índice de Calidad del Agua WQI-NSF / ANA Perú",
    formula: "WQI = sum(W_i * Q_i) / sum(W_i) con ponderaciones normalizadas",
    source: "National Sanitation Foundation (NSF) / R.J. 056-2018-ANA",
    units: "Puntos (0-100)",
    version: ENGINE_VERSION,
  }

  let effectiveDoSat = inputs.doSat
  if (effectiveDoSat === undefined && inputs.doMgL !== undefined) {
    const temp = inputs.waterTempC ?? 20
    const sol = oxygenSaturationSolubility(temp)
    effectiveDoSat = (inputs.doMgL / sol) * 100
    warnings.push(`Saturación de OD estimada en ${effectiveDoSat.toFixed(1)}% basada en OD=${inputs.doMgL} mg/L y T=${temp} °C.`)
  }

  let effectiveTds = inputs.tds
  if (effectiveTds === undefined && inputs.conductivityUsCm !== undefined) {
    effectiveTds = inputs.conductivityUsCm * 0.65
    warnings.push(`TDS estimado en ${effectiveTds.toFixed(1)} mg/L a partir de CE=${inputs.conductivityUsCm} µS/cm.`)
  }

  const subIndices: Record<string, number> = {}
  const activeWeights: Record<string, number> = {}

  if (effectiveDoSat !== undefined && Number.isFinite(effectiveDoSat)) {
    subIndices.doSat = subIndexDo(effectiveDoSat)
    activeWeights.doSat = WQI_WEIGHTS.doSat
  }
  if (inputs.fc !== undefined && Number.isFinite(inputs.fc) && inputs.fc >= 0) {
    subIndices.fc = subIndexFc(inputs.fc)
    activeWeights.fc = WQI_WEIGHTS.fc
  }
  if (inputs.ph !== undefined && Number.isFinite(inputs.ph) && inputs.ph >= 0 && inputs.ph <= 14) {
    subIndices.ph = subIndexPh(inputs.ph)
    activeWeights.ph = WQI_WEIGHTS.ph
  }
  if (inputs.bod !== undefined && Number.isFinite(inputs.bod) && inputs.bod >= 0) {
    subIndices.bod = subIndexBod(inputs.bod)
    activeWeights.bod = WQI_WEIGHTS.bod
  }
  if (inputs.tempDiff !== undefined && Number.isFinite(inputs.tempDiff)) {
    subIndices.tempDiff = subIndexTemp(inputs.tempDiff)
    activeWeights.tempDiff = WQI_WEIGHTS.tempDiff
  }
  if (inputs.tp !== undefined && Number.isFinite(inputs.tp) && inputs.tp >= 0) {
    subIndices.tp = subIndexTp(inputs.tp)
    activeWeights.tp = WQI_WEIGHTS.tp
  }
  if (inputs.no3 !== undefined && Number.isFinite(inputs.no3) && inputs.no3 >= 0) {
    subIndices.no3 = subIndexNo3(inputs.no3)
    activeWeights.no3 = WQI_WEIGHTS.no3
  }
  if (inputs.turbidity !== undefined && Number.isFinite(inputs.turbidity) && inputs.turbidity >= 0) {
    subIndices.turbidity = subIndexTurbidity(inputs.turbidity)
    activeWeights.turbidity = WQI_WEIGHTS.turbidity
  }
  if (effectiveTds !== undefined && Number.isFinite(effectiveTds) && effectiveTds >= 0) {
    subIndices.tds = subIndexTds(effectiveTds)
    activeWeights.tds = WQI_WEIGHTS.tds
  }

  const paramCount = Object.keys(subIndices).length
  if (paramCount < 3) {
    errors.push("Se requieren al menos 3 parámetros físico-químicos para estimar un ICA representativo.")
    return outcome(false, null, errors, warnings, meta)
  }

  if (paramCount < 9) {
    warnings.push(`Índice calculado con ${paramCount}/9 parámetros; los pesos fueron renormalizados automáticamente.`)
  }

  let totalWeight = 0
  let weightedSum = 0
  for (const k of Object.keys(subIndices)) {
    const w = activeWeights[k]
    const q = subIndices[k]
    totalWeight += w
    weightedSum += w * q
  }

  const score = Number((weightedSum / totalWeight).toFixed(1))

  let classification: WqiValue["classification"]
  let color: string
  if (score >= 90) {
    classification = "Excelente"
    color = "#10b981"
  } else if (score >= 70) {
    classification = "Buena"
    color = "#3b82f6"
  } else if (score >= 50) {
    classification = "Regular"
    color = "#f59e0b"
  } else if (score >= 25) {
    classification = "Mala"
    color = "#f97316"
  } else {
    classification = "Pésima"
    color = "#ef4444"
  }

  const normalizedWeights: Record<string, number> = {}
  for (const [k, w] of Object.entries(activeWeights)) {
    normalizedWeights[k] = Number((w / totalWeight).toFixed(3))
  }

  const value: WqiValue = {
    score,
    classification,
    color,
    subIndices,
    usedWeights: normalizedWeights,
  }

  return outcome(true, value, errors, warnings, meta)
}

export type BioreactorType = "activated_sludge" | "trickling_filter" | "facultative_lagoon" | "uasb"

export interface BioreactorInputs {
  type: BioreactorType
  flowM3PerDay: number
  bodInMgL: number
  targetBodEffluentMgL?: number
  safetyFactor?: number
  manualHrtHours?: number
}

export interface BioreactorResult {
  designVolumeM3: number
  governingHrtHours: number
  organicLoadKgBodPerDay: number
  volumetricLoadAppliedKgPerM3Day: number
  governingCriterion: "TRH" | "Carga Orgánica Volumétrica"
  typicalDimensions: { lengthM: number; widthM: number; depthM: number }
  expectedRemovalPercent: number
  complianceWarning?: string
}

export function sizeBioreactor(inputs: BioreactorInputs): CalcOutcome<BioreactorResult> {
  const errors: string[] = []
  const warnings: string[] = []
  const meta: CalcMeta = {
    id: "bioreactor_sizing",
    name: "Dimensionamiento de Reactor Biológico (TRH y Carga Orgánica)",
    formula: "V = max(Q * TRH, L_org / Cv_max)",
    source: "Metcalf & Eddy (4th/5th Ed.) / R.M. 192-2020-VIVIENDA / D.S. 003-2010-MINAM",
    units: "m³",
    version: ENGINE_VERSION,
  }

  const { type, flowM3PerDay, bodInMgL } = inputs
  const targetEffluent = inputs.targetBodEffluentMgL ?? 100
  const safety = inputs.safetyFactor ?? 1.15

  if (!Number.isFinite(flowM3PerDay) || !Number.isFinite(bodInMgL)) {
    errors.push("El caudal y la DBO afluente deben ser números válidos.")
    return outcome(false, null, errors, warnings, meta)
  }

  if (flowM3PerDay <= 0 || bodInMgL <= 0) {
    errors.push("El caudal y la DBO afluente deben ser mayores a cero.")
    return outcome(false, null, errors, warnings, meta)
  }

  const loadKgPerDay = (flowM3PerDay * bodInMgL) / 1000

  let minHrtHours: number
  let maxCvKgM3Day: number
  let typicalDepthM: number
  let lengthWidthRatio: number
  let typicalRemoval: number

  switch (type) {
    case "activated_sludge":
      minHrtHours = 6.0
      maxCvKgM3Day = 0.8
      typicalDepthM = 4.0
      lengthWidthRatio = 3.0
      typicalRemoval = 90
      break
    case "trickling_filter":
      minHrtHours = 2.5
      maxCvKgM3Day = 0.8
      typicalDepthM = 2.0
      lengthWidthRatio = 1.0
      typicalRemoval = 80
      break
    case "facultative_lagoon":
      minHrtHours = 20 * 24
      maxCvKgM3Day = 0.03
      typicalDepthM = 1.8
      lengthWidthRatio = 2.5
      typicalRemoval = 75
      break
    case "uasb":
      minHrtHours = 8.0
      maxCvKgM3Day = 2.5
      typicalDepthM = 4.5
      lengthWidthRatio = 1.5
      typicalRemoval = 70
      break
  }

  const effectiveHrtHours = inputs.manualHrtHours ? Math.max(inputs.manualHrtHours, minHrtHours * 0.5) : minHrtHours
  const volumeByHrt = (flowM3PerDay * (effectiveHrtHours / 24)) * safety
  const volumeByLoad = (loadKgPerDay / maxCvKgM3Day) * safety

  let designVolume = Math.max(volumeByHrt, volumeByLoad)
  const governingCriterion: BioreactorResult["governingCriterion"] = volumeByLoad > volumeByHrt ? "Carga Orgánica Volumétrica" : "TRH"

  if (governingCriterion === "Carga Orgánica Volumétrica") {
    warnings.push(`La alta carga orgánica (${loadKgPerDay.toFixed(1)} kg DBO/d) gobierna el volumen del reactor por sobre el TRH mínimo.`)
  }

  const governingHrt = (designVolume / flowM3PerDay) * 24
  const volumetricLoad = Number((loadKgPerDay / designVolume).toFixed(3))

  const area = designVolume / typicalDepthM
  const width = Math.sqrt(area / lengthWidthRatio)
  const length = width * lengthWidthRatio

  const expectedEffluent = bodInMgL * (1 - typicalRemoval / 100)
  if (expectedEffluent > targetEffluent) {
    warnings.push(`El efluente estimado (${expectedEffluent.toFixed(1)} mg/L DBO) supera el límite objetivo de ${targetEffluent} mg/L (LMP D.S. 003-2010-MINAM = 100 mg/L). Considere tren de tratamiento secundario o pulimento.`)
  }

  if (type === "uasb" && bodInMgL < 250) {
    warnings.push("La tecnología UASB suele requerir DBO/DQO más concentrada para sostener el manto de lodos anaerobio de forma estable.")
  }

  const result: BioreactorResult = {
    designVolumeM3: Number(designVolume.toFixed(2)),
    governingHrtHours: Number(governingHrt.toFixed(2)),
    organicLoadKgBodPerDay: Number(loadKgPerDay.toFixed(2)),
    volumetricLoadAppliedKgPerM3Day: volumetricLoad,
    governingCriterion,
    typicalDimensions: {
      lengthM: Number(length.toFixed(2)),
      widthM: Number(width.toFixed(2)),
      depthM: typicalDepthM,
    },
    expectedRemovalPercent: typicalRemoval,
  }

  return outcome(true, result, errors, warnings, meta)
}

export const GAS_MOLECULAR_WEIGHTS: Record<string, { name: string; mw: number }> = {
  CO: { name: "Monóxido de carbono", mw: 28.01 },
  CO2: { name: "Dióxido de carbono", mw: 44.01 },
  NO: { name: "Monóxido de nitrógeno", mw: 30.01 },
  NO2: { name: "Dióxido de nitrógeno", mw: 46.01 },
  SO2: { name: "Dióxido de azufre", mw: 64.06 },
  O3: { name: "Ozono", mw: 48.0 },
  H2S: { name: "Sulfuro de hidrógeno", mw: 34.08 },
  NH3: { name: "Amoníaco", mw: 17.03 },
  CH4: { name: "Metano", mw: 16.04 },
  C6H6: { name: "Benceno", mw: 78.11 },
}

export interface GasConversionInputs {
  gasKey?: keyof typeof GAS_MOLECULAR_WEIGHTS | string
  customMolecularWeight?: number
  value: number
  fromUnit: "ppm" | "ppb" | "mg_m3" | "ug_m3"
  toUnit: "ppm" | "ppb" | "mg_m3" | "ug_m3"
  tempC?: number
  pressureAtm?: number
}

export function convertGasConcentration(inputs: GasConversionInputs): CalcOutcome<number> {
  const errors: string[] = []
  const warnings: string[] = []
  const meta: CalcMeta = {
    id: "ideal_gas_law_converter",
    name: "Conversor Termodinámico de Gases (Ley de Gases Ideales)",
    formula: "mg/m³ = ppm * (PM / 22.414) * (273.15 / T) * (P / 1.0)",
    source: "US EPA / Seinfeld & Pandis, Atmospheric Chemistry and Physics",
    units: inputs.toUnit,
    version: ENGINE_VERSION,
  }

  const { value, fromUnit, toUnit } = inputs
  const tempC = inputs.tempC ?? 25
  const pressureAtm = inputs.pressureAtm ?? 1.0

  if (!Number.isFinite(value)) {
    errors.push("El valor de concentración debe ser un número válido.")
    return outcome(false, null, errors, warnings, meta)
  }

  if (value < 0) {
    errors.push("La concentración de un gas no puede ser negativa.")
    return outcome(false, null, errors, warnings, meta)
  }

  let mw: number | undefined
  if (inputs.customMolecularWeight && inputs.customMolecularWeight > 0) {
    mw = inputs.customMolecularWeight
  } else if (inputs.gasKey && GAS_MOLECULAR_WEIGHTS[inputs.gasKey]) {
    mw = GAS_MOLECULAR_WEIGHTS[inputs.gasKey].mw
  }

  if (!mw) {
    errors.push("Debe indicar un gas reconocido o un peso molecular mayor a cero.")
    return outcome(false, null, errors, warnings, meta)
  }

  const T_kelvin = tempC + 273.15
  if (T_kelvin <= 0) {
    errors.push("La temperatura debe ser superior al cero absoluto.")
    return outcome(false, null, errors, warnings, meta)
  }

  if (pressureAtm <= 0) {
    errors.push("La presión atmosférica debe ser mayor a cero.")
    return outcome(false, null, errors, warnings, meta)
  }

  let valueInPpm: number
  if (fromUnit === "ppm") {
    valueInPpm = value
  } else if (fromUnit === "ppb") {
    valueInPpm = value / 1000
  } else if (fromUnit === "mg_m3") {
    valueInPpm = value / ((mw / 22.414) * (273.15 / T_kelvin) * (pressureAtm / 1.0))
  } else {
    const mgM3 = value / 1000
    valueInPpm = mgM3 / ((mw / 22.414) * (273.15 / T_kelvin) * (pressureAtm / 1.0))
  }

  const mgM3Equiv = valueInPpm * (mw / 22.414) * (273.15 / T_kelvin) * (pressureAtm / 1.0)

  let result: number
  switch (toUnit) {
    case "ppm":
      result = valueInPpm
      break
    case "ppb":
      result = valueInPpm * 1000
      break
    case "mg_m3":
      result = mgM3Equiv
      break
    case "ug_m3":
      result = mgM3Equiv * 1000
      break
  }

  return outcome(true, Number(result.toFixed(4)), errors, warnings, meta)
}

export interface CarbonFootprintInputs {
  fuelType: "diesel" | "gasolina" | "glp" | "gas_natural" | "carbon"
  fuelQuantity: number
  electricityKwh: number
  gridCountry?: "peru" | "mexico" | "colombia" | "chile" | "usa" | "default"
  wasteKgPerYear?: number
}

export interface CarbonFootprintResult {
  scope1TonsCo2e: number
  scope2TonsCo2e: number
  scope3TonsCo2e: number
  totalTonsCo2e: number
  breakdownPercent: { scope1: number; scope2: number; scope3: number }
}

const FUEL_FACTORS_KG_CO2E: Record<string, number> = {
  diesel: 2.68,
  gasolina: 2.31,
  glp: 2.98,
  gas_natural: 2.03,
  carbon: 2.42,
}

const GRID_FACTORS_KG_KWH: Record<string, number> = {
  peru: 0.212,
  chile: 0.31,
  colombia: 0.164,
  mexico: 0.435,
  usa: 0.386,
  default: 0.35,
}

export function calculateCarbonFootprint(inputs: CarbonFootprintInputs): CalcOutcome<CarbonFootprintResult> {
  const errors: string[] = []
  const warnings: string[] = []
  const meta: CalcMeta = {
    id: "ghg_protocol_corporate",
    name: "Huella de Carbono Corporativa (Alcances 1, 2 y 3)",
    formula: "Total = Sum(Combustibles * FE_1) + (KWh * FE_red) + Residuos",
    source: "GHG Protocol Corporate Standard / Factor Oficial SEIN MINEM Perú",
    units: "t CO2e/año",
    version: ENGINE_VERSION,
  }

  const { fuelType, fuelQuantity, electricityKwh } = inputs
  const grid = inputs.gridCountry ?? "peru"
  const wasteKg = inputs.wasteKgPerYear ?? 0

  if (!Number.isFinite(fuelQuantity) || !Number.isFinite(electricityKwh)) {
    errors.push("Las cantidades de combustible y electricidad deben ser números válidos.")
    return outcome(false, null, errors, warnings, meta)
  }

  if (fuelQuantity < 0 || electricityKwh < 0 || wasteKg < 0) {
    errors.push("Los consumos no pueden ser negativos.")
    return outcome(false, null, errors, warnings, meta)
  }

  const fuelFe = FUEL_FACTORS_KG_CO2E[fuelType] ?? 2.5
  const gridFe = GRID_FACTORS_KG_KWH[grid] ?? 0.3

  const scope1Kg = fuelQuantity * fuelFe
  const scope2Kg = electricityKwh * gridFe
  const scope3Kg = wasteKg * 0.5

  const scope1Tons = Number((scope1Kg / 1000).toFixed(3))
  const scope2Tons = Number((scope2Kg / 1000).toFixed(3))
  const scope3Tons = Number((scope3Kg / 1000).toFixed(3))
  const totalTons = Number((scope1Tons + scope2Tons + scope3Tons).toFixed(3))

  const total = totalTons > 0 ? totalTons : 1
  const breakdownPercent = {
    scope1: Number(((scope1Tons / total) * 100).toFixed(1)),
    scope2: Number(((scope2Tons / total) * 100).toFixed(1)),
    scope3: Number(((scope3Tons / total) * 100).toFixed(1)),
  }

  return outcome(true, { scope1TonsCo2e: scope1Tons, scope2TonsCo2e: scope2Tons, scope3TonsCo2e: scope3Tons, totalTonsCo2e: totalTons, breakdownPercent }, errors, warnings, meta)
}

export interface WaterFootprintInputs {
  blueWaterM3Year: number
  greenWaterM3Year: number
  effluentVolumeM3Year?: number
  pollutantEffluentMgL?: number
  legalLimitMgL?: number
  naturalBackgroundMgL?: number
}

export interface WaterFootprintResult {
  blueM3: number
  greenM3: number
  greyM3: number
  totalM3: number
}

export function calculateWaterFootprint(inputs: WaterFootprintInputs): CalcOutcome<WaterFootprintResult> {
  const errors: string[] = []
  const warnings: string[] = []
  const meta: CalcMeta = {
    id: "wfn_water_footprint",
    name: "Huella Hídrica Total (Azul, Verde y Gris)",
    formula: "HH_total = Azul + Verde + Gris ; Gris = L_poll / (C_max - C_nat)",
    source: "The Water Footprint Assessment Manual (WFN, Hoekstra et al., 2011)",
    units: "m³/año",
    version: ENGINE_VERSION,
  }

  const { blueWaterM3Year, greenWaterM3Year } = inputs
  const effluentM3 = inputs.effluentVolumeM3Year ?? 0
  const cEffluent = inputs.pollutantEffluentMgL ?? 0
  const cMax = inputs.legalLimitMgL ?? 100
  const cNat = inputs.naturalBackgroundMgL ?? 5

  if (blueWaterM3Year < 0 || greenWaterM3Year < 0 || effluentM3 < 0) {
    errors.push("Los volúmenes hídricos no pueden ser negativos.")
    return outcome(false, null, errors, warnings, meta)
  }

  if (cMax <= cNat) {
    errors.push("El límite normativo (C_max) debe ser mayor a la concentración natural de fondo (C_nat).")
    return outcome(false, null, errors, warnings, meta)
  }

  let greyM3 = 0
  if (effluentM3 > 0 && cEffluent > cNat) {
    const loadKg = (effluentM3 * (cEffluent - cNat)) / 1000
    const denominatorKgM3 = (cMax - cNat) / 1000
    greyM3 = Math.max(0, loadKg / denominatorKgM3)
  }

  const blueM3 = Number(blueWaterM3Year.toFixed(2))
  const greenM3 = Number(greenWaterM3Year.toFixed(2))
  const greyM3Rounded = Number(greyM3.toFixed(2))
  const totalM3 = Number((blueM3 + greenM3 + greyM3Rounded).toFixed(2))

  return outcome(true, { blueM3, greenM3, greyM3: greyM3Rounded, totalM3 }, errors, warnings, meta)
}

export interface SoilRemediationInputs {
  soilVolumeM3: number
  initialTphMgKg: number
  targetTphMgKg: number
  soilDensityTonPerM3?: number
  cToNRatio?: number
  cToPRatio?: number
}

export interface SoilRemediationResult {
  soilMassTons: number
  hydrocarbonMassKg: number
  nitrogenRequiredKg: number
  phosphorusRequiredKg: number
  ureaKg: number
  tripleSuperphosphateKg: number
  estimatedDurationMonths: number
  estimatedCostUsd: { min: number; max: number }
}

export function calculateBiopileRemediation(inputs: SoilRemediationInputs): CalcOutcome<SoilRemediationResult> {
  const errors: string[] = []
  const warnings: string[] = []
  const meta: CalcMeta = {
    id: "soil_biopile_remediation",
    name: "Diseño y Balance de Nutrientes de Biopilas de Remediación",
    formula: "N = C / (C:N) ; P = C / (C:P) con C_petróleo ≈ 85%",
    source: "US EPA 542-R-01-004 / D.S. 011-2017-MINAM (ECA Suelo)",
    units: "kg nutrientes / USD",
    version: ENGINE_VERSION,
  }

  const { soilVolumeM3, initialTphMgKg, targetTphMgKg } = inputs
  const density = inputs.soilDensityTonPerM3 ?? 1.5
  const cn = inputs.cToNRatio ?? 10
  const cp = inputs.cToPRatio ?? 100

  if (soilVolumeM3 <= 0 || initialTphMgKg <= 0) {
    errors.push("El volumen de suelo y la concentración inicial de TPH deben ser mayores a cero.")
    return outcome(false, null, errors, warnings, meta)
  }

  if (targetTphMgKg >= initialTphMgKg) {
    errors.push("El objetivo de remediación debe ser menor a la concentración inicial de hidrocarburos.")
    return outcome(false, null, errors, warnings, meta)
  }

  const massTons = soilVolumeM3 * density
  const deltaTphGPerTon = initialTphMgKg - targetTphMgKg
  const hydrocarbonKg = (massTons * deltaTphGPerTon) / 1000
  const carbonKg = hydrocarbonKg * 0.85

  const nitrogenKg = carbonKg / cn
  const phosphorusKg = carbonKg / cp

  const ureaKg = nitrogenKg / 0.46
  const tspKg = phosphorusKg / 0.2

  const removalPercent = ((initialTphMgKg - targetTphMgKg) / initialTphMgKg) * 100
  const durationMonths = Number(Math.max(3, Math.min(18, (removalPercent / 15) * (initialTphMgKg > 10000 ? 1.4 : 1.0))).toFixed(1))

  const minCost = Number((soilVolumeM3 * 45).toFixed(0))
  const maxCost = Number((soilVolumeM3 * 95).toFixed(0))

  return outcome(
    true,
    {
      soilMassTons: Number(massTons.toFixed(1)),
      hydrocarbonMassKg: Number(hydrocarbonKg.toFixed(1)),
      nitrogenRequiredKg: Number(nitrogenKg.toFixed(1)),
      phosphorusRequiredKg: Number(phosphorusKg.toFixed(1)),
      ureaKg: Number(ureaKg.toFixed(1)),
      tripleSuperphosphateKg: Number(tspKg.toFixed(1)),
      estimatedDurationMonths: durationMonths,
      estimatedCostUsd: { min: minCost, max: maxCost },
    },
    errors,
    warnings,
    meta,
  )
}
