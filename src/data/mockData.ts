import {
  BasemapConfig,
  BasemapLayerId,
  DistrictForecast,
  LeadTime,
  LiveAwsReading,
  SkillMetricEntry,
  SynopticParameters,
  SynopticRegimeId,
  SynopticRegimeInfo,
} from '../types/meteo';

export const basemapLayersConfig: Record<BasemapLayerId, BasemapConfig> = {
  satellite: {
    id: 'satellite',
    name: 'Satellite View',
    description: 'Realistic satellite view showing forests, coastlines, and mountains',
    thumbnail: 'https://images.unsplash.com/photo-1544984243-ec57ea16fe25?auto=format&fit=crop&w=200&q=80',
    attribution: 'Tiles © Esri, NASA, USGS',
  },
  topographic: {
    id: 'topographic',
    name: 'Hills & Mountains',
    description: 'Clear elevation contours showing mountain slopes and valleys',
    thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=200&q=80',
    attribution: 'Map data: © OpenStreetMap contributors, OpenTopoMap',
  },
  dark: {
    id: 'dark',
    name: 'Night Canvas',
    description: 'Clean dark background that highlights rain colors and wind flows',
    thumbnail: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=200&q=80',
    attribution: '© OpenStreetMap contributors, © CARTO',
  },
};

export const operationalSynopticParams: SynopticParameters = {
  shear850hPa: 18.5,
  troughLatitude: 22.8,
  mslpGradient: 12.4,
  offshoreVortexIndex: 7.8,
  moistureConvergence: 8.6,
  capeValue: 2450,
};

export const synopticRegimesData: Record<SynopticRegimeId, SynopticRegimeInfo> = {
  active_monsoon: {
    id: 'active_monsoon',
    name: 'Heavy Monsoon Rain',
    confidence: 94,
    description: 'A powerful monsoon rain belt stretches across central India and the western coastline, bringing continuous heavy showers to states and mountain slopes.',
    keyDrivers: [
      'Strong sea breezes loaded with ocean moisture',
      'Rain belt locked across central India',
      'Dense cloud line along the west coast',
      'Steady inflow of humid air from the Arabian Sea',
    ],
    characteristicBiases: [
      'Old models spread the rain too far inland and miss the biggest mountain peaks',
      'Old forecasts underestimate the hardest cloudbursts (>150 mm/day)',
      'Old models predict rain over dry eastern plains where it does not fall',
    ],
    aiCorrectionStrategy: 'AI locks the heaviest rain directly onto the mountain slopes where clouds actually drop their water.',
  },
  break_monsoon: {
    id: 'break_monsoon',
    name: 'Rain Break (Dry Spell)',
    confidence: 12,
    description: 'The main rain belt has moved north into the Himalayan foothills. Most of central and southern India enjoys warm, dry, sunny weather while northern hills get intense rain.',
    keyDrivers: [
      'Rain clouds pushed far north into the mountains',
      'Dry sunny skies over central and southern states',
      'Lighter winds across the plains',
      'Rain focused on rivers flowing from the northern hills',
    ],
    characteristicBiases: [
      'Old models falsely predict rain in central states during dry spells',
      'Old models are slow to catch sudden hill floods in the north',
    ],
    aiCorrectionStrategy: 'AI recognizes the dry break immediately, clearing away false rain alerts across central India.',
  },
  monsoon_depression: {
    id: 'monsoon_depression',
    name: 'Low Pressure Storm',
    confidence: 35,
    description: 'A swirling storm system has spun up over the Bay of Bengal and is travelling inland across Odisha and central states, producing strong gusts and torrential rain.',
    keyDrivers: [
      'Circular storm clouds swirling counter-clockwise',
      'Significant drop in air pressure over the sea',
      'Gusty winds and heavy squalls',
      'Strongest rain falling southwest of the storm center',
    ],
    characteristicBiases: [
      'Old models predict the storm track 80 to 160 km off target',
      'Old models put rain in the wrong part of the storm swirl',
    ],
    aiCorrectionStrategy: 'AI follows the real center of the storm swirl to accurately pinpoint where the flood-heavy rain bands will land.',
  },
  orographic_surge: {
    id: 'orographic_surge',
    name: 'Mountain Rain',
    confidence: 88,
    description: 'Humid sea winds crash directly into the steep Western Ghats mountains, forcing massive cloud buildup and triggering intense downpours on the hill crests.',
    keyDrivers: [
      'Very fast moist winds blowing straight against the hills',
      'Clouds forced rapidly upward by steep mountain cliffs',
      'Mini cloud swirl along the Konkan and Goa coast',
      'Near 100% moisture in the air up to the peaks',
    ],
    characteristicBiases: [
      'Old models flatten high mountains into gentle hills on their map grid',
      'Old forecasts miss intense mountain cloudbursts at places like Wayanad and Agumbe',
      'Old models smear mountain rain onto the dry plains behind the hills',
    ],
    aiCorrectionStrategy: 'AI uses sharp 3D mountain maps to concentrate rainfall right on the windward slopes where clouds hit.',
  },
  western_disturbance: {
    id: 'western_disturbance',
    name: 'Northern Hill Showers',
    confidence: 18,
    description: 'Cool northern air meets warm monsoon humidity, sparking sudden thundershowers and cooler temperatures across Himachal Pradesh, Uttarakhand, and northern plains.',
    keyDrivers: [
      'High-altitude cool winds crossing northern borders',
      'Cool northern air meeting humid monsoon clouds',
      'Sudden localized thunderstorms in valleys and hill ridges',
    ],
    characteristicBiases: [
      'Old models struggle with the jagged Himalayan ridges and valleys',
      'Old forecasts often get the arrival time of hill storms wrong',
    ],
    aiCorrectionStrategy: 'AI accurately pairs high-altitude mountain wind shifts with valley humidity to time showers cleanly.',
  },
};

