import test from "node:test"
import assert from "node:assert/strict"
import {
  dbo5,
  dqoTitration,
  reactorSizing,
  calculateWqi,
  convertGasConcentration,
  calculateCarbonFootprint,
  calculateWaterFootprint,
  calculateSoilRemediation,
} from "./calc-engine.ts"

const close = (a: number, b: number, eps = 1e-4) => assert.ok(Math.abs(a - b) < eps, `${a} ≈ ${b} (diff: ${Math.abs(a - b)})`)

/* ------------------------------------------------------------------ */
/* 1. DBO₅                                                            */
/* ------------------------------------------------------------------ */
test("DBO5: caso normal 3 mL en botella de 300 mL → 530 mg/L", () => {
  const r = dbo5({ do1: 8.5, do2: 3.2, sampleMl: 3, bottleMl: 300 })
  assert.equal(r.ok, true)
  close(r.value!.dbo, 530)
  close(r.value!.p, 0.01)
  assert.equal(r.value!.valid, true)
})

test("DBO5: 30 mL en 300 mL → 53 mg/L", () => {
  close(dbo5({ do1: 8.5, do2: 3.2, sampleMl: 30, bottleMl: 300 }).value!.dbo, 53)
})

test("DBO5: sin dilución (P=1) devuelve el consumo de OD", () => {
  close(dbo5({ do1: 8.5, do2: 3.2, sampleMl: 300, bottleMl: 300 }).value!.dbo, 5.3)
})

test("DBO5: con corrección de semilla → (5.3 − 0.2)/0.1 = 51", () => {
  close(dbo5({ do1: 8.5, do2: 3.2, sampleMl: 30, bottleMl: 300, seedCorrectionMgL: 0.2 }).value!.dbo, 51)
})

test("DBO5: consumo < 2 mg/L → no válido (se calcula pero se advierte)", () => {
  const r = dbo5({ do1: 8.5, do2: 7.0, sampleMl: 30, bottleMl: 300 })
  assert.equal(r.ok, true)
  assert.equal(r.value!.valid, false)
  assert.ok(r.warnings.length > 0)
})

test("DBO5: OD residual < 1 mg/L → no válido", () => {
  const r = dbo5({ do1: 8.5, do2: 0.5, sampleMl: 30, bottleMl: 300 })
  assert.equal(r.value!.valid, false)
})

test("DBO5: entradas inválidas", () => {
  assert.equal(dbo5({ do1: 3, do2: 8, sampleMl: 3, bottleMl: 300 }).ok, false) // OD final > inicial
  assert.equal(dbo5({ do1: 8.5, do2: 3, sampleMl: 400, bottleMl: 300 }).ok, false) // muestra > botella
  assert.equal(dbo5({ do1: 8.5, do2: 3, sampleMl: 0, bottleMl: 300 }).ok, false)
  assert.equal(dbo5({ do1: NaN, do2: 3, sampleMl: 3, bottleMl: 300 }).ok, false)
  assert.equal(dbo5({ do1: 8.5, do2: 3, sampleMl: 3, bottleMl: 300, seedCorrectionMgL: 9 }).ok, false)
})

/* ------------------------------------------------------------------ */
/* 2. DQO                                                             */
/* ------------------------------------------------------------------ */
test("DQO: (12−8)×0.1×8000/20 = 160 mg/L", () => {
  close(dqoTitration({ blankMl: 12, sampleTitrantMl: 8, molarityFas: 0.1, sampleMl: 20 }).value!.dqo, 160)
})

test("DQO: blanco < muestra y datos inválidos → error", () => {
  assert.equal(dqoTitration({ blankMl: 8, sampleTitrantMl: 12, molarityFas: 0.1, sampleMl: 20 }).ok, false)
  assert.equal(dqoTitration({ blankMl: 12, sampleTitrantMl: 8, molarityFas: 0, sampleMl: 20 }).ok, false)
  assert.equal(dqoTitration({ blankMl: 12, sampleTitrantMl: 8, molarityFas: 0.1, sampleMl: -1 }).ok, false)
})

/* ------------------------------------------------------------------ */
/* 3. Reactores                                                       */
/* ------------------------------------------------------------------ */
test("Reactor: la DBO afluente SÍ cambia el resultado (lodos activados 10 m³/h)", () => {
  const alta = reactorSizing({ type: "activated-sludge", flowM3h: 10, influentMgL: 250 }).value!
  close(alta.volume, 150)
  assert.equal(alta.governing, "carga orgánica")
  close(alta.loadKgPerDay, 60)
  const baja = reactorSizing({ type: "activated-sludge", flowM3h: 10, influentMgL: 100 }).value!
  close(baja.volume, 80)
  assert.equal(baja.governing, "TRH")
  assert.notEqual(alta.volume, baja.volume)
})

