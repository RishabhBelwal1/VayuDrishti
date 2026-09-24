import React, { useState, useEffect, useRef } from 'react';
import { AppView, SupportedLanguage, BasemapLayerId } from '../types/meteo';
import { translations } from '../i18n/translations';
import { basemapLayersConfig } from '../data/mockData';
import { HISTORICAL_PRESETS, HistoricalPreset } from '../data/historicalPresets';
import { DisplayMode, BlendMode } from './MapCanvas';
import {
  Menu,
  Sun,
  Moon,
  Globe,
  Radio,
  Clock,
  Layers,
  ShieldAlert,
  BarChart3,
  MapPin,
  Sliders,
  ChevronDown,
  Check,
  CloudRain,
  Zap,
  X,
  Sparkles,
} from 'lucide-react';

interface DynamicNavbarProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  lang: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenWhatIf?: () => void;
  confidence?: number;
  onSelectPreset?: (preset: HistoricalPreset) => void;
  // Map layers controls (controlled from right-side toggle)
  activeBasemap: BasemapLayerId;
  onSelectBasemap: (id: BasemapLayerId) => void;
  displayMode: DisplayMode;
  onSelectDisplayMode: (mode: DisplayMode) => void;
  radarOpacity: number;
  onChangeRadarOpacity: (val: number) => void;
  showClouds: boolean;
  onToggleClouds: (val: boolean) => void;
  showLightning: boolean;
  onToggleLightning: (val: boolean) => void;
  showWindFlow?: boolean;
  onToggleWindFlow?: (val: boolean) => void;
}

