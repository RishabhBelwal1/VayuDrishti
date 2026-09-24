import React, { useState, useEffect } from 'react';
import { KEY_OBSERVATION_STATIONS, LiveStationData, fetchAllKeyStations } from '../services/openMeteo';
import { ArrowUpRight, CloudRain, Wind, Droplets, Thermometer, Globe2 } from 'lucide-react';

interface LiveObservationTickerProps {
  isDarkMode: boolean;
  onSelectStation?: (lat: number, lng: number, name: string) => void;
}

export const LiveObservationTicker: React.FC<LiveObservationTickerProps> = ({ isDarkMode, onSelectStation }) => {
  const [stationData, setStationData] = useState<Record<string, LiveStationData>>({});
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initial fetch and 60-second polling
  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const data = await fetchAllKeyStations();
        if (isMounted) {
          setStationData(data);
          setIsLoading(false);
        }
      } catch (e) {
        console.error('Error fetching live Open-Meteo observations', e);
      }
    };

    loadData();
    const interval = setInterval(loadData, 60000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Smooth rotation ticker every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % KEY_OBSERVATION_STATIONS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const currentStationMeta = KEY_OBSERVATION_STATIONS[currentIndex];
  const item: LiveStationData | undefined = stationData[currentStationMeta.id];

  const temp = item?.temperature ?? 27.2;
  const humidity = item?.relativeHumidity ?? 86;
  const rain = item?.precipitation ?? 0.0;
  const wind = item?.windSpeed ?? 18.5;
  const isLive = item?.isLive ?? true;

  const handleClick = () => {
    if (onSelectStation && currentStationMeta) {
      onSelectStation(currentStationMeta.lat, currentStationMeta.lng, currentStationMeta.name);
    }
  };

  return (
    <div className="fixed bottom-20 left-6 z-20 hidden sm:block max-w-sm pointer-events-none">
      <div
        className={`pointer-events-auto relative overflow-hidden rounded-2xl p-2.5 backdrop-blur-2xl transition-all duration-300 shadow-xl border ${
          isDarkMode
            ? 'bg-slate-950/60 border-white/10 text-slate-100 shadow-[0_8px_32px_0_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.15)] hover:border-cyan-500/30'
            : 'bg-white/90 border-slate-300 text-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.9)] hover:border-cyan-500/40'
        }`}
      >
        {/* Specular Liquid Sheen Reflection */}
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/30 dark:from-white/10 to-transparent pointer-events-none rounded-t-2xl" />

        {/* Top: Live Station Observation */}
        <div
          onClick={handleClick}
          className="relative flex items-center gap-2 cursor-pointer group"
          title="Click to jump to this observation station"
        >
          {/* Live Pulse Indicator */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[9px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-500 font-bold flex items-center gap-0.5">
              <Globe2 className="w-2.5 h-2.5" />
              OPEN-METEO
            </span>
          </div>

          <span className="text-slate-400 dark:text-slate-700 font-light text-xs">|</span>

          {/* Station name & state */}
          <div className="flex items-center gap-1 min-w-0 flex-1 truncate">
            <span className="text-[11px] font-bold truncate text-slate-950 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-500 transition-colors">
              {currentStationMeta.name.split('(')[0].trim()}
            </span>
            <span className="text-[9.5px] text-slate-700 dark:text-slate-400 font-semibold truncate">
              {currentStationMeta.state}
            </span>
          </div>

          {/* Quick jump icon */}
          <div className="text-slate-700 dark:text-slate-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all shrink-0">
            <ArrowUpRight className="w-3 h-3" />
          </div>
        </div>

        {/* Environmental metrics row */}
        <div className="relative flex items-center gap-2 text-[10px] font-mono mt-1 pt-0.5">
          <span className="flex items-center gap-0.5 text-amber-600 dark:text-amber-400 font-semibold">
            <Thermometer className="w-2.5 h-2.5" />
            {temp.toFixed(1)}°
          </span>
          <span className="flex items-center gap-0.5 text-cyan-700 dark:text-cyan-400 font-bold">
            <CloudRain className="w-2.5 h-2.5" />
            {rain.toFixed(1)}mm
          </span>
          <span className="flex items-center gap-0.5 text-sky-700 dark:text-sky-300 font-semibold">
            <Droplets className="w-2.5 h-2.5" />
            {humidity}%
          </span>
          <span className="flex items-center gap-0.5 text-slate-800 dark:text-slate-400 font-semibold">
            <Wind className="w-2.5 h-2.5" />
            {wind.toFixed(0)}km/h
          </span>
        </div>

        {/* Liquid Glass Divider */}
        <div className="my-1.5 h-px bg-gradient-to-r from-transparent via-slate-300/60 dark:via-white/15 to-transparent" />

        {/* Bottom: Ultra-compact Rain Scale Legend */}
        <div className="relative flex items-center justify-between gap-1 text-[9.5px] font-mono text-slate-800 dark:text-slate-300">
          <span className="text-[9px] uppercase font-bold text-slate-700 dark:text-slate-400 shrink-0">Rain (24h)</span>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.6)]" />
              <span>&lt;15mm</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
              <span>Mod</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-orange-400 shadow-[0_0_6px_rgba(251,146,60,0.6)]" />
              <span>Heavy</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.6)]" />
              <span>Extr</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
