import { LeadTime, SynopticParameters } from '../types/meteo';

export interface HistoricalPreset {
  id: string;
  title: string;
  yearBadge: string;
  subtitle: string;
  description: string;
  tag: string;
  tagColor: string;
  districtId: string;
  districtName: string;
  leadTime: LeadTime;
  center: [number, number];
  zoom: number;
  rainfallHighlight: string;
  synopticParams: SynopticParameters;
}

export const HISTORICAL_PRESETS: HistoricalPreset[] = [
  {
    id: 'kerala_2018',
    title: '2018 Kerala Cloudburst',
    yearBadge: '2018',
    subtitle: 'Wayanad & Idukki — 184 mm/24h Red Alert Orographic Surge',
    description:
      'Relentless Arabian Sea low-level jet funneled into the Western Ghats steep slopes, triggering massive orographic cloudbursts and reservoir overflows.',
    tag: 'Red Alert • 184mm',
    tagColor: 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30',
    districtId: 'wayanad',
    districtName: 'Wayanad, Kerala',
    leadTime: 't24',
    center: [11.6854, 76.132],
    zoom: 8,
    rainfallHighlight: '184.0 mm',
    synopticParams: {
      shear850hPa: 24.5,
      troughLatitude: 21.0,
      mslpGradient: 16.2,
      offshoreVortexIndex: 8.5,
      moistureConvergence: 9.8,
      capeValue: 2850,
    },
  },
  {
    id: 'north_india_2023',
    title: '2023 North India Surge',
    yearBadge: '2023',
    subtitle: 'Himachal & Delhi NCR — Northern Trough Foothills Flood',
    description:
      'Monsoon trough shifted far north into the Himalayan foothills combined with a Western Disturbance, causing extreme localized flash floods across Shimla and Yamuna surge.',
    tag: 'Northern Trough Surge',
    tagColor: 'bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30',
    districtId: 'shimla',
    districtName: 'Shimla, Himachal Pradesh',
    leadTime: 't24',
    center: [31.1048, 77.1734],
    zoom: 8,
    rainfallHighlight: '96.0 mm',
    synopticParams: {
      shear850hPa: 12.0,
      troughLatitude: 29.5,
      mslpGradient: 9.5,
      offshoreVortexIndex: 3.2,
      moistureConvergence: 8.9,
      capeValue: 2200,
    },
  },
  {
    id: 'central_india_depression',
    title: 'Central India Depression',
    yearBadge: 'Deep Low',
    subtitle: 'Nagpur & Odisha Coast — Bay of Bengal Circulating System',
    description:
      'Deep monsoon depression formed over north Bay of Bengal tracking west-northwestward across Odisha and Vidarbha, producing wide circular storm bands and squalls.',
    tag: 'Depression • 148mm',
    tagColor: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 border-cyan-500/30',
    districtId: 'nagpur',
    districtName: 'Nagpur, Maharashtra',
    leadTime: 't48',
    center: [21.1458, 79.0882],
    zoom: 7,
    rainfallHighlight: '114.0 mm',
    synopticParams: {
      shear850hPa: 17.5,
      troughLatitude: 21.5,
      mslpGradient: 15.8,
      offshoreVortexIndex: 9.2,
      moistureConvergence: 9.4,
      capeValue: 2600,
    },
  },
];