test("Reactor: filtro percolador dimensiona por carga: 60 kg/d ÷ 0.8 = 75 m³", () => {
  close(reactorSizing({ type: "trickling-filter", flowM3h: 10, influentMgL: 250 }).value!.volume, 75)
})

test("Reactor: laguna, el TRH de 20 d gobierna (4800 m³)", () => {
  const v = reactorSizing({ type: "lagoon", flowM3h: 10, influentMgL: 250 }).value!
  close(v.volume, 4800)
  assert.equal(v.governing, "TRH")
})

test("Reactor: dimensiones consistentes (L×W×H = V) y UASB advierte sobre DQO", () => {
  const r = reactorSizing({ type: "uasb", flowM3h: 20, influentMgL: 600 })
  const { length, width, depth } = r.value!.dimensions
  close(length * width * depth, r.value!.volume, 1e-4)
  assert.ok(r.warnings.some((w) => w.includes("DQO")))
})

test("Reactor: entradas inválidas", () => {
  assert.equal(reactorSizing({ type: "lagoon", flowM3h: 0, influentMgL: 250 }).ok, false)
  assert.equal(reactorSizing({ type: "lagoon", flowM3h: 10, influentMgL: NaN }).ok, false)
  assert.equal(reactorSizing({ type: "lagoon", flowM3h: 10, influentMgL: -5 }).ok, false)
})

/* ------------------------------------------------------------------ */
/* 4. ICA (WQI)                                                       */
/* ------------------------------------------------------------------ */
test("ICA: agua limpia de alta calidad → Excelente o Buena (> 85)", () => {
  const r = calculateWqi({
    doSaturationPercent: 95,
    ph: 7.2,
    turbidityNtu: 3,
    bod5MgL: 1.5,
    fecalColiformsNmp: 5,
    tdsMgL: 120,
  })
  assert.equal(r.ok, true)
  assert.ok(r.value!.score >= 85, `Score should be >= 85, got ${r.value!.score}`)
  assert.ok(["Excelente", "Buena"].includes(r.value!.classification))
  assert.equal(r.value!.parametersEvaluated, 6)
})

test("ICA: agua severamente contaminada → Mala o Pésima (< 45)", () => {
  const r = calculateWqi({
    doSaturationPercent: 15,
    ph: 4.5,
    turbidityNtu: 90,
    bod5MgL: 35,
    fecalColiformsNmp: 50000,
  })
  assert.equal(r.ok, true)
  assert.ok(r.value!.score <= 45, `Score should be <= 45, got ${r.value!.score}`)
  assert.ok(["Mala", "Pésima"].includes(r.value!.classification))
})

test("ICA: validación con OD en mg/L y temperatura", () => {
  const r = calculateWqi({
    doMgL: 7.5,
    temperatureC: 20,
    ph: 7.3,
    turbidityNtu: 5,
  })
  assert.equal(r.ok, true)
  assert.equal(r.value!.parametersEvaluated, 3)
  assert.ok(r.value!.score > 75)
})

test("ICA: menos de 3 parámetros o valores inválidos → error", () => {
  assert.equal(calculateWqi({ ph: 7.0, turbidityNtu: 5 }).ok, false) // solo 2 parámetros
  assert.equal(calculateWqi({ ph: 16, turbidityNtu: 5, doSaturationPercent: 90 }).ok, false) // pH > 14
})

/* ------------------------------------------------------------------ */
/* 5. Conversor de Gases                                              */
/* ------------------------------------------------------------------ */
test("Conversor de Gases: 1 ppm de CO a 25 °C y 1 atm ≈ 1.145 mg/m³", () => {
  const r = convertGasConcentration({
    value: 1,
    fromUnit: "ppm",
    toUnit: "mg_m3",
    gasKey: "co",
    temperatureC: 25,
    pressureAtm: 1.0,
  })
  assert.equal(r.ok, true)
  // 1 ppm × 28.01 / 24.465 ≈ 1.1449 mg/m³
  close(r.value!.result, 1.145, 0.01)
})

test("Conversor de Gases: 100 µg/m³ de SO2 a 25 °C → ppm y regreso", () => {
  const toPpm = convertGasConcentration({
    value: 100,
    fromUnit: "ug_m3",
    toUnit: "ppm",
    gasKey: "so2",
    temperatureC: 25,
  })
  assert.equal(toPpm.ok, true)
  const back = convertGasConcentration({
    value: toPpm.value!.result,
    fromUnit: "ppm",
    toUnit: "ug_m3",
    gasKey: "so2",
    temperatureC: 25,
  })
  close(back.value!.result, 100, 1e-3)
})

test("Conversor de Gases: gas personalizado con peso molecular", () => {
  const r = convertGasConcentration({
    value: 10,
    fromUnit: "mg_m3",
    toUnit: "ppm",
    gasKey: "custom",
    customMolecularWeight: 44.01, // CO2
  })
  assert.equal(r.ok, true)
  assert.ok(r.value!.result > 0)
})

