/**
 * VayuSena API Service & Mock Data Contract
 * Conforms strictly to backend schema specifications.
 */

export const CPCB_AQI_BANDS = {
  GOOD: { min: 0, max: 50, label: 'Good', color: '#a8e05f', textColor: '#166534', bgLight: '#f4fbe9' },
  SATISFACTORY: { min: 51, max: 100, label: 'Satisfactory', color: '#fff833', textColor: '#854d0e', bgLight: '#fefde8' },
  MODERATE: { min: 101, max: 200, label: 'Moderate', color: '#f29c33', textColor: '#9a3412', bgLight: '#fff7ed' },
  POOR: { min: 201, max: 300, label: 'Poor', color: '#f33734', textColor: '#991b1b', bgLight: '#fef2f2' },
  VERY_POOR: { min: 301, max: 400, label: 'Very Poor', color: '#a070b6', textColor: '#581c87', bgLight: '#faf5ff' },
  SEVERE: { min: 401, max: 500, label: 'Severe', color: '#7e0424', textColor: '#450a0a', bgLight: '#fdf2f4' }
};

export function getAqiBand(aqi) {
  const num = Number(aqi) || 0;
  if (num <= 50) return CPCB_AQI_BANDS.GOOD;
  if (num <= 100) return CPCB_AQI_BANDS.SATISFACTORY;
  if (num <= 200) return CPCB_AQI_BANDS.MODERATE;
  if (num <= 300) return CPCB_AQI_BANDS.POOR;
  if (num <= 400) return CPCB_AQI_BANDS.VERY_POOR;
  return CPCB_AQI_BANDS.SEVERE;
}

export function getSeverityBand(severityText) {
  const normalized = (severityText || '').toLowerCase().replace(/[^a-z]/g, '');
  if (normalized.includes('severe')) return CPCB_AQI_BANDS.SEVERE;
  if (normalized.includes('verypoor')) return CPCB_AQI_BANDS.VERY_POOR;
  if (normalized.includes('poor')) return CPCB_AQI_BANDS.POOR;
  if (normalized.includes('mod')) return CPCB_AQI_BANDS.MODERATE;
  if (normalized.includes('satis')) return CPCB_AQI_BANDS.SATISFACTORY;
  return CPCB_AQI_BANDS.GOOD;
}

// Initial Mock Dataset matching JSON contract
export const initialMockStats = {
  currentAqi: 301,
  aqiCategory: "Very Poor",
  activeHotspots: 187,
  forecastAlert: "Spike expected in 2 days",
  modelR2: 0.86,
  lastUpdated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  pollutant: "PM2.5",
  pollutantValue: "168.4 µg/m³",
  windVector: "NW → SE @ 18 km/h",
  punjabHotspots: 142,
  haryanaHotspots: 45
};

