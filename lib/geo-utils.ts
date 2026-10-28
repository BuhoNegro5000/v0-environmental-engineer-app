/**
 * Utilidades geoespaciales y telemetría de campo para Laboratorio Ambiental by GREEN OWL LABS.
 * Conversión de coordenadas WGS84 a UTM (Zonas 17S, 18S, 19S para Perú y Sudamérica)
 * y formateo de sellos técnicos para evidencia en campo.
 */

export interface GeoLocationState {
  latitude: number
  longitude: number
  altitude: number | null
  accuracy: number | null
  heading: number | null
  speed: number | null
  timestamp: number
  utmZone?: string
  utmEasting?: number
  utmNorthing?: number
}

/**
 * Convierte latitud y longitud WGS84 a coordenadas UTM (Proyección Universal Transversa de Mercator)
 */
export function latLngToUtm(lat: number, lng: number): { zone: string; easting: number; northing: number } {
  const a = 6378137.0 // Semi-eje mayor WGS84
  const f = 1 / 298.257223563 // Aplanamiento
  const b = a * (1 - f) // Semi-eje menor
  const e2 = (a * a - b * b) / (a * a) // Excentricidad al cuadrado
  const ePrime2 = (a * a - b * b) / (b * b) // Segunda excentricidad al cuadrado

  const latRad = (lat * Math.PI) / 180
  const lngRad = (lng * Math.PI) / 180

  const zoneNumber = Math.floor((lng + 180) / 6) + 1
  const hemisphere = lat >= 0 ? "N" : "S"
  const zone = `${zoneNumber}${hemisphere}`

  const centralMeridianLng = (zoneNumber - 1) * 6 - 180 + 3
  const centralMeridianRad = (centralMeridianLng * Math.PI) / 180

  const k0 = 0.9996 // Factor de escala en meridiano central

  const N = a / Math.sqrt(1 - e2 * Math.sin(latRad) * Math.sin(latRad))
  const T = Math.tan(latRad) * Math.tan(latRad)
  const C = ePrime2 * Math.cos(latRad) * Math.cos(latRad)
  const A = Math.cos(latRad) * (lngRad - centralMeridianRad)

  // Longitud de arco meridiano
  const M =
    a *
    ((1 - e2 / 4 - (3 * e2 * e2) / 64 - (5 * e2 * e2 * e2) / 256) * latRad -
      ((3 * e2) / 8 + (3 * e2 * e2) / 32 + (45 * e2 * e2 * e2) / 1024) * Math.sin(2 * latRad) +
      ((15 * e2 * e2) / 256 + (45 * e2 * e2 * e2) / 1024) * Math.sin(4 * latRad) -
      ((35 * e2 * e2 * e2) / 3072) * Math.sin(6 * latRad))

  const easting =
    k0 *
      N *
      (A +
        ((1 - T + C) * A * A * A) / 6 +
        ((5 - 18 * T + T * T + 72 * C - 58 * ePrime2) * A * A * A * A * A) / 120) +
    500000.0

  let northing =
    k0 *
    (M +
      N *
        Math.tan(latRad) *
        ((A * A) / 2 +
          ((5 - T + 9 * C + 4 * C * C) * A * A * A * A) / 24 +
          ((61 - 58 * T + T * T + 600 * C - 330 * ePrime2) * A * A * A * A * A * A) / 720))

  if (lat < 0) {
    northing += 10000000.0 // Falso norte para hemisferio sur
  }

  return {
    zone,
    easting: Math.round(easting),
    northing: Math.round(northing),
  }
}

/**
 * Formatea coordenadas en Grados, Minutos, Segundos (DMS)
 */
export function formatDms(lat: number, lng: number): string {
  const formatCoord = (deg: number, isLat: boolean) => {
    const direction = isLat ? (deg >= 0 ? "N" : "S") : deg >= 0 ? "E" : "W"
    const abs = Math.abs(deg)
    const d = Math.floor(abs)
    const minFloat = (abs - d) * 60
    const m = Math.floor(minFloat)
    const s = ((minFloat - m) * 60).toFixed(1)
    return `${d}°${m}'${s}"${direction}`
  }

  return `${formatCoord(lat, true)} ${formatCoord(lng, false)}`
}