export const districtsList: DistrictForecast[] = [
  {
    id: 'wayanad',
    name: 'Wayanad',
    state: 'Kerala',
    lat: 11.6854,
    lng: 76.132,
    zone: 'Western Ghats',
    synopticMechanism: 'Moist sea winds hit the steep hills, triggering heavy mountain downpours.',
    awsStationId: 'AWS-KER-WY01',
    liveReadingMm: 98.4,
    rainfalls: {
      t0: { rawNwp: 52, aiCorrected: 88, riskLevel: 'red', probHeavy: 98, probVeryHeavy: 85, probExtremelyHeavy: 42 },
      t24: { rawNwp: 112, aiCorrected: 184, riskLevel: 'red', probHeavy: 98, probVeryHeavy: 88, probExtremelyHeavy: 46 },
      t48: { rawNwp: 94, aiCorrected: 152, riskLevel: 'orange', probHeavy: 92, probVeryHeavy: 74, probExtremelyHeavy: 28 },
      t72: { rawNwp: 72, aiCorrected: 104, riskLevel: 'orange', probHeavy: 82, probVeryHeavy: 52, probExtremelyHeavy: 14 },
      t96: { rawNwp: 48, aiCorrected: 62, riskLevel: 'yellow', probHeavy: 58, probVeryHeavy: 24, probExtremelyHeavy: 5 },
      t120: { rawNwp: 32, aiCorrected: 40, riskLevel: 'yellow', probHeavy: 38, probVeryHeavy: 12, probExtremelyHeavy: 2 },
    },
  },
  {
    id: 'mumbai',
    name: 'Mumbai Suburban',
    state: 'Maharashtra',
    lat: 19.076,
    lng: 72.8777,
    zone: 'Western Ghats',
    synopticMechanism: 'Thick rain clouds from the sea meet warm city air, bringing heavy coastal showers.',
    awsStationId: 'AWS-MAH-MUM02',
    liveReadingMm: 74.2,
    rainfalls: {
      t0: { rawNwp: 42, aiCorrected: 68, riskLevel: 'orange', probHeavy: 89, probVeryHeavy: 72, probExtremelyHeavy: 28 },
      t24: { rawNwp: 88, aiCorrected: 142, riskLevel: 'orange', probHeavy: 94, probVeryHeavy: 78, probExtremelyHeavy: 34 },
      t48: { rawNwp: 124, aiCorrected: 218, riskLevel: 'red', probHeavy: 99, probVeryHeavy: 92, probExtremelyHeavy: 62 },
      t72: { rawNwp: 82, aiCorrected: 116, riskLevel: 'orange', probHeavy: 86, probVeryHeavy: 64, probExtremelyHeavy: 19 },
      t96: { rawNwp: 52, aiCorrected: 68, riskLevel: 'yellow', probHeavy: 64, probVeryHeavy: 31, probExtremelyHeavy: 8 },
      t120: { rawNwp: 38, aiCorrected: 44, riskLevel: 'green', probHeavy: 42, probVeryHeavy: 15, probExtremelyHeavy: 3 },
    },
  },
  {
    id: 'ratnagiri',
    name: 'Ratnagiri',
    state: 'Maharashtra',
    lat: 16.9902,
    lng: 73.312,
    zone: 'Western Ghats',
    synopticMechanism: 'Storm clouds blowing in directly from the sea, dropping intense rain along coastal hills.',
    awsStationId: 'AWS-MAH-RTN01',
    liveReadingMm: 112.0,
    rainfalls: {
      t0: { rawNwp: 58, aiCorrected: 96, riskLevel: 'red', probHeavy: 96, probVeryHeavy: 86, probExtremelyHeavy: 44 },
      t24: { rawNwp: 130, aiCorrected: 198, riskLevel: 'red', probHeavy: 99, probVeryHeavy: 89, probExtremelyHeavy: 52 },
      t48: { rawNwp: 108, aiCorrected: 164, riskLevel: 'red', probHeavy: 95, probVeryHeavy: 82, probExtremelyHeavy: 38 },
      t72: { rawNwp: 76, aiCorrected: 110, riskLevel: 'orange', probHeavy: 84, probVeryHeavy: 58, probExtremelyHeavy: 16 },
      t96: { rawNwp: 45, aiCorrected: 58, riskLevel: 'yellow', probHeavy: 52, probVeryHeavy: 21, probExtremelyHeavy: 4 },
      t120: { rawNwp: 28, aiCorrected: 34, riskLevel: 'green', probHeavy: 30, probVeryHeavy: 8, probExtremelyHeavy: 1 },
    },
  },
  {
    id: 'pune',
    name: 'Pune (Ghats Catchment)',
    state: 'Maharashtra',
    lat: 18.5204,
    lng: 73.8567,
    zone: 'Western Ghats',
    synopticMechanism: 'Heavy rain on the western hills (Lonavala), tapering off quickly into lighter showers in the city.',
    awsStationId: 'AWS-MAH-PUN01',
    liveReadingMm: 52.8,
    rainfalls: {
      t0: { rawNwp: 31, aiCorrected: 28, riskLevel: 'yellow', probHeavy: 55, probVeryHeavy: 24, probExtremelyHeavy: 5 },
      t24: { rawNwp: 72, aiCorrected: 64, riskLevel: 'yellow', probHeavy: 68, probVeryHeavy: 36, probExtremelyHeavy: 9 },
      t48: { rawNwp: 95, aiCorrected: 82, riskLevel: 'orange', probHeavy: 79, probVeryHeavy: 48, probExtremelyHeavy: 16 },
      t72: { rawNwp: 60, aiCorrected: 48, riskLevel: 'yellow', probHeavy: 54, probVeryHeavy: 22, probExtremelyHeavy: 4 },
      t96: { rawNwp: 36, aiCorrected: 28, riskLevel: 'green', probHeavy: 32, probVeryHeavy: 9, probExtremelyHeavy: 1 },
      t120: { rawNwp: 22, aiCorrected: 18, riskLevel: 'green', probHeavy: 18, probVeryHeavy: 4, probExtremelyHeavy: 0 },
    },
  },
  {
    id: 'shimla',
    name: 'Shimla',
    state: 'Himachal Pradesh',
    lat: 31.1048,
    lng: 77.1734,
    zone: 'Himalayan',
    synopticMechanism: 'Cool mountain winds rising up steep Himalayan valleys, causing sudden heavy showers.',
    awsStationId: 'AWS-HP-SHM01',
    liveReadingMm: 42.6,
    rainfalls: {
      t0: { rawNwp: 26, aiCorrected: 38, riskLevel: 'yellow', probHeavy: 64, probVeryHeavy: 32, probExtremelyHeavy: 9 },
      t24: { rawNwp: 55, aiCorrected: 84, riskLevel: 'orange', probHeavy: 81, probVeryHeavy: 54, probExtremelyHeavy: 21 },
      t48: { rawNwp: 64, aiCorrected: 96, riskLevel: 'orange', probHeavy: 87, probVeryHeavy: 62, probExtremelyHeavy: 26 },
      t72: { rawNwp: 40, aiCorrected: 58, riskLevel: 'yellow', probHeavy: 61, probVeryHeavy: 28, probExtremelyHeavy: 7 },
      t96: { rawNwp: 28, aiCorrected: 36, riskLevel: 'green', probHeavy: 35, probVeryHeavy: 11, probExtremelyHeavy: 2 },
      t120: { rawNwp: 18, aiCorrected: 22, riskLevel: 'green', probHeavy: 20, probVeryHeavy: 5, probExtremelyHeavy: 0 },
    },
  },
  {
    id: 'patna',
    name: 'Patna',
    state: 'Bihar',
    lat: 25.5941,
    lng: 85.1376,
    zone: 'Indo-Gangetic',
    synopticMechanism: 'Monsoon clouds passing over the Ganga plains, bringing overcast skies and steady showers.',
    awsStationId: 'AWS-BIH-PAT01',
    liveReadingMm: 28.5,
    rainfalls: {
      t0: { rawNwp: 18, aiCorrected: 16, riskLevel: 'green', probHeavy: 32, probVeryHeavy: 10, probExtremelyHeavy: 2 },
      t24: { rawNwp: 42, aiCorrected: 38, riskLevel: 'green', probHeavy: 44, probVeryHeavy: 18, probExtremelyHeavy: 4 },
      t48: { rawNwp: 68, aiCorrected: 62, riskLevel: 'yellow', probHeavy: 66, probVeryHeavy: 34, probExtremelyHeavy: 8 },
      t72: { rawNwp: 88, aiCorrected: 112, riskLevel: 'orange', probHeavy: 85, probVeryHeavy: 61, probExtremelyHeavy: 22 },
      t96: { rawNwp: 54, aiCorrected: 58, riskLevel: 'yellow', probHeavy: 58, probVeryHeavy: 26, probExtremelyHeavy: 5 },
      t120: { rawNwp: 30, aiCorrected: 26, riskLevel: 'green', probHeavy: 28, probVeryHeavy: 8, probExtremelyHeavy: 1 },
    },
  },
  {
    id: 'cherrapunji',
    name: 'East Khasi Hills (Cherrapunji)',
    state: 'Meghalaya',
    lat: 25.2744,
    lng: 91.7323,
    zone: 'Northeast',
    synopticMechanism: 'Monsoon sea winds funneled into the high cliffs, producing world-famous non-stop rain.',
    awsStationId: 'AWS-MEG-CHR01',
    liveReadingMm: 242.0,
    rainfalls: {
      t0: { rawNwp: 95, aiCorrected: 175, riskLevel: 'red', probHeavy: 100, probVeryHeavy: 98, probExtremelyHeavy: 82 },
      t24: { rawNwp: 180, aiCorrected: 310, riskLevel: 'red', probHeavy: 100, probVeryHeavy: 98, probExtremelyHeavy: 84 },
      t48: { rawNwp: 160, aiCorrected: 275, riskLevel: 'red', probHeavy: 100, probVeryHeavy: 96, probExtremelyHeavy: 76 },
      t72: { rawNwp: 130, aiCorrected: 215, riskLevel: 'red', probHeavy: 98, probVeryHeavy: 88, probExtremelyHeavy: 58 },
      t96: { rawNwp: 95, aiCorrected: 145, riskLevel: 'orange', probHeavy: 91, probVeryHeavy: 72, probExtremelyHeavy: 29 },
      t120: { rawNwp: 70, aiCorrected: 95, riskLevel: 'orange', probHeavy: 78, probVeryHeavy: 46, probExtremelyHeavy: 12 },
    },
  },
  {
    id: 'agumbe',
    name: 'Shivamogga (Agumbe)',
    state: 'Karnataka',
    lat: 13.5065,
    lng: 75.0934,
    zone: 'Western Ghats',
    synopticMechanism: 'Very heavy mountain rain as dense sea clouds crash directly into the hill peaks.',
    awsStationId: 'AWS-KAR-AGM01',
    liveReadingMm: 178.5,
    rainfalls: {
      t0: { rawNwp: 75, aiCorrected: 135, riskLevel: 'red', probHeavy: 99, probVeryHeavy: 94, probExtremelyHeavy: 68 },
      t24: { rawNwp: 140, aiCorrected: 245, riskLevel: 'red', probHeavy: 100, probVeryHeavy: 95, probExtremelyHeavy: 72 },
      t48: { rawNwp: 125, aiCorrected: 210, riskLevel: 'red', probHeavy: 99, probVeryHeavy: 91, probExtremelyHeavy: 60 },
      t72: { rawNwp: 90, aiCorrected: 140, riskLevel: 'orange', probHeavy: 92, probVeryHeavy: 73, probExtremelyHeavy: 28 },
      t96: { rawNwp: 60, aiCorrected: 82, riskLevel: 'yellow', probHeavy: 72, probVeryHeavy: 40, probExtremelyHeavy: 10 },
      t120: { rawNwp: 40, aiCorrected: 52, riskLevel: 'yellow', probHeavy: 48, probVeryHeavy: 19, probExtremelyHeavy: 3 },
    },
  },
  {
    id: 'idukki',
    name: 'Idukki',
    state: 'Kerala',
    lat: 9.8494,
    lng: 76.9804,
    zone: 'Western Ghats',
    synopticMechanism: 'High mountain valleys catching dense rain clouds, leading to reservoir runoff.',
    awsStationId: 'AWS-KER-IDK01',
    liveReadingMm: 86.4,
    rainfalls: {
      t0: { rawNwp: 48, aiCorrected: 82, riskLevel: 'red', probHeavy: 94, probVeryHeavy: 80, probExtremelyHeavy: 36 },
      t24: { rawNwp: 98, aiCorrected: 168, riskLevel: 'red', probHeavy: 96, probVeryHeavy: 84, probExtremelyHeavy: 42 },
      t48: { rawNwp: 85, aiCorrected: 138, riskLevel: 'orange', probHeavy: 90, probVeryHeavy: 72, probExtremelyHeavy: 24 },
      t72: { rawNwp: 62, aiCorrected: 92, riskLevel: 'orange', probHeavy: 78, probVeryHeavy: 46, probExtremelyHeavy: 12 },
      t96: { rawNwp: 42, aiCorrected: 54, riskLevel: 'yellow', probHeavy: 54, probVeryHeavy: 20, probExtremelyHeavy: 4 },
      t120: { rawNwp: 26, aiCorrected: 32, riskLevel: 'green', probHeavy: 28, probVeryHeavy: 7, probExtremelyHeavy: 1 },
    },
  },
  {
    id: 'cuttack',
    name: 'Cuttack',
    state: 'Odisha',
    lat: 20.4625,
    lng: 85.883,
    zone: 'Central India',
    synopticMechanism: 'A storm system from the Bay of Bengal bringing breezy weather and continuous rain.',
    awsStationId: 'AWS-ODI-CUT01',
    liveReadingMm: 62.0,
    rainfalls: {
      t0: { rawNwp: 36, aiCorrected: 48, riskLevel: 'yellow', probHeavy: 72, probVeryHeavy: 42, probExtremelyHeavy: 12 },
      t24: { rawNwp: 75, aiCorrected: 92, riskLevel: 'orange', probHeavy: 84, probVeryHeavy: 56, probExtremelyHeavy: 18 },
      t48: { rawNwp: 110, aiCorrected: 148, riskLevel: 'orange', probHeavy: 94, probVeryHeavy: 76, probExtremelyHeavy: 32 },
      t72: { rawNwp: 95, aiCorrected: 120, riskLevel: 'orange', probHeavy: 88, probVeryHeavy: 68, probExtremelyHeavy: 22 },
      t96: { rawNwp: 48, aiCorrected: 52, riskLevel: 'yellow', probHeavy: 56, probVeryHeavy: 22, probExtremelyHeavy: 5 },
      t120: { rawNwp: 25, aiCorrected: 28, riskLevel: 'green', probHeavy: 26, probVeryHeavy: 6, probExtremelyHeavy: 1 },
    },
  },
  {
    id: 'nagpur',
    name: 'Nagpur',
    state: 'Maharashtra',
    lat: 21.1458,
    lng: 79.0882,
    zone: 'Central India',
    synopticMechanism: 'Monsoon rain clouds crossing central India, bringing breezy showers and overcast skies.',
    awsStationId: 'AWS-MAH-NGP01',
    liveReadingMm: 34.2,
    rainfalls: {
      t0: { rawNwp: 22, aiCorrected: 20, riskLevel: 'green', probHeavy: 38, probVeryHeavy: 14, probExtremelyHeavy: 3 },
      t24: { rawNwp: 52, aiCorrected: 48, riskLevel: 'green', probHeavy: 51, probVeryHeavy: 22, probExtremelyHeavy: 5 },
      t48: { rawNwp: 78, aiCorrected: 74, riskLevel: 'yellow', probHeavy: 74, probVeryHeavy: 41, probExtremelyHeavy: 11 },
      t72: { rawNwp: 92, aiCorrected: 114, riskLevel: 'orange', probHeavy: 86, probVeryHeavy: 62, probExtremelyHeavy: 20 },
      t96: { rawNwp: 64, aiCorrected: 60, riskLevel: 'yellow', probHeavy: 62, probVeryHeavy: 29, probExtremelyHeavy: 6 },
      t120: { rawNwp: 32, aiCorrected: 28, riskLevel: 'green', probHeavy: 30, probVeryHeavy: 8, probExtremelyHeavy: 1 },
    },
  },
  {
    id: 'surat',
    name: 'Surat',
    state: 'Gujarat',
    lat: 21.1702,
    lng: 72.8311,
    zone: 'Western Ghats',
    synopticMechanism: 'Coastal sea clouds turning inland across south Gujarat, bringing heavy showers.',
    awsStationId: 'AWS-GUJ-SRT01',
    liveReadingMm: 58.0,
    rainfalls: {
      t0: { rawNwp: 30, aiCorrected: 42, riskLevel: 'yellow', probHeavy: 68, probVeryHeavy: 36, probExtremelyHeavy: 8 },
      t24: { rawNwp: 65, aiCorrected: 88, riskLevel: 'orange', probHeavy: 82, probVeryHeavy: 51, probExtremelyHeavy: 16 },
      t48: { rawNwp: 88, aiCorrected: 130, riskLevel: 'orange', probHeavy: 91, probVeryHeavy: 70, probExtremelyHeavy: 26 },
      t72: { rawNwp: 70, aiCorrected: 95, riskLevel: 'orange', probHeavy: 80, probVeryHeavy: 52, probExtremelyHeavy: 15 },
      t96: { rawNwp: 40, aiCorrected: 46, riskLevel: 'yellow', probHeavy: 48, probVeryHeavy: 18, probExtremelyHeavy: 3 },
      t120: { rawNwp: 22, aiCorrected: 24, riskLevel: 'green', probHeavy: 22, probVeryHeavy: 5, probExtremelyHeavy: 0 },
    },
  },
  {
    id: 'uttarkashi',
    name: 'Uttarkashi',
    state: 'Uttarakhand',
    lat: 30.7268,
    lng: 78.4354,
    zone: 'Himalayan',
    synopticMechanism: 'Himalayan river valley catching monsoon clouds, causing steady mountain showers.',
    awsStationId: 'AWS-UK-UTK01',
    liveReadingMm: 48.0,
    rainfalls: {
      t0: { rawNwp: 28, aiCorrected: 45, riskLevel: 'yellow', probHeavy: 71, probVeryHeavy: 38, probExtremelyHeavy: 11 },
      t24: { rawNwp: 62, aiCorrected: 98, riskLevel: 'orange', probHeavy: 85, probVeryHeavy: 59, probExtremelyHeavy: 25 },
      t48: { rawNwp: 74, aiCorrected: 118, riskLevel: 'orange', probHeavy: 89, probVeryHeavy: 66, probExtremelyHeavy: 31 },
      t72: { rawNwp: 52, aiCorrected: 72, riskLevel: 'yellow', probHeavy: 68, probVeryHeavy: 36, probExtremelyHeavy: 10 },
      t96: { rawNwp: 34, aiCorrected: 42, riskLevel: 'green', probHeavy: 40, probVeryHeavy: 14, probExtremelyHeavy: 3 },
      t120: { rawNwp: 20, aiCorrected: 24, riskLevel: 'green', probHeavy: 22, probVeryHeavy: 6, probExtremelyHeavy: 1 },
    },
  },
  {
    id: 'dehradun',
    name: 'Dehradun',
    state: 'Uttarakhand',
    lat: 30.3165,
    lng: 78.0322,
    zone: 'Himalayan',
    synopticMechanism: 'Valley rain trapped between the Shivalik hills and high mountains.',
    awsStationId: 'AWS-UK-DDN01',
    liveReadingMm: 68.2,
    rainfalls: {
      t0: { rawNwp: 35, aiCorrected: 54, riskLevel: 'yellow', probHeavy: 75, probVeryHeavy: 44, probExtremelyHeavy: 14 },
      t24: { rawNwp: 78, aiCorrected: 114, riskLevel: 'orange', probHeavy: 88, probVeryHeavy: 64, probExtremelyHeavy: 24 },
      t48: { rawNwp: 85, aiCorrected: 126, riskLevel: 'orange', probHeavy: 92, probVeryHeavy: 71, probExtremelyHeavy: 29 },
      t72: { rawNwp: 58, aiCorrected: 80, riskLevel: 'yellow', probHeavy: 74, probVeryHeavy: 42, probExtremelyHeavy: 12 },
      t96: { rawNwp: 38, aiCorrected: 46, riskLevel: 'green', probHeavy: 46, probVeryHeavy: 16, probExtremelyHeavy: 3 },
      t120: { rawNwp: 24, aiCorrected: 26, riskLevel: 'green', probHeavy: 25, probVeryHeavy: 6, probExtremelyHeavy: 1 },
    },
  },
  {
    id: 'kolkata',
    name: 'Kolkata',
    state: 'West Bengal',
    lat: 22.5726,
    lng: 88.3639,
    zone: 'Indo-Gangetic',
    synopticMechanism: 'Breezy coastal rain bands blowing in from the Bay of Bengal.',
    awsStationId: 'AWS-WB-KOL01',
    liveReadingMm: 38.6,
    rainfalls: {
      t0: { rawNwp: 21, aiCorrected: 24, riskLevel: 'green', probHeavy: 40, probVeryHeavy: 15, probExtremelyHeavy: 3 },
      t24: { rawNwp: 48, aiCorrected: 54, riskLevel: 'yellow', probHeavy: 56, probVeryHeavy: 24, probExtremelyHeavy: 6 },
      t48: { rawNwp: 72, aiCorrected: 86, riskLevel: 'yellow', probHeavy: 76, probVeryHeavy: 44, probExtremelyHeavy: 12 },
      t72: { rawNwp: 64, aiCorrected: 74, riskLevel: 'yellow', probHeavy: 70, probVeryHeavy: 38, probExtremelyHeavy: 9 },
      t96: { rawNwp: 42, aiCorrected: 45, riskLevel: 'green', probHeavy: 44, probVeryHeavy: 15, probExtremelyHeavy: 3 },
      t120: { rawNwp: 28, aiCorrected: 30, riskLevel: 'green', probHeavy: 28, probVeryHeavy: 7, probExtremelyHeavy: 1 },
    },
  },
  {
    id: 'kozhikode',
    name: 'Kozhikode',
    state: 'Kerala',
    lat: 11.2588,
    lng: 75.7804,
    zone: 'Western Ghats',
    synopticMechanism: 'Humid sea breeze bringing steady tropical rain showers along the coast.',
    awsStationId: 'AWS-KER-KOZ01',
    liveReadingMm: 82.1,
    rainfalls: {
      t0: { rawNwp: 44, aiCorrected: 66, riskLevel: 'orange', probHeavy: 88, probVeryHeavy: 66, probExtremelyHeavy: 21 },
      t24: { rawNwp: 92, aiCorrected: 138, riskLevel: 'orange', probHeavy: 92, probVeryHeavy: 74, probExtremelyHeavy: 28 },
      t48: { rawNwp: 84, aiCorrected: 122, riskLevel: 'orange', probHeavy: 88, probVeryHeavy: 68, probExtremelyHeavy: 22 },
      t72: { rawNwp: 58, aiCorrected: 84, riskLevel: 'yellow', probHeavy: 76, probVeryHeavy: 42, probExtremelyHeavy: 10 },
      t96: { rawNwp: 36, aiCorrected: 48, riskLevel: 'green', probHeavy: 46, probVeryHeavy: 16, probExtremelyHeavy: 3 },
      t120: { rawNwp: 24, aiCorrected: 28, riskLevel: 'green', probHeavy: 26, probVeryHeavy: 6, probExtremelyHeavy: 1 },
    },
  },
  {
    id: 'new_delhi',
    name: 'New Delhi NCR',
    state: 'Delhi NCR',
    lat: 28.6139,
    lng: 77.209,
    zone: 'Indo-Gangetic',
    synopticMechanism: 'Monsoon clouds bringing passing showers, humid air, and afternoon thunder.',
    awsStationId: 'AWS-DEL-SFD01',
    liveReadingMm: 18.2,
    rainfalls: {
      t0: { rawNwp: 14, aiCorrected: 18, riskLevel: 'green', probHeavy: 34, probVeryHeavy: 11, probExtremelyHeavy: 2 },
      t24: { rawNwp: 38, aiCorrected: 42, riskLevel: 'yellow', probHeavy: 46, probVeryHeavy: 18, probExtremelyHeavy: 4 },
      t48: { rawNwp: 58, aiCorrected: 68, riskLevel: 'orange', probHeavy: 78, probVeryHeavy: 42, probExtremelyHeavy: 14 },
      t72: { rawNwp: 44, aiCorrected: 48, riskLevel: 'yellow', probHeavy: 52, probVeryHeavy: 22, probExtremelyHeavy: 5 },
      t96: { rawNwp: 24, aiCorrected: 22, riskLevel: 'green', probHeavy: 25, probVeryHeavy: 7, probExtremelyHeavy: 1 },
      t120: { rawNwp: 15, aiCorrected: 14, riskLevel: 'green', probHeavy: 18, probVeryHeavy: 4, probExtremelyHeavy: 0 },
    },
  },
];

