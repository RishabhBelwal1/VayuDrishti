import React, { useState, useEffect } from 'react';
import {
  AppView,
  DistrictForecast,
  LeadTime,
  SupportedLanguage,
  SynopticParameters,
  SynopticRegimeId,
  BasemapLayerId,
} from './types/meteo';
import { operationalSynopticParams, districtsList } from './data/mockData';
import { HistoricalPreset } from './data/historicalPresets';
import { DynamicNavbar } from './components/DynamicNavbar';
import { MapCanvas, DisplayMode } from './components/MapCanvas';
import { WhatIfDrawer } from './components/WhatIfDrawer';
import { DistrictBottomSheet } from './components/DistrictBottomSheet';
import { TimeScrubber } from './components/TimeScrubber';
import { LiveObservationTicker } from './components/LiveObservationTicker';
import { RegimeIntelligenceView } from './components/views/RegimeIntelligenceView';
import { DistrictRiskCenterView } from './components/views/DistrictRiskCenterView';
import { SkillVerificationView } from './components/views/SkillVerificationView';

export default function App() {
  // Navigation & View state
  const [currentView, setCurrentView] = useState<AppView>('precipitation_map');

  // Map layer controls
  const [activeBasemap, setActiveBasemap] = useState<BasemapLayerId>('satellite');
  const [displayMode, setDisplayMode] = useState<DisplayMode>('ai');
  const [radarOpacity, setRadarOpacity] = useState<number>(0.88);
  const [showClouds, setShowClouds] = useState<boolean>(true);
  const [showLightning, setShowLightning] = useState<boolean>(true);
  const [showWindFlow, setShowWindFlow] = useState<boolean>(true);

  // Forecast Lead Time step (Day 1 through Day 5)
  const [leadTime, setLeadTime] = useState<LeadTime>('t24');

  // Selected district for drilldown bottom sheet
  const [activeDistrict, setActiveDistrict] = useState<DistrictForecast | null>(null);

  // i18n Language support
  const [lang, setLang] = useState<SupportedLanguage>('en');

  // Theme support (default in dark mode for satellite radar glassmorphism)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  // Synoptic Sandbox & What-If state
  const [isWhatIfOpen, setIsWhatIfOpen] = useState<boolean>(false);
  const [synopticParams, setSynopticParams] = useState<SynopticParameters>(operationalSynopticParams);

  // Map interaction tracking for dynamic navbar auto-hide
  const [isMapDragging, setIsMapDragging] = useState<boolean>(false);

  // Map center/zoom control for 1-click historical presets
  const [targetMapCenter, setTargetMapCenter] = useState<{
    lat: number;
    lng: number;
    zoom: number;
    key?: string;
  } | null>(null);

  // 1-Click Historical Preset Handler
  const handleSelectPreset = (preset: HistoricalPreset) => {
    // 1. Update synoptic parameters (triggers active regime shift and recalculates canvas what-if offsets)
    setSynopticParams(preset.synopticParams);
    // 2. Set forecast lead time to peak cycle
    setLeadTime(preset.leadTime);
    // 3. Switch to precipitation map view so evaluator sees the map immediately
    setCurrentView('precipitation_map');
    // 4. Center map on event epicenter
    setTargetMapCenter({
      lat: preset.center[0],
      lng: preset.center[1],
      zoom: preset.zoom,
      key: `${preset.id}-${Date.now()}`,
    });
    // 5. Activate target district and open bottom sheet
    const district = districtsList.find((d) => d.id === preset.districtId) || null;
    setActiveDistrict(district);
  };

  // Determine active regime from synoptic params
  const currentRegime: SynopticRegimeId = React.useMemo(() => {
    if (synopticParams.troughLatitude >= 26.0 && synopticParams.shear850hPa < 14) {
      return 'break_monsoon';
    }
    if (synopticParams.shear850hPa >= 20.0 && synopticParams.offshoreVortexIndex >= 6.5) {
      return 'orographic_surge';
    }
    if (synopticParams.offshoreVortexIndex >= 8.0 && synopticParams.mslpGradient >= 14) {
      return 'monsoon_depression';
    }
    if (synopticParams.troughLatitude > 28.5) {
      return 'western_disturbance';
    }
    return 'active_monsoon';
  }, [synopticParams]);

  // Sync theme with document element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.className = 'bg-slate-950 text-slate-100 antialiased overflow-hidden select-none';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.className = 'bg-slate-100 text-slate-900 antialiased overflow-hidden select-none';
    }
  }, [isDarkMode]);

  const regimeConfidence =
    currentRegime === 'active_monsoon'
      ? 94
      : currentRegime === 'orographic_surge'
      ? 88
      : currentRegime === 'break_monsoon'
      ? 82
      : 85;

  return (
    <div className={`relative w-screen h-screen overflow-hidden ${isDarkMode ? 'dark' : ''}`}>
      {/* 1. Single Unified Top Container */}
      <DynamicNavbar
        currentView={currentView}
        onViewChange={(view) => setCurrentView(view)}
        lang={lang}
        onLanguageChange={setLang}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
        onOpenWhatIf={() => setIsWhatIfOpen(true)}
        confidence={regimeConfidence}
        onSelectPreset={handleSelectPreset}
        activeBasemap={activeBasemap}
        onSelectBasemap={setActiveBasemap}
        displayMode={displayMode}
        onSelectDisplayMode={setDisplayMode}
        radarOpacity={radarOpacity}
        onChangeRadarOpacity={setRadarOpacity}
        showClouds={showClouds}
        onToggleClouds={setShowClouds}
        showLightning={showLightning}
        onToggleLightning={setShowLightning}
        showWindFlow={showWindFlow}
        onToggleWindFlow={setShowWindFlow}
      />

      {/* 2. Main Viewport Stage */}
      <main className={`w-full h-full relative ${currentView !== 'precipitation_map' ? (isDarkMode ? 'bg-slate-950' : 'bg-slate-100') : ''}`}>
        {currentView === 'precipitation_map' && (
          <>
            {/* Full-Viewport Geospatial Canvas */}
            <MapCanvas
              leadTime={leadTime}
              activeDistrict={activeDistrict}
              onSelectDistrict={setActiveDistrict}
              lang={lang}
              isDarkMode={isDarkMode}
              onMapInteracting={setIsMapDragging}
              whatIfShift={{
                troughLat: synopticParams.troughLatitude,
                shear850: synopticParams.shear850hPa,
              }}
              activeBasemap={activeBasemap}
              displayMode={displayMode}
              radarOpacity={radarOpacity}
              showClouds={showClouds}
              showLightning={showLightning}
              showWindFlow={showWindFlow}
              onToggleWindFlow={setShowWindFlow}
              targetCenter={targetMapCenter}
            />

            {/* Live Observation Ticker Chip (Bottom-Left) */}
            <LiveObservationTicker
              isDarkMode={isDarkMode}
              onSelectStation={(lat, lng, name) => {
                const match = districtsList.find(
                  (d) =>
                    name.toLowerCase().includes(d.name.toLowerCase()) ||
                    d.name.toLowerCase().includes(name.toLowerCase())
                );
                if (match) {
                  setActiveDistrict(match);
                }
              }}
            />

            {/* Floating Time Scrubber (Bottom-Center) */}
            <TimeScrubber
              leadTime={leadTime}
              onLeadTimeChange={setLeadTime}
              lang={lang}
              isDarkMode={isDarkMode}
            />
          </>
        )}

        {currentView === 'regime_intelligence' && (
          <RegimeIntelligenceView
            currentRegime={currentRegime}
            onSelectRegime={(id) => {
              if (id === 'break_monsoon') {
                setSynopticParams((prev) => ({ ...prev, troughLatitude: 27.5, shear850hPa: 10 }));
              } else if (id === 'orographic_surge') {
                setSynopticParams((prev) => ({ ...prev, shear850hPa: 24, offshoreVortexIndex: 8 }));
              } else if (id === 'monsoon_depression') {
                setSynopticParams((prev) => ({ ...prev, offshoreVortexIndex: 9, mslpGradient: 16 }));
              } else {
                setSynopticParams(operationalSynopticParams);
              }
            }}
            onOpenWhatIf={() => setIsWhatIfOpen(true)}
            lang={lang}
            isDarkMode={isDarkMode}
          />
        )}

        {currentView === 'district_risk' && (
          <DistrictRiskCenterView
            leadTime={leadTime}
            onSelectDistrict={(d) => {
              setActiveDistrict(d);
            }}
            lang={lang}
            isDarkMode={isDarkMode}
          />
        )}

        {currentView === 'skill_verification' && (
          <SkillVerificationView lang={lang} isDarkMode={isDarkMode} />
        )}
      </main>

      {/* 3. District Detail Bottom Sheet (Drill-Down) */}
      <DistrictBottomSheet
        district={activeDistrict}
        onClose={() => setActiveDistrict(null)}
        leadTime={leadTime}
        lang={lang}
        isDarkMode={isDarkMode}
      />

      {/* 4. What-If Synoptic Sandbox Drawer */}
      <WhatIfDrawer
        isOpen={isWhatIfOpen}
        onClose={() => setIsWhatIfOpen(false)}
        params={synopticParams}
        onChangeParams={setSynopticParams}
        lang={lang}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}
