/**
 * GeoMap Component
 * Interactive Leaflet map showing Bogotá census sectors with air pollution data
 */

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import { latLngBounds } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { SectorFeature, Pollutant, Year, PollutantConcentration } from '../types/dashboard';
import { getColorForConcentration, getConcentrationLabel } from '../utils/colorScales';
import { getConcentration } from '../utils/dataUtils';
import { formatNumber } from '../utils/formatters';

interface GeoMapProps {
  sectors: SectorFeature[];
  concentrations: PollutantConcentration[];
  selectedPollutant: Pollutant;
  selectedYear: Year;
  selectedSectorId: string | null;
  onSectorSelect: (setuCcnct: string) => void;
}

// Component to center the map on Bogotá
const MapCenterController: React.FC = () => {
  const map = useMap();

  useEffect(() => {
    const bounds = latLngBounds(
      [4.5, -74.3], // Southwest
      [4.9, -73.8], // Northeast
    );

    map.fitBounds(bounds, { padding: [50, 50] });
  }, [map]);

  return null;
};

interface GeoJSONLayerProps {
  sector: SectorFeature;
  pollutant: Pollutant;
  year: Year;
  concentrations: PollutantConcentration[];
  isSelected: boolean;
  onSelect: (setuCcnct: string) => void;
}

const isValidGeometry = (geometry: any) => {
  if (!geometry) return false;
  if (!geometry.type) return false;
  if (!geometry.coordinates) return false;
  if (!Array.isArray(geometry.coordinates)) return false;

  return geometry.type === 'Polygon' || geometry.type === 'MultiPolygon';
};

const GeoJSONLayer: React.FC<GeoJSONLayerProps> = ({
  sector,
  pollutant,
  year,
  concentrations,
  isSelected,
  onSelect,
}) => {
  // Safety check: Leaflet crashes if geometry is undefined, null or malformed.
  if (!sector || !isValidGeometry(sector.geometry)) {
    return null;
  }

  const concentration = getConcentration(sector.setuCcnct, pollutant, year, concentrations);
  const color = getColorForConcentration(pollutant, concentration);

  const unit =
    pollutant === 'PM2.5' || pollutant === 'PM10' || pollutant === 'Black Carbon'
      ? 'µg/m³'
      : 'ppb';

  const feature = {
    type: 'Feature',
    geometry: sector.geometry,
    properties: {
      ...(sector.properties ?? {}),
      SETU_CCNCT: sector.setuCcnct,
      name: sector.name ?? sector.setuCcnct,
    },
  };

  const onEachFeature = (_feature: any, layer: any) => {
    layer.bindPopup(
      `
      <div class="text-sm">
        <p class="font-semibold">${sector.name ?? 'Sector censal'}</p>
        <p class="text-xs text-gray-600">SETU_CCNCT: ${sector.setuCcnct}</p>
        <p class="text-xs">
          ${pollutant}: ${
            concentration !== null && concentration !== undefined
              ? `${formatNumber(concentration, 2)} ${unit}`
              : 'Sin dato'
          }
        </p>
        <p class="text-xs">${getConcentrationLabel(pollutant, concentration)}</p>
      </div>
      `,
      {
        className: 'custom-popup',
      },
    );

    layer.on('click', () => {
      onSelect(sector.setuCcnct);
    });
  };

  return (
    <GeoJSON
      key={`${sector.setuCcnct}-${pollutant}-${year}-${isSelected ? 'selected' : 'normal'}`}
      data={feature as any}
      onEachFeature={onEachFeature}
      style={() => ({
        fillColor: color,
        weight: isSelected ? 3 : 1.5,
        opacity: 1,
        color: isSelected ? '#1c1917' : '#999',
        dashArray: '',
        fillOpacity: concentration === null || concentration === undefined ? 0.35 : 0.85,
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
}) => {
  const validSectors = sectors.filter((sector) => sector && isValidGeometry(sector.geometry));

  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden shadow-lg-soft">
      <MapContainer
        center={[4.7111, -74.0721]}
        zoom={12}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          maxZoom={19}
        />

        <MapCenterController />

        {validSectors.map((sector) => (
          <GeoJSONLayer
            key={sector.setuCcnct}
            sector={sector}
            pollutant={selectedPollutant}
            year={selectedYear}
            concentrations={concentrations}
            isSelected={selectedSectorId === sector.setuCcnct}
            onSelect={onSectorSelect}
          />
        ))}
      </MapContainer>

      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-md text-xs text-stone-600 pointer-events-none max-w-xs">
        <p className="font-medium text-stone-900 mb-1">Interacción con el mapa</p>
        <ul className="space-y-1 text-stone-600">
          <li>Haz clic en un sector para ver detalles</li>
          <li>Usa la rueda del ratón para hacer zoom</li>
          <li>Arrastra para mover el mapa</li>
        </ul>
      </div>
    </div>
  );
};

