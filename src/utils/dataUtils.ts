import {
  SectorFeature,
  PollutantConcentration,
  SelectedSector,
  Pollutant,
  Year,
  LisaRecord,
  LisaCluster,
} from '../types/dashboard';
import {
  MOCK_SECTORS,
  AVAILABLE_POLLUTANTS,
  AVAILABLE_YEARS,
  generateMockConcentrations,
  getConcentrationValue,
} from '../data/mockData';

export function normalizeSectorId(value: unknown): string {
  return String(value ?? '').trim();
}

function normalizePollutantName(name: string): Pollutant {
  const map: Record<string, Pollutant> = {
    CO: 'CO', co: 'CO',
    eBC: 'eBC', EBC: 'eBC', BC: 'eBC', 'Black Carbon': 'eBC', BlackCarbon: 'eBC', black_carbon: 'eBC',
    NO2: 'NO2', no2: 'NO2',
    OZONO: 'O3', O3: 'O3', 'O₃': 'O3', o3: 'O3',
    PM10: 'PM10', pm10: 'PM10',
    'PM2.5': 'PM2.5', PM25: 'PM2.5', PM2_5: 'PM2.5', pm25: 'PM2.5', pm2_5: 'PM2.5',
    SO2: 'SO2', 'SO₂': 'SO2', so2: 'SO2',
  };
  const normalized = map[name];
  if (!normalized && import.meta.env.DEV) {
    console.warn(`[DEV] Unknown pollutant name: "${name}"`);
  }
  return normalized ?? 'PM2.5';
}

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.split('\n');
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim());
  const result: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const values = line.split(',');
    const row: Record<string, string> = {};
    headers.forEach((header, j) => {
      row[header] = values[j]?.trim() ?? '';
    });
    result.push(row);
  }
  return result;
}

async function loadSociodemographics(): Promise<Map<string, Record<string, string>>> {
  const socioMap = new Map<string, Record<string, string>>();
  try {
    const response = await fetch('/data/tabular/sociodemograficas_sector_censal.csv');
    if (!response.ok) {
      console.warn('Sociodemographic CSV not found');
      return socioMap;
    }
    const text = await response.text();
    const rows = parseCSV(text);
    rows.forEach(row => {
      const key = normalizeSectorId(row['SETU_CCNCT']);
      if (key) socioMap.set(key, row);
    });
    if (import.meta.env.DEV) {
      console.log(`[DEV] Loaded ${socioMap.size} sociodemographic records`);
      const sample = rows[0];
      if (sample) console.log(`[DEV] Socio sample SETU_CCNCT:`, sample['SETU_CCNCT']);
    }
  } catch (e) {
    console.warn('Error loading sociodemographic CSV:', e);
  }
  return socioMap;
}

export function convertGeoJSONFeature(
  feature: Record<string, any>,
  socioData?: Map<string, Record<string, string>>,
): SectorFeature {
  const setuCcnct = normalizeSectorId(feature.properties?.SETU_CCNCT);
  const socio = socioData?.get(setuCcnct);
  const num = (val: string | number | undefined): number => {
    const n = parseFloat(String(val ?? '0'));
    return isNaN(n) ? 0 : n;
  };

  return {
    id: setuCcnct,
    setuCcnct,
    name: `Sector ${setuCcnct}`,
    geometry: feature.geometry,
    properties: {
      setuCcnct,
      areaName: '',
      locality: '',
      demographics: {
        totalPopulation: socio
          ? num(socio['STP27_PERS'])
          : num(feature.properties?.STP27_PERS),
        children0_9: num(socio?.['STP34_1_ED']),
        youth10_19: num(socio?.['STP34_2_ED']),
        adults20_59:
          num(socio?.['STP34_3_ED']) +
          num(socio?.['STP34_4_ED']) +
          num(socio?.['STP34_5_ED']) +
          num(socio?.['STP34_6_ED']),
        olderAdults60Plus:
          num(socio?.['STP34_7_ED']) +
          num(socio?.['STP34_8_ED']) +
          num(socio?.['STP34_9_ED']),
        majorityStrata: String(socio?.['ESTRATO_MAYORITARIO'] ?? feature.properties?.ESTRATO_MAYORITARIO ?? ''),
        averageIPM: num(socio?.['IPM_PROMEDIO']),
      },
    },
  };
}

export async function loadSectors(): Promise<SectorFeature[]> {
  try {
    const [geoResponse, socioMap] = await Promise.all([
      fetch('/data/geo/sectores_censales_bogota.geojson'),
      loadSociodemographics(),
    ]);

    if (!geoResponse.ok) {
      console.warn('GeoJSON not found, using mock data');
      return MOCK_SECTORS;
    }

    const geojson = await geoResponse.json();
    if (!geojson.features || !Array.isArray(geojson.features)) {
      console.warn('Invalid GeoJSON structure, using mock data');
      return MOCK_SECTORS;
    }

    const sectors: SectorFeature[] = geojson.features.map(
      (f: Record<string, any>) => convertGeoJSONFeature(f, socioMap),
    );

    if (import.meta.env.DEV) {
      console.log(`[DEV] Loaded ${sectors.length} census sectors`);
      if (sectors[0]) console.log(`[DEV] Sample sector SETU_CCNCT:`, sectors[0].setuCcnct);
      const withSocio = sectors.filter(s => s.properties.demographics.totalPopulation > 0);
      console.log(`[DEV] Sectors with sociodemographic data: ${withSocio.length}`);
    }

    return sectors;
  } catch (error) {
    console.warn('Error loading sectors, using mock data:', error);
    return MOCK_SECTORS;
  }
}