/* ------------------------------------------------------------------ */
/* 6. Huella de Carbono (GHG Protocol)                                */
/* ------------------------------------------------------------------ */
test("Huella de Carbono: desglose por Alcances y red eléctrica de Perú", () => {
  const r = calculateCarbonFootprint({
    naturalGasM3: 100, // 100 × 2.03 = 203 kg
    electricityKwh: 500, // 500 × 0.212 = 106 kg (Perú SEIN)
    vehicleKm: 300, // 300 × 0.171 = 51.3 kg
    gridRegion: "peru_sein",
  })
  assert.equal(r.ok, true)
  close(r.value!.scope1Kg, 203, 0.1)
  close(r.value!.scope2Kg, 106, 0.1)
  close(r.value!.scope3Kg, 51.3, 0.1)
  close(r.value!.totalKgCo2e, 360.3, 0.2)
  close(r.value!.totalTonCo2e, 0.36, 0.01)
  assert.ok(r.value!.treesNeededOffset > 0)
})

test("Huella de Carbono: rechaza valores negativos", () => {
  assert.equal(calculateCarbonFootprint({ electricityKwh: -50 }).ok, false)
})

/* ------------------------------------------------------------------ */
/* 7. Huella Hídrica (WFN / Hoekstra)                                 */
/* ------------------------------------------------------------------ */
test("Huella Hídrica: Azul + Verde + Gris con vertimiento contaminante", () => {
  const r = calculateWaterFootprint({
    surfaceWaterConsumedM3: 500, // Azul
    groundwaterConsumedM3: 300, // Azul (Total azul = 800)
    rainwaterEvapotranspiredM3: 200, // Verde
    effluentDischargeM3: 1000, // Vertimiento Q
    effluentConcentrationMgL: 50, // C_eff (DBO = 50 mg/L)
    standardLimitMgL: 10, // ECA C_max = 10 mg/L
    naturalBackgroundMgL: 0, // C_nat = 0 mg/L
  })
  assert.equal(r.ok, true)
  assert.equal(r.value!.blueM3, 800)
  assert.equal(r.value!.greenM3, 200)
  // Gris: 1000 × (50 - 0) / (10 - 0) = 5000 m³
  assert.equal(r.value!.greyM3, 5000)
  assert.equal(r.value!.totalM3, 6000)
  close(r.value!.percentages.grey, (5000 / 6000) * 100, 0.1)
})

test("Huella Hídrica: efluente cumple norma → Huella Gris = 0", () => {
  const r = calculateWaterFootprint({
    surfaceWaterConsumedM3: 100,
    effluentDischargeM3: 500,
    effluentConcentrationMgL: 8, // menor que límite
    standardLimitMgL: 10,
    naturalBackgroundMgL: 0,
  })
  assert.equal(r.ok, true)
  assert.equal(r.value!.greyM3, 0)
  assert.equal(r.value!.totalM3, 100)
})

/* ------------------------------------------------------------------ */
/* 8. Remediación de Suelos y Costos                                  */
/* ------------------------------------------------------------------ */
test("Remediación de Suelos: biopilas con cálculo de nutrientes C:N:P", () => {
  const r = calculateSoilRemediation({
    technology: "biopiles",
    areaM2: 500,
    depthM: 1.5,
    soilDensityTonM3: 1.6,
    initialConcentrationMgKg: 5000, // 5000 mg/kg hidrocarburos
    targetConcentrationMgKg: 500, // ECA Suelo Residencial 500 mg/kg
  })
  assert.equal(r.ok, true)
  // Volumen: 500 × 1.5 = 750 m³
  assert.equal(r.value!.inSituVolumeM3, 750)
  // Masa: 750 × 1.6 = 1200 toneladas
  assert.equal(r.value!.soilMassTonnes, 1200)
  // Costo: 1200 × $55/ton = $66,000 USD
  assert.equal(r.value!.costs.totalEstimatedUsd, 66000)
  // Eficiencia: (5000 - 500)/5000 = 90%
  assert.equal(r.value!.requiredEfficiencyPercent, 90)
  // Contaminante removido: 1200 t × 1000 kg/t × 4500 mg/kg × 10^-6 = 5400 kg
  assert.equal(r.value!.contaminantRemovedKg, 5400)
  // Nutrientes C:N:P (C ≈ 5400 × 0.85 = 4590 kg C → N = 459 kg, P = 45.9 kg)
  assert.ok(r.value!.nutrientRequirementsKg)
  close(r.value!.nutrientRequirementsKg!.nitrogenKg, 459, 1)
  close(r.value!.nutrientRequirementsKg!.phosphorusKg, 45.9, 0.5)
})
