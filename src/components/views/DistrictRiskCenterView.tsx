import React, { useState, useMemo } from 'react';
import { DistrictForecast, LeadTime, RiskLevel, SupportedLanguage } from '../../types/meteo';
import { districtsList } from '../../data/mockData';
import { translations } from '../../i18n/translations';
import {
  ShieldAlert,
  Search,
  Filter,
  Download,
  MapPin,
  ArrowUpDown,
  ExternalLink,
  AlertTriangle,
  Droplets,
} from 'lucide-react';

interface DistrictRiskCenterViewProps {
  leadTime: LeadTime;
  onSelectDistrict: (district: DistrictForecast) => void;
  lang: SupportedLanguage;
  isDarkMode: boolean;
}

export const DistrictRiskCenterView: React.FC<DistrictRiskCenterViewProps> = ({
  leadTime,
  onSelectDistrict,
  lang,
  isDarkMode,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<'all' | RiskLevel>('all');
  const [selectedZoneFilter, setSelectedZoneFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'rainfall' | 'risk' | 'name'>('rainfall');

  const t = translations[lang] || translations.en;

  // Filter and sort districts
  const filteredDistricts = useMemo(() => {
    return districtsList
      .filter((d) => {
        const matchesSearch =
          d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.state.toLowerCase().includes(searchQuery.toLowerCase());

        const currentStep = d.rainfalls[leadTime];
        const matchesRisk =
          selectedRiskFilter === 'all' || currentStep.riskLevel === selectedRiskFilter;

        const matchesZone = selectedZoneFilter === 'all' || d.zone === selectedZoneFilter;

        return matchesSearch && matchesRisk && matchesZone;
      })
      .sort((a, b) => {
        const stepA = a.rainfalls[leadTime];
        const stepB = b.rainfalls[leadTime];

        if (sortBy === 'rainfall') {
          return stepB.aiCorrected - stepA.aiCorrected;
        } else if (sortBy === 'risk') {
          const riskWeight: Record<RiskLevel, number> = {
            red: 4,
            orange: 3,
            yellow: 2,
            green: 1,
          };
          return riskWeight[stepB.riskLevel] - riskWeight[stepA.riskLevel];
        } else {
          return a.name.localeCompare(b.name);
        }
      });
  }, [searchQuery, selectedRiskFilter, selectedZoneFilter, sortBy, leadTime]);

  // Count summaries
  const counts = useMemo(() => {
    let red = 0,
      orange = 0,
      yellow = 0,
      green = 0;
    districtsList.forEach((d) => {
      const level = d.rainfalls[leadTime].riskLevel;
      if (level === 'red') red++;
      else if (level === 'orange') orange++;
      else if (level === 'yellow') yellow++;
      else green++;
    });
    return { red, orange, yellow, green, total: districtsList.length };
  }, [leadTime]);

  const getAlertBadge = (level: RiskLevel) => {
    switch (level) {
      case 'red':
        return 'bg-red-100 text-red-800 border-red-300 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/40';
      case 'orange':
        return 'bg-orange-100 text-orange-900 border-orange-300 dark:bg-orange-500/20 dark:text-orange-400 dark:border-orange-500/40';
      case 'yellow':
        return 'bg-amber-100 text-amber-950 border-amber-300 dark:bg-yellow-500/20 dark:text-yellow-400 dark:border-yellow-500/40';
      case 'green':
      default:
        return 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/40';
    }
  };

  return (
    <div className="w-full h-full pt-20 sm:pt-24 pb-16 px-4 sm:px-8 max-w-7xl mx-auto overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-cyan-700 dark:text-cyan-400 text-xs font-mono uppercase tracking-wider font-bold">
            <ShieldAlert className="w-4 h-4" />
            <span>Rain & Flood Warnings by District</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-slate-950 dark:text-white">
            {t.views.districtRisk}
          </h1>
          <p className="text-sm text-slate-800 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed font-medium">
            District-level rainfall advisories and localized flood risks calibrated using high-resolution terrain analysis.
          </p>
        </div>

        {/* Lead time step pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs font-mono">
          <span className="text-slate-800 dark:text-slate-400 font-bold">Forecast Time:</span>
          <span className="font-extrabold text-cyan-800 dark:text-cyan-400">{t.leadTimes[leadTime]}</span>
        </div>
      </div>

      {/* Quick Summary Cards (Red, Orange, Yellow, Green Counts) */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setSelectedRiskFilter('red')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            selectedRiskFilter === 'red'
              ? 'bg-red-100 dark:bg-red-500/20 border-red-500 ring-2 ring-red-500/50'
              : 'bg-red-50/80 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 hover:bg-red-100 dark:hover:bg-red-500/15'
          }`}
        >
          <div className="text-[11px] font-mono text-red-800 dark:text-red-400 font-extrabold uppercase">
            Red Warning
          </div>
          <div className="text-2xl font-mono font-extrabold text-red-800 dark:text-red-300 mt-0.5">{counts.red}</div>
          <div className="text-[11px] text-slate-800 dark:text-slate-400 mt-0.5 font-semibold">Take immediate action</div>
        </button>

        <button
          onClick={() => setSelectedRiskFilter('orange')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            selectedRiskFilter === 'orange'
              ? 'bg-orange-100 dark:bg-orange-500/20 border-orange-500 ring-2 ring-orange-500/50'
              : 'bg-orange-50/80 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/20 hover:bg-orange-100 dark:hover:bg-orange-500/15'
          }`}
        >
          <div className="text-[11px] font-mono text-orange-900 dark:text-orange-400 font-extrabold uppercase">
            Orange Alert
          </div>
          <div className="text-2xl font-mono font-extrabold text-orange-900 dark:text-orange-300 mt-0.5">{counts.orange}</div>
          <div className="text-[11px] text-slate-800 dark:text-slate-400 mt-0.5 font-semibold">Be prepared for extremes</div>
        </button>

        <button
          onClick={() => setSelectedRiskFilter('yellow')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            selectedRiskFilter === 'yellow'
              ? 'bg-amber-100 dark:bg-yellow-500/20 border-amber-500 ring-2 ring-amber-500/50'
              : 'bg-amber-50/80 dark:bg-yellow-500/10 border-amber-200 dark:border-yellow-500/20 hover:bg-amber-100 dark:hover:bg-yellow-500/15'
          }`}
        >
          <div className="text-[11px] font-mono text-amber-900 dark:text-yellow-400 font-extrabold uppercase">
            Yellow Watch
          </div>
          <div className="text-2xl font-mono font-extrabold text-amber-900 dark:text-yellow-300 mt-0.5">{counts.yellow}</div>
          <div className="text-[11px] text-slate-800 dark:text-slate-400 mt-0.5 font-semibold">Maintain vigilance</div>
        </button>

        <button
          onClick={() => setSelectedRiskFilter('green')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            selectedRiskFilter === 'green'
              ? 'bg-emerald-100 dark:bg-emerald-500/20 border-emerald-500 ring-2 ring-emerald-500/50'
              : 'bg-emerald-50/80 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 hover:bg-emerald-100 dark:hover:bg-emerald-500/15'
          }`}
        >
          <div className="text-[11px] font-mono text-emerald-900 dark:text-emerald-400 font-extrabold uppercase">
            Green (Normal)
          </div>
          <div className="text-2xl font-mono font-extrabold text-emerald-900 dark:text-emerald-300 mt-0.5">{counts.green}</div>
          <div className="text-[11px] text-slate-800 dark:text-slate-400 mt-0.5 font-semibold">Normal activity</div>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-600 dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t.riskCenter.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-xl text-xs border focus:outline-none transition-all placeholder:text-slate-500 dark:placeholder:text-slate-400 ${
              isDarkMode
                ? 'bg-slate-900 border-slate-700 text-slate-100 focus:border-cyan-500'
                : 'bg-white border-slate-300 text-slate-950 font-medium focus:border-cyan-600'
            }`}
          />
        </div>

        {/* Filter controls */}
        <div className="flex items-center flex-wrap gap-2 w-full md:w-auto">
          {/* Risk Level Filter Pill */}
          <button
            onClick={() => setSelectedRiskFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              selectedRiskFilter === 'all'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : isDarkMode
                ? 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                : 'bg-white text-slate-900 hover:bg-slate-100 border border-slate-300'
            }`}
          >
            All Alerts ({counts.total})
          </button>

          {/* Topographic Zone Filter */}
          <select
            value={selectedZoneFilter}
            onChange={(e) => setSelectedZoneFilter(e.target.value)}
            className={`px-3 py-1.5 rounded-lg text-xs border focus:outline-none cursor-pointer font-semibold ${
              isDarkMode
                ? 'bg-slate-900 border-slate-700 text-slate-300'
                : 'bg-white border-slate-300 text-slate-900'
            }`}
          >
            <option value="all">All Regions</option>
            <option value="Western Ghats">Western Ghats</option>
            <option value="Himalayan">Himalayan Foothills</option>
            <option value="Central India">Central India</option>
            <option value="Indo-Gangetic">Northern Plains</option>
            <option value="Northeast">Northeast Hills</option>
          </select>

          {/* Sort selector */}
          <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-400 ml-auto md:ml-2 font-semibold">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className={`px-2.5 py-1.5 rounded-lg text-xs border focus:outline-none cursor-pointer font-semibold ${
                isDarkMode
                  ? 'bg-slate-900 border-slate-700 text-slate-300'
                  : 'bg-white border-slate-300 text-slate-900'
              }`}
            >
              <option value="rainfall">Highest Rain (24h)</option>
              <option value="risk">Alert Level (Red to Green)</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>
        </div>
      </div>

      {/* District Cards Grid */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDistricts.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-700 dark:text-slate-500 text-xs font-semibold">
            No districts found matching your current filter criteria.
          </div>
        ) : (
          filteredDistricts.map((district) => {
            const step = district.rainfalls[leadTime];
            const delta = step.aiCorrected - step.rawNwp;

            return (
              <div
                key={district.id}
                onClick={() => onSelectDistrict(district)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer group flex flex-col justify-between ${
                  isDarkMode
                    ? 'bg-slate-900/70 hover:bg-slate-800/80 border-slate-800 hover:border-cyan-500/50'
                    : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-cyan-500/60 shadow-sm'
                }`}
              >
                <div>
                  {/* District header & alert tier */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                        <h3 className="text-slate-950 font-bold text-lg dark:text-white group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition-colors">
                          {district.name}
                        </h3>
                      </div>
                      <div className="text-slate-700 font-semibold text-xs mt-0.5 dark:text-slate-400">
                        {district.state} · <span className="font-mono font-bold text-slate-900 dark:text-slate-200">{district.zone}</span>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getAlertBadge(
                        step.riskLevel
                      )}`}
                    >
                      {step.riskLevel} Alert
                    </span>
                  </div>

                  {/* Rainfall Comparison Numbers (High contrast inner box) */}
                  <div className="mt-4 bg-slate-100 border border-slate-200 rounded-xl p-3 dark:bg-slate-800/80 dark:border-slate-700/60 grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="text-slate-700 font-bold text-xs tracking-wider uppercase dark:text-slate-300">
                        STANDARD NWP
                      </div>
                      <div className="font-mono font-extrabold text-base text-slate-950 dark:text-white mt-0.5">
                        {step.rawNwp} <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">mm</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-cyan-700 font-bold text-xs tracking-wider uppercase dark:text-cyan-400">
                        CALIBRATED
                      </div>
                      <div className="font-mono font-extrabold text-base text-cyan-700 dark:text-cyan-400 mt-0.5">
                        {step.aiCorrected} <span className="text-xs font-semibold text-cyan-700/70 dark:text-cyan-400/70">mm</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-700 font-bold text-xs tracking-wider uppercase dark:text-slate-300">
                        CALIBRATION DELTA
                      </div>
                      <div
                        className={`font-mono font-extrabold text-base mt-0.5 ${
                          delta > 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'
                        }`}
                      >
                        {delta > 0 ? `+${delta}` : delta} <span className="text-xs font-semibold opacity-70">mm</span>
                      </div>
                    </div>
                  </div>

                  {/* Extreme Probability Mini-Meter */}
                  <div className="mt-3.5 space-y-2 text-xs">
                    <div>
                      <div className="flex justify-between items-baseline text-slate-900 font-bold text-xs dark:text-slate-200 mb-1">
                        <span>Heavy (&gt;64.5mm)</span>
                        <span className="font-mono font-extrabold text-amber-800 dark:text-yellow-400">
                          {step.probHeavy}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-yellow-500 h-full rounded-full"
                          style={{ width: `${step.probHeavy}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-baseline text-slate-900 font-bold text-xs dark:text-slate-200 mb-1">
                        <span>Very Heavy (&gt;115.5mm)</span>
                        <span className="font-mono font-extrabold text-orange-800 dark:text-orange-400">
                          {step.probVeryHeavy}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-orange-500 h-full rounded-full"
                          style={{ width: `${step.probVeryHeavy}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Link */}
                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-700 dark:text-slate-400 font-medium">
                  <span className="text-xs truncate max-w-[180px] font-semibold text-slate-800 dark:text-slate-300">
                    {district.synopticMechanism}
                  </span>
                  <span className="text-cyan-700 dark:text-cyan-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1 font-bold shrink-0">
                    View details <ExternalLink className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
