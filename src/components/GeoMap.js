import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * GeoMap Component
 * Interactive Leaflet map showing Bogotá census sectors with air pollution data
 */
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import { LatLngBounds, FeatureGroup } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getColorForConcentration, getConcentrationLabel } from '../utils/colorScales';
import { getConcentration } from '../utils/dataUtils';
import { formatNumber } from '../utils/formatters';
// Component to center the map on Bogotá
const MapCenterController = () => {
    const map = useMap();
    useEffect(() => {
        // Bogotá center and bounds
        const bounds = new LatLngBounds([4.5, -74.3], // Southwest
        [4.9, -73.8]);
        map.fitBounds(bounds, { padding: [50, 50] });
    }, [map]);
    return null;
};
const GeoJSONLayer = ({ sector, pollutant, year, concentrations, isSelected, onSelect, }) => {
    const concentration = getConcentration(sector.setuCcnct, pollutant, year, concentrations);
    const color = getColorForConcentration(pollutant, concentration);
    const onEachFeature = (feature, layer) => {
        // Hover tooltip
        layer.bindPopup(`
      <div class="text-sm">
        <p class="font-semibold">${sector.name}</p>
        <p class="text-xs text-gray-600">SETU_CCNCT: ${sector.setuCcnct}</p>
        <p class="text-xs">${pollutant}: ${concentration !== null
            ? `${formatNumber(concentration, 2)} ${pollutant === 'PM2.5'
                ? 'µg/m³'
                : pollutant === 'PM10'
                    ? 'µg/m³'
                    : pollutant === 'Black Carbon'
                        ? 'µg/m³'
                        : 'ppb'}`
            : 'N/A'}</p>
        <p class="text-xs">${getConcentrationLabel(pollutant, concentration)}</p>
      </div>
    `, {
            className: 'custom-popup',
        });
        layer.on('click', () => {
            onSelect(sector.setuCcnct);
        });
    };
    return (_jsx(GeoJSON, { data: {
            type: 'Feature',
            geometry: sector.geometry,
            properties: sector.properties,
        }, onEachFeature: onEachFeature, style: () => ({
            fillColor: color,
            weight: isSelected ? 3 : 1.5,
            opacity: 1,
            color: isSelected ? '#1c1917' : '#999',
            dashArray: '',
            fillOpacity: 0.85,
        }) }, `${sector.setuCcnct}-${pollutant}-${year}`));
};
export const GeoMap = ({ sectors, concentrations, selectedPollutant, selectedYear, selectedSectorId, onSectorSelect, mapRef, }) => {
    const [mapInstance, setMapInstance] = useState(null);
    return (_jsxs("div", { className: "w-full h-full relative rounded-2xl overflow-hidden shadow-lg-soft", children: [_jsxs(MapContainer, { ref: mapRef, center: [4.7111, -74.0721], zoom: 12, scrollWheelZoom: true, style: { width: '100%', height: '100%' }, whenCreated: setMapInstance, children: [_jsx(TileLayer, { url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", attribution: '\u00A9 <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>', maxZoom: 19 }), _jsx(MapCenterController, {}), _jsx(FeatureGroup, { children: sectors.map((sector) => (_jsx(GeoJSONLayer, { sector: sector, pollutant: selectedPollutant, year: selectedYear, concentrations: concentrations, isSelected: selectedSectorId === sector.setuCcnct, onSelect: onSectorSelect }, sector.setuCcnct))) })] }), _jsxs("div", { className: "absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-md text-xs text-stone-600 pointer-events-none max-w-xs", children: [_jsx("p", { className: "font-medium text-stone-900 mb-1", children: "Interacci\u00F3n con el mapa" }), _jsxs("ul", { className: "space-y-1 text-stone-600", children: [_jsx("li", { children: "\u2022 Haz clic en un sector para ver detalles" }), _jsx("li", { children: "\u2022 Usa la rueda del rat\u00F3n para hacer zoom" }), _jsx("li", { children: "\u2022 Arrastra para mover el mapa" })] })] })] }));
};
