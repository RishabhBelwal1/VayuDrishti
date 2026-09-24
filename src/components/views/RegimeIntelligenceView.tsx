import React, { useState } from 'react';
import { SynopticRegimeId, SupportedLanguage } from '../../types/meteo';
import { synopticRegimesData } from '../../data/mockData';
import { translations } from '../../i18n/translations';
import {
  Compass,
  Wind,
  Layers,
  Activity,
  ArrowRight,
  Sparkles,
  Sliders,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface RegimeIntelligenceViewProps {
  currentRegime: SynopticRegimeId;
  onSelectRegime: (regime: SynopticRegimeId) => void;
  onOpenWhatIf: () => void;
  lang: SupportedLanguage;
  isDarkMode: boolean;
}

const regimesList: SynopticRegimeId[] = [
  'active_monsoon',
  'break_monsoon',
  'monsoon_depression',
  'orographic_surge',
  'western_disturbance',
];

export const RegimeIntelligenceView: React.FC<RegimeIntelligenceViewProps> = ({
  currentRegime,
  onSelectRegime,
  onOpenWhatIf,
  lang,
  isDarkMode,
}) => {
  const [selectedRegimeId, setSelectedRegimeId] = useState<SynopticRegimeId>(currentRegime);
  const t = translations[lang] || translations.en;
  const activeData = synopticRegimesData[selectedRegimeId];

  return (
    <div className="w-full h-full pt-20 sm:pt-24 pb-16 px-4 sm:px-8 max-w-7xl mx-auto overflow-y-auto">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-cyan-700 dark:text-cyan-400 text-xs font-mono uppercase tracking-wider font-bold">
            <Compass className="w-4 h-4" />
            <span>Weather Pattern Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-slate-950 dark:text-white">
            {t.views.regimeIntelligence}
          </h1>
          <p className="text-sm text-slate-800 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed font-medium">
            Understand active large-scale monsoon patterns that shape rainfall, storms, and cloudbursts across India.
          </p>
        </div>

        <button
          onClick={onOpenWhatIf}
          className="self-start md:self-auto flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg transition-all cursor-pointer active:scale-95"
        >
          <Sliders className="w-4 h-4" />
          <span>Simulate Weather Changes</span>
        </button>
      </div>

      {/* 5 Regime Selector Tabs */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {regimesList.map((id) => {
          const reg = synopticRegimesData[id];
          const isSelected = selectedRegimeId === id;
          const isOperational = currentRegime === id;

          return (
            <button
              key={id}
              onClick={() => setSelectedRegimeId(id)}
              className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer relative ${
                isSelected
                  ? 'bg-cyan-500/15 border-cyan-500 text-cyan-900 dark:text-cyan-300 shadow-md ring-2 ring-cyan-500/30'
                  : isDarkMode
                  ? 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-800 text-slate-300'
                  : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-900 shadow-xs'
              }`}
            >
              {isOperational && (
                <span className="absolute top-2 right-2 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              )}
              <div className="text-xs font-bold truncate pr-3 text-slate-950 dark:text-white">{t.regimes[id] || reg.name}</div>
              <div className="mt-1 flex items-baseline justify-between text-[11px] font-mono">
                <span className="text-slate-800 dark:text-slate-400 font-bold">Match</span>
                <span className="font-extrabold text-cyan-800 dark:text-cyan-400">{reg.confidence}%</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Diagnostic Detail Container */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Synopsis & AI Correction Engine */}
        <div className="lg:col-span-2 space-y-6">
          {/* Regime Overview Card */}
          <div
            className={`p-6 rounded-2xl border ${
              isDarkMode ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-700 dark:text-cyan-400 font-bold">
                Weather Setup & Details
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/10 text-cyan-800 dark:text-cyan-400 border border-cyan-500/20">
                SYNOPTIC SETUP // {selectedRegimeId.toUpperCase().replace(/_/g, ' ')}
              </span>
            </div>

            <h2 className="text-xl font-bold mt-2 text-slate-950 dark:text-slate-100">
              {t.regimes[selectedRegimeId] || activeData.name}
            </h2>

            <p className="mt-2 text-sm text-slate-800 dark:text-slate-300 leading-relaxed font-medium">
              {activeData.description}
            </p>

            {/* Key Atmospheric Drivers */}
            <div className="mt-5">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Wind className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                <span>Main Weather Drivers</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeData.keyDrivers.map((driver, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl text-xs flex items-start gap-2 border ${
                      isDarkMode
                        ? 'bg-slate-800/40 border-slate-800 text-slate-300'
                        : 'bg-slate-100 border-slate-200 text-slate-900 font-medium'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                    <span>{driver}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* NWP Biases vs Calibration Strategy */}
            <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Standard NWP Systematic Biases</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-900 dark:text-slate-300 font-medium">
                  {activeData.characteristicBiases.map((bias, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-700 dark:text-amber-400 font-bold">✕</span>
                      <span>{bias}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>High-Resolution Calibration Strategy</span>
                </h4>
                <p className="text-xs text-slate-900 dark:text-slate-300 leading-relaxed bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-300 dark:border-emerald-500/20 p-3 rounded-xl font-medium">
                  {activeData.aiCorrectionStrategy}
                </p>
              </div>
            </div>
          </div>

          {/* Regime Transition Probability Matrix */}
          <div
            className={`p-6 rounded-2xl border ${
              isDarkMode ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-950 dark:text-slate-100 flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span>3-Day Weather Pattern Shifts</span>
              </h3>
              <span className="text-xs font-mono text-slate-800 dark:text-slate-400 font-bold">Likelihood %</span>
            </div>
            <p className="text-xs text-slate-800 dark:text-slate-400 mb-4 font-medium">
              Estimated chances of the current pattern shifting into other weather setups over the next 3 days.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50">
                <div className="text-slate-800 dark:text-slate-300 text-[11px] font-bold">Stays Same</div>
                <div className="text-lg font-mono font-extrabold text-cyan-800 dark:text-cyan-400 mt-1">68.4%</div>
                <div className="text-[10px] text-slate-700 dark:text-slate-400 mt-0.5 font-medium">High Stability</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50">
                <div className="text-slate-800 dark:text-slate-300 text-[11px] font-bold">To Dry Spell</div>
                <div className="text-lg font-mono font-extrabold text-amber-800 dark:text-amber-400 mt-1">14.2%</div>
                <div className="text-[10px] text-slate-700 dark:text-slate-400 mt-0.5 font-medium">Clouds shift north</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50">
                <div className="text-slate-800 dark:text-slate-300 text-[11px] font-bold">To Storm System</div>
                <div className="text-lg font-mono font-extrabold text-emerald-800 dark:text-emerald-400 mt-1">12.8%</div>
                <div className="text-[10px] text-slate-700 dark:text-slate-400 mt-0.5 font-medium">Bay of Bengal low</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50">
                <div className="text-slate-800 dark:text-slate-300 text-[11px] font-bold">To Mountain Rain</div>
                <div className="text-lg font-mono font-extrabold text-cyan-800 dark:text-cyan-300 mt-1">4.6%</div>
                <div className="text-[10px] text-slate-700 dark:text-slate-400 mt-0.5 font-medium">Heavy slope showers</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Atmospheric Indicators & AI Tuning */}
        <div className="space-y-6">
          {/* Synoptic Index Gauge Telemetry */}
          <div
            className={`p-6 rounded-2xl border ${
              isDarkMode ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <h3 className="text-sm font-bold text-slate-950 dark:text-slate-100 mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>Atmospheric Health</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-slate-700 dark:text-slate-400 font-semibold">Wind Speed (Lower Atmosphere)</span>
                  <span className="font-mono font-bold text-cyan-700 dark:text-cyan-400">18.5 m/s</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700/50 h-2 rounded-full overflow-hidden">
                  <div className="bg-cyan-500 h-full rounded-full" style={{ width: '68%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-slate-700 dark:text-slate-400 font-semibold">Rain Belt Position</span>
                  <span className="font-mono font-bold text-cyan-700 dark:text-cyan-400">22.8° N</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700/50 h-2 rounded-full overflow-hidden">
                  <div className="bg-cyan-500 h-full rounded-full" style={{ width: '48%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-slate-700 dark:text-slate-400 font-semibold">Air Pressure Difference</span>
                  <span className="font-mono font-bold text-cyan-700 dark:text-cyan-400">12.4 hPa</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700/50 h-2 rounded-full overflow-hidden">
                  <div className="bg-cyan-500 h-full rounded-full" style={{ width: '62%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-slate-700 dark:text-slate-400 font-semibold">Sea Storm Vortex</span>
                  <span className="font-mono font-bold text-cyan-700 dark:text-cyan-400">7.8 / 10</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700/50 h-2 rounded-full overflow-hidden">
                  <div className="bg-cyan-500 h-full rounded-full" style={{ width: '78%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-slate-700 dark:text-slate-400 font-semibold">Thunderstorm Energy</span>
                  <span className="font-mono font-bold text-amber-700 dark:text-amber-400">2,450 J/kg</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700/50 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: '72%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Terrain-Aware Calibration Tuning */}
          <div
            className={`p-6 rounded-2xl border ${
              isDarkMode ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <h3 className="text-sm font-bold text-slate-950 dark:text-slate-100 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>Terrain-Aware Dynamic Calibration</span>
            </h3>
            <p className="text-xs text-slate-700 dark:text-slate-400 leading-relaxed font-medium">
              Rather than relying on coarse grid averages, VayuDrishti tunes its calibration parameters specifically for mountain slopes, coastal valleys, and rain shadows:
            </p>

            <div className="mt-4 space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-200 dark:bg-slate-800/40 dark:border-slate-700/40 flex justify-between">
                <span className="text-slate-800 dark:text-slate-300 font-semibold">Mountain Rain Boost</span>
                <span className="font-mono font-bold text-cyan-700 dark:text-cyan-400">+82% Focus</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-200 dark:bg-slate-800/40 dark:border-slate-700/40 flex justify-between">
                <span className="text-slate-800 dark:text-slate-300 font-semibold">Sharp Local Detail</span>
                <span className="font-mono font-bold text-cyan-700 dark:text-cyan-400">High Precision</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-200 dark:bg-slate-800/40 dark:border-slate-700/40 flex justify-between">
                <span className="text-slate-800 dark:text-slate-300 font-semibold">Dry Rain-Shadow Fix</span>
                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">-42% Smooth</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
