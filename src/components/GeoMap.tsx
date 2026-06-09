import React, { useEffect, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  SectorFeature,
  Pollutant,
  Year,
  PollutantConcentration,
  LisaCluster,
  PersistenceData,
  LayerMode,
} from '../types/dashboard';
import {
  getContinuousColor,
  getConcentrationLabel,
  LISA_COLORS,
  LISA_LABELS,
  BIVARIATE_LISA_LABELS,
} from '../utils/colorScales';
import { normalizeSectorId } from '../utils/dataUtils';
import { formatNumber } from '../utils/formatters';

interface GeoMapProps {
  sectors: SectorFeature[];
  concentrations: PollutantConcentration[];
  selectedPollutant: Pollutant;
  selectedYear: Year;
  selectedSectorId: string | null;
  onSectorSelect: (setuCcnct: string) => void;
  centerTrigger: number;
  layerMode: LayerMode;
  lisaIndex: Map<string, LisaCluster>;
  lisaBivIndex: Map<string, LisaCluster>;
  persistenceData: Map<string, PersistenceData>;
  bivariateYear: 2023 | 2024;
  concP5: number;
  concP95: number;
}

const BOGOTA_BOUNDS: [[number, number], [number, number]] = [
  [4.47, -74.23],
  [4.84, -73.99],
];

const BogotaRecenter: React.FC<{ trigger: number }> = ({ trigger }) => {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(BOGOTA_BOUNDS, { padding: [10, 10] });
  }, [trigger, map]);
  return null;
};

const isValidGeometry = (geometry: any): boolean => {
  if (!geometry?.type || !Array.isArray(geometry?.coordinates)) return false;
  return geometry.type === 'Polygon' || geometry.type === 'MultiPolygon';
};

const POLLUTANT_UNIT: Record<Pollutant, string> = {
  'PM2.5': 'µg/m³', 'PM10': 'µg/m³', 'NO2': 'µg/m³',
  'SO2': 'µg/m³', 'CO': 'µg/m³', 'O3': 'µg/m³', 'eBC': 'µg/m³',
};

interface LayerProps {
  sector: SectorFeature;
  pollutant: Pollutant;
  year: Year;
  concentration: number | null;
  lisaCluster: LisaCluster | null;
  bivariateCluster: LisaCluster | null;
  persistenceInfo: PersistenceData | null;
  isSelected: boolean;
  layerMode: LayerMode;
  bivariateYear: 2023 | 2024;
  concP5: number;
  concP95: number;
  onSelect: (setuCcnct: string) => void;
}

const GeoJSONLayer: React.FC<LayerProps> = ({
  sector,
  pollutant,
  year,
  concentration,
  lisaCluster,
  bivariateCluster,
  persistenceInfo,
  isSelected,
  layerMode,
  bivariateYear,
  concP5,
  concP95,
  onSelect,
}) => {
  if (!sector || !isValidGeometry(sector.geometry)) return null;

  const unit = POLLUTANT_UNIT[pollutant];
  const concText =
    concentration !== null && concentration !== undefined
      ? `${formatNumber(concentration, 2)} ${unit}`
      : 'Sin dato';

  // ── Persistence gradient values ───────────────────────────────────────────
  const pIntensity = persistenceInfo?.persistenceIntensity ?? 0;
  const pCount = persistenceInfo?.HHYearsCount ?? 0;
  const pTotal = persistenceInfo?.totalYearsAvailable ?? 0;

  // ── Build popup HTML per layer mode ──────────────────────────────────────
  const buildPopup = (): string => {
    const header = `
      <p style="font-weight:700;margin:0 0 3px">${sector.name}</p>
      <p style="color:#78716c;margin:0 0 5px;font-size:10px">SETU_CCNCT: ${sector.setuCcnct}</p>`;

    const persistRow = pTotal > 0
      ? `<p style="color:#78716c;margin:2px 0 0;font-size:10px">Persistencia HH: ${pCount}/${pTotal} años</p>`
      : '';

    if (layerMode === 'concentracion') {
      return `<div style="font-size:12px;line-height:1.5;min-width:160px">
        ${header}
        <p style="margin:0 0 2px"><b>${pollutant}:</b> ${concText}</p>
        <p style="color:#78716c;margin:0;font-size:11px">${getConcentrationLabel(pollutant, concentration)} · ${year}</p>
      </div>`;
    }

    if (layerMode === 'lisa_univariado') {
      const lisaLabel = lisaCluster ? (LISA_LABELS[lisaCluster] ?? lisaCluster) : 'Sin dato LISA';
      return `<div style="font-size:12px;line-height:1.5;min-width:180px">
        ${header}
        <p style="margin:0 0 2px"><b>${pollutant}:</b> ${concText} · ${year}</p>
        <p style="margin:0 0 2px;font-size:11px"><b>LISA:</b> ${lisaLabel}</p>
        ${persistRow}
      </div>`;
    }

    // lisa_bivariado
    const bivLabel = bivariateCluster ? (BIVARIATE_LISA_LABELS[bivariateCluster] ?? bivariateCluster) : 'Sin dato bivariado';
    return `<div style="font-size:12px;line-height:1.5;min-width:200px">
      ${header}
      <p style="margin:0 0 2px"><b>${pollutant} bivariado ${bivariateYear}:</b></p>
      <p style="margin:0 0 2px;font-size:11px">${bivLabel}</p>
      ${persistRow}
    </div>`;
  };

  // ── Style per layer mode ──────────────────────────────────────────────────
  // Persistence is encoded in the BORDER (color + weight), not the fill.
  // - Fill color = LISA category (categorical, clear)
  // - Border = persistence: dark+thick if many HH years, light+thin if none
  const computeStyle = () => {
    if (layerMode === 'concentracion') {
      return {
        fillColor: getContinuousColor(concentration, concP5, concP95),
        fillOpacity: concentration === null ? 0.18 : 0.60,
        weight: isSelected ? 2.5 : 0.7,
        opacity: 1,
        color: isSelected ? '#111827' : '#9ca3af',
      };
    }

    // LISA univariado or bivariado
    const cluster = layerMode === 'lisa_univariado'
      ? (lisaCluster ?? 'NS')
      : (bivariateCluster ?? 'NS');

    const isSignificant = cluster !== 'NS';

    // Fill: fixed opacity based on significance; persistence only affects border
    const fillOpacity = isSignificant ? 0.62 : 0.18;
    const fillColor = isSignificant
      ? (LISA_COLORS[cluster] ?? '#9ca3af')
      : '#e5e7eb'; // light gray for NS

    // Border: encodes persistence
    // - No persistence (pIntensity=0): very thin, light stone border
    // - High persistence: thick, dark charcoal border
    let weight: number;
    let borderColor: string;
    let borderOpacity: number;

    if (isSelected) {
      weight = 3;
      borderColor = '#111827'; // almost black — selection always visible
      borderOpacity = 1;
    } else if (pIntensity === 0) {
      weight = 0.4;
      borderColor = '#d6d3d1'; // stone-300, barely visible
      borderOpacity = 0.6;
    } else {
      // Interpolate border from subtle to prominent
      weight = 0.7 + pIntensity * 2.4;          // 0.7 → 3.1
      borderColor = '#1f2937';                    // gray-800, dark but not pure black
      borderOpacity = 0.40 + pIntensity * 0.55;  // 0.40 → 0.95
    }

    return { fillColor, fillOpacity, weight, opacity: borderOpacity, color: borderColor };
  };

  const feature = {
    type: 'Feature',
    geometry: sector.geometry,
    properties: { SETU_CCNCT: sector.setuCcnct },
  };

  // Key forces re-render when relevant props change
  const layerKey = `${sector.setuCcnct}-${pollutant}-${year}-${isSelected}-${layerMode}-${bivariateYear}`;

  const onEachFeature = (_feat: any, layer: any) => {
    layer.bindPopup(buildPopup(), { className: 'custom-popup' });
    layer.on('click', () => onSelect(sector.setuCcnct));
  };

  return (
    <GeoJSON
      key={layerKey}
      data={feature as any}
      onEachFeature={onEachFeature}
      style={computeStyle}
    />
  );
};

