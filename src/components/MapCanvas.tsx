import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import { BasemapLayerId, DistrictForecast, LeadTime, SupportedLanguage } from '../types/meteo';
import { districtsList, basemapLayersConfig } from '../data/mockData';
import { translations } from '../i18n/translations';
import {
  fetchLiveCoordData,
  reverseGeocodeIndia,
  searchIndiaDistricts,
  SearchDistrictResult,
} from '../services/openMeteo';
import { buildDynamicDistrictForecast } from '../services/dynamicDistrict';
import {
  Maximize2,
  Minimize2,
  SplitSquareVertical,
  Search,
  Loader2,
  MapPin,
  X,
} from 'lucide-react';

interface MapCanvasProps {
  leadTime: LeadTime;
  activeDistrict: DistrictForecast | null;
  onSelectDistrict: (district: DistrictForecast) => void;
  lang: SupportedLanguage;
  isDarkMode: boolean;
  onMapInteracting?: (isInteracting: boolean) => void;
  whatIfShift?: {
    troughLat: number;
    shear850: number;
  };
  activeBasemap?: BasemapLayerId;
  displayMode?: DisplayMode;
  radarOpacity?: number;
  showClouds?: boolean;
  showLightning?: boolean;
  showWindFlow?: boolean;
  onToggleWindFlow?: (val: boolean) => void;
  targetCenter?: {
    lat: number;
    lng: number;
    zoom: number;
    key?: string;
  } | null;
}

export type DisplayMode = 'split' | 'ai' | 'raw' | 'delta';
export type BlendMode = 'screen' | 'overlay' | 'normal' | 'multiply';

// -------------------------------------------------------------
// AUTHENTIC MONSOON WIND VECTOR FIELD ENGINE
// Realistic meteorological vector calculation:
// 1. Arabian Sea Surge (Low-Level Somali Jet): SW to NE toward Western Ghats
// 2. Bay of Bengal Branch: S to N curving WNW into Gangetic Valley
// 3. Monsoon Trough: Easterly / ESE flow along trough axis
// -------------------------------------------------------------
interface WindVector {
  u: number;
  v: number;
  speed: number;
}

interface WindParticle {
  lat: number;
  lng: number;
  age: number;
  maxAge: number;
  prevX: number | null;
  prevY: number | null;
  speed: number;
}

function getMonsoonWindVector(
  lat: number,
  lng: number,
  troughLat: number = 22.8,
  shear850: number = 18.2
): WindVector {
  const shearFactor = Math.max(0.65, Math.min(1.55, shear850 / 18.2));

  // 1. Arabian Sea Surge (Low-Level Jet): Fast SW flow toward Western Ghats (Kerala, Karnataka, Goa, Maharashtra)
  if (lng <= 77.2 && lat <= 23.5) {
    const latFactor = (lat - 8) / 15;
    const angle = 0.52 + latFactor * 0.16; // ~30° to 39° (Southwest to Northeast)
    const baseSpeed = (2.2 + Math.sin(lat * 0.4) * 0.35) * shearFactor;
    return {
      u: Math.cos(angle) * baseSpeed,
      v: Math.sin(angle) * baseSpeed,
      speed: baseSpeed,
    };
  }

  // 2. Gangetic Plains & Monsoon Trough Belt (East-Southeast to West-Northwest)
  const distToTrough = lat - troughLat;
  if (Math.abs(distToTrough) <= 3.8 && lng >= 74.0 && lng <= 90.0) {
    const progress = (lng - 74.0) / 16.0; // 0 in Delhi, 1 in Bengal
    const angle = Math.PI - 0.25 - (1 - progress) * 0.15; // heading WNW
    const baseSpeed = (1.6 + progress * 0.5) * shearFactor;
    return {
      u: Math.cos(angle) * baseSpeed,
      v: Math.sin(angle) * baseSpeed,
      speed: baseSpeed,
    };
  }

  // 3. Bay of Bengal Branch (South-to-North, curving WNW at Head Bay)
  if (lng >= 81.0 && lat <= troughLat) {
    if (lat >= 19.0) {
      // Head Bay curvature: curving from South-North to West-Northwest toward Odisha/Bengal
      const turnFactor = (lat - 19.0) / 4.0;
      const angle = Math.PI / 2 + turnFactor * 0.95; // turning from 90° (North) toward 145° (NW)
      const baseSpeed = 1.95 * shearFactor;
      return {
        u: Math.cos(angle) * baseSpeed,
        v: Math.sin(angle) * baseSpeed,
        speed: baseSpeed,
      };
    } else {
      // Open Bay of Bengal: strong south-to-north flow with slight eastward curvature
      const angle = 1.35 + Math.sin((lat - 10) * 0.2) * 0.12;
      const baseSpeed = (1.8 + Math.cos(lat * 0.3) * 0.3) * shearFactor;
      return {
        u: Math.cos(angle) * baseSpeed,
        v: Math.sin(angle) * baseSpeed,
        speed: baseSpeed,
      };
    }
  }

  // 4. Northeast India / Assam Valley (Orographic channeling)
  if (lat >= 24.0 && lng >= 88.0) {
    const angle = 0.45;
    const baseSpeed = 1.6 * shearFactor;
    return {
      u: Math.cos(angle) * baseSpeed,
      v: Math.sin(angle) * baseSpeed,
      speed: baseSpeed,
    };
  }

  // 5. Peninsular Plateau (Interior Karnataka, Andhra, Vidarbha)
  if (lat <= troughLat && lng > 77.2 && lng < 82.0) {
    const baseSpeed = 1.5 * shearFactor;
    return {
      u: 0.95 * baseSpeed,
      v: 0.25 * baseSpeed,
      speed: baseSpeed,
    };
  }

  // 6. Northwest / Rajasthan / Himalayan foothills
  if (lat > troughLat) {
    const baseSpeed = 1.3 * shearFactor;
    return {
      u: -0.9 * baseSpeed,
      v: 0.35 * baseSpeed,
      speed: baseSpeed,
    };
  }

  // Background monsoon flow
  return {
    u: 1.2 * shearFactor,
    v: 0.7 * shearFactor,
    speed: 1.4 * shearFactor,
  };
}