export const initialMockHotspots = {
  hotspots: [
    { id: "HS-01", lat: 31.63, lng: 74.87, intensity: "high", district: "Amritsar", state: "Punjab", frp: 94.2, count: 28 },
    { id: "HS-02", lat: 31.32, lng: 75.57, intensity: "high", district: "Jalandhar", state: "Punjab", frp: 78.5, count: 24 },
    { id: "HS-03", lat: 30.90, lng: 75.85, intensity: "high", district: "Ludhiana", state: "Punjab", frp: 91.0, count: 35 },
    { id: "HS-04", lat: 30.33, lng: 76.38, intensity: "medium", district: "Patiala", state: "Punjab", frp: 54.6, count: 18 },
    { id: "HS-05", lat: 30.21, lng: 74.95, intensity: "high", district: "Bathinda", state: "Punjab", frp: 83.4, count: 22 },
    { id: "HS-06", lat: 30.23, lng: 75.84, intensity: "high", district: "Sangrur", state: "Punjab", frp: 88.0, count: 31 },
    { id: "HS-07", lat: 30.70, lng: 75.17, intensity: "medium", district: "Moga", state: "Punjab", frp: 46.8, count: 14 },
    { id: "HS-08", lat: 29.68, lng: 76.99, intensity: "medium", district: "Karnal", state: "Haryana", frp: 49.3, count: 16 },
    { id: "HS-09", lat: 29.39, lng: 76.97, intensity: "medium", district: "Panipat", state: "Haryana", frp: 41.5, count: 12 },
    { id: "HS-10", lat: 29.80, lng: 76.40, intensity: "medium", district: "Kaithal", state: "Haryana", frp: 43.1, count: 15 },
    { id: "HS-11", lat: 29.15, lng: 75.72, intensity: "low", district: "Hisar", state: "Haryana", frp: 24.2, count: 7 },
    { id: "HS-12", lat: 28.89, lng: 76.60, intensity: "low", district: "Rohtak", state: "Haryana", frp: 18.7, count: 5 }
  ],
  cities: [
    { name: "Delhi-NCR", lat: 28.61, lng: 77.21, type: "receptor", aqi: 301, role: "Primary Receptor Zone" },
    { name: "Amritsar", lat: 31.63, lng: 74.87, type: "source", aqi: 195, role: "Agricultural Cluster" },
    { name: "Ludhiana", lat: 30.90, lng: 75.85, type: "source", aqi: 245, role: "Industrial & Agricultural Hub" },
    { name: "Patiala", lat: 30.33, lng: 76.38, type: "source", aqi: 220, role: "Southern Punjab Hub" },
    { name: "Karnal", lat: 29.68, lng: 76.99, type: "corridor", aqi: 265, role: "GT Road Transport Corridor" },
    { name: "Hisar", lat: 29.15, lng: 75.72, type: "corridor", aqi: 188, role: "Western Haryana Hub" }
  ],
  wind: {
    origin: "North-West (Punjab Plains)",
    destination: "South-East (Delhi-NCR)",
    speed: "18 km/h",
    directionDeg: 135,
    transportSpeedHours: "14-18 hrs transit to NCR"
  }
};

export const initialMockForecast = {
  actual: [
    { date: "2026-08-28", displayDate: "Aug 28", aqi: 172, category: "Moderate", pm25: 82, temp: "31°C", wind: "11 km/h" },
    { date: "2026-08-29", displayDate: "Aug 29", aqi: 188, category: "Moderate", pm25: 89, temp: "30°C", wind: "10 km/h" },
    { date: "2026-08-30", displayDate: "Aug 30", aqi: 215, category: "Poor", pm25: 108, temp: "29°C", wind: "13 km/h" },
    { date: "2026-08-31", displayDate: "Aug 31", aqi: 242, category: "Poor", pm25: 126, temp: "28°C", wind: "15 km/h" },
    { date: "2026-09-01", displayDate: "Sep 01", aqi: 268, category: "Poor", pm25: 144, temp: "28°C", wind: "16 km/h" },
    { date: "2026-09-02", displayDate: "Sep 02", aqi: 285, category: "Poor", pm25: 156, temp: "27°C", wind: "17 km/h" },
    { date: "2026-09-03", displayDate: "Today", aqi: 301, category: "Very Poor", pm25: 168, temp: "27°C", wind: "18 km/h" }
  ],
  predicted: [
    { date: "2026-09-03", displayDate: "Today", aqi: 301, category: "Very Poor", ciLower: 290, ciUpper: 312, confidence: "94%" },
    { date: "2026-09-04", displayDate: "Tomorrow (+1d)", aqi: 348, category: "Very Poor", ciLower: 326, ciUpper: 370, confidence: "90%" },
    { date: "2026-09-05", displayDate: "+2 Days", aqi: 392, category: "Very Poor", ciLower: 362, ciUpper: 422, confidence: "86%" },
    { date: "2026-09-06", displayDate: "+3 Days", aqi: 424, category: "Severe", ciLower: 388, ciUpper: 460, confidence: "81%" }
  ],
  modelMeta: {
    r2: 0.86,
    modelName: "Spatiotemporal Atmospheric Dispersion + XGBoost Ensemble",
    features: ["VIIRS FRP", "ERA5 Wind Vectors", "Boundary Layer Height", "Lagged PM2.5", "Relative Humidity"]
  }
};

