import React, { useState, useMemo } from 'react';
import { SynopticParameters, SynopticRegimeId, SupportedLanguage } from '../types/meteo';
import { synopticRegimesData, operationalSynopticParams } from '../data/mockData';
import { translations } from '../i18n/translations';
import { X, RotateCcw, Zap, Sparkles, SlidersHorizontal, Info } from 'lucide-react';

interface WhatIfDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  params: SynopticParameters;
  onChangeParams: (params: SynopticParameters) => void;
  lang: SupportedLanguage;
  isDarkMode: boolean;
}

export const WhatIfDrawer: React.FC<WhatIfDrawerProps> = ({
  isOpen,
  onClose,
  params,
  onChangeParams,
  lang,
  isDarkMode,
}) => {
  const t = translations[lang] || translations.en;

  // Real-time atmospheric classification inference based on parameters
  const inferredRegime = useMemo<{ regimeId: SynopticRegimeId; confidence: number; reason: string }>(() => {
    // 1. Break monsoon condition: Trough shifted to Himalayan foothills (>26°N) and low shear (<12 m/s)
    if (params.troughLatitude >= 26.0 && params.shear850hPa < 14) {
      const conf = Math.min(99, Math.round(75 + (params.troughLatitude - 26) * 6));
      return {
        regimeId: 'break_monsoon',
        confidence: conf,
        reason: 'Rain clouds have drifted north to the Himalayan foothills, causing a dry spell in central and southern India.',
      };
    }

    // 2. Orographic surge: High 850 hPa shear (>20 m/s) and high offshore vortex (>6.5)
    if (params.shear850hPa >= 20.0 && params.offshoreVortexIndex >= 6.5) {
      const conf = Math.min(98, Math.round(80 + (params.shear850hPa - 20) * 1.8));
      return {
        regimeId: 'orographic_surge',
        confidence: conf,
        reason: 'Strong, moisture-packed ocean winds are blowing straight into the western hills, triggering heavy mountain downpours.',
      };
    }

    // 3. Monsoon depression: High offshore vortex/low-pressure and moderate-to-high trough position
    if (params.offshoreVortexIndex >= 8.0 && params.mslpGradient >= 14) {
      return {
        regimeId: 'monsoon_depression',
        confidence: 91,
        reason: 'A deep low-pressure storm system with heavy rain bands is crossing inland from the sea.',
      };
    }

    // 4. Western disturbance: Trough pushed far north/northwest with high shear anomalies
    if (params.troughLatitude > 28.5) {
      return {
        regimeId: 'western_disturbance',
        confidence: 86,
        reason: 'A cool northern weather system bringing showers and cloud cover across the northern plains.',
      };
    }

    // 5. Default Active monsoon
    const conf = Math.min(96, Math.max(70, Math.round(85 + (params.mslpGradient - 10) * 1.5)));
    return {
      regimeId: 'active_monsoon',
      confidence: conf,
      reason: 'Healthy, widespread monsoon winds bringing steady rain across central and coastal areas.',
    };
  }, [params]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Card */}
      <div
        className={`fixed top-4 right-4 bottom-4 w-full max-w-md z-50 rounded-2xl shadow-2xl overflow-y-auto flex flex-col p-6 transition-all duration-300 border ${
          isDarkMode
            ? 'bg-slate-900/95 border-slate-800 text-slate-100'
            : 'bg-white/95 border-slate-200 text-slate-900'
        } backdrop-blur-xl`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-cyan-700 dark:text-cyan-400" />
            <div>
              <h2 className="text-base font-extrabold text-slate-950 dark:text-white">{t.whatIfModal.title}</h2>
              <p className="text-xs text-slate-800 dark:text-slate-400 font-medium">{t.whatIfModal.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Detected Regime Banner */}
        <div
          className={`my-4 p-4 rounded-xl border transition-all ${
            isDarkMode ? 'bg-cyan-950/40 border-cyan-500/40' : 'bg-cyan-50 border-cyan-400 shadow-xs'
          }`}
        >
          <div className="text-[10px] uppercase font-mono tracking-wider text-cyan-800 dark:text-cyan-400 font-extrabold flex items-center justify-between">
            <span>{t.whatIfModal.detectedRegime}</span>
            <span className="flex items-center gap-1 text-emerald-800 dark:text-emerald-400 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Weather Match
            </span>
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-lg font-extrabold text-cyan-950 dark:text-cyan-300">
              {t.regimes[inferredRegime.regimeId] || inferredRegime.regimeId}
            </span>
            <span className="font-mono text-sm font-extrabold text-cyan-800 dark:text-cyan-400">
              {inferredRegime.confidence}% Match
            </span>
          </div>
          <p className="mt-1.5 text-xs text-slate-900 dark:text-slate-300 font-medium leading-relaxed">
            {inferredRegime.reason}
          </p>
        </div>

        {/* Parameter Sliders */}
        <div className="space-y-5 flex-1 py-2">
          {/* Slider 1: 850 hPa Wind Shear */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-950 dark:text-slate-200">{t.whatIfModal.shear850}</span>
              <span className="font-mono font-extrabold text-cyan-800 dark:text-cyan-400">
                {params.shear850hPa.toFixed(1)} m/s
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="32"
              step="0.5"
              value={params.shear850hPa}
              onChange={(e) =>
                onChangeParams({ ...params, shear850hPa: parseFloat(e.target.value) })
              }
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer accent-cyan-600"
            />
            <div className="flex justify-between text-[10px] text-slate-800 dark:text-slate-400 font-mono font-bold">
              <span>5 m/s (Weak)</span>
              <span>18 m/s (Nominal)</span>
              <span>32 m/s (Extreme Jet)</span>
            </div>
          </div>

          {/* Slider 2: Monsoon Trough Latitude */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-950 dark:text-slate-200">{t.whatIfModal.troughLat}</span>
              <span className="font-mono font-extrabold text-cyan-800 dark:text-cyan-400">
                {params.troughLatitude.toFixed(1)}° N
              </span>
            </div>
            <input
              type="range"
              min="18.0"
              max="29.5"
              step="0.2"
              value={params.troughLatitude}
              onChange={(e) =>
                onChangeParams({ ...params, troughLatitude: parseFloat(e.target.value) })
              }
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer accent-cyan-600"
            />
            <div className="flex justify-between text-[10px] text-slate-800 dark:text-slate-400 font-mono font-bold">
              <span>18.0°N (South/Active)</span>
              <span>23.0°N (Normal)</span>
              <span>29.5°N (Foothills/Break)</span>
            </div>
          </div>

          {/* Slider 3: MSLP Gradient */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-950 dark:text-slate-200">{t.whatIfModal.mslpGrad}</span>
              <span className="font-mono font-extrabold text-cyan-800 dark:text-cyan-400">
                {params.mslpGradient.toFixed(1)} hPa
              </span>
            </div>
            <input
              type="range"
              min="4.0"
              max="22.0"
              step="0.5"
              value={params.mslpGradient}
              onChange={(e) =>
                onChangeParams({ ...params, mslpGradient: parseFloat(e.target.value) })
              }
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer accent-cyan-600"
            />
            <div className="flex justify-between text-[10px] text-slate-800 dark:text-slate-400 font-mono font-bold">
              <span>4 hPa (Weak)</span>
              <span>12 hPa (Normal)</span>
              <span>22 hPa (Strong Trough)</span>
            </div>
          </div>

          {/* Slider 4: Offshore Vortex Intensity */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-950 dark:text-slate-200">{t.whatIfModal.vortexIndex}</span>
              <span className="font-mono font-extrabold text-cyan-800 dark:text-cyan-400">
                {params.offshoreVortexIndex.toFixed(1)} / 10
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={params.offshoreVortexIndex}
              onChange={(e) =>
                onChangeParams({ ...params, offshoreVortexIndex: parseFloat(e.target.value) })
              }
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer accent-cyan-600"
            />
            <div className="flex justify-between text-[10px] text-slate-800 dark:text-slate-400 font-mono font-bold">
              <span>0 (Dormant)</span>
              <span>5 (Moderate)</span>
              <span>10 (Severe Vortex)</span>
            </div>
          </div>

          {/* Quick Scenario Preset Buttons */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="text-[11px] font-extrabold text-slate-900 dark:text-slate-400 uppercase tracking-wider mb-2">
              Quick Weather Scenarios
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <button
                onClick={() =>
                  onChangeParams({
                    ...params,
                    shear850hPa: 9.5,
                    troughLatitude: 27.8,
                    mslpGradient: 6.2,
                    offshoreVortexIndex: 1.5,
                  })
                }
                className="px-3 py-2 rounded-xl text-left bg-slate-100 hover:bg-slate-200 text-slate-950 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 dark:text-slate-200 transition-colors border border-slate-300 dark:border-slate-700/50 cursor-pointer"
              >
                <div className="font-bold">{t.whatIfModal.simulateBreak}</div>
                <div className="text-[10px] text-slate-700 dark:text-slate-400 font-semibold">Dry spell inland</div>
              </button>

              <button
                onClick={() =>
                  onChangeParams({
                    ...params,
                    shear850hPa: 24.5,
                    troughLatitude: 21.0,
                    mslpGradient: 16.5,
                    offshoreVortexIndex: 8.8,
                  })
                }
                className="px-3 py-2 rounded-xl text-left bg-slate-100 hover:bg-slate-200 text-slate-950 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 dark:text-slate-200 transition-colors border border-slate-300 dark:border-slate-700/50 cursor-pointer"
              >
                <div className="font-bold">{t.whatIfModal.simulateSurge}</div>
                <div className="text-[10px] text-slate-700 dark:text-slate-400 font-semibold">Heavy mountain downpour</div>
              </button>

              <button
                onClick={() =>
                  onChangeParams({
                    ...params,
                    shear850hPa: 16.0,
                    troughLatitude: 22.5,
                    mslpGradient: 18.0,
                    offshoreVortexIndex: 9.5,
                  })
                }
                className="px-3 py-2 rounded-xl text-left bg-slate-100 hover:bg-slate-200 text-slate-950 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 dark:text-slate-200 transition-colors border border-slate-300 dark:border-slate-700/50 cursor-pointer"
              >
                <div className="font-bold">{t.whatIfModal.simulateDepression}</div>
                <div className="text-[10px] text-slate-700 dark:text-slate-400 font-semibold">Coastal storm system</div>
              </button>

              <button
                onClick={() => onChangeParams({ ...operationalSynopticParams })}
                className="px-3 py-2 rounded-xl text-left bg-cyan-50 hover:bg-cyan-100 text-cyan-950 dark:bg-cyan-950/40 dark:hover:bg-cyan-900/40 dark:text-cyan-300 transition-colors border border-cyan-400 dark:border-cyan-800/50 flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="font-bold">{t.whatIfModal.resetOperational}</div>
                  <div className="text-[10px] text-cyan-800 dark:text-cyan-400 font-bold">Live Today</div>
                </div>
                <RotateCcw className="w-3.5 h-3.5 ml-2" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer active:scale-[0.98]"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </>
  );
};
