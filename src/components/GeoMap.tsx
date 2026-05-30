import React, { useEffect, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { SectorFeature, Pollutant, Year, PollutantConcentration, LisaCluster } from '../types/dashboard';
import { getContinuousColor, getConcentrationLabel, LISA_COLORS, LISA_LABELS } from '../utils/colorScales';
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
  showLisa: boolean;
  lisaIndex: Map<string, LisaCluster>;
  concP5: number;
  concP95: number;
}

// Tighter bounds that keep Bogotá nicely framed
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
  isSelected: boolean;
  showLisa: boolean;
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
  isSelected,
  showLisa,
  concP5,
  concP95,
  onSelect,
}) => {
  if (!sector || !isValidGeometry(sector.geometry)) return null;

  const unit = POLLUTANT_UNIT[pollutant];

  const feature = {
    type: 'Feature',
    geometry: sector.geometry,
    properties: { SETU_CCNCT: sector.setuCcnct },
  };

  const concText =
    concentration !== null && concentration !== undefined
      ? `${formatNumber(concentration, 2)} ${unit}`
      : 'Sin dato';

  const lisaText = lisaCluster ? (LISA_LABELS[lisaCluster] ?? lisaCluster) : 'Sin dato LISA';

  const onEachFeature = (_feature: any, layer: any) => {
    layer.bindPopup(
      `<div style="font-size:12px;line-height:1.5;min-width:160px">
        <p style="font-weight:700;margin:0 0 3px">${sector.name}</p>
        <p style="color:#666;margin:0 0 4px;font-size:10px">SETU_CCNCT: ${sector.setuCcnct}</p>
        <p style="margin:0 0 2px"><b>${pollutant}:</b> ${concText}</p>
        <p style="color:#666;margin:0 0 4px;font-size:11px">${getConcentrationLabel(pollutant, concentration)} · ${year}</p>
        <p style="margin:0;font-size:11px"><b>LISA:</b> ${lisaText}</p>
      </div>`,
      { className: 'custom-popup' },
    );
    layer.on('click', () => onSelect(sector.setuCcnct));
  };

  // Compute style based on mode
  let fillColor: string;
  let fillOpacity: number;

  if (showLisa) {
    const clusterKey = lisaCluster ?? 'NS';
    fillColor = LISA_COLORS[clusterKey] ?? LISA_COLORS.NS;
    fillOpacity = (lisaCluster && lisaCluster !== 'NS') ? 0.78 : 0.07;
  } else {
    fillColor = getContinuousColor(concentration, concP5, concP95);
    fillOpacity = concentration === null ? 0.22 : 0.58;
  }

  return (
    <GeoJSON
      key={`${sector.setuCcnct}-${pollutant}-${year}-${isSelected}-${showLisa}`}
      data={feature as any}
      onEachFeature={onEachFeature}
      style={() => ({
        fillColor,
        fillOpacity,
        weight: isSelected ? 2.5 : 0.7,
        opacity: 1,
        color: isSelected ? '#1c1917' : '#888',
      })}
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
  showLisa,
  lisaIndex,
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
            isSelected={selectedSectorId === sector.setuCcnct}
            showLisa={showLisa}
            concP5={concP5}
            concP95={concP95}
            onSelect={onSectorSelect}
          />
        ))}
      </MapContainer>
    </div>
  );
};
