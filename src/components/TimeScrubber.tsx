import React, { useState, useEffect } from 'react';
import { LeadTime, SupportedLanguage } from '../types/meteo';
import { translations } from '../i18n/translations';
import { Play, Pause, SkipForward, SkipBack, Repeat, ChevronLeft, ChevronRight } from 'lucide-react';

interface TimeScrubberProps {
  leadTime: LeadTime;
  onLeadTimeChange: (lead: LeadTime) => void;
  lang: SupportedLanguage;
  isDarkMode: boolean;
}

const leadTimesList: LeadTime[] = ['t0', 't24', 't48', 't72', 't96', 't120'];

export const TimeScrubber: React.FC<TimeScrubberProps> = ({
  leadTime,
  onLeadTimeChange,
  lang,
  isDarkMode,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLooping, setIsLooping] = useState<boolean>(true);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const t = translations[lang] || translations.en;

  // Auto-play animation cycle
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      const currentIndex = leadTimesList.indexOf(leadTime);
      const nextIndex = currentIndex + 1;
      if (nextIndex >= leadTimesList.length) {
        if (isLooping) {
          onLeadTimeChange(leadTimesList[0]);
        } else {
          setIsPlaying(false);
        }
      } else {
        onLeadTimeChange(leadTimesList[nextIndex]);
      }
    }, 2200);

    return () => clearInterval(interval);
  }, [isPlaying, isLooping, leadTime, onLeadTimeChange]);

  const currentIndex = leadTimesList.indexOf(leadTime);

  const handlePrev = () => {
    const prevIndex = (currentIndex - 1 + leadTimesList.length) % leadTimesList.length;
    onLeadTimeChange(leadTimesList[prevIndex]);
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % leadTimesList.length;
    onLeadTimeChange(leadTimesList[nextIndex]);
  };

  return (
    <div className="fixed bottom-6 left-6 z-30 transition-all pointer-events-none max-w-[calc(100vw-3rem)]">
      {isCollapsed ? (
        /* Collapsed Button aligned to left */
        <button
          onClick={() => setIsCollapsed(false)}
          className={`pointer-events-auto relative overflow-hidden flex items-center gap-2 px-3 py-2 rounded-2xl backdrop-blur-2xl transition-all duration-300 shadow-xl border cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${
            isDarkMode
              ? 'bg-slate-950/60 border-white/10 text-slate-100 shadow-[0_8px_32px_0_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.15)] hover:border-cyan-500/40'
              : 'bg-white/60 border-white/80 text-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.9)] hover:border-cyan-500/40'
          }`}
          title="Open forecast timeline"
        >
          {/* Specular Liquid Sheen */}
          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/30 dark:from-white/10 to-transparent pointer-events-none rounded-t-2xl" />

          <div className="relative flex items-center gap-2 text-xs font-mono">
            <span
              onClick={(e) => {
                e.stopPropagation();
                setIsPlaying(!isPlaying);
              }}
              className="p-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all shadow-md shadow-cyan-500/30 flex items-center justify-center cursor-pointer"
              title={isPlaying ? t.mapControls.pause : t.mapControls.play}
            >
              {isPlaying ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current ml-0.5" />}
            </span>

            <span className="font-bold text-slate-900 dark:text-slate-100">
              {currentIndex === 0 ? 'Now' : `Day ${currentIndex}`}
            </span>
            <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-bold bg-cyan-500/10 px-1.5 py-0.5 rounded-md">
              {currentIndex === 0 ? 'T+0h' : `+${currentIndex * 24}h`}
            </span>

            <div className="flex items-center text-slate-700 dark:text-slate-400 group-hover:text-cyan-400 transition-colors pl-1">
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </button>
      ) : (
        /* Full Liquid Glass Timeline Box */
        <div
          className={`pointer-events-auto relative overflow-hidden flex items-center justify-between gap-1 p-1.5 sm:p-2 rounded-2xl backdrop-blur-2xl transition-all duration-300 shadow-xl border ${
            isDarkMode
              ? 'bg-slate-950/60 border-white/10 text-slate-100 shadow-[0_8px_32px_0_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.15)] hover:border-cyan-500/30'
              : 'bg-white/80 border-slate-300 text-slate-950 shadow-[0_8px_30px_rgb(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.9)] hover:border-cyan-500/40'
          }`}
        >
          {/* Specular Liquid Sheen */}
          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/30 dark:from-white/10 to-transparent pointer-events-none rounded-t-2xl" />

          {/* Left Close Button (collapses into button on the left) */}
          <button
            onClick={() => setIsCollapsed(true)}
            className="relative p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-slate-700 hover:text-slate-950 dark:text-slate-400 dark:hover:text-slate-200 transition-colors cursor-pointer shrink-0"
            title="Collapse timeline to left button"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Liquid Glass Divider */}
          <div className="h-5 w-px bg-slate-300/60 dark:bg-white/15 mx-0.5 shrink-0" />

          {/* Playback Controls */}
          <div className="relative flex items-center gap-0.5 shrink-0">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 sm:p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all shadow-md shadow-cyan-500/30 cursor-pointer active:scale-95 shrink-0"
              title={isPlaying ? t.mapControls.pause : t.mapControls.play}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
            </button>

            <button
              onClick={handlePrev}
              className={`p-1.5 sm:p-2 rounded-xl transition-colors cursor-pointer shrink-0 ${
                isDarkMode ? 'hover:bg-white/10 text-slate-400 hover:text-slate-200' : 'hover:bg-black/5 text-slate-800'
              }`}
              title="Previous forecast step"
            >
              <SkipBack className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleNext}
              className={`p-1.5 sm:p-2 rounded-xl transition-colors cursor-pointer shrink-0 ${
                isDarkMode ? 'hover:bg-white/10 text-slate-400 hover:text-slate-200' : 'hover:bg-black/5 text-slate-800'
              }`}
              title="Next forecast step"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Liquid Glass Divider */}
          <div className="h-5 w-px bg-slate-300/60 dark:bg-white/15 mx-0.5 shrink-0" />

          {/* Lead Time Segmented Steps */}
          <div className="relative flex items-center gap-1 px-0.5 overflow-x-auto min-w-0">
            {leadTimesList.map((lt, idx) => {
              const isSelected = leadTime === lt;
              const label = idx === 0 ? 'Now' : `Day ${idx}`;
              const sub = idx === 0 ? 'T+0h' : `+${idx * 24}h`;
              return (
                <button
                  key={lt}
                  onClick={() => {
                    onLeadTimeChange(lt);
                    setIsPlaying(false);
                  }}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    isSelected
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/25 ring-1 ring-cyan-300'
                      : isDarkMode
                      ? 'text-slate-300 hover:text-white hover:bg-white/10'
                      : 'text-slate-800 hover:text-slate-950 hover:bg-slate-200/80 font-semibold'
                  }`}
                >
                  <span>{label}</span>
                  <span className={`text-[10px] ml-1.5 ${isSelected ? 'text-slate-950/90 font-bold' : 'text-slate-700 dark:text-slate-400 font-medium'}`}>
                    {sub}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Liquid Glass Divider */}
          <div className="h-5 w-px bg-slate-300/60 dark:bg-white/15 mx-0.5 shrink-0" />

          {/* Loop Toggle */}
          <div className="relative flex items-center pr-0.5 shrink-0">
            <button
              onClick={() => setIsLooping(!isLooping)}
              className={`p-1.5 sm:p-2 rounded-xl text-xs transition-colors cursor-pointer ${
                isLooping
                  ? 'text-cyan-500 dark:text-cyan-400 bg-cyan-500/10'
                  : isDarkMode
                  ? 'text-slate-500 hover:bg-white/10'
                  : 'text-slate-700 hover:bg-black/5'
              }`}
              title={isLooping ? 'Auto-looping active' : 'Repeat loop disabled'}
            >
              <Repeat className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