export const liveAwsFeed: LiveAwsReading[] = [
  { id: 'aws-1', stationName: 'Cherrapunji AWS', district: 'East Khasi Hills', state: 'Meghalaya', rainfall1h: 18.5, rainfall24h: 242.0, trend: 'rising', updatedAt: 'Just now' },
  { id: 'aws-2', stationName: 'Agumbe Observatory', district: 'Shivamogga', state: 'Karnataka', rainfall1h: 14.2, rainfall24h: 178.5, trend: 'rising', updatedAt: '1 min ago' },
  { id: 'aws-3', stationName: 'Mahabaleshwar Met', district: 'Satara', state: 'Maharashtra', rainfall1h: 12.0, rainfall24h: 164.2, trend: 'steady', updatedAt: '2 mins ago' },
  { id: 'aws-4', stationName: 'Meppadi Station', district: 'Wayanad', state: 'Kerala', rainfall1h: 9.8, rainfall24h: 98.4, trend: 'rising', updatedAt: 'Just now' },
  { id: 'aws-5', stationName: 'Colaba Coastal AWS', district: 'Mumbai', state: 'Maharashtra', rainfall1h: 8.4, rainfall24h: 74.2, trend: 'rising', updatedAt: '3 mins ago' },
  { id: 'aws-6', stationName: 'Dehradun Forest Met', district: 'Dehradun', state: 'Uttarakhand', rainfall1h: 6.2, rainfall24h: 68.2, trend: 'steady', updatedAt: '4 mins ago' },
  { id: 'aws-7', stationName: 'Ratnagiri Port AWS', district: 'Ratnagiri', state: 'Maharashtra', rainfall1h: 11.5, rainfall24h: 112.0, trend: 'rising', updatedAt: '2 mins ago' },
  { id: 'aws-8', stationName: 'Idukki Dam AWS', district: 'Idukki', state: 'Kerala', rainfall1h: 7.6, rainfall24h: 86.4, trend: 'falling', updatedAt: '5 mins ago' },
];