export const GeoMap: React.FC<GeoMapProps> = ({
  sectors = [],
  concentrations = [],
  selectedPollutant,
  selectedYear,
  selectedSectorId,
  onSectorSelect,
  centerTrigger,
  layerMode,
  lisaIndex,
  lisaBivIndex,
  persistenceData,
  bivariateYear,
  concP5,
  concP95,
}) => {
  // O(1) concentration lookup
  const concIndex = useMemo(() => {
    const idx = new Map<string, number | null>();
    concentrations.forEach(c => {
      idx.set(`${c.setuCcnct}|${c.pollutant}|${c.year}`, c.concentration);
    });
    return idx;
  }, [concentrations]);

  const lookupConc = useCallback(
    (setuCcnct: string): number | null => {
      const key = `${normalizeSectorId(setuCcnct)}|${selectedPollutant}|${selectedYear}`;
      return concIndex.has(key) ? (concIndex.get(key) ?? null) : null;
    },
    [concIndex, selectedPollutant, selectedYear],
  );

  const lookupLisa = useCallback(
    (setuCcnct: string): LisaCluster | null => {
      const key = `${normalizeSectorId(setuCcnct)}|${selectedPollutant}|${selectedYear}`;
      return lisaIndex.get(key) ?? null;
    },
    [lisaIndex, selectedPollutant, selectedYear],
  );

  const lookupBiv = useCallback(
    (setuCcnct: string): LisaCluster | null => {
      const key = `${normalizeSectorId(setuCcnct)}|${selectedPollutant}`;
      return lisaBivIndex.get(key) ?? null;
    },
    [lisaBivIndex, selectedPollutant],
  );

  const validSectors = useMemo(
    () => sectors.filter(s => s && isValidGeometry(s.geometry)),
    [sectors],
  );

  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden shadow-lg">
      <MapContainer
        center={[4.66, -74.11]}
        zoom={11}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          maxZoom={19}
        />

        <BogotaRecenter trigger={centerTrigger} />

        {validSectors.map(sector => (
          <GeoJSONLayer
            key={sector.setuCcnct}
            sector={sector}
            pollutant={selectedPollutant}
            year={selectedYear}
            concentration={lookupConc(sector.setuCcnct)}
            lisaCluster={lookupLisa(sector.setuCcnct)}
            bivariateCluster={lookupBiv(sector.setuCcnct)}
            persistenceInfo={persistenceData.get(normalizeSectorId(sector.setuCcnct)) ?? null}
            isSelected={selectedSectorId === sector.setuCcnct}
            layerMode={layerMode}
            bivariateYear={bivariateYear}
            concP5={concP5}
            concP95={concP95}
            onSelect={onSectorSelect}
          />
        ))}
      </MapContainer>
    </div>
  );
};