export async function loadConcentrations(): Promise<PollutantConcentration[]> {
  try {
    const response = await fetch('/data/geo/concentraciones_sector_censal.json');
    if (!response.ok) {
      console.warn('Concentrations JSON not found, using mock data');
      return generateMockConcentrations();
    }

    const records = await response.json();
    if (!Array.isArray(records)) {
      console.warn('Invalid concentrations data, using mock data');
      return generateMockConcentrations();
    }

    const converted: PollutantConcentration[] = records
      .filter((r: Record<string, any>) => r.concentration !== null && r.concentration !== undefined)
      .map((record: Record<string, any>) => ({
        setuCcnct: normalizeSectorId(record.SETU_CCNCT),
        pollutant: normalizePollutantName(String(record.pollutant ?? '')),
        year: Number(record.year) as Year,
        concentration: Number(record.concentration),
      }));

    if (import.meta.env.DEV) {
      console.log(`[DEV] Loaded ${converted.length} concentration records`);
      if (converted[0]) console.log(`[DEV] Sample concentration:`, converted[0]);
      const pollutants = [...new Set(converted.map(c => c.pollutant))].sort();
      console.log(`[DEV] Unique pollutants:`, pollutants.join(', '));
      const years = [...new Set(converted.map(c => c.year))].sort((a, b) => a - b);
      console.log(`[DEV] Unique years:`, years.join(', '));
    }

    return converted;
  } catch (error) {
    console.warn('Error loading concentrations, using mock data:', error);
    return generateMockConcentrations();
  }
}

export function getSectorData(
  setuCcnct: string,
  sectors: SectorFeature[],
  concentrations: PollutantConcentration[],
): SelectedSector | null {
  const normalizedId = normalizeSectorId(setuCcnct);
  const sector = sectors.find(s => normalizeSectorId(s.setuCcnct) === normalizedId);

  if (!sector) {
    if (import.meta.env.DEV) console.warn(`[DEV] Sector not found for id: ${normalizedId}`);
    return null;
  }

  const sectorConcentrations: SelectedSector['concentrations'] = {};
  AVAILABLE_POLLUTANTS.forEach(pollutant => {
    sectorConcentrations[pollutant] = {};
    AVAILABLE_YEARS.forEach(year => {
      sectorConcentrations[pollutant]![year] = getConcentrationValue(
        normalizedId,
        pollutant,
        year,
        concentrations,
      );
    });
  });

  if (import.meta.env.DEV) {
    console.log(`[DEV] Clicked sector: ${normalizedId}`);
    const pm25_2018 = sectorConcentrations['PM2.5']?.[2018];
    console.log(`[DEV] PM2.5 year=2018 for this sector:`, pm25_2018 ?? 'not found');
  }

  return {
    setuCcnct: sector.setuCcnct,
    name: sector.name,
    geometry: sector.geometry,
    demographics: sector.properties.demographics,
    concentrations: sectorConcentrations,
  };
}

export function getConcentration(
  setuCcnct: string,
  pollutant: Pollutant,
  year: Year,
  concentrations: PollutantConcentration[],
): number | null {
  const normalizedId = normalizeSectorId(setuCcnct);

  if (import.meta.env.DEV) {
    const result = getConcentrationValue(normalizedId, pollutant, year, concentrations);
    if (result === null) {
      // Only log misses occasionally to avoid flooding
    }
    return result;
  }

  return getConcentrationValue(normalizedId, pollutant, year, concentrations);
}

export function getConcentrationRange(
  pollutant: Pollutant,
  year: Year,
  concentrations: PollutantConcentration[],
): { min: number; max: number; hasData: boolean } {
  const values = concentrations
    .filter(c => c.pollutant === pollutant && c.year === year && c.concentration !== null)
    .map(c => c.concentration as number);

  if (values.length === 0) return { min: 0, max: 0, hasData: false };
  return { min: Math.min(...values), max: Math.max(...values), hasData: true };
}

export function isMissingData(value: number | null): boolean {
  return value === null || value === undefined;
}

export async function loadLisaClusters(): Promise<LisaRecord[]> {
  try {
    const response = await fetch('/data/lisa/lisa_clusters.json');
    if (!response.ok) {
      console.warn('LISA clusters file not found');
      return [];
    }
    const records = await response.json();
    if (!Array.isArray(records)) return [];

    const converted: LisaRecord[] = records.map((r: Record<string, unknown>) => ({
      setuCcnct: normalizeSectorId(r['SETU_CCNCT']),
      pollutant: r['pollutant'] as Pollutant,
      year: Number(r['year']) as Year,
      cluster: r['cluster'] as LisaCluster,
    }));

    if (import.meta.env.DEV) {
      console.log(`[DEV] Loaded ${converted.length} LISA cluster records`);
    }
    return converted;
  } catch (e) {
    console.warn('Error loading LISA clusters:', e);
    return [];
  }
}

export function convertConcentrationRecord(record: Record<string, any>): PollutantConcentration {
  return {
    setuCcnct: normalizeSectorId(record.SETU_CCNCT ?? record.setuCcnct),
    year: Number(record.year ?? record.YEAR) as Year,
    pollutant: normalizePollutantName(String(record.pollutant ?? '')) as Pollutant,
    concentration: record.concentration ?? null,
    unit: record.unit,
  };
}
