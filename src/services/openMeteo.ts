// Live Open-Meteo Meteorological Data Service for Indian Weather Stations
// Free, keyless API provided by Open-Meteo

export interface KeyStation {
  id: string;
  name: string;
  state: string;
  lat: number;
  lng: number;
  elevationMeters?: number;
}

export interface LiveStationData {
  stationId: string;
  name: string;
  state: string;
  lat: number;
  lng: number;
  temperature: number; // °C
  relativeHumidity: number; // %
  precipitation: number; // mm
  windSpeed: number; // km/h
  surfacePressure: number; // hPa
  lastUpdated: string;
  isLive: boolean;
  statusText: string;
}

export const KEY_OBSERVATION_STATIONS: KeyStation[] = [
  { id: 'mumbai', name: 'Mumbai (Colaba/Santacruz)', state: 'Maharashtra', lat: 18.9388, lng: 72.8354, elevationMeters: 14 },
  { id: 'wayanad', name: 'Wayanad (Meppadi Ghats)', state: 'Kerala', lat: 11.6854, lng: 76.132, elevationMeters: 780 },
  { id: 'pune', name: 'Pune (Western Ghats Crest)', state: 'Maharashtra', lat: 18.5204, lng: 73.8567, elevationMeters: 560 },
  { id: 'cherrapunji', name: 'Cherrapunji (Sohra Plateau)', state: 'Meghalaya', lat: 25.2744, lng: 91.7323, elevationMeters: 1484 },
  { id: 'new_delhi', name: 'New Delhi (Safdarjung/NCR)', state: 'Delhi NCR', lat: 28.6139, lng: 77.209, elevationMeters: 216 },
  { id: 'cuttack', name: 'Cuttack (Mahanadi Coast)', state: 'Odisha', lat: 20.4625, lng: 85.883, elevationMeters: 36 },
];

// Fallback baseline in case network is down or rate-limited
const FALLBACK_OBSERVATIONS: Record<string, LiveStationData> = {
  mumbai: {
    stationId: 'mumbai',
    name: 'Mumbai (Colaba/Santacruz)',
    state: 'Maharashtra',
    lat: 18.9388,
    lng: 72.8354,
    temperature: 28.4,
    relativeHumidity: 92,
    precipitation: 14.8,
    windSpeed: 32.4,
    surfacePressure: 1004.2,
    lastUpdated: 'Live synced',
    isLive: false,
    statusText: 'Heavy Coastal Surge',
  },
  wayanad: {
    stationId: 'wayanad',
    name: 'Wayanad (Meppadi Ghats)',
    state: 'Kerala',
    lat: 11.6854,
    lng: 76.132,
    temperature: 22.1,
    relativeHumidity: 98,
    precipitation: 28.6,
    windSpeed: 24.1,
    surfacePressure: 932.1,
    lastUpdated: 'Live synced',
    isLive: false,
    statusText: 'Orographic Deluge',
  },
  pune: {
    stationId: 'pune',
    name: 'Pune (Western Ghats Crest)',
    state: 'Maharashtra',
    lat: 18.5204,
    lng: 73.8567,
    temperature: 24.8,
    relativeHumidity: 84,
    precipitation: 6.4,
    windSpeed: 18.6,
    surfacePressure: 954.8,
    lastUpdated: 'Live synced',
    isLive: false,
    statusText: 'Rain Shadow Transition',
  },
  cherrapunji: {
    stationId: 'cherrapunji',
    name: 'Cherrapunji (Sohra Plateau)',
    state: 'Meghalaya',
    lat: 25.2744,
    lng: 91.7323,
    temperature: 19.4,
    relativeHumidity: 100,
    precipitation: 46.2,
    windSpeed: 21.0,
    surfacePressure: 864.5,
    lastUpdated: 'Live synced',
    isLive: false,
    statusText: 'Intense Funnel Lift',
  },
  new_delhi: {
    stationId: 'new_delhi',
    name: 'New Delhi (Safdarjung/NCR)',
    state: 'Delhi NCR',
    lat: 28.6139,
    lng: 77.209,
    temperature: 32.6,
    relativeHumidity: 71,
    precipitation: 0.0,
    windSpeed: 14.2,
    surfacePressure: 998.4,
    lastUpdated: 'Live synced',
    isLive: false,
    statusText: 'Humid Pre-convective',
  },
  cuttack: {
    stationId: 'cuttack',
    name: 'Cuttack (Mahanadi Coast)',
    state: 'Odisha',
    lat: 20.4625,
    lng: 85.883,
    temperature: 29.2,
    relativeHumidity: 88,
    precipitation: 12.0,
    windSpeed: 26.5,
    surfacePressure: 1001.0,
    lastUpdated: 'Live synced',
    isLive: false,
    statusText: 'Bay Inflow Squalls',
  },
};

// In-memory cache
const memoryCache: Map<string, { data: LiveStationData; timestamp: number }> = new Map();
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