const languages: { code: SupportedLanguage; label: string; nativeName: string }[] = [
  { code: 'en', label: 'English', nativeName: 'English' },
  { code: 'hi', label: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'bn', label: 'Bengali', nativeName: 'বাংলা' },
  { code: 'ta', label: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', label: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'mr', label: 'Marathi', nativeName: 'मराठी' },
];

export const DynamicNavbar: React.FC<DynamicNavbarProps> = ({
  currentView,
  onViewChange,
  lang,
  onLanguageChange,
  isDarkMode,
  onToggleDarkMode,
  onOpenWhatIf,
  confidence = 94,
  onSelectPreset,
  activeBasemap,
  onSelectBasemap,
  displayMode,
  onSelectDisplayMode,
  radarOpacity,
  onChangeRadarOpacity,
  showClouds,
  onToggleClouds,
  showLightning,
  onToggleLightning,
  showWindFlow = true,
  onToggleWindFlow,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLayerDrawerOpen, setIsLayerDrawerOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isPresetOpen, setIsPresetOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement | null>(null);
  const layerDrawerRef = useRef<HTMLDivElement | null>(null);
  const presetMenuRef = useRef<HTMLDivElement | null>(null);

  // Live Heartbeat polling clock (updates every 3s)
  const [packetCount, setPacketCount] = useState(1482);
  const [countdownStr, setCountdownStr] = useState('03:41:18');

  const t = translations[lang] || translations.en;

  // Simulate WebSocket/Polling Heartbeat every 3s
  useEffect(() => {
    const interval = setInterval(() => {
      setPacketCount((prev) => prev + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Live UTC Countdown to next NWP Cycle (00Z, 06Z, 12Z, 18Z)
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const hours = now.getUTCHours();
      const minutes = now.getUTCMinutes();
      const seconds = now.getUTCSeconds();

      const nextRunHour = Math.ceil((hours + 1) / 6) * 6;
      let diffHours = nextRunHour - hours - 1;
      let diffMins = 59 - minutes;
      let diffSecs = 59 - seconds;

      if (diffHours < 0) diffHours += 24;

      const pad = (n: number) => n.toString().padStart(2, '0');
      setCountdownStr(`${pad(diffHours)}h ${pad(diffMins)}m ${pad(diffSecs)}s`);
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
        setIsLangMenuOpen(false);
      }
      if (layerDrawerRef.current && !layerDrawerRef.current.contains(e.target as Node)) {
        setIsLayerDrawerOpen(false);
      }
      if (presetMenuRef.current && !presetMenuRef.current.contains(e.target as Node)) {
        setIsPresetOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      className={`fixed top-2 sm:top-3 left-2 right-2 sm:left-4 sm:right-4 max-w-6xl mx-auto flex items-center justify-between px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-2xl ${
        isDarkMode
          ? 'bg-slate-900/85 text-white border-white/10 shadow-black/60'
          : 'bg-white/95 text-slate-900 border-slate-300 shadow-slate-900/10'
      } backdrop-blur-md border z-[1000] shadow-xl gap-1.5 sm:gap-2.5 transition-all`}
    >
      {/* 1. Left: Menu Button / Brand Title */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 min-w-0" ref={menuRef}>
        <div className="relative">
          <button
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
              setIsLayerDrawerOpen(false);
            }}
            className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer text-xs font-bold ${
              isMenuOpen
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-sm'
                : isDarkMode
                ? 'bg-white/10 hover:bg-white/15 text-white border-white/10'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-300'
            }`}
            title="Navigation Menu"
            aria-label="Navigation Menu"
          >
            <Menu className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
            <span className="hidden sm:inline">Menu</span>
          </button>

          {/* Clean Navigation Menu Popover */}
          {isMenuOpen && (
            <div
              className={`absolute left-0 top-full mt-2 w-64 p-2 rounded-2xl shadow-2xl border backdrop-blur-2xl z-[1001] animate-in fade-in zoom-in-95 duration-150 ${
                isDarkMode
                  ? 'bg-slate-950/95 border-slate-800 text-slate-100 shadow-black/80'
                  : 'bg-white border-slate-300 text-slate-900 shadow-xl'
              }`}
            >
              <div className="px-3 py-1.5 text-[10px] font-mono text-slate-700 dark:text-slate-400 uppercase tracking-wider font-bold">
                Application Views
              </div>

              <div className="space-y-1">
                <button
                  onClick={() => {
                    onViewChange('precipitation_map');
                    setIsMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                    currentView === 'precipitation_map'
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                      : isDarkMode
                      ? 'hover:bg-slate-900 text-slate-200'
                      : 'hover:bg-slate-100 text-slate-800'
                  }`}
                >
                  <Layers className="w-4 h-4 shrink-0" />
                  <span>{t.views.precipitationMap}</span>
                </button>

                <button
                  onClick={() => {
                    onViewChange('regime_intelligence');
                    setIsMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                    currentView === 'regime_intelligence'
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                      : isDarkMode
                      ? 'hover:bg-slate-900 text-slate-200'
                      : 'hover:bg-slate-100 text-slate-800'
                  }`}
                >
                  <Radio className="w-4 h-4 shrink-0" />
                  <span>{t.views.regimeIntelligence}</span>
                </button>

                <button
                  onClick={() => {
                    onViewChange('district_risk');
                    setIsMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                    currentView === 'district_risk'
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                      : isDarkMode
                      ? 'hover:bg-slate-900 text-slate-200'
                      : 'hover:bg-slate-100 text-slate-800'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{t.views.districtRisk}</span>
                </button>

                <button
                  onClick={() => {
                    onViewChange('skill_verification');
                    setIsMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                    currentView === 'skill_verification'
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                      : isDarkMode
                      ? 'hover:bg-slate-900 text-slate-200'
                      : 'hover:bg-slate-100 text-slate-800'
                  }`}
                >
                  <BarChart3 className="w-4 h-4 shrink-0" />
                  <span>{t.views.skillVerification}</span>
                </button>
              </div>

              {/* Language Selection */}
              <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between px-3 py-1">
                  <span className="text-[10px] font-mono text-slate-700 dark:text-slate-400 uppercase tracking-wider font-bold">
                    Language
                  </span>
                  <button
                    onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                    className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-400 flex items-center gap-1 cursor-pointer"
                  >
                    <Globe className="w-3 h-3" />
                    <span>{languages.find((l) => l.code === lang)?.nativeName || 'English'}</span>
                  </button>
                </div>

                {isLangMenuOpen && (
                  <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100/70 dark:bg-slate-900/70 rounded-xl mt-1">
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => {
                          onLanguageChange(l.code);
                          setIsLangMenuOpen(false);
                        }}
                        className={`px-2 py-1 rounded-lg text-[11px] text-left transition-all ${
                          lang === l.code
                            ? 'bg-cyan-500 text-slate-950 font-bold'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5'
                        }`}
                      >
                        {l.nativeName}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Live NWP Cycle Info */}
              <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-800 px-3 py-1 flex items-center justify-between text-[10px] font-mono text-slate-700 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-500" />
                  Next Cycle
                </span>
                <span className="text-cyan-600 dark:text-cyan-400 font-semibold">{countdownStr}</span>
              </div>
            </div>
          )}
        </div>

        {/* Brand Title */}
        <button
          onClick={() => onViewChange('precipitation_map')}
          className="flex flex-col text-left group cursor-pointer focus:outline-none min-w-0"
        >
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-sm sm:text-base font-extrabold tracking-tight bg-gradient-to-r from-cyan-700 via-sky-700 to-blue-700 dark:from-cyan-400 dark:via-cyan-300 dark:to-blue-400 bg-clip-text text-transparent shrink-0">
              VayuDrishti
            </span>
            <span className="hidden xl:inline-block text-[11px] font-bold text-slate-800 dark:text-slate-300 truncate">
              // National Monsoon Forecast System
            </span>
          </div>
          <span className="hidden 2xl:inline-block text-[9px] font-mono tracking-tight text-slate-700 dark:text-slate-400 font-semibold">
            High-Resolution Calibrated Rainfall Analysis
          </span>
        </button>
      </div>

      {/* 2. Center: Adaptive Convective Surge Pill */}
      <div className="flex items-center justify-center shrink min-w-0 mx-0.5 sm:mx-1">
        <button
          onClick={onOpenWhatIf}
          className={`group flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 rounded-full border transition-all cursor-pointer shadow-xs active:scale-95 max-w-full truncate ${
            isDarkMode
              ? 'bg-cyan-500/15 hover:bg-cyan-500/25 border-cyan-500/30 text-white'
              : 'bg-slate-100 hover:bg-cyan-50/80 border-slate-300 hover:border-cyan-400 text-slate-950 shadow-xs'
          }`}
          title="Click to inspect synoptic atmospheric parameters"
        >
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>

          {/* Desktop/Tablet text (> 640px) */}
          <span className="hidden sm:inline-flex items-center text-[11px] sm:text-xs font-bold font-mono tracking-tight text-slate-950 dark:text-white">
            <span className="text-cyan-800 dark:text-cyan-400">High Confidence</span>
            <span className="text-slate-500 dark:text-slate-400 mx-1">•</span>
            <span className="text-slate-950 dark:text-white">Convective Surge</span>
          </span>

          {/* Mobile phone text (< 640px) - Never overflows or cuts awkwardly */}
          <span className="sm:hidden inline-flex items-center text-[11px] font-bold font-mono tracking-tight text-slate-950 dark:text-white">
            <span className="text-cyan-800 dark:text-cyan-400">Surge</span>
          </span>

          <Sliders className="w-3.5 h-3.5 text-cyan-700 dark:text-cyan-400 shrink-0" />
        </button>
      </div>

      {/* 3. Right: "Preset Scenarios", "Map Layers" Toggle and Theme Switch */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0 relative">
        {/* Preset Scenarios 1-Click Evaluation Dropdown */}
        <div className="relative" ref={presetMenuRef}>
          <button
            onClick={() => {
              setIsPresetOpen(!isPresetOpen);
              setIsLayerDrawerOpen(false);
              setIsMenuOpen(false);
            }}
            className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer text-xs font-bold shadow-xs ${
              isPresetOpen
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                : isDarkMode
                ? 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border-amber-500/30'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-950 border-amber-300'
            }`}
            title="Load 1-Click Historical Demo Scenarios"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="hidden md:inline">Presets</span>
            <span className="md:hidden hidden sm:inline">Demo</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${isPresetOpen ? 'rotate-180' : ''}`} />
          </button>

          {isPresetOpen && (
            <div
              className={`absolute right-0 top-full mt-2 w-80 sm:w-96 p-3 rounded-3xl shadow-2xl border backdrop-blur-2xl z-[1001] animate-in fade-in zoom-in-95 duration-150 ${
                isDarkMode
                  ? 'bg-slate-950/95 border-slate-800 text-slate-100 shadow-black/90'
                  : 'bg-white border-slate-300 text-slate-900 shadow-2xl'
              }`}
            >
              <div className="px-2 pb-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 dark:text-white">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Demo Historical Examples</span>
                  </div>
                  <p className="text-[11px] text-slate-700 dark:text-slate-400 mt-0.5">
                    1-Click evaluator benchmarks with ground-truth radar
                  </p>
                </div>
              </div>

              <div className="mt-2.5 space-y-2">
                {HISTORICAL_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => {
                      onSelectPreset?.(preset);
                      setIsPresetOpen(false);
                    }}
                    className={`w-full p-2.5 rounded-2xl border text-left transition-all cursor-pointer group flex flex-col gap-1 ${
                      isDarkMode
                        ? 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-800 hover:border-amber-500/50'
                        : 'bg-slate-50 hover:bg-amber-50/70 border-slate-200 hover:border-amber-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors flex items-center gap-1.5">
                        <span>{preset.title}</span>
                      </span>
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${preset.tagColor}`}
                      >
                        {preset.tag}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-700 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {preset.subtitle}
                    </div>
                    <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-200/60 dark:border-slate-800/60 text-[10px] text-slate-700 dark:text-slate-400 font-mono">
                      <span>Target: {preset.districtName}</span>
                      <span className="text-cyan-700 dark:text-cyan-400 font-semibold group-hover:underline">
                        Apply & Center →
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Map Layers Toggle and Theme Switch */}
        <div className="relative" ref={layerDrawerRef}>
          <button
            onClick={() => {
              setIsLayerDrawerOpen(!isLayerDrawerOpen);
              setIsMenuOpen(false);
            }}
            className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer text-xs font-bold ${
              isLayerDrawerOpen
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/25'
                : isDarkMode
                ? 'bg-white/10 hover:bg-white/15 text-white border-white/10'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-300'
            }`}
            title="Map Styles & Rain Layers"
            aria-label="Map Styles and Rain Layers"
          >
            <Layers className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
            <span className="hidden md:inline">Layers</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isLayerDrawerOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Map Layers Dropdown Drawer (Cleanly anchored to top header) */}
          {isLayerDrawerOpen && (
            <div
              className={`absolute right-0 top-full mt-2 w-72 p-4 rounded-3xl shadow-2xl border backdrop-blur-2xl z-[1001] animate-in fade-in zoom-in-95 duration-150 ${
                isDarkMode
                  ? 'bg-slate-950/95 border-slate-800 text-slate-100 shadow-black/80'
                  : 'bg-white border-slate-300 text-slate-900 shadow-2xl'
              }`}
            >
              {/* Basemap Selection */}
              <div className="mb-4">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-800 dark:text-slate-400 font-bold block mb-2">
                  1. Base Map
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {(['satellite', 'topographic', 'dark'] as BasemapLayerId[]).map((id) => {
                    const conf = basemapLayersConfig[id];
                    const isSelected = activeBasemap === id;
                    return (
                      <button
                        key={id}
                        onClick={() => onSelectBasemap(id)}
                        className={`relative flex flex-col items-center p-1.5 rounded-2xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'border-cyan-500 ring-2 ring-cyan-500/30 bg-cyan-500/10'
                            : isDarkMode
                            ? 'border-slate-800 hover:border-slate-700 bg-slate-900/50 text-slate-200'
                            : 'border-slate-200 hover:border-slate-300 bg-slate-100/50 text-slate-900'
                        }`}
                      >
                        <img
                          src={conf.thumbnail}
                          alt={conf.name}
                          className="w-full h-11 object-cover rounded-xl mb-1 shadow-sm"
                        />
                        <span className="text-[10px] font-bold truncate w-full text-slate-900 dark:text-slate-100">
                          {id === 'satellite' ? 'Satellite' : id === 'topographic' ? 'Terrain' : 'Dark Matter'}
                        </span>
                        {isSelected && (
                          <div className="absolute top-1 right-1 w-3.5 h-3.5 bg-cyan-500 rounded-full flex items-center justify-center text-slate-950">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Rain Comparison Mode */}
              <div className="mb-4">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-800 dark:text-slate-400 font-bold block mb-2">
                  2. Rain Comparison Mode
                </span>
                <div className="grid grid-cols-2 gap-1.5 text-xs font-medium">
                  <button
                    onClick={() => onSelectDisplayMode('split')}
                    className={`px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer ${
                      displayMode === 'split'
                        ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-sm'
                        : isDarkMode
                        ? 'border-slate-800 hover:bg-slate-900 text-slate-300'
                        : 'border-slate-200 hover:bg-slate-100 text-slate-900 font-semibold'
                    }`}
                  >
                    Compare Slider
                  </button>
                  <button
                    onClick={() => onSelectDisplayMode('ai')}
                    className={`px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer ${
                      displayMode === 'ai'
                        ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-sm'
                        : isDarkMode
                        ? 'border-slate-800 hover:bg-slate-900 text-slate-300'
                        : 'border-slate-200 hover:bg-slate-100 text-slate-900 font-semibold'
                    }`}
                  >
                    Calibrated Forecast
                  </button>
                  <button
                    onClick={() => onSelectDisplayMode('raw')}
                    className={`px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer ${
                      displayMode === 'raw'
                        ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-sm'
                        : isDarkMode
                        ? 'border-slate-800 hover:bg-slate-900 text-slate-300'
                        : 'border-slate-200 hover:bg-slate-100 text-slate-900 font-semibold'
                    }`}
                  >
                    Standard NWP (GFS)
                  </button>
                  <button
                    onClick={() => onSelectDisplayMode('delta')}
                    className={`px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer ${
                      displayMode === 'delta'
                        ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-sm'
                        : isDarkMode
                        ? 'border-slate-800 hover:bg-slate-900 text-slate-300'
                        : 'border-slate-200 hover:bg-slate-100 text-slate-900 font-semibold'
                    }`}
                  >
                    Forecast Delta
                  </button>
                </div>
              </div>

              {/* Visual Toggles: Clouds & Lightning */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2.5 text-xs">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="flex items-center gap-2 text-slate-900 dark:text-slate-200 font-bold">
                    <CloudRain className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-500" />
                    <span>Satellite Cloud Sheet</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={showClouds}
                    onChange={(e) => onToggleClouds(e.target.checked)}
                    className="rounded accent-cyan-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="flex items-center gap-2 text-slate-900 dark:text-slate-200 font-bold">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>Convective Lightning</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={showLightning}
                    onChange={(e) => onToggleLightning(e.target.checked)}
                    className="rounded accent-cyan-500 cursor-pointer"
                  />
                </label>

                {onToggleWindFlow && (
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="flex items-center gap-2 text-slate-900 dark:text-slate-200 font-bold">
                      <span className="text-xs">🌬️</span>
                      <span>Wind Flow Streamlines</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={showWindFlow}
                      onChange={(e) => onToggleWindFlow(e.target.checked)}
                      className="rounded accent-cyan-500 cursor-pointer"
                    />
                  </label>
                )}
              </div>

              {/* Radar Opacity Slider */}
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800">
                <div className="flex justify-between items-center text-[11px] font-mono text-slate-900 dark:text-slate-400 mb-1.5 font-bold">
                  <span className="uppercase">Radar Opacity</span>
                  <span className="text-cyan-800 dark:text-cyan-400 font-extrabold">
                    {Math.round(radarOpacity * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="1"
                  step="0.05"
                  value={radarOpacity}
                  onChange={(e) => onChangeRadarOpacity(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>

        {/* Theme Switch */}
        <button
          onClick={onToggleDarkMode}
          className={`p-1.5 sm:p-2 rounded-xl border transition-all cursor-pointer ${
            isDarkMode
              ? 'bg-white/10 hover:bg-white/15 text-amber-300 border-white/10'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-300'
          }`}
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