export const initialMockAlerts = [
  {
    id: "ALT-2026-0901",
    date: "2026-09-03 22:45",
    district: "Delhi-NCR (Anand Vihar / Bawana)",
    predictedAqi: 392,
    severity: "Very Poor",
    status: "Active",
    sourceCluster: "Sangrur & Patiala Stubble Inflow",
    recommendation: "Issue GRAP Stage-III Pre-emptive Trigger"
  },
  {
    id: "ALT-2026-0902",
    date: "2026-09-03 21:15",
    district: "Karnal - Panipat Downwind Axis",
    predictedAqi: 348,
    severity: "Very Poor",
    status: "Active",
    sourceCluster: "Kaithal & Kurukshetra Plume",
    recommendation: "Alert Highway Patrol for Low Visibility"
  },
  {
    id: "ALT-2026-0903",
    date: "2026-09-03 19:30",
    district: "Ludhiana - Sangrur Agricultural Belt",
    predictedAqi: 295,
    severity: "Poor",
    status: "Dispatched",
    sourceCluster: "35 Farm Fire Triggers Detected",
    recommendation: "Deploy District Agriculture In-situ Teams"
  },
  {
    id: "ALT-2026-0904",
    date: "2026-09-03 17:00",
    district: "Bathinda - Mansa Rural Zone",
    predictedAqi: 275,
    severity: "Poor",
    status: "Dispatched",
    sourceCluster: "22 VIIRS Thermal Anomalies",
    recommendation: "Direct CRM Machinery & Straw Balers"
  },
  {
    id: "ALT-2026-0905",
    date: "2026-09-03 14:10",
    district: "Noida - Greater Noida NCR Sector",
    predictedAqi: 310,
    severity: "Very Poor",
    status: "Acknowledged",
    sourceCluster: "Cross-border dispersion trajectory",
    recommendation: "Activate Anti-smog Guns & Water Sprinklers"
  },
  {
    id: "ALT-2026-0906",
    date: "2026-09-02 20:00",
    district: "Gurugram - Manesar Industrial Belt",
    predictedAqi: 260,
    severity: "Poor",
    status: "Resolved",
    sourceCluster: "Transient Local + Inflow Load",
    recommendation: "Enforce strict diesel generator ban"
  }
];

// Realistic simulation generator for live demo button
const simulationLocations = [
  { district: "Tarn Taran - Amritsar Rural", predictedAqi: 365, severity: "Very Poor", sourceCluster: "High FRP Fire Cluster Detected", recommendation: "Trigger Immediate Mobile Firefighter Unit" },
  { district: "Delhi-NCR (Dwarka & IGI Airport)", predictedAqi: 415, severity: "Severe", sourceCluster: "Downwind Plume Convergence", recommendation: "Pre-alert Aviation & Health Services" },
  { district: "Fatehabad - Sirsa Corridor", predictedAqi: 320, severity: "Very Poor", sourceCluster: "Evening Post-Harvest Burning", recommendation: "Coordinate Inter-district Flying Squad" },
  { district: "Ghaziabad - Vasundhara Axis", predictedAqi: 405, severity: "Severe", sourceCluster: "Stagnant Boundary Layer + Plume", recommendation: "Enforce Construction & Demolition Moratorium" }
];

let simCounter = 1;

export function generateSimulatedAlert() {
  const template = simulationLocations[(simCounter - 1) % simulationLocations.length];
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const dateStr = `2026-09-03 ${timeStr}`;

  const newAlert = {
    id: `ALT-LIVE-${1000 + simCounter}`,
    date: dateStr,
    district: template.district,
    predictedAqi: template.predictedAqi,
    severity: template.severity,
    status: "Active",
    sourceCluster: template.sourceCluster,
    recommendation: template.recommendation,
    isNew: true
  };

  simCounter++;
  return newAlert;
}

// API Fetch Helper with mock fallback & FastAPI live toggle support
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function fetchStats() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/stats`, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error('Network error');
    return await res.json();
  } catch (err) {
    return initialMockStats;
  }
}

export async function fetchHotspots() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/hotspots`, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error('Network error');
    return await res.json();
  } catch (err) {
    return initialMockHotspots;
  }
}

export async function fetchForecast() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/forecast`, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error('Network error');
    return await res.json();
  } catch (err) {
    return initialMockForecast;
  }
}

export async function fetchAlerts() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/alerts`, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error('Network error');
    return await res.json();
  } catch (err) {
    return { alerts: initialMockAlerts };
  }
}

export async function broadcastCustomAlert(payload) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/alerts/custom`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error('Network error');
    return await res.json();
  } catch (err) {
    console.error("Failed to broadcast alert:", err);
    throw err;
  }
}