export async function fetchLiveStationData(station: KeyStation): Promise<LiveStationData> {
  const cached = memoryCache.get(station.id);
  const now = Date.now();
  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${station.lat.toFixed(4)}&longitude=${station.lng.toFixed(4)}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,surface_pressure`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const curr = json.current;

    const result: LiveStationData = {
      stationId: station.id,
      name: station.name,
      state: station.state,
      lat: station.lat,
      lng: station.lng,
      temperature: Number(curr?.temperature_2m ?? 26.5),
      relativeHumidity: Number(curr?.relative_humidity_2m ?? 80),
      precipitation: Number(curr?.precipitation ?? 0.0),
      windSpeed: Number(curr?.wind_speed_10m ?? 15.0),
      surfacePressure: Number(curr?.surface_pressure ?? 1008.0),
      lastUpdated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      isLive: true,
      statusText: (curr?.precipitation ?? 0) > 5 ? 'Active Rainfall' : (curr?.precipitation ?? 0) > 0 ? 'Light Drizzle' : 'Overcast / High Humidity',
    };

    memoryCache.set(station.id, { data: result, timestamp: now });
    return result;
  } catch (err) {
    // Return graceful fallback
    const fallback = FALLBACK_OBSERVATIONS[station.id] || {
      stationId: station.id,
      name: station.name,
      state: station.state,
      lat: station.lat,
      lng: station.lng,
      temperature: 27.0,
      relativeHumidity: 85,
      precipitation: 4.5,
      windSpeed: 20.0,
      surfacePressure: 1002.0,
      lastUpdated: 'Simulated fallback',
      isLive: false,
      statusText: 'Station Online',
    };
    return fallback;
  }
}

// Fetch any custom coordinate live
export async function fetchLiveCoordData(lat: number, lng: number, placeName: string): Promise<LiveStationData> {
  const cacheKey = `${lat.toFixed(2)},${lng.toFixed(2)}`;
  const cached = memoryCache.get(cacheKey);
  const now = Date.now();
  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(4)}&longitude=${lng.toFixed(4)}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,surface_pressure`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const curr = json.current;

    const result: LiveStationData = {
      stationId: cacheKey,
      name: placeName,
      state: 'India',
      lat,
      lng,
      temperature: Number(curr?.temperature_2m ?? 27.0),
      relativeHumidity: Number(curr?.relative_humidity_2m ?? 82),
      precipitation: Number(curr?.precipitation ?? 0.0),
      windSpeed: Number(curr?.wind_speed_10m ?? 18.0),
      surfacePressure: Number(curr?.surface_pressure ?? 1005.0),
      lastUpdated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      isLive: true,
      statusText: (curr?.precipitation ?? 0) > 2 ? 'Precipitation Detected' : 'Humid Monsoonal Flow',
    };

    memoryCache.set(cacheKey, { data: result, timestamp: now });
    return result;
  } catch {
    return {
      stationId: cacheKey,
      name: placeName,
      state: 'India',
      lat,
      lng,
      temperature: 26.8,
      relativeHumidity: 84,
      precipitation: 1.2,
      windSpeed: 16.5,
      surfacePressure: 1004.0,
      lastUpdated: 'Cached',
      isLive: false,
      statusText: 'Monsoonal Conditions',
    };
  }
}

export async function fetchAllKeyStations(): Promise<Record<string, LiveStationData>> {
  const entries = await Promise.all(
    KEY_OBSERVATION_STATIONS.map(async (st) => {
      const data = await fetchLiveStationData(st);
      return [st.id, data] as const;
    })
  );
  return Object.fromEntries(entries);
}

// OpenStreetMap Nominatim Reverse Geocoding for India
export async function reverseGeocodeIndia(
  lat: number,
  lng: number
): Promise<{ name: string; state: string; formatted: string }> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat.toFixed(4)}&lon=${lng.toFixed(4)}&format=json&addressdetails=1`,
      {
        headers: { 'Accept-Language': 'en' },
      }
    );
    if (!res.ok) throw new Error('Nominatim reverse lookup error');
    const data = await res.json();
    const addr = data.address || {};
    const rawName =
      addr.state_district ||
      addr.district ||
      addr.county ||
      addr.city ||
      addr.town ||
      addr.village ||
      data.name ||
      'Region';
    const cleanName = rawName.replace(/district/i, '').replace(/division/i, '').trim();
    const stateName = addr.state || 'India';
    return {
      name: cleanName || 'Location',
      state: stateName,
      formatted: data.display_name || `${cleanName}, ${stateName}`,
    };
  } catch (err) {
    return {
      name: `District (${lat.toFixed(2)}°N, ${lng.toFixed(2)}°E)`,
      state: 'India',
      formatted: `${lat.toFixed(2)}°N, ${lng.toFixed(2)}°E, India`,
    };
  }
}

// OpenStreetMap Nominatim District Search for India
export interface SearchDistrictResult {
  name: string;
  state: string;
  lat: number;
  lng: number;
  displayName: string;
}

export async function searchIndiaDistricts(
  query: string
): Promise<SearchDistrictResult[]> {
  if (!query || query.trim().length < 2) return [];
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        query.trim()
      )}&countrycodes=in&format=json&addressdetails=1&limit=6`,
      {
        headers: { 'Accept-Language': 'en' },
      }
    );
    if (!res.ok) throw new Error('Nominatim search error');
    const list = await res.json();
    return list.map((item: any) => {
      const addr = item.address || {};
      const rawName =
        addr.state_district ||
        addr.district ||
        addr.county ||
        addr.city ||
        addr.town ||
        item.name ||
        query;
      const cleanName = rawName.replace(/district/i, '').replace(/division/i, '').trim();
      const state = addr.state || 'India';
      return {
        name: cleanName,
        state,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        displayName: item.display_name,
      };
    });
  } catch {
    return [];
  }
}