export const verificationSkillData: SkillMetricEntry[] = [
  { threshold: '>10 mm (Light)', rawCsi: 0.62, aiCsi: 0.81, rawFar: 0.34, aiFar: 0.18, rawPod: 0.78, aiPod: 0.91 },
  { threshold: '>35 mm (Moderate)', rawCsi: 0.48, aiCsi: 0.72, rawFar: 0.42, aiFar: 0.22, rawPod: 0.65, aiPod: 0.84 },
  { threshold: '>64.5 mm (Heavy)', rawCsi: 0.36, aiCsi: 0.61, rawFar: 0.51, aiFar: 0.29, rawPod: 0.54, aiPod: 0.77 },
  { threshold: '>115.5 mm (Very Heavy)', rawCsi: 0.22, aiCsi: 0.49, rawFar: 0.64, aiFar: 0.36, rawPod: 0.39, aiPod: 0.66 },
  { threshold: '>204.4 mm (Extremely Heavy)', rawCsi: 0.11, aiCsi: 0.38, rawFar: 0.78, aiFar: 0.44, rawPod: 0.24, aiPod: 0.53 },
];

// Simplified geometric points for drawing India's outline on HTML5 Canvas
// Scaled to normalized latitude and longitude (lat: 8 to 36, lng: 68 to 97)
export const indiaOutlineCoords: [number, number][] = [
  // [lat, lng]
  [35.5, 74.5], // Kashmir north
  [34.5, 77.5], // Ladakh
  [32.8, 78.5],
  [31.2, 79.2],
  [30.4, 80.5], // Uttarakhand border
  [28.8, 80.2], // Nepal border west
  [27.5, 84.5], // Nepal border center
  [26.8, 88.2], // Sikkim
  [28.0, 88.8],
  [27.6, 92.0], // Arunachal
  [28.5, 94.5],
  [29.0, 96.5], // Northeast tip
  [27.5, 96.8],
  [25.8, 94.5], // Nagaland
  [24.5, 93.5], // Manipur
  [22.8, 92.8], // Mizoram
  [23.2, 91.5], // Tripura
  [25.0, 89.8], // Meghalaya
  [22.0, 89.0], // Sundarbans
  [21.5, 87.2], // Odisha coast
  [19.8, 85.8], // Puri
  [17.7, 83.3], // Visakhapatnam
  [15.8, 80.8], // Andhra coast
  [13.1, 80.3], // Chennai
  [10.8, 79.8], // Nagapattinam
  [9.3, 79.2],  // Rameshwaram
  [8.1, 77.5],  // Kanyakumari
  [8.5, 76.9],  // Thiruvananthapuram
  [10.0, 76.2], // Kochi
  [12.0, 75.3], // Kannur
  [13.3, 74.7], // Mangaluru
  [15.3, 73.8], // Goa
  [17.0, 73.3], // Ratnagiri
  [19.0, 72.8], // Mumbai
  [20.8, 72.8], // Daman
  [21.5, 72.5], // Surat
  [20.7, 70.9], // Diu
  [22.2, 69.0], // Dwarka
  [23.0, 68.5], // Kutch west
  [23.8, 68.8], // Great Rann of Kutch
  [24.6, 71.0], // Rajasthan border south
  [26.5, 70.2], // Jaisalmer border
  [28.5, 72.5], // Bikaner border
  [30.5, 74.0], // Punjab border
  [32.5, 74.8], // Jammu border
  [35.5, 74.5], // Close loop
];

// Western Ghats ridge line coordinates (for topographic orographic highlight)
export const westernGhatsRidge: [number, number][] = [
  [8.5, 77.2],
  [9.6, 77.1],
  [10.5, 76.8],
  [11.5, 76.1],
  [12.8, 75.5],
  [14.2, 74.8],
  [16.0, 74.1],
  [17.8, 73.7],
  [19.2, 73.4],
  [20.8, 73.5],
];

// Himalayan foothills ridge line
export const himalayanFoothills: [number, number][] = [
  [33.0, 75.0],
  [31.8, 77.0],
  [30.2, 79.0],
  [28.5, 82.5],
  [27.2, 86.5],
  [26.8, 90.0],
  [27.4, 94.0],
];
