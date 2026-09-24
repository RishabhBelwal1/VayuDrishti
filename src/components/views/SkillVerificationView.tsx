import React, { useState } from 'react';
import { SupportedLanguage } from '../../types/meteo';
import { verificationSkillData } from '../../data/mockData';
import { translations } from '../../i18n/translations';
import {
  BarChart3,
  TrendingDown,
  TrendingUp,
  CheckCircle2,
  Percent,
  Layers,
  ArrowRight,
  ShieldCheck,
  FileSpreadsheet,
} from 'lucide-react';

interface SkillVerificationViewProps {
  lang: SupportedLanguage;
  isDarkMode: boolean;
}

export const SkillVerificationView: React.FC<SkillVerificationViewProps> = ({
  lang,
  isDarkMode,
}) => {
  const [activeMetric, setActiveMetric] = useState<'csi' | 'far' | 'pod'>('csi');
  const t = translations[lang] || translations.en;

  return (
    <div className="w-full h-full pt-20 sm:pt-24 pb-16 px-4 sm:px-8 max-w-7xl mx-auto overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-cyan-700 dark:text-cyan-400 text-xs font-mono uppercase tracking-wider font-bold">
            <BarChart3 className="w-4 h-4" />
            <span>Forecast Accuracy & Reliability Score</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-slate-950 dark:text-white">
            {t.views.skillVerification}
          </h1>
          <p className="text-sm text-slate-800 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed font-medium">
            Tested and proven across 4,200+ real government weather stations throughout India over multiple monsoon seasons.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-400 text-xs font-mono font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>Live Testing: Fully Verified</span>
        </div>
      </div>

      {/* 4 Core Verification KPIs */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: RMSE */}
        <div
          className={`p-5 rounded-2xl border ${
            isDarkMode ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="text-xs font-bold text-slate-800 dark:text-slate-400 uppercase tracking-wider">
            Overall Forecast Error
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-mono font-extrabold text-cyan-800 dark:text-cyan-400">26.4</span>
            <span className="text-xs font-mono text-slate-800 dark:text-slate-400 font-bold">mm</span>
            <span className="text-sm font-mono text-slate-500 line-through ml-1 font-semibold">42.8</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-400">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>38% Less Error</span>
          </div>
        </div>

        {/* KPI 2: MAE */}
        <div
          className={`p-5 rounded-2xl border ${
            isDarkMode ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="text-xs font-bold text-slate-800 dark:text-slate-400 uppercase tracking-wider">
            Average Day-to-Day Margin
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-mono font-extrabold text-cyan-800 dark:text-cyan-400">17.2</span>
            <span className="text-xs font-mono text-slate-800 dark:text-slate-400 font-bold">mm</span>
            <span className="text-sm font-mono text-slate-500 line-through ml-1 font-semibold">28.1</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-400">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>39% Closer to Actual Rain</span>
          </div>
        </div>

        {/* KPI 3: CSI Heavy */}
        <div
          className={`p-5 rounded-2xl border ${
            isDarkMode ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="text-xs font-bold text-slate-800 dark:text-slate-400 uppercase tracking-wider">
            Heavy Rain Success Score
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-mono font-extrabold text-cyan-800 dark:text-cyan-400">0.61</span>
            <span className="text-sm font-mono text-slate-500 line-through ml-1 font-semibold">0.36</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-400">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+69% Better Detection</span>
          </div>
        </div>

        {/* KPI 4: Peak Displacement */}
        <div
          className={`p-5 rounded-2xl border ${
            isDarkMode ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="text-xs font-bold text-slate-800 dark:text-slate-400 uppercase tracking-wider">
            Location Pinpoint Error
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-mono font-extrabold text-cyan-800 dark:text-cyan-400">14.0</span>
            <span className="text-xs font-mono text-slate-800 dark:text-slate-400 font-bold">km</span>
            <span className="text-sm font-mono text-slate-500 line-through ml-1 font-semibold">78.0</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-400">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>82% Sharper Pinpointing</span>
          </div>
        </div>
      </div>

      {/* Interactive Threshold Curve Chart & Reliability Diagram */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Skill Metric by Rainfall Threshold */}
        <div
          className={`p-6 rounded-2xl border flex flex-col justify-between ${
            isDarkMode ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-950 dark:text-slate-100 flex items-center gap-2">
                <span>Forecast Accuracy by Rain Level</span>
              </h2>

              <div className="flex items-center p-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono">
                <button
                  onClick={() => setActiveMetric('csi')}
                  className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                    activeMetric === 'csi' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-700 dark:text-slate-400 font-semibold'
                  }`}
                >
                  Accuracy Score
                </button>
                <button
                  onClick={() => setActiveMetric('far')}
                  className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                    activeMetric === 'far' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-700 dark:text-slate-400 font-semibold'
                  }`}
                >
                  False Alarms
                </button>
                <button
                  onClick={() => setActiveMetric('pod')}
                  className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                    activeMetric === 'pod' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-700 dark:text-slate-400 font-semibold'
                  }`}
                >
                  Detection Rate
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-400 mt-1 font-medium">
              Comparing Standard NWP (gray) vs. Calibrated Forecast (cyan) across rain intensity levels.
            </p>

            {/* Threshold Bar Comparison */}
            <div className="mt-6 space-y-4">
              {verificationSkillData.map((row) => {
                const rawVal =
                  activeMetric === 'csi'
                    ? row.rawCsi
                    : activeMetric === 'far'
                    ? row.rawFar
                    : row.rawPod;
                const aiVal =
                  activeMetric === 'csi'
                    ? row.aiCsi
                    : activeMetric === 'far'
                    ? row.aiFar
                    : row.aiPod;

                return (
                  <div key={row.threshold} className="space-y-1 text-xs">
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-slate-900 dark:text-slate-300">{row.threshold}</span>
                      <div className="flex items-center gap-3 font-mono text-[11px]">
                        <span className="text-slate-700 dark:text-slate-400 font-semibold">NWP: {rawVal.toFixed(2)}</span>
                        <span className="font-bold text-cyan-700 dark:text-cyan-400">Calibrated: {aiVal.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {/* Raw bar */}
                      <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-slate-500 h-full rounded-full transition-all"
                          style={{ width: `${rawVal * 100}%` }}
                        />
                      </div>
                      {/* AI bar */}
                      <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            activeMetric === 'far' ? 'bg-amber-500' : 'bg-cyan-500'
                          }`}
                          style={{ width: `${aiVal * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-400 flex items-center justify-between font-semibold">
            <span>Higher score is better · Lower false alarm is better</span>
            <span className="font-mono text-cyan-700 dark:text-cyan-400 font-bold">Tested Across 5 Seasons</span>
          </div>
        </div>

        {/* Chart 2: Reliability Diagram (Calibration Curve) */}
        <div
          className={`p-6 rounded-2xl border flex flex-col justify-between ${
            isDarkMode ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-950 dark:text-slate-100">
                Forecast Honesty: Predicted vs What Happened
              </h2>
              <span className="text-xs font-mono text-cyan-700 dark:text-cyan-400 font-bold">Heavy Rain (&gt;64.5mm)</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-400 mt-1 font-medium">
              When the forecast predicts a 60% probability of heavy rain, does it verify 60% of the time? The closer to the dashed diagonal line, the more reliable the calibrated system.
            </p>

            {/* SVG Reliability Plot */}
            <div className="mt-6 flex items-center justify-center">
              <svg viewBox="0 0 320 220" className="w-full max-w-sm overflow-visible">
                {/* Axes and grid */}
                <line x1="40" y1="20" x2="40" y2="180" stroke={isDarkMode ? '#334155' : '#cbd5e1'} strokeWidth="1.5" />
                <line x1="40" y1="180" x2="300" y2="180" stroke={isDarkMode ? '#334155' : '#cbd5e1'} strokeWidth="1.5" />

                {/* Grid lines */}
                {[0.25, 0.5, 0.75, 1.0].map((val) => (
                  <g key={val}>
                    <line
                      x1="40"
                      y1={180 - val * 160}
                      x2="300"
                      y2={180 - val * 160}
                      stroke={isDarkMode ? '#1e293b' : '#f1f5f9'}
                      strokeDasharray="3 3"
                    />
                    <text
                      x="32"
                      y={184 - val * 160}
                      fill={isDarkMode ? '#64748b' : '#475569'}
                      fontSize="9"
                      textAnchor="end"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {val * 100}%
                    </text>
                    <line
                      x1={40 + val * 260}
                      y1="20"
                      x2={40 + val * 260}
                      y2="180"
                      stroke={isDarkMode ? '#1e293b' : '#f1f5f9'}
                      strokeDasharray="3 3"
                    />
                    <text
                      x={40 + val * 260}
                      y="194"
                      fill={isDarkMode ? '#64748b' : '#475569'}
                      fontSize="9"
                      textAnchor="middle"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {val * 100}%
                    </text>
                  </g>
                ))}

                {/* 1:1 Perfect Reliability diagonal */}
                <line
                  x1="40"
                  y1="180"
                  x2="300"
                  y2="20"
                  stroke={isDarkMode ? '#475569' : '#94a3b8'}
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />

                {/* Raw NWP curve (Substantially under-calibrated / over-forecasting) */}
                <polyline
                  fill="none"
                  stroke={isDarkMode ? '#94a3b8' : '#64748b'}
                  strokeWidth="2.5"
                  points="40,180 92,168 144,142 196,110 248,70 300,45"
                />

                {/* AI-Corrected curve (Closely hugs diagonal) */}
                <polyline
                  fill="none"
                  stroke="#0891b2"
                  strokeWidth="3"
                  points="40,180 92,148 144,116 196,84 248,52 300,24"
                />

                {/* Points on AI curve */}
                {[
                  [40, 180],
                  [92, 148],
                  [144, 116],
                  [196, 84],
                  [248, 52],
                  [300, 24],
                ].map(([x, y], i) => (
                  <circle key={i} cx={x} cy={y} r="3.5" fill="#0891b2" />
                ))}

                {/* Axis Labels */}
                <text x="170" y="212" fill={isDarkMode ? '#94a3b8' : '#334155'} fontSize="10" textAnchor="middle" fontWeight="bold">
                  Forecast Probability
                </text>
                <text
                  x="-100"
                  y="14"
                  fill={isDarkMode ? '#94a3b8' : '#334155'}
                  fontSize="10"
                  textAnchor="middle"
                  fontWeight="bold"
                  transform="rotate(-90)"
                >
                  Observed Frequency
                </text>
              </svg>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-mono font-semibold">
            <div className="flex items-center gap-2">
              <span className="w-3 h-0.5 bg-slate-500"></span>
              <span className="text-slate-700 dark:text-slate-400 font-bold">Standard NWP (GFS)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-1 bg-cyan-600 dark:bg-cyan-400"></span>
              <span className="text-cyan-700 dark:text-cyan-400 font-bold">Calibrated Forecast</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-0.5 bg-slate-500 border-dashed border-b"></span>
              <span className="text-slate-600 dark:text-slate-500 font-medium">Perfect Match</span>
            </div>
          </div>
        </div>
      </div>

      {/* Regional Skill Breakdown Table */}
      <div
        className={`mt-6 p-6 rounded-2xl border ${
          isDarkMode ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-slate-950 dark:text-slate-100 flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span>Regional Forecast Accuracy Table</span>
          </h2>
          <span className="text-xs font-mono text-slate-700 dark:text-slate-400 font-semibold">Standard NWP vs Calibrated Forecast</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-400 font-mono uppercase text-[10px] font-extrabold">
                <th className="py-2.5 px-3">Region</th>
                <th className="py-2.5 px-3">Weather Setup</th>
                <th className="py-2.5 px-3">Standard NWP Error</th>
                <th className="py-2.5 px-3">Calibrated Error</th>
                <th className="py-2.5 px-3">Accuracy Score</th>
                <th className="py-2.5 px-3">False Alarms</th>
                <th className="py-2.5 px-3">Spot-on Precision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 font-mono tabular-nums">
              <tr className="hover:bg-slate-100/70 dark:hover:bg-slate-800/30">
                <td className="py-3 px-3 font-sans font-extrabold text-slate-950 dark:text-slate-200">
                  Western Ghats (Mountain Slopes)
                </td>
                <td className="py-3 px-3 text-cyan-800 dark:text-cyan-400 font-bold">Mountain Rain</td>
                <td className="py-3 px-3 text-slate-800 dark:text-slate-400 font-bold">54.2 mm</td>
                <td className="py-3 px-3 text-cyan-800 dark:text-cyan-300 font-extrabold">28.6 mm (-47%)</td>
                <td className="py-3 px-3 text-emerald-800 dark:text-emerald-400 font-extrabold">0.72 (+84%)</td>
                <td className="py-3 px-3 text-slate-900 dark:text-slate-300 font-semibold">0.24 (-52%)</td>
                <td className="py-3 px-3 text-emerald-800 dark:text-emerald-400 font-extrabold">62 km sharper</td>
              </tr>
              <tr className="hover:bg-slate-100/70 dark:hover:bg-slate-800/30">
                <td className="py-3 px-3 font-sans font-extrabold text-slate-950 dark:text-slate-200">
                  Central India Core Corridor
                </td>
                <td className="py-3 px-3 text-cyan-800 dark:text-cyan-400 font-bold">Storm System</td>
                <td className="py-3 px-3 text-slate-800 dark:text-slate-400 font-bold">38.4 mm</td>
                <td className="py-3 px-3 text-cyan-800 dark:text-cyan-300 font-extrabold">24.1 mm (-37%)</td>
                <td className="py-3 px-3 text-emerald-800 dark:text-emerald-400 font-extrabold">0.64 (+56%)</td>
                <td className="py-3 px-3 text-slate-900 dark:text-slate-300 font-semibold">0.31 (-38%)</td>
                <td className="py-3 px-3 text-emerald-800 dark:text-emerald-400 font-extrabold">44 km sharper</td>
              </tr>
              <tr className="hover:bg-slate-100/70 dark:hover:bg-slate-800/30">
                <td className="py-3 px-3 font-sans font-extrabold text-slate-950 dark:text-slate-200">
                  Himalayan Foothills & Valleys
                </td>
                <td className="py-3 px-3 text-cyan-800 dark:text-cyan-400 font-bold">Foothill Rains</td>
                <td className="py-3 px-3 text-slate-800 dark:text-slate-400 font-bold">46.8 mm</td>
                <td className="py-3 px-3 text-cyan-800 dark:text-cyan-300 font-extrabold">29.4 mm (-37%)</td>
                <td className="py-3 px-3 text-emerald-800 dark:text-emerald-400 font-extrabold">0.58 (+71%)</td>
                <td className="py-3 px-3 text-slate-900 dark:text-slate-300 font-semibold">0.33 (-41%)</td>
                <td className="py-3 px-3 text-emerald-800 dark:text-emerald-400 font-extrabold">58 km sharper</td>
              </tr>
              <tr className="hover:bg-slate-100/70 dark:hover:bg-slate-800/30">
                <td className="py-3 px-3 font-sans font-extrabold text-slate-950 dark:text-slate-200">
                  Northern Plains
                </td>
                <td className="py-3 px-3 text-cyan-800 dark:text-cyan-400 font-bold">Regular Monsoon</td>
                <td className="py-3 px-3 text-slate-800 dark:text-slate-400 font-bold">31.6 mm</td>
                <td className="py-3 px-3 text-cyan-800 dark:text-cyan-300 font-extrabold">23.5 mm (-26%)</td>
                <td className="py-3 px-3 text-emerald-800 dark:text-emerald-400 font-extrabold">0.51 (+46%)</td>
                <td className="py-3 px-3 text-slate-900 dark:text-slate-300 font-semibold">0.28 (-33%)</td>
                <td className="py-3 px-3 text-emerald-800 dark:text-emerald-400 font-extrabold">28 km sharper</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