// Key Indian Cities for temperature badges
const KEY_CITY_BADGES = [
  { name: 'Shimla', lat: 31.1048, lng: 77.1734, temp: '16°' },
  { name: 'Delhi NCR', lat: 28.6139, lng: 77.209, temp: '32°' },
  { name: 'Mumbai', lat: 19.076, lng: 72.8777, temp: '29°' },
  { name: 'Hyderabad', lat: 17.385, lng: 78.4867, temp: '26°' },
  { name: 'Nagpur', lat: 21.1458, lng: 79.0882, temp: '29°' },
  { name: 'New Delhi', lat: 28.6139, lng: 77.209, temp: '32°' },
  { name: 'Kolkata', lat: 22.5726, lng: 88.3639, temp: '28°' },
  { name: 'Bengaluru', lat: 12.9716, lng: 77.5946, temp: '24°' },
  { name: 'Chennai', lat: 13.0827, lng: 80.2707, temp: '30°' },
  { name: 'Wayanad', lat: 11.6854, lng: 76.132, temp: '22°' },
  { name: 'Cherrapunji', lat: 25.2744, lng: 91.7323, temp: '20°' },
  { name: 'Ahmedabad', lat: 23.0225, lng: 72.5714, temp: '27°' },
  { name: 'Pune', lat: 18.5204, lng: 73.8567, temp: '25°' },
  { name: 'Bhubaneswar', lat: 20.2961, lng: 85.8245, temp: '28°' },
  { name: 'Lucknow', lat: 26.8467, lng: 80.9462, temp: '31°' },
  { name: 'Jaipur', lat: 26.9124, lng: 75.7873, temp: '25°' },
  { name: 'Patna', lat: 25.5941, lng: 85.1376, temp: '28°' },
  { name: 'Bhopal', lat: 23.2599, lng: 77.4126, temp: '27°' },
];

// Active Convective Storm Pockets for Static / Gently Glowing Lightning Strikes
const LIGHTNING_HOTSPOTS = [
  { name: 'Nagpur Convective Core', lat: 21.25, lng: 79.15 },
  { name: 'Hyderabad Cluster', lat: 17.45, lng: 78.55 },
  { name: 'Bay of Bengal Deep Squall', lat: 19.35, lng: 87.2 },
  { name: 'Bay of Bengal Outer Band', lat: 18.1, lng: 88.6 },
  { name: 'Raipur Convective Storm', lat: 21.2, lng: 81.7 },
  { name: 'Meghalaya Plateau Escarpment', lat: 25.32, lng: 91.65 },
  { name: 'Vidarbha-Wardha Cell', lat: 20.75, lng: 78.6 },
  { name: 'Wayanad Ghats Crest', lat: 11.65, lng: 76.05 },
];

// Realistic Satellite Cloud Decks (Zoom Earth / INSAT-3D Style)
// Soft, billowing semi-translucent cloud masses covering the Western Ghats, Central India, and the Bay of Bengal
const SATELLITE_CLOUD_DECKS = [
  // 1. Western Ghats Coastal Belt & Eastern Arabian Sea
  { lat: 9.6, lng: 76.0, radiusDeg: 2.2, opacity: 0.65 },
  { lat: 11.8, lng: 75.6, radiusDeg: 2.5, opacity: 0.70 },
  { lat: 13.8, lng: 74.5, radiusDeg: 2.8, opacity: 0.72 },
  { lat: 15.6, lng: 73.8, radiusDeg: 2.6, opacity: 0.68 },
  { lat: 17.4, lng: 73.2, radiusDeg: 2.7, opacity: 0.70 },
  { lat: 19.2, lng: 72.8, radiusDeg: 2.8, opacity: 0.72 },
  { lat: 20.6, lng: 72.6, radiusDeg: 2.2, opacity: 0.60 },
  // Offshore Arabian Sea Monsoon Plume
  { lat: 13.2, lng: 71.8, radiusDeg: 3.2, opacity: 0.55 },
  { lat: 16.5, lng: 70.8, radiusDeg: 3.5, opacity: 0.58 },

  // 2. Central India Monsoon Trough Belt & Vidarbha
  { lat: 20.6, lng: 76.8, radiusDeg: 3.0, opacity: 0.62 },
  { lat: 21.2, lng: 79.1, radiusDeg: 3.6, opacity: 0.75 },
  { lat: 22.4, lng: 78.6, radiusDeg: 3.2, opacity: 0.65 },
  { lat: 23.2, lng: 76.9, radiusDeg: 2.8, opacity: 0.60 },
  { lat: 21.4, lng: 81.6, radiusDeg: 3.4, opacity: 0.72 },
  { lat: 22.2, lng: 83.4, radiusDeg: 3.2, opacity: 0.68 },
  { lat: 21.2, lng: 85.5, radiusDeg: 3.0, opacity: 0.65 },

  // 3. Head Bay of Bengal Cyclonic Curl & Gangetic Delta
  { lat: 17.2, lng: 86.2, radiusDeg: 4.2, opacity: 0.62 },
  { lat: 19.4, lng: 87.8, radiusDeg: 4.5, opacity: 0.74 },
  { lat: 21.5, lng: 88.6, radiusDeg: 3.5, opacity: 0.68 },
  { lat: 22.6, lng: 89.4, radiusDeg: 3.2, opacity: 0.65 },
  { lat: 18.2, lng: 83.8, radiusDeg: 2.8, opacity: 0.58 },

  // 4. Northeast Orographic Barrier & Assam Valley
  { lat: 25.3, lng: 91.8, radiusDeg: 2.6, opacity: 0.75 },
  { lat: 26.2, lng: 92.8, radiusDeg: 2.8, opacity: 0.68 },
  { lat: 27.2, lng: 94.0, radiusDeg: 2.5, opacity: 0.62 },
];

