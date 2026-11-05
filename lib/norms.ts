export type NormCategory =
  | "ECA Agua 1-A1"
  | "ECA Agua 1-A2"
  | "ECA Agua 3-D1"
  | "ECA Agua 3-D2"
  | "ECA Agua 4-E2"
  | "LMP PTAR"
  | "ECA Suelo F1-F3"

export interface NormLimit {
  parametro: string
  categoria: NormCategory
  min: number | null
  max: number | null
  unidad: string
  norma: string
  version_o_fecha: string
}

const agua = "D.S. N.° 004-2017-MINAM"
const lmp = "D.S. N.° 003-2010-MINAM"
const suelo = "D.S. N.° 011-2017-MINAM"
const fechaAgua = "07/06/2017"
const fechaLmp = "17/03/2010"
const fechaSuelo = "02/12/2017"

export const norms: NormLimit[] = [
  // ECA Agua 1-A1: Anexo, subcategoría A1.
  { parametro: "pH", categoria: "ECA Agua 1-A1", min: 6.5, max: 8.5, unidad: "unidad de pH", norma: agua, version_o_fecha: fechaAgua },
  { parametro: "OD", categoria: "ECA Agua 1-A1", min: 6, max: null, unidad: "mg/L", norma: agua, version_o_fecha: fechaAgua },
  { parametro: "CE", categoria: "ECA Agua 1-A1", min: null, max: null, unidad: "µS/cm", norma: agua, version_o_fecha: fechaAgua },
  { parametro: "DBO5", categoria: "ECA Agua 1-A1", min: null, max: 3, unidad: "mg/L", norma: agua, version_o_fecha: fechaAgua },
  { parametro: "DQO", categoria: "ECA Agua 1-A1", min: null, max: 10, unidad: "mg/L", norma: agua, version_o_fecha: fechaAgua },
  { parametro: "SST", categoria: "ECA Agua 1-A1", min: null, max: 25, unidad: "mg/L", norma: agua, version_o_fecha: fechaAgua },

  // ECA Agua 1-A2: Anexo, subcategoría A2.
  { parametro: "pH", categoria: "ECA Agua 1-A2", min: 5.5, max: 9, unidad: "unidad de pH", norma: agua, version_o_fecha: fechaAgua },
  { parametro: "OD", categoria: "ECA Agua 1-A2", min: 5, max: null, unidad: "mg/L", norma: agua, version_o_fecha: fechaAgua },
  { parametro: "CE", categoria: "ECA Agua 1-A2", min: null, max: null, unidad: "µS/cm", norma: agua, version_o_fecha: fechaAgua },
  { parametro: "DBO5", categoria: "ECA Agua 1-A2", min: null, max: 5, unidad: "mg/L", norma: agua, version_o_fecha: fechaAgua },
  { parametro: "DQO", categoria: "ECA Agua 1-A2", min: null, max: 20, unidad: "mg/L", norma: agua, version_o_fecha: fechaAgua },
  { parametro: "SST", categoria: "ECA Agua 1-A2", min: null, max: 25, unidad: "mg/L", norma: agua, version_o_fecha: fechaAgua },

  // ECA Agua 3-D1: riego no restringido / restringido.
  { parametro: "pH", categoria: "ECA Agua 3-D1", min: 6.5, max: 8.5, unidad: "unidad de pH", norma: agua, version_o_fecha: fechaAgua },
  { parametro: "OD", categoria: "ECA Agua 3-D1", min: 4, max: null, unidad: "mg/L", norma: agua, version_o_fecha: fechaAgua },
  { parametro: "CE", categoria: "ECA Agua 3-D1", min: null, max: 2500, unidad: "µS/cm", norma: agua, version_o_fecha: fechaAgua },
  { parametro: "DBO5", categoria: "ECA Agua 3-D1", min: null, max: 15, unidad: "mg/L", norma: agua, version_o_fecha: fechaAgua },
  { parametro: "DQO", categoria: "ECA Agua 3-D1", min: null, max: 40, unidad: "mg/L", norma: agua, version_o_fecha: fechaAgua },
  { parametro: "SST", categoria: "ECA Agua 3-D1", min: null, max: null, unidad: "mg/L", norma: agua, version_o_fecha: fechaAgua },

  // ECA Agua 3-D2: bebida de animales.
  { parametro: "pH", categoria: "ECA Agua 3-D2", min: 6.5, max: 8.4, unidad: "unidad de pH", norma: agua, version_o_fecha: fechaAgua },
  { parametro: "OD", categoria: "ECA Agua 3-D2", min: 5, max: null, unidad: "mg/L", norma: agua, version_o_fecha: fechaAgua },
  { parametro: "CE", categoria: "ECA Agua 3-D2", min: null, max: 5000, unidad: "µS/cm", norma: agua, version_o_fecha: fechaAgua },
  { parametro: "DBO5", categoria: "ECA Agua 3-D2", min: null, max: 15, unidad: "mg/L", norma: agua, version_o_fecha: fechaAgua },
  { parametro: "DQO", categoria: "ECA Agua 3-D2", min: null, max: 40, unidad: "mg/L", norma: agua, version_o_fecha: fechaAgua },
  { parametro: "SST", categoria: "ECA Agua 3-D2", min: null, max: null, unidad: "mg/L", norma: agua, version_o_fecha: fechaAgua },

  // ECA Agua 4-E2: ríos, costa/sierra y selva. Se conserva la separación de la tabla oficial.
  { parametro: "pH", categoria: "ECA Agua 4-E2", min: 6.5, max: 9, unidad: "unidad de pH", norma: agua, version_o_fecha: fechaAgua },
  { parametro: "OD", categoria: "ECA Agua 4-E2", min: 5, max: null, unidad: "mg/L", norma: agua, version_o_fecha: fechaAgua },
  { parametro: "CE", categoria: "ECA Agua 4-E2", min: null, max: 1000, unidad: "µS/cm", norma: agua, version_o_fecha: fechaAgua },
  { parametro: "DBO5", categoria: "ECA Agua 4-E2", min: null, max: 10, unidad: "mg/L", norma: agua, version_o_fecha: fechaAgua },
  { parametro: "DQO", categoria: "ECA Agua 4-E2", min: null, max: null, unidad: "mg/L", norma: agua, version_o_fecha: fechaAgua },
  { parametro: "SST", categoria: "ECA Agua 4-E2", min: null, max: 100, unidad: "mg/L", norma: agua, version_o_fecha: fechaAgua },

  // LMP para efluentes de PTAR. SST aparece en la norma como mL/L.
  { parametro: "pH", categoria: "LMP PTAR", min: 6.5, max: 8.5, unidad: "unidad de pH", norma: lmp, version_o_fecha: fechaLmp },
  { parametro: "DBO5", categoria: "LMP PTAR", min: null, max: 100, unidad: "mg/L", norma: lmp, version_o_fecha: fechaLmp },
  { parametro: "DQO", categoria: "LMP PTAR", min: null, max: 200, unidad: "mg/L", norma: lmp, version_o_fecha: fechaLmp },
  { parametro: "SST", categoria: "LMP PTAR", min: null, max: 150, unidad: "mL/L", norma: lmp, version_o_fecha: fechaLmp },
  { parametro: "Aceites y grasas", categoria: "LMP PTAR", min: null, max: 20, unidad: "mg/L", norma: lmp, version_o_fecha: fechaLmp },

  // ECA Suelo: fracciones de hidrocarburos de petróleo F1-F3 (mg/kg PS).
  { parametro: "F1 (C6-C10)", categoria: "ECA Suelo F1-F3", min: null, max: 200, unidad: "mg/kg PS · agrícola", norma: suelo, version_o_fecha: fechaSuelo },
  { parametro: "F1 (C6-C10)", categoria: "ECA Suelo F1-F3", min: null, max: 200, unidad: "mg/kg PS · residencial/parques", norma: suelo, version_o_fecha: fechaSuelo },
  { parametro: "F1 (C6-C10)", categoria: "ECA Suelo F1-F3", min: null, max: 500, unidad: "mg/kg PS · comercial/industrial/extractivo", norma: suelo, version_o_fecha: fechaSuelo },
  { parametro: "F2 (>C10-C28)", categoria: "ECA Suelo F1-F3", min: null, max: 1200, unidad: "mg/kg PS · agrícola", norma: suelo, version_o_fecha: fechaSuelo },
  { parametro: "F2 (>C10-C28)", categoria: "ECA Suelo F1-F3", min: null, max: 1200, unidad: "mg/kg PS · residencial/parques", norma: suelo, version_o_fecha: fechaSuelo },
  { parametro: "F2 (>C10-C28)", categoria: "ECA Suelo F1-F3", min: null, max: 5000, unidad: "mg/kg PS · comercial/industrial/extractivo", norma: suelo, version_o_fecha: fechaSuelo },
  { parametro: "F3 (>C28-C40)", categoria: "ECA Suelo F1-F3", min: null, max: 3000, unidad: "mg/kg PS · agrícola", norma: suelo, version_o_fecha: fechaSuelo },
  { parametro: "F3 (>C28-C40)", categoria: "ECA Suelo F1-F3", min: null, max: 3000, unidad: "mg/kg PS · residencial/parques", norma: suelo, version_o_fecha: fechaSuelo },
  { parametro: "F3 (>C28-C40)", categoria: "ECA Suelo F1-F3", min: null, max: 6000, unidad: "mg/kg PS · comercial/industrial/extractivo", norma: suelo, version_o_fecha: fechaSuelo },
]

export function getNorm(parametro: string, categoria: NormCategory): NormLimit | undefined {
  return norms.find((norm) => norm.parametro === parametro && norm.categoria === categoria)
}

export function getNormCategoryLabel(categoria: NormCategory): string {
  if (categoria === "LMP PTAR") return "LMP PTAR · D.S. 003-2010-MINAM · 17/03/2010"
  if (categoria === "ECA Suelo F1-F3") return "ECA Suelo F1-F3 · D.S. 011-2017-MINAM · 02/12/2017"
  return `${categoria} · D.S. 004-2017-MINAM · 07/06/2017`
}
