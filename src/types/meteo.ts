export type SynopticRegimeId =
  | 'active_monsoon'
  | 'break_monsoon'
  | 'monsoon_depression'
  | 'orographic_surge'
  | 'western_disturbance';

export type RiskLevel = 'green' | 'yellow' | 'orange' | 'red';

export type LeadTime = 't0' | 't24' | 't48' | 't72' | 't96' | 't120';

export type BasemapLayerId = 'satellite' | 'topographic' | 'dark';

export interface BasemapConfig {
  id: BasemapLayerId;
  name: string;
  description: string;
  thumbnail: string;
  attribution: string;
}

export type AppView =
  | 'precipitation_map'
  | 'regime_intelligence'
  | 'district_risk'
  | 'skill_verification';

export type SupportedLanguage = 'en' | 'hi' | 'bn' | 'ta' | 'te' | 'mr';

export interface SynopticParameters {
  shear850hPa: number; // m/s
  troughLatitude: number; // degrees North (e.g. 23.5)
  mslpGradient: number; // hPa between North and South India
  offshoreVortexIndex: number; // 0 to 10
  moistureConvergence: number; // g/kg/s
  capeValue: number; // J/kg
}

export interface SynopticRegimeInfo {
  id: SynopticRegimeId;
  name: string;
  confidence: number; // 0-100%
  description: string;
  keyDrivers: string[];
  characteristicBiases: string[];
  aiCorrectionStrategy: string;
}

export interface DistrictForecast {
  id: string;
  name: string;
  state: string;
  lat: number;
  lng: number;
  zone: 'Western Ghats' | 'Central India' | 'Northeast' | 'Indo-Gangetic' | 'Himalayan' | 'Peninsular';
  rainfalls: Record<LeadTime, {
    rawNwp: number; // mm / 24h
    aiCorrected: number; // mm / 24h
    riskLevel: RiskLevel;
    probHeavy: number; // >64.5 mm (%)
    probVeryHeavy: number; // >115.5 mm (%)
    probExtremelyHeavy: number; // >204.4 mm (%)
  }>;
  synopticMechanism: string;
  awsStationId?: string;
  liveReadingMm?: number;
}

export interface LiveAwsReading {
  id: string;
  stationName: string;
  district: string;
  state: string;
  rainfall1h: number;
  rainfall24h: number;
  trend: 'rising' | 'steady' | 'falling';
  updatedAt: string;
}

export interface SkillMetricEntry {
  threshold: string;
  rawCsi: number;
  aiCsi: number;
  rawFar: number;
  aiFar: number;
  rawPod: number;
  aiPod: number;
}