export const MapCanvas: React.FC<MapCanvasProps> = ({
  leadTime,
  activeDistrict,
  onSelectDistrict,
  lang,
  isDarkMode,
  onMapInteracting,
  whatIfShift,
  activeBasemap = 'satellite',
  displayMode = 'ai',
  radarOpacity = 0.88,
  showClouds = true,
  showLightning = true,
  showWindFlow = true,
  onToggleWindFlow,
  targetCenter,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const windCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const cityBadgesLayerRef = useRef<L.LayerGroup | null>(null);
  const currentTileLayerRef = useRef<L.Layer | null>(null);
  const clickRippleMarkerRef = useRef<L.CircleMarker | null>(null);

  // Map state
  const [splitPercent, setSplitPercent] = useState<number>(50);
  const [isDraggingSplit, setIsDraggingSplit] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Wind flow streamline toggle state (controlled with local fallback)
  const [localWindFlow, setLocalWindFlow] = useState<boolean>(true);
  const isWindActive = onToggleWindFlow !== undefined ? (showWindFlow ?? true) : localWindFlow;
  const handleToggleWind = () => {
    if (onToggleWindFlow) {
      onToggleWindFlow(!isWindActive);
    } else {
      setLocalWindFlow(!isWindActive);
    }
  };

  // Live District Search Bar State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchDistrictResult[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState<boolean>(false);

  const t = translations[lang] || translations.en;

  // Stable callback refs to prevent map tear-down on every state change
  const onSelectDistrictRef = useRef(onSelectDistrict);
  useEffect(() => {
    onSelectDistrictRef.current = onSelectDistrict;
  }, [onSelectDistrict]);

  const onMapInteractingRef = useRef(onMapInteracting);
  useEffect(() => {
    onMapInteractingRef.current = onMapInteracting;
  }, [onMapInteracting]);

  // 1. Initialize Full-Screen Leaflet Map centered on India [19.2, 78.8]
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [19.2, 78.8],
      zoom: 5,
      minZoom: 4,
      maxZoom: 13,
      zoomControl: false,
      attributionControl: false,
      dragging: true,
      touchZoom: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      boxZoom: true,
      inertia: true,
      inertiaDeceleration: 3000,
    });

    // Add zoom control at bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Initial tile layer: ESRI World Imagery + Reference
    const esriImagery = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      { maxZoom: 19 }
    );
    const esriBoundaries = L.tileLayer(
      'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
      { maxZoom: 19, opacity: 0.75 }
    );
    const satelliteGroup = L.layerGroup([esriImagery, esriBoundaries]);
    satelliteGroup.addTo(map);
    currentTileLayerRef.current = satelliteGroup;

    // Layer groups for markers & city temperature badges
    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;

    const cityBadgesLayer = L.layerGroup().addTo(map);
    cityBadgesLayerRef.current = cityBadgesLayer;

    // Map interaction events for dynamic auto-hiding navbar
    map.on('dragstart', () => onMapInteractingRef.current?.(true));
    map.on('dragend', () => onMapInteractingRef.current?.(false));
    map.on('movestart', () => onMapInteractingRef.current?.(true));
    map.on('moveend', () => onMapInteractingRef.current?.(false));

    // COMPLETE DISTRICT COVERAGE: Map-Wide Click Listener (map.on('click'))
    map.on('click', async (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;

      // Restrict to broader Indian Subcontinent bounds [lat 6-38, lng 66-98]
      if (lat < 6.0 || lat > 37.5 || lng < 66.0 || lng > 98.0) return;

      // Add immediate visual feedback ripple marker at clicked coordinates
      if (clickRippleMarkerRef.current && map.hasLayer(clickRippleMarkerRef.current)) {
        map.removeLayer(clickRippleMarkerRef.current);
        clickRippleMarkerRef.current = null;
      }

      const ripple = L.circleMarker([lat, lng], {
        radius: 12,
        color: '#06b6d4',
        weight: 3,
        fillColor: '#22d3ee',
        fillOpacity: 0.65,
      }).addTo(map);
      clickRippleMarkerRef.current = ripple;

      setIsFetchingLocation(true);

      try {
        const geo = await reverseGeocodeIndia(lat, lng);
        const liveObs = await fetchLiveCoordData(lat, lng, geo.name);
        const dyn = buildDynamicDistrictForecast(lat, lng, geo.name, geo.state, liveObs);
        onSelectDistrictRef.current?.(dyn);
      } catch (err) {
        console.error('Error handling map click:', err);
      } finally {
        setIsFetchingLocation(false);
      }
    });

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Smoothly center and zoom map when a historical preset or target center is requested
  useEffect(() => {
    if (!targetCenter) return;
    const map = mapInstanceRef.current;
    if (map && (map as any)._loaded && (map as any)._mapPane) {
      map.flyTo([targetCenter.lat, targetCenter.lng], targetCenter.zoom, {
        duration: 1.4,
      });
    }
  }, [targetCenter?.lat, targetCenter?.lng, targetCenter?.zoom, targetCenter?.key]);

  // 2. Dynamic Basemap Switcher
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (currentTileLayerRef.current) {
      map.removeLayer(currentTileLayerRef.current);
    }

    if (activeBasemap === 'satellite') {
      const esriImagery = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 19 }
      );
      const esriBoundaries = L.tileLayer(
        'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 19, opacity: 0.75 }
      );
      const satelliteGroup = L.layerGroup([esriImagery, esriBoundaries]);
      satelliteGroup.addTo(map);
      currentTileLayerRef.current = satelliteGroup;
    } else if (activeBasemap === 'topographic') {
      const topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        maxZoom: 17,
        subdomains: 'abc',
      });
      topo.addTo(map);
      currentTileLayerRef.current = topo;
    } else if (activeBasemap === 'dark') {
      const dark = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        {
          maxZoom: 19,
          subdomains: 'abcd',
        }
      );
      dark.addTo(map);
      currentTileLayerRef.current = dark;
    }
  }, [activeBasemap]);

  // 3. Render City Temperature Badges
  useEffect(() => {
    const map = mapInstanceRef.current;
    const badgesGroup = cityBadgesLayerRef.current;
    if (!map || !badgesGroup) return;

    badgesGroup.clearLayers();

    KEY_CITY_BADGES.forEach((city) => {
      const badgeHtml = `
        <div class="cursor-pointer group select-none">
          <div class="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border font-mono text-xs transition-transform duration-150 hover:scale-110 active:scale-95 ${
            isDarkMode
              ? 'bg-slate-950/90 text-white border-white/20 shadow-lg shadow-black/80'
              : 'bg-white text-slate-950 border-slate-300 shadow-md shadow-slate-900/25 ring-1 ring-slate-900/10'
          }" style="${isDarkMode ? 'text-shadow: 0 1px 2px rgba(0,0,0,0.9);' : ''}">
            <span class="font-extrabold ${isDarkMode ? 'text-cyan-400' : 'text-cyan-700'}">${city.temp}</span>
            <span class="font-bold font-sans tracking-tight text-[11px] ${isDarkMode ? 'text-slate-100' : 'text-slate-950'}">${city.name}</span>
          </div>
        </div>
      `;

      const badgeIcon = L.divIcon({
        html: badgeHtml,
        className: 'city-temperature-badge',
        iconSize: [92, 28],
        iconAnchor: [46, 14],
      });

      const marker = L.marker([city.lat, city.lng], { icon: badgeIcon });
      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        const match = districtsList.find((d) => d.name.toLowerCase() === city.name.toLowerCase());
        if (match) {
          setTimeout(() => {
            onSelectDistrictRef.current?.(match);
          }, 0);
        } else {
          setIsFetchingLocation(true);
          fetchLiveCoordData(city.lat, city.lng, city.name)
            .then((live) => {
              const dyn = buildDynamicDistrictForecast(city.lat, city.lng, city.name, 'India', live);
              setTimeout(() => {
                onSelectDistrictRef.current?.(dyn);
              }, 0);
            })
            .catch((err) => console.error('Failed to fetch city weather:', err))
            .finally(() => setIsFetchingLocation(false));
        }
      });

      badgesGroup.addLayer(marker);
    });
  }, [isDarkMode]);

  // 4. Render Operational District Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    districtsList.forEach((district) => {
      const forecast = district.rainfalls[leadTime];
      const isSelected = activeDistrict?.id === district.id;

      const riskColors: Record<string, { pulse: string; border: string; bg: string }> = {
        red: { pulse: 'bg-red-500', border: 'border-red-500', bg: 'bg-red-600' },
        orange: { pulse: 'bg-orange-500', border: 'border-orange-500', bg: 'bg-orange-600' },
        yellow: { pulse: 'bg-yellow-400', border: 'border-yellow-400', bg: 'bg-yellow-500' },
        green: { pulse: 'bg-emerald-400', border: 'border-emerald-400', bg: 'bg-emerald-500' },
      };

      const color = riskColors[forecast.riskLevel] || riskColors.green;

      const iconHtml = `
        <div class="group relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2 cursor-pointer">
          ${
            forecast.riskLevel === 'red' || forecast.riskLevel === 'orange'
              ? `<span class="animate-ping absolute inline-flex h-6 w-6 rounded-full ${color.pulse} opacity-70"></span>`
              : ''
          }
          
          <div class="relative flex items-center justify-center w-4 h-4 rounded-full border-2 ${
            isSelected ? 'border-white ring-4 ring-cyan-400 scale-125' : color.border
          } ${color.bg} shadow-md transition-all duration-150">
            <span class="w-1 h-1 rounded-full bg-white"></span>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-district-marker',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });

      const marker = L.marker([district.lat, district.lng], { icon: customIcon });
      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        setTimeout(() => {
          onSelectDistrictRef.current?.(district);
        }, 0);
      });

      markersGroup.addLayer(marker);
    });
  }, [leadTime, activeDistrict?.id]);

  // 5. Debounced District Search input handler (Nominatim API)
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const results = await searchIndiaDistricts(searchQuery);
        setSearchResults(results);
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelectSearchResult = async (result: SearchDistrictResult) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);

    const map = mapInstanceRef.current;
    if (map && (map as any)._loaded && (map as any)._mapPane) {
      map.flyTo([result.lat, result.lng], 9, { duration: 1.2 });
    }

    setIsFetchingLocation(true);
    try {
      const liveObs = await fetchLiveCoordData(result.lat, result.lng, result.name);
      const dyn = buildDynamicDistrictForecast(result.lat, result.lng, result.name, result.state, liveObs);
      onSelectDistrictRef.current?.(dyn);
    } catch (err) {
      console.error('Error fetching search result coordinates:', err);
    } finally {
      setIsFetchingLocation(false);
    }
  };

  // 6. REALISTIC SATELLITE CLOUDS & BLUE RADAR VISUAL ENGINE (60 FPS, ZERO LAG)
  // Matching Zoom Earth satellite radar imagery:
  // - Soft, organic semi-translucent white/light-grey cloud decks
  // - Nested bright cyan and electric-blue precipitation pockets (#38bdf8 to #0284c7)
  // - Small static/glowing yellow lightning strike indicators
  // - Redrawn on map move/zoom and prop change with 0% CPU consumption when idle
  const renderCanvasOverlay = useCallback(() => {
    const canvas = canvasRef.current;
    const map = mapInstanceRef.current;
    if (!canvas || !map || !(map as any)._loaded || !(map as any)._mapPane) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    if (width === 0 || height === 0) return;
    ctx.clearRect(0, 0, width, height);

    // Latitudinal adjustment from what-if synoptic scenario
    const latShift = (whatIfShift?.troughLat ?? 22.8) - 22.8;

    // Helper: Project Geo Coordinates to Screen Pixels (Safely guarded)
    const toPx = (lat: number, lng: number) => {
      try {
        const pt = map.latLngToContainerPoint([lat, lng]);
        return { x: pt.x, y: pt.y };
      } catch {
        return { x: -9999, y: -9999 };
      }
    };

    const zoom = map.getZoom();
    const zoomScale = Math.pow(1.25, Math.max(0, zoom - 5));
    const splitX = (width * splitPercent) / 100;

    // -------------------------------------------------------------
    // A. SATELLITE CLOUD DECKS: Soft, organic billowing white/grey clouds
    // -------------------------------------------------------------
    const drawSatelliteClouds = (clipRegion?: { minX: number; maxX: number }) => {
      if (!showClouds) return;
      ctx.save();

      if (clipRegion) {
        ctx.beginPath();
        ctx.rect(clipRegion.minX, 0, clipRegion.maxX - clipRegion.minX, height);
        ctx.clip();
      }

      SATELLITE_CLOUD_DECKS.forEach((deck, idx) => {
        const centerLat = deck.lat + latShift * 0.25;
        const center = toPx(centerLat, deck.lng);

        // Geographically accurate radius scaling with zoom
        const edgePt = toPx(centerLat + deck.radiusDeg, deck.lng);
        const radius = Math.max(50, Math.abs(edgePt.y - center.y));

        // Skip if outside viewport bounds
        if (
          center.x + radius < -50 ||
          center.x - radius > width + 50 ||
          center.y + radius < -50 ||
          center.y - radius > height + 50
        ) {
          return;
        }

        // 1. Soft diffuse cloud underbelly (cool silver/light-blue tone)
        const underbelly = ctx.createRadialGradient(center.x, center.y, 0, center.x, center.y, radius);
        underbelly.addColorStop(0, `rgba(225, 236, 248, ${deck.opacity * 0.45})`);
        underbelly.addColorStop(0.55, `rgba(205, 222, 238, ${deck.opacity * 0.25})`);
        underbelly.addColorStop(0.85, `rgba(190, 210, 230, ${deck.opacity * 0.10})`);
        underbelly.addColorStop(1, 'rgba(190, 210, 230, 0)');

        ctx.fillStyle = underbelly;
        ctx.beginPath();
        ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
        ctx.fill();

        // 2. Flowing white cumulus billow top
        const cloudTop = ctx.createRadialGradient(
          center.x - radius * 0.12,
          center.y - radius * 0.12,
          0,
          center.x,
          center.y,
          radius * 0.82
        );
        cloudTop.addColorStop(0, `rgba(255, 255, 255, ${deck.opacity * 0.72})`);
        cloudTop.addColorStop(0.38, `rgba(246, 250, 255, ${deck.opacity * 0.52})`);
        cloudTop.addColorStop(0.75, `rgba(232, 242, 252, ${deck.opacity * 0.24})`);
        cloudTop.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = cloudTop;
        ctx.beginPath();
        ctx.arc(center.x, center.y, radius * 0.82, 0, Math.PI * 2);
        ctx.fill();

        // 3. Organic sub-puff for non-uniform natural cloud structure
        const subOffsetAngle = (idx * 1.35) % (Math.PI * 2);
        const subDist = radius * 0.38;
        const subX = center.x + Math.cos(subOffsetAngle) * subDist;
        const subY = center.y + Math.sin(subOffsetAngle) * subDist;
        const subR = radius * 0.58;

        const subGrad = ctx.createRadialGradient(subX, subY, 0, subX, subY, subR);
        subGrad.addColorStop(0, `rgba(255, 255, 255, ${deck.opacity * 0.58})`);
        subGrad.addColorStop(0.65, `rgba(240, 248, 255, ${deck.opacity * 0.26})`);
        subGrad.addColorStop(1, 'rgba(240, 248, 255, 0)');

        ctx.fillStyle = subGrad;
        ctx.beginPath();
        ctx.arc(subX, subY, subR, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();
    };

    // -------------------------------------------------------------
    // B. DOPPLER RADAR RAIN CORES (ZOOM EARTH STYLE)
    // Nested inside the white clouds:
    // Bright cyan (#38bdf8) & electric deep-blue (#0284c7)
    // Heavy rain: orange/crimson core surrounded by deep blue and cyan
    // -------------------------------------------------------------
    const drawRadarRainCores = (
      mode: 'ai' | 'raw',
      clipRegion?: { minX: number; maxX: number }
    ) => {
      ctx.save();
      if (clipRegion) {
        ctx.beginPath();
        ctx.rect(clipRegion.minX, 0, clipRegion.maxX - clipRegion.minX, height);
        ctx.clip();
      }

      districtsList.forEach((d) => {
        const forecast = d.rainfalls[leadTime];
        const val = mode === 'ai' ? forecast.aiCorrected : forecast.rawNwp;
        if (val < 3) return;

        // Position coordinates (raw model is displaced eastward onto rain shadow)
        const isGhats = d.zone === 'Western Ghats';
        const targetLat = mode === 'ai' ? d.lat + latShift * 0.15 : d.lat + latShift * 0.4;
        const targetLng = mode === 'ai' ? d.lng : isGhats ? d.lng + 0.65 : d.lng + 0.2;

        const center = toPx(targetLat, targetLng);
        // Realistic radius scaling with rain intensity & zoom factor
        const baseRadius = mode === 'ai' ? val * 0.65 : val * 0.95;
        const radius = Math.min(190, Math.max(30, baseRadius * zoomScale));

        const grad = ctx.createRadialGradient(center.x, center.y, 0, center.x, center.y, radius);

        // Authentic Zoom Earth Doppler Radar Palette:
        // Extreme (>150mm): White-hot / crimson center + electric deep blue + bright cyan
        // Heavy (>65mm): Deep blue core + electric cyan
        // Moderate (>25mm): Azure / deep cyan core
        // Light: Bright cyan (#38bdf8)
        if (val > 150) {
          grad.addColorStop(0, 'rgba(255, 255, 255, 0.96)'); // White-hot convective center
          grad.addColorStop(0.22, 'rgba(220, 38, 38, 0.92)'); // Crimson core
          grad.addColorStop(0.48, 'rgba(2, 132, 199, 0.88)'); // Electric deep blue (#0284c7)
          grad.addColorStop(0.82, 'rgba(56, 189, 248, 0.72)'); // Bright cyan (#38bdf8)
          grad.addColorStop(1, 'rgba(56, 189, 248, 0)');
        } else if (val > 65) {
          grad.addColorStop(0, 'rgba(2, 132, 199, 0.92)'); // Electric deep blue (#0284c7)
          grad.addColorStop(0.45, 'rgba(14, 165, 233, 0.82)'); // Azure blue (#0ea5e9)
          grad.addColorStop(0.82, 'rgba(56, 189, 248, 0.68)'); // Bright cyan (#38bdf8)
          grad.addColorStop(1, 'rgba(56, 189, 248, 0)');
        } else if (val > 25) {
          grad.addColorStop(0, 'rgba(2, 132, 199, 0.82)'); // Deep blue
          grad.addColorStop(0.55, 'rgba(56, 189, 248, 0.70)'); // Bright cyan (#38bdf8)
          grad.addColorStop(1, 'rgba(56, 189, 248, 0)');
        } else {
          grad.addColorStop(0, 'rgba(56, 189, 248, 0.70)'); // Bright cyan (#38bdf8)
          grad.addColorStop(0.65, 'rgba(56, 189, 248, 0.35)');
          grad.addColorStop(1, 'rgba(56, 189, 248, 0)');
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();
    };

    // -------------------------------------------------------------
    // C. CONVECTIVE LIGHTNING STRIKES (ZERO-LAG STATIC / GLOWING DOTS)
    // Small glowing yellow dots with faint halos in active storm zones (Nagpur, Hyderabad, etc.)
    // -------------------------------------------------------------
    const drawConvectiveLightning = (clipRegion?: { minX: number; maxX: number }) => {
      if (!showLightning) return;
      ctx.save();

      if (clipRegion) {
        ctx.beginPath();
        ctx.rect(clipRegion.minX, 0, clipRegion.maxX - clipRegion.minX, height);
        ctx.clip();
      }

      LIGHTNING_HOTSPOTS.forEach((spot) => {
        const pt = toPx(spot.lat, spot.lng);

        // Skip if outside screen
        if (pt.x < -10 || pt.x > width + 10 || pt.y < -10 || pt.y > height + 10) return;

        // Faint glowing outer halo
        const haloRadius = 10;
        const haloGrad = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, haloRadius);
        haloGrad.addColorStop(0, 'rgba(250, 204, 21, 0.48)');
        haloGrad.addColorStop(0.45, 'rgba(250, 204, 21, 0.20)');
        haloGrad.addColorStop(1, 'rgba(250, 204, 21, 0)');

        ctx.fillStyle = haloGrad;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, haloRadius, 0, Math.PI * 2);
        ctx.fill();

        // Brilliant yellow center dot: #fef08a / #facc15
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 2.6, 0, Math.PI * 2);
        ctx.fill();

        // Crisp white central glint point
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 1.2, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();
    };

    // -------------------------------------------------------------
    // D. RENDER BY DISPLAY MODE
    // -------------------------------------------------------------
    if (displayMode === 'split') {
      // 1. Satellite clouds over entire visible region
      drawSatelliteClouds();

      // 2. Left: Old Model NWP Forecast
      drawRadarRainCores('raw', { minX: 0, maxX: splitX });

      // 3. Right: AI-Fixed Rain Cores
      drawRadarRainCores('ai', { minX: splitX, maxX: width });

      // 4. Lightning strikes across convective zones
      drawConvectiveLightning();

      // 5. Vertical comparison divider line
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.lineWidth = 2;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 4;
      ctx.beginPath();
      ctx.moveTo(splitX, 0);
      ctx.lineTo(splitX, height);
      ctx.stroke();
      ctx.restore();
    } else if (displayMode === 'ai') {
      drawSatelliteClouds();
      drawRadarRainCores('ai');
      drawConvectiveLightning();
    } else if (displayMode === 'raw') {
      drawSatelliteClouds();
      drawRadarRainCores('raw');
      drawConvectiveLightning();
    } else if (displayMode === 'delta') {
      drawSatelliteClouds();
      // Forecast Difference: Green for AI Amplified, Amber for AI Attenuated
      districtsList.forEach((d) => {
        const forecast = d.rainfalls[leadTime];
        const delta = forecast.aiCorrected - forecast.rawNwp;
        const center = toPx(d.lat, d.lng);
        const radius = Math.min(95, Math.max(28, Math.abs(delta) * 0.9 * zoomScale));

        const grad = ctx.createRadialGradient(center.x, center.y, 0, center.x, center.y, radius);
        if (delta > 0) {
          grad.addColorStop(0, 'rgba(16, 185, 129, 0.85)');
          grad.addColorStop(0.6, 'rgba(56, 189, 248, 0.45)');
          grad.addColorStop(1, 'rgba(56, 189, 248, 0)');
        } else {
          grad.addColorStop(0, 'rgba(244, 63, 94, 0.85)');
          grad.addColorStop(0.6, 'rgba(251, 146, 60, 0.40)');
          grad.addColorStop(1, 'rgba(251, 146, 60, 0)');
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
        ctx.fill();
      });
      drawConvectiveLightning();
    }
  }, [
    leadTime,
    displayMode,
    splitPercent,
    whatIfShift,
    showClouds,
    showLightning,
  ]);

  // Synchronize Canvas with Leaflet Map on Pan, Zoom, and Resize (Instant 60 FPS, Zero Freeze)
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = mapContainerRef.current;
      if (!canvas || !container) return;

      const rect = container.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        if (canvas.width !== Math.floor(rect.width) || canvas.height !== Math.floor(rect.height)) {
          canvas.width = Math.floor(rect.width);
          canvas.height = Math.floor(rect.height);
        }
        renderCanvasOverlay();
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const map = mapInstanceRef.current;
    if (map) {
      map.on('move', renderCanvasOverlay);
      map.on('zoom', renderCanvasOverlay);
      map.on('viewreset', renderCanvasOverlay);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mapInstanceRef.current && (mapInstanceRef.current as any)._mapPane) {
        try {
          mapInstanceRef.current.off('move', renderCanvasOverlay);
          mapInstanceRef.current.off('zoom', renderCanvasOverlay);
          mapInstanceRef.current.off('viewreset', renderCanvasOverlay);
        } catch {
          // Ignore if map already disposed
        }
      }
    };
  }, [renderCanvasOverlay]);

  // Redraw when dependencies change
  useEffect(() => {
    renderCanvasOverlay();
  }, [renderCanvasOverlay]);

  // -------------------------------------------------------------
  // 7. AUTHENTIC 60 FPS NON-BLOCKING MONSOON WIND STREAMLINE ENGINE
  // Windy.com / Zoom Earth style:
  // - 250 ultra-thin (1.2px) animated streamline streaks
  // - Continuous fading tail trail: destination-out + rgba(0,0,0,0.08)
  // - Color transition: translucent white to vibrant sky-cyan in fast currents
  // - Instant re-projection and canvas clear on map move/zoom
  // - Guaranteed 0% CPU when toggled OFF or tab invisible
  // -------------------------------------------------------------
  useEffect(() => {
    const canvas = windCanvasRef.current;
    const map = mapInstanceRef.current;
    if (!canvas || !map) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (!isWindActive) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    const PARTICLE_COUNT = 250;
    const particles: WindParticle[] = [];

    const seedParticle = (p: WindParticle, isInitial: boolean = false) => {
      let south = 6.5;
      let north = 36.5;
      let west = 66.0;
      let east = 96.0;

      try {
        if ((map as any)._loaded && (map as any)._mapPane) {
          const b = map.getBounds();
          south = Math.max(6.0, b.getSouth() - 0.5);
          north = Math.min(38.0, b.getNorth() + 0.5);
          west = Math.max(64.0, b.getWest() - 0.5);
          east = Math.min(98.0, b.getEast() + 0.5);
        }
      } catch {
        // Fallback default bounds
      }

      p.lat = south + Math.random() * (north - south);
      p.lng = west + Math.random() * (east - west);
      p.maxAge = Math.floor(45 + Math.random() * 45); // 45-90 frames
      p.age = isInitial ? Math.floor(Math.random() * p.maxAge) : 0;
      p.prevX = null;
      p.prevY = null;
      p.speed = 1.5;
    };

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p: WindParticle = {
        lat: 0,
        lng: 0,
        age: 0,
        maxAge: 60,
        prevX: null,
        prevY: null,
        speed: 1.5,
      };
      seedParticle(p, true);
      particles.push(p);
    }

    let animationFrameId: number;

    const resizeWindCanvas = () => {
      const container = mapContainerRef.current;
      if (!canvas || !container) return;
      const rect = container.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        if (canvas.width !== Math.floor(rect.width) || canvas.height !== Math.floor(rect.height)) {
          canvas.width = Math.floor(rect.width);
          canvas.height = Math.floor(rect.height);
          for (let i = 0; i < particles.length; i++) {
            particles[i].prevX = null;
            particles[i].prevY = null;
          }
        }
      }
    };

    resizeWindCanvas();

    const handleMapMovement = () => {
      if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      for (let i = 0; i < particles.length; i++) {
        particles[i].prevX = null;
        particles[i].prevY = null;
      }
    };

    map.on('movestart', handleMapMovement);
    map.on('move', handleMapMovement);
    map.on('zoomstart', handleMapMovement);
    map.on('zoom', handleMapMovement);
    map.on('viewreset', handleMapMovement);

    const animate = () => {
      if (!canvas || !ctx || !mapInstanceRef.current) return;

      const width = canvas.width;
      const height = canvas.height;
      if (width === 0 || height === 0) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      // Smooth trail fading effect (Zoom Earth / Windy.com hair-like trails)
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      const troughLat = whatIfShift?.troughLat ?? 22.8;
      const shear850 = whatIfShift?.shear850 ?? 18.2;
      const zoom = map.getZoom();
      const degPerPx = 360 / (256 * Math.pow(2, zoom));

      let south = 6.0;
      let north = 38.0;
      let west = 64.0;
      let east = 98.0;

      try {
        const b = map.getBounds();
        south = b.getSouth() - 1.0;
        north = b.getNorth() + 1.0;
        west = b.getWest() - 1.0;
        east = b.getEast() + 1.0;
      } catch {
        // use default bounds
      }

      ctx.lineWidth = 1.2;
      ctx.lineCap = 'round';

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        let pt: { x: number; y: number };
        try {
          const lPt = map.latLngToContainerPoint([p.lat, p.lng]);
          pt = { x: lPt.x, y: lPt.y };
        } catch {
          seedParticle(p);
          continue;
        }

        if (p.prevX !== null && p.prevY !== null) {
          const inScreen =
            pt.x >= -30 && pt.x <= width + 30 && pt.y >= -30 && pt.y <= height + 30;

          if (inScreen) {
            const dx = pt.x - p.prevX;
            const dy = pt.y - p.prevY;
            const distSq = dx * dx + dy * dy;

            if (distSq < 1600) {
              let strokeColor = 'rgba(255, 255, 255, 0.45)';
              if (p.speed > 2.0) {
                strokeColor = 'rgba(56, 189, 248, 0.72)';
              } else if (p.speed > 1.5) {
                strokeColor = 'rgba(125, 211, 252, 0.58)';
              }

              ctx.strokeStyle = strokeColor;
              ctx.beginPath();
              ctx.moveTo(p.prevX, p.prevY);
              ctx.lineTo(pt.x, pt.y);
              ctx.stroke();
            }
          }
        }

        p.prevX = pt.x;
        p.prevY = pt.y;

        const vec = getMonsoonWindVector(p.lat, p.lng, troughLat, shear850);
        p.speed = vec.speed;

        const pxStep = 1.5 * vec.speed;
        const degStep = pxStep * degPerPx;

        p.lat += vec.v * degStep;
        p.lng += vec.u * degStep;
        p.age++;

        if (
          p.age >= p.maxAge ||
          p.lat < south ||
          p.lat > north ||
          p.lng < west ||
          p.lng > east
        ) {
          seedParticle(p);
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    window.addEventListener('resize', resizeWindCanvas);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeWindCanvas);
      if (mapInstanceRef.current && (mapInstanceRef.current as any)._mapPane) {
        try {
          map.off('movestart', handleMapMovement);
          map.off('move', handleMapMovement);
          map.off('zoomstart', handleMapMovement);
          map.off('zoom', handleMapMovement);
          map.off('viewreset', handleMapMovement);
        } catch {
          // ignore
        }
      }
      if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
  }, [isWindActive, whatIfShift?.troughLat, whatIfShift?.shear850]);

  // Fluid Draggable Comparison Slider Handling
  const handleSplitStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingSplit(true);
  };

  useEffect(() => {
    const handleMove = (clientX: number) => {
      if (!isDraggingSplit || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(10, Math.min(rect.width - 10, clientX - rect.left));
      const pct = (x / rect.width) * 100;
      setSplitPercent(pct);
    };

    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) handleMove(e.touches[0].clientX);
    };

    const onEnd = () => {
      if (isDraggingSplit) setIsDraggingSplit(false);
    };

    if (isDraggingSplit) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onEnd);
      window.addEventListener('touchmove', onTouchMove);
      window.addEventListener('touchend', onEnd);
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onEnd);
    };
  }, [isDraggingSplit]);

  // Toggle Fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden select-none">
      {/* 1. Fullscreen Leaflet Base Map (Unblocked, immediate touch & mouse pan/zoom) */}
      <div
        ref={mapContainerRef}
        className="absolute inset-0 w-full h-full z-0 pointer-events-auto touch-auto cursor-grab active:cursor-grabbing"
      />

      {/* 2. HTML5 Canvas Satellite Cloud & Doppler Radar Layer (Guaranteed pointer-events-none) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        style={{
          pointerEvents: 'none',
          mixBlendMode: 'screen',
          opacity: radarOpacity,
        }}
      />

      {/* 2b. HTML5 Canvas Authentic Wind Flow Animation Layer (Windy.com / Zoom Earth style) */}
      <canvas
        ref={windCanvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-[400]"
        style={{
          pointerEvents: 'none',
        }}
      />

      {/* 3. Draggable Comparison Divider & Labels (When in split mode) */}
      {displayMode === 'split' && (
        <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
          {/* Draggable Divider Handle */}
          <div
            className="absolute top-0 bottom-0 w-10 -translate-x-1/2 flex items-center justify-center cursor-ew-resize group touch-none pointer-events-auto"
            style={{ left: `${splitPercent}%` }}
            onMouseDown={handleSplitStart}
            onTouchStart={handleSplitStart}
          >
            <div className="w-1 h-full bg-white/90 shadow-[0_0_8px_rgba(0,0,0,0.6)] group-hover:bg-cyan-400 transition-colors pointer-events-none" />
            <div
              className={`absolute p-2.5 rounded-full backdrop-blur-2xl border shadow-xl group-hover:scale-110 group-hover:border-cyan-400 transition-all flex items-center justify-center pointer-events-auto ${
                isDarkMode
                  ? 'bg-slate-950/80 border-white/20 text-white shadow-black/80'
                  : 'bg-white/95 border-slate-300 text-slate-900 shadow-md'
              }`}
            >
              <SplitSquareVertical className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            </div>
          </div>

          {/* Left Side Label: Standard NWP (GFS) (Clean minimalist text, no box/pill) */}
          <span
            className="absolute left-4 top-20 sm:top-24 pointer-events-none select-none text-[11px] sm:text-xs font-semibold tracking-wider uppercase text-amber-400 dark:text-amber-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] z-20"
            style={{ textShadow: '0 1px 3px rgba(0,0,0,0.95), 0 0 1px rgba(0,0,0,0.95)' }}
          >
            Standard NWP (GFS)
          </span>

          {/* Right Side Label: Calibrated Forecast (Clean minimalist text, no box/pill) */}
          <span
            className="absolute right-4 top-20 sm:top-24 pointer-events-none select-none text-[11px] sm:text-xs font-semibold tracking-wider uppercase text-cyan-400 dark:text-cyan-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] z-20 text-right"
            style={{ textShadow: '0 1px 3px rgba(0,0,0,0.95), 0 0 1px rgba(0,0,0,0.95)' }}
          >
            Calibrated Forecast
          </span>
        </div>
      )}

      {/* 4. Top Floating District Search Bar */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 transition-all duration-300 w-72 sm:w-80 pointer-events-auto">
        <div className="relative w-full">
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-2xl shadow-xl backdrop-blur-2xl border transition-all ${
              isDarkMode
                ? 'bg-slate-950/85 border-white/15 text-white'
                : 'bg-white/95 border-slate-300 text-slate-900 shadow-md'
            }`}
          >
            {isFetchingLocation || isSearching ? (
              <Loader2 className="w-4 h-4 text-cyan-500 animate-spin shrink-0" />
            ) : (
              <Search className="w-4 h-4 text-slate-600 dark:text-slate-400 shrink-0" />
            )}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              placeholder="Search district or city..."
              className="w-full bg-transparent text-xs font-semibold text-slate-950 dark:text-white focus:outline-none placeholder:text-slate-500 dark:placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSearchResults([]);
                }}
                className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Autocomplete Results Dropdown */}
          {isSearchOpen && searchResults.length > 0 && (
            <div
              className={`absolute top-full left-0 right-0 mt-1.5 rounded-2xl shadow-2xl border overflow-hidden backdrop-blur-2xl z-40 transition-all ${
                isDarkMode ? 'bg-slate-950/95 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'
              }`}
            >
              <div className="p-1.5 space-y-0.5 max-h-60 overflow-y-auto text-xs">
                {searchResults.map((res, i) => (
                  <button
                    key={`${res.lat}_${res.lng}_${i}`}
                    onClick={() => handleSelectSearchResult(res)}
                    className="w-full text-left px-3 py-2 rounded-xl flex items-center justify-between hover:bg-cyan-500/15 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <MapPin className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-500 shrink-0" />
                      <span className="font-bold truncate text-slate-950 dark:text-white">{res.name}</span>
                      <span className="text-slate-700 dark:text-slate-400 text-[11px] truncate font-medium">{res.state}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-600 dark:text-slate-400 ml-2 shrink-0 font-medium">
                      {res.lat.toFixed(2)}°N
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 5. Bottom Right Floating Controls (Wind Flow Toggle Pill & Fullscreen) */}
      <div className="absolute bottom-6 right-16 z-[410] flex items-center gap-2 pointer-events-auto">
        {/* Subtle Wind Flow Toggle Pill */}
        <button
          onClick={handleToggleWind}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl shadow-xl backdrop-blur-xl border text-xs font-semibold transition-all cursor-pointer pointer-events-auto select-none ${
            isDarkMode
              ? 'bg-slate-950/85 border-white/15 text-slate-200 hover:border-cyan-500/40 hover:text-white'
              : 'bg-white/95 border-slate-300 text-slate-900 hover:border-cyan-600 shadow-md'
          }`}
          title={isWindActive ? 'Pause animated wind streamlines' : 'Enable authentic monsoon wind flow'}
          aria-label="Toggle wind flow streamlines"
        >
          <span className="text-sm leading-none">🌬️</span>
          <span className="hidden sm:inline font-bold">Wind Flow</span>
          <span
            className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold transition-colors ${
              isWindActive
                ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/40'
                : isDarkMode
                ? 'bg-slate-800 text-slate-400 border border-slate-700'
                : 'bg-slate-200 text-slate-600 border border-slate-300'
            }`}
          >
            {isWindActive ? 'ON' : 'OFF'}
          </span>
        </button>

        {/* Fullscreen Button */}
        <button
          onClick={toggleFullscreen}
          className={`p-2.5 rounded-2xl shadow-xl backdrop-blur-xl border transition-all cursor-pointer pointer-events-auto ${
            isDarkMode
              ? 'bg-slate-950/85 border-white/15 text-slate-300 hover:text-white hover:bg-slate-900'
              : 'bg-white/95 border-slate-300 text-slate-900 hover:text-black shadow-md'
          }`}
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          aria-label="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
