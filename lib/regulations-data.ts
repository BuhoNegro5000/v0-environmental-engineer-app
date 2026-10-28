export interface RegulationLimit {
  parameter: string
  limit: number | string
  unit: string
  standard: string
  category?: string
}

export interface CountryRegulations {
  name: string
  waterQuality: RegulationLimit[]
  airQuality: RegulationLimit[]
  soilQuality?: RegulationLimit[]
  effluentLimits?: RegulationLimit[]
  noiseLimits?: RegulationLimit[]
}

export const regulationsByCountry: Record<string, CountryRegulations> = {
  peru: {
    name: "Perú - MINAM",
    waterQuality: [
      { parameter: "pH", limit: "6.5 - 8.5", unit: "unidades", standard: "D.S. N° 004-2017-MINAM", category: "ECA Agua Cat 1-A2 / Cat 3" },
      { parameter: "DBO₅ (Cat 1-A2 Potabilización)", limit: 5, unit: "mg/L", standard: "D.S. N° 004-2017-MINAM", category: "ECA Agua Cat 1-A2" },
      { parameter: "DBO₅ (Cat 3 Riego de vegetales)", limit: 15, unit: "mg/L", standard: "D.S. N° 004-2017-MINAM", category: "ECA Agua Cat 3" },
      { parameter: "DBO₅ (Cat 4 Conservación Ríos)", limit: 10, unit: "mg/L", standard: "D.S. N° 004-2017-MINAM", category: "ECA Agua Cat 4" },
      { parameter: "DQO (Cat 1-A2 Potabilización)", limit: 10, unit: "mg/L", standard: "D.S. N° 004-2017-MINAM", category: "ECA Agua Cat 1-A2" },
      { parameter: "DQO (Cat 3 Riego de vegetales)", limit: 40, unit: "mg/L", standard: "D.S. N° 004-2017-MINAM", category: "ECA Agua Cat 3" },
      { parameter: "Sólidos Suspendidos Totales (SST)", limit: 50, unit: "mg/L", standard: "D.S. N° 004-2017-MINAM", category: "ECA Agua Cat 1-A2" },
      { parameter: "Aceites y Grasas (Cat 1-A2)", limit: 0.5, unit: "mg/L", standard: "D.S. N° 004-2017-MINAM", category: "ECA Agua Cat 1-A2" },
      { parameter: "Coliformes Termotolerantes (Cat 1-A2)", limit: 2000, unit: "NMP/100mL", standard: "D.S. N° 004-2017-MINAM", category: "ECA Agua Cat 1-A2" },
      { parameter: "Coliformes Termotolerantes (Cat 3 Riego)", limit: 1000, unit: "NMP/100mL", standard: "D.S. N° 004-2017-MINAM", category: "ECA Agua Cat 3" },
      { parameter: "Nitratos (NO₃⁻)", limit: 50, unit: "mg/L", standard: "D.S. N° 004-2017-MINAM", category: "ECA Agua Cat 1-A2" },
      { parameter: "Fósforo Total", limit: 0.15, unit: "mg/L", standard: "D.S. N° 004-2017-MINAM", category: "ECA Agua Cat 1-A2" },
      { parameter: "Arsénico Total", limit: 0.01, unit: "mg/L", standard: "D.S. N° 004-2017-MINAM", category: "ECA Agua Cat 1-A2" },
      { parameter: "Cadmio Total", limit: 0.003, unit: "mg/L", standard: "D.S. N° 004-2017-MINAM", category: "ECA Agua Cat 1-A2" },
      { parameter: "Plomo Total", limit: 0.01, unit: "mg/L", standard: "D.S. N° 004-2017-MINAM", category: "ECA Agua Cat 1-A2" },
      // Efluentes PTAR
      { parameter: "LMP PTAR - pH", limit: "6.5 - 8.5", unit: "unidades", standard: "D.S. N° 003-2010-MINAM", category: "LMP Efluentes PTAR" },
      { parameter: "LMP PTAR - DBO₅", limit: 100, unit: "mg/L", standard: "D.S. N° 003-2010-MINAM", category: "LMP Efluentes PTAR" },
      { parameter: "LMP PTAR - DQO", limit: 200, unit: "mg/L", standard: "D.S. N° 003-2010-MINAM", category: "LMP Efluentes PTAR" },
      { parameter: "LMP PTAR - SST", limit: 150, unit: "mg/L", standard: "D.S. N° 003-2010-MINAM", category: "LMP Efluentes PTAR" },
      { parameter: "LMP PTAR - Aceites y Grasas", limit: 20, unit: "mg/L", standard: "D.S. N° 003-2010-MINAM", category: "LMP Efluentes PTAR" },
      { parameter: "LMP PTAR - Coliformes Termotolerantes", limit: 10000, unit: "NMP/100mL", standard: "D.S. N° 003-2010-MINAM", category: "LMP Efluentes PTAR" },
    ],
    airQuality: [
      { parameter: "Material Particulado PM10 (24h)", limit: 100, unit: "µg/m³", standard: "D.S. N° 003-2017-MINAM" },
      { parameter: "Material Particulado PM2.5 (24h)", limit: 50, unit: "µg/m³", standard: "D.S. N° 003-2017-MINAM" },
      { parameter: "Dióxido de Azufre SO₂ (24h)", limit: 250, unit: "µg/m³", standard: "D.S. N° 003-2017-MINAM" },
      { parameter: "Dióxido de Nitrógeno NO₂ (1h)", limit: 200, unit: "µg/m³", standard: "D.S. N° 003-2017-MINAM" },
      { parameter: "Dióxido de Nitrógeno NO₂ (anual)", limit: 100, unit: "µg/m³", standard: "D.S. N° 003-2017-MINAM" },
      { parameter: "Ozono O₃ (8h)", limit: 100, unit: "µg/m³", standard: "D.S. N° 003-2017-MINAM" },
      { parameter: "Monóxido de Carbono CO (8h)", limit: 10000, unit: "µg/m³", standard: "D.S. N° 003-2017-MINAM" },
      { parameter: "Monóxido de Carbono CO (1h)", limit: 30000, unit: "µg/m³", standard: "D.S. N° 003-2017-MINAM" },
      { parameter: "Sulfuro de Hidrógeno H₂S (24h)", limit: 150, unit: "µg/m³", standard: "D.S. N° 003-2017-MINAM" },
      { parameter: "Plomo en PM10 (anual)", limit: 0.5, unit: "µg/m³", standard: "D.S. N° 003-2017-MINAM" },
      { parameter: "Benceno (anual)", limit: 2, unit: "µg/m³", standard: "D.S. N° 003-2017-MINAM" },
    ],
    soilQuality: [
      { parameter: "Arsénico (As) Agrícola/Residencial", limit: 50, unit: "mg/kg MS", standard: "D.S. N° 011-2017-MINAM" },
      { parameter: "Arsénico (As) Comercial/Industrial", limit: 140, unit: "mg/kg MS", standard: "D.S. N° 011-2017-MINAM" },
      { parameter: "Cadmio (Cd) Agrícola", limit: 1.4, unit: "mg/kg MS", standard: "D.S. N° 011-2017-MINAM" },
      { parameter: "Cadmio (Cd) Residencial/Parques", limit: 10, unit: "mg/kg MS", standard: "D.S. N° 011-2017-MINAM" },
      { parameter: "Cadmio (Cd) Comercial/Industrial", limit: 22, unit: "mg/kg MS", standard: "D.S. N° 011-2017-MINAM" },
      { parameter: "Plomo (Pb) Agrícola", limit: 70, unit: "mg/kg MS", standard: "D.S. N° 011-2017-MINAM" },
      { parameter: "Plomo (Pb) Residencial/Parques", limit: 140, unit: "mg/kg MS", standard: "D.S. N° 011-2017-MINAM" },
      { parameter: "Plomo (Pb) Comercial/Industrial", limit: 800, unit: "mg/kg MS", standard: "D.S. N° 011-2017-MINAM" },
      { parameter: "Hidrocarburos F1 (C6-C10) Agrícola", limit: 200, unit: "mg/kg MS", standard: "D.S. N° 011-2017-MINAM" },
      { parameter: "Hidrocarburos F2 (C10-C28) Agrícola", limit: 1200, unit: "mg/kg MS", standard: "D.S. N° 011-2017-MINAM" },
      { parameter: "Hidrocarburos F3 (C28-C40) Agrícola", limit: 3000, unit: "mg/kg MS", standard: "D.S. N° 011-2017-MINAM" },
    ],
    noiseLimits: [
      { parameter: "Zona de Protección Especial", limit: "50 Día / 40 Noche", unit: "dBA", standard: "D.S. N° 085-2003-PCM" },
      { parameter: "Zona Residencial", limit: "60 Día / 50 Noche", unit: "dBA", standard: "D.S. N° 085-2003-PCM" },
      { parameter: "Zona Comercial", limit: "70 Día / 60 Noche", unit: "dBA", standard: "D.S. N° 085-2003-PCM" },
      { parameter: "Zona Industrial", limit: "80 Día / 70 Noche", unit: "dBA", standard: "D.S. N° 085-2003-PCM" },
    ],
  },
  mexico: {
    name: "México - SEMARNAT",
    waterQuality: [
      { parameter: "pH", limit: "6.0 - 9.0", unit: "unidades", standard: "NOM-001-SEMARNAT-2021" },
      { parameter: "DBO₅", limit: 60, unit: "mg/L", standard: "NOM-001-SEMARNAT-2021" },
      { parameter: "DQO", limit: 150, unit: "mg/L", standard: "NOM-001-SEMARNAT-2021" },
      { parameter: "SST", limit: 60, unit: "mg/L", standard: "NOM-001-SEMARNAT-2021" },
      { parameter: "Grasas y Aceites", limit: 15, unit: "mg/L", standard: "NOM-001-SEMARNAT-2021" },
      { parameter: "Nitrógeno Total", limit: 25, unit: "mg/L", standard: "NOM-001-SEMARNAT-2021" },
      { parameter: "Fósforo Total", limit: 10, unit: "mg/L", standard: "NOM-001-SEMARNAT-2021" },
      { parameter: "Escherichia coli", limit: 1000, unit: "NMP/100mL", standard: "NOM-001-SEMARNAT-2021" },
    ],
    airQuality: [
      { parameter: "PM10 (24h)", limit: 70, unit: "µg/m³", standard: "NOM-025-SSA1-2021" },
      { parameter: "PM2.5 (24h)", limit: 41, unit: "µg/m³", standard: "NOM-025-SSA1-2021" },
      { parameter: "O₃ (1h)", limit: 95, unit: "ppb", standard: "NOM-020-SSA1-2021" },
      { parameter: "CO (8h)", limit: 9.0, unit: "ppm", standard: "NOM-021-SSA1-2021" },
      { parameter: "SO₂ (24h)", limit: 75, unit: "ppb", standard: "NOM-022-SSA1-2019" },
      { parameter: "NO₂ (1h)", limit: 210, unit: "ppb", standard: "NOM-023-SSA1-2021" },
    ],
  },
  usa: {
    name: "USA - EPA",
    waterQuality: [
      { parameter: "pH", limit: "6.5 - 8.5", unit: "units", standard: "EPA Clean Water Act" },
      { parameter: "BOD₅ (Secondary Treatment)", limit: 30, unit: "mg/L", standard: "EPA 40 CFR 133" },
      { parameter: "COD", limit: 120, unit: "mg/L", standard: "EPA Industrial Guidelines" },
      { parameter: "TSS (Secondary Treatment)", limit: 30, unit: "mg/L", standard: "EPA 40 CFR 133" },
      { parameter: "Oil & Grease", limit: 15, unit: "mg/L", standard: "EPA 40 CFR 435" },
      { parameter: "Total Nitrogen", limit: 10, unit: "mg/L", standard: "EPA TMDL Guidelines" },
      { parameter: "Total Phosphorus", limit: 1.0, unit: "mg/L", standard: "EPA Criteria" },
      { parameter: "Fecal Coliform", limit: 200, unit: "CFU/100mL", standard: "EPA Recreational Water Quality" },
    ],
    airQuality: [
      { parameter: "PM10 (24h)", limit: 150, unit: "µg/m³", standard: "EPA NAAQS 40 CFR 50" },
      { parameter: "PM2.5 (24h)", limit: 35, unit: "µg/m³", standard: "EPA NAAQS 40 CFR 50" },
      { parameter: "PM2.5 (Annual)", limit: 9.0, unit: "µg/m³", standard: "EPA NAAQS 2024 Update" },
      { parameter: "O₃ (8h)", limit: 70, unit: "ppb", standard: "EPA NAAQS 40 CFR 50" },
      { parameter: "CO (8h)", limit: 9, unit: "ppm", standard: "EPA NAAQS 40 CFR 50" },
      { parameter: "SO₂ (1h)", limit: 75, unit: "ppb", standard: "EPA NAAQS 40 CFR 50" },
      { parameter: "NO₂ (1h)", limit: 100, unit: "ppb", standard: "EPA NAAQS 40 CFR 50" },
      { parameter: "Lead (3-month rolling)", limit: 0.15, unit: "µg/m³", standard: "EPA NAAQS 40 CFR 50" },
    ],
  },
  europe: {
    name: "Europa - EU Directives",
    waterQuality: [
      { parameter: "pH", limit: "6.5 - 9.0", unit: "units", standard: "EU WFD 2000/60/EC" },
      { parameter: "BOD₅", limit: 25, unit: "mg/L", standard: "EU Directive 91/271/EEC (UWWTD)" },
      { parameter: "COD", limit: 125, unit: "mg/L", standard: "EU Directive 91/271/EEC (UWWTD)" },
      { parameter: "TSS", limit: 35, unit: "mg/L", standard: "EU Directive 91/271/EEC (UWWTD)" },
      { parameter: "Total Nitrogen", limit: 15, unit: "mg/L", standard: "EU Directive 91/271/EEC" },
      { parameter: "Total Phosphorus", limit: 2.0, unit: "mg/L", standard: "EU Directive 91/271/EEC" },
    ],
    airQuality: [
      { parameter: "PM10 (24h)", limit: 50, unit: "µg/m³", standard: "EU Directive 2008/50/EC" },
      { parameter: "PM2.5 (Annual)", limit: 20, unit: "µg/m³", standard: "EU Directive 2008/50/EC" },
      { parameter: "O₃ (8h)", limit: 120, unit: "µg/m³", standard: "EU Directive 2008/50/EC" },
      { parameter: "CO (8h)", limit: 10, unit: "mg/m³", standard: "EU Directive 2008/50/EC" },
      { parameter: "SO₂ (24h)", limit: 125, unit: "µg/m³", standard: "EU Directive 2008/50/EC" },
      { parameter: "NO₂ (1h)", limit: 200, unit: "µg/m³", standard: "EU Directive 2008/50/EC" },
    ],
  },
  brazil: {
    name: "Brasil - CONAMA",
    waterQuality: [
      { parameter: "pH", limit: "6.0 - 9.0", unit: "unidades", standard: "CONAMA 357/2005" },
      { parameter: "DBO₅", limit: 60, unit: "mg/L", standard: "CONAMA 430/2011" },
      { parameter: "DQO", limit: 180, unit: "mg/L", standard: "CONAMA 430/2011" },
      { parameter: "SST", limit: 100, unit: "mg/L", standard: "CONAMA 430/2011" },
      { parameter: "Óleos e Graxas", limit: 20, unit: "mg/L", standard: "CONAMA 430/2011" },
      { parameter: "Fósforo Total", limit: 1.0, unit: "mg/L", standard: "CONAMA 357/2005" },
    ],
    airQuality: [
      { parameter: "PM10 (24h)", limit: 120, unit: "µg/m³", standard: "CONAMA 491/2018" },
      { parameter: "PM2.5 (24h)", limit: 60, unit: "µg/m³", standard: "CONAMA 491/2018" },
      { parameter: "O₃ (8h)", limit: 140, unit: "µg/m³", standard: "CONAMA 491/2018" },
      { parameter: "CO (8h)", limit: 9, unit: "ppm", standard: "CONAMA 491/2018" },
      { parameter: "SO₂ (24h)", limit: 125, unit: "µg/m³", standard: "CONAMA 491/2018" },
      { parameter: "NO₂ (1h)", limit: 260, unit: "µg/m³", standard: "CONAMA 491/2018" },
    ],
  },
  colombia: {
    name: "Colombia - MinAmbiente",
    waterQuality: [
      { parameter: "pH", limit: "6.0 - 9.0", unit: "unidades", standard: "Resolución 0631 de 2015" },
      { parameter: "DBO₅ (Doméstico)", limit: 90, unit: "mg/L", standard: "Resolución 0631 de 2015" },
      { parameter: "DQO (Doméstico)", limit: 180, unit: "mg/L", standard: "Resolución 0631 de 2015" },
      { parameter: "SST", limit: 90, unit: "mg/L", standard: "Resolución 0631 de 2015" },
      { parameter: "Grasas y Aceites", limit: 20, unit: "mg/L", standard: "Resolución 0631 de 2015" },
    ],
    airQuality: [
      { parameter: "PM10 (24h)", limit: 75, unit: "µg/m³", standard: "Resolución 2254 de 2017" },
      { parameter: "PM2.5 (24h)", limit: 37, unit: "µg/m³", standard: "Resolución 2254 de 2017" },
      { parameter: "O₃ (8h)", limit: 100, unit: "µg/m³", standard: "Resolución 2254 de 2017" },
      { parameter: "CO (8h)", limit: 5000, unit: "µg/m³", standard: "Resolución 2254 de 2017" },
      { parameter: "SO₂ (24h)", limit: 50, unit: "µg/m³", standard: "Resolución 2254 de 2017" },
      { parameter: "NO₂ (1h)", limit: 200, unit: "µg/m³", standard: "Resolución 2254 de 2017" },
    ],
  },
  chile: {
    name: "Chile - MMA",
    waterQuality: [
      { parameter: "pH", limit: "6.0 - 8.5", unit: "unidades", standard: "D.S. N° 90/2000" },
      { parameter: "DBO₅", limit: 35, unit: "mg/L", standard: "D.S. N° 90/2000 (Aguas Fluviales)" },
      { parameter: "DQO", limit: 120, unit: "mg/L", standard: "D.S. N° 90/2000" },
      { parameter: "SST", limit: 80, unit: "mg/L", standard: "D.S. N° 90/2000" },
      { parameter: "Aceites y Grasas", limit: 20, unit: "mg/L", standard: "D.S. N° 90/2000" },
      { parameter: "Coliformes Fecales", limit: 1000, unit: "NMP/100mL", standard: "D.S. N° 90/2000" },
    ],
    airQuality: [
      { parameter: "PM10 (24h)", limit: 130, unit: "µg/m³", standard: "D.S. N° 12/2021 MMA" },
      { parameter: "PM2.5 (24h)", limit: 50, unit: "µg/m³", standard: "D.S. N° 12/2011 MMA" },
      { parameter: "SO₂ (24h)", limit: 150, unit: "µg/m³", standard: "D.S. N° 104/2018 MMA" },
      { parameter: "NO₂ (1h)", limit: 400, unit: "µg/m³", standard: "D.S. N° 114/2002 MINSEGPRES" },
      { parameter: "O₃ (8h)", limit: 120, unit: "µg/m³", standard: "D.S. N° 112/2002 MINSEGPRES" },
    ],
  },
  argentina: {
    name: "Argentina - Ambiente",
    waterQuality: [
      { parameter: "pH", limit: "6.5 - 8.5", unit: "unidades", standard: "Resolución ACUMAR 46/2017" },
      { parameter: "DBO₅", limit: 50, unit: "mg/L", standard: "Resolución ACUMAR 46/2017" },
      { parameter: "DQO", limit: 250, unit: "mg/L", standard: "Resolución ACUMAR 46/2017" },
      { parameter: "SST", limit: 50, unit: "mg/L", standard: "Resolución ACUMAR 46/2017" },
      { parameter: "Sustancias Grasas", limit: 30, unit: "mg/L", standard: "Resolución ACUMAR 46/2017" },
    ],
    airQuality: [
      { parameter: "PM10 (24h)", limit: 150, unit: "µg/m³", standard: "Ley Nacional 20.284 / Res. 174/2019" },
      { parameter: "PM2.5 (24h)", limit: 35, unit: "µg/m³", standard: "Resolución 174/2019" },
      { parameter: "CO (8h)", limit: 10, unit: "mg/m³", standard: "Ley Nacional 20.284" },
      { parameter: "NO₂ (1h)", limit: 400, unit: "µg/m³", standard: "Ley Nacional 20.284" },
      { parameter: "SO₂ (24h)", limit: 365, unit: "µg/m³", standard: "Ley Nacional 20.284" },
    ],
  },
  ecuador: {
    name: "Ecuador - TULSMA",
    waterQuality: [
      { parameter: "pH", limit: "6.0 - 9.0", unit: "unidades", standard: "TULSMA Libro VI Anexo 1" },
      { parameter: "DBO₅", limit: 100, unit: "mg/L", standard: "TULSMA Libro VI Tabla 9" },
      { parameter: "DQO", limit: 250, unit: "mg/L", standard: "TULSMA Libro VI Tabla 9" },
      { parameter: "SST", limit: 100, unit: "mg/L", standard: "TULSMA Libro VI Tabla 9" },
      { parameter: "Aceites y Grasas", limit: 30, unit: "mg/L", standard: "TULSMA Libro VI Tabla 9" },
      { parameter: "Coliformes Fecales", limit: 2000, unit: "NMP/100mL", standard: "TULSMA Libro VI Tabla 9" },
    ],
    airQuality: [
      { parameter: "PM10 (24h)", limit: 100, unit: "µg/m³", standard: "TULSMA Libro VI Anexo 4" },
      { parameter: "PM2.5 (24h)", limit: 50, unit: "µg/m³", standard: "TULSMA Libro VI Anexo 4" },
      { parameter: "O₃ (8h)", limit: 100, unit: "µg/m³", standard: "TULSMA Libro VI Anexo 4" },
      { parameter: "CO (8h)", limit: 10000, unit: "µg/m³", standard: "TULSMA Libro VI Anexo 4" },
      { parameter: "SO₂ (24h)", limit: 125, unit: "µg/m³", standard: "TULSMA Libro VI Anexo 4" },
      { parameter: "NO₂ (1h)", limit: 200, unit: "µg/m³", standard: "TULSMA Libro VI Anexo 4" },
    ],
  },
}
