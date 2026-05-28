# Dashboard Geoespacial de Calidad del Aire en Bogotá

A professional, interactive geospatial dashboard for analyzing air pollution concentrations across Bogotá's census sectors, integrated with sociodemographic data.

## Features

- 🗺️ **Interactive Map**: Explore air pollution data across Bogotá's census sectors
- 📊 **Multiple Pollutants**: Track PM2.5, PM10, NO2, SO₂, CO, O₃, and Black Carbon
- 📅 **Temporal Analysis**: Compare data from 2010 to 2018
- 👥 **Sociodemographic Integration**: View population distribution and socioeconomic indicators
- 🎨 **Premium UI**: Clean, institutional, iOS-inspired interface
- ⚡ **Real-time Transitions**: Smooth smoke transitions between pollutant selections
- 📱 **Responsive Design**: Works seamlessly on different screen sizes

## Technology Stack

- **Frontend Framework**: React 18.2.0 with TypeScript
- **Build Tool**: Vite 5.0.2
- **Styling**: Tailwind CSS 3.3.3
- **Animations**: Framer Motion 10.16.4
- **Mapping**: React Leaflet 4.2.1 + Leaflet 1.9.4
- **Data Format**: GeoJSON, JSON, CSV (ready for production)

## Quick Start

### Prerequisites

- Node.js 16+ and npm 7+ installed
- Git for version control

### Installation

```bash
# Clone the repository
git clone https://github.com/HaiderFonseca/Air-Pollution-in-Bogota.git
cd Air-Pollution-in-Bogota

# Install dependencies
npm install
```

### Running Locally

```bash
# Start the development server
npm run dev
```

The dashboard will automatically open in your browser at `http://localhost:3000`.

### Building for Production

```bash
# Create an optimized production build
npm run build

# Preview the production build locally
npm run preview
```

## Project Structure

```
├── public/
│   └── data/
│       ├── geo/              # GeoJSON files for sectors and concentrations
│       │   ├── sectores_censales_bogota.geojson
│       │   └── concentraciones_sector_censal.geojson
│       └── tabular/          # CSV/JSON files for sociodemographic data
│           └── sociodemograficas_sector_censal.csv
│
├── src/
│   ├── components/
│   │   ├── AppLayout.tsx              # Main layout component
│   │   ├── DashboardHeader.tsx        # Header with controls
│   │   ├── PollutantTabs.tsx          # Pollutant selector
│   │   ├── YearTabs.tsx               # Year selector
│   │   ├── GeoMap.tsx                 # Interactive Leaflet map
│   │   ├── SectorDetailPanel.tsx      # Selected sector details
│   │   ├── Legend.tsx                 # Color scale legend
│   │   ├── SmokeTransition.tsx        # Transition animation
│   │   ├── LoadingState.tsx           # Loading indicator
│   │   └── EmptyState.tsx             # Empty state message
│   │
│   ├── data/
│   │   └── mockData.ts                # Mock data for development
│   │
│   ├── types/
│   │   └── dashboard.ts               # TypeScript interfaces
│   │
│   ├── utils/
│   │   ├── dataUtils.ts               # Data loading and processing
│   │   ├── colorScales.ts             # Color mapping logic
│   │   └── formatters.ts              # Text formatting utilities
│   │
│   ├── App.tsx                        # Main app component with state management
│   ├── main.tsx                       # Entry point
│   └── index.css                      # Global styles
│
├── docs/
│   ├── DATA_STRUCTURE.md              # Data schema documentation
│   ├── DASHBOARD_REQUIREMENTS.md      # Detailed requirements
│   └── PROJECT_GUIDE.md               # Developer guide
│
├── Datos/                             # Raw data files (not deployed)
├── vite.config.ts                     # Vite configuration
├── tailwind.config.js                 # Tailwind CSS configuration
├── tsconfig.json                      # TypeScript configuration
├── package.json                       # Dependencies and scripts
└── index.html                         # HTML entry point
```

## Default Configuration

The dashboard opens with these default values:

- **Pollutant**: PM2.5
- **Year**: 2018
- **View**: Bogotá (centered and zoomed)

## Current State: Mock Data

The current implementation uses **mock data** for demonstration. This allows:

- Testing the full UI/UX without external dependencies
- Understanding the data structure
- Verifying all functionality works correctly

**Mock data includes:**
- 6 census sectors with geographic coordinates
- 9 years of data (2010-2018)
- 7 air pollutants
- Sociodemographic variables for each sector
- 1 intentional missing data value for demonstration

## Connecting Real Data

To connect real data in production:

### 1. Prepare Real Data Files

Convert raw data files to supported formats:

#### Sectors (Shapefiles → GeoJSON)
```bash
# Using ogr2ogr (GDAL):
ogr2ogr -f GeoJSON public/data/geo/sectores_censales_bogota.geojson \
  Datos/BOGOTA_SECTOR_CENSAL/BOGOTA_SECTOR_CENSAL.shp
```

Place the converted file at: `public/data/geo/sectores_censales_bogota.geojson`

#### Concentrations (GPKG → GeoJSON or JSON)
```bash
# Using ogr2ogr:
ogr2ogr -f GeoJSON public/data/geo/concentraciones_sector_censal.geojson \
  Datos/MEDIA_ZONAL_SECTOR_CENSAL_2010_2024.gpkg
```

Place the converted file at: `public/data/geo/concentraciones_sector_censal.geojson`

#### Sociodemographic Variables (Excel → CSV or JSON)
```bash
# Convert using pandas (Python):
python3 -c "
import pandas as pd
df = pd.read_excel('Datos/SC_BOGOTA_VARIABLES_SOCIODEMO.xlsx', sheet_name='Sheet1')
df.to_csv('public/data/tabular/sociodemograficas_sector_censal.csv', index=False)
"
```

Place the converted file at: `public/data/tabular/sociodemograficas_sector_censal.csv`

### 2. Update Data Loading Logic

Edit `src/utils/dataUtils.ts` to uncomment the real data loading code:

```typescript
// In loadSectors():
const response = await fetch('/data/geo/sectores_censales_bogota.geojson');
const geojson = await response.json();
return geojson.features.map(convertGeoJSONFeature);

// In loadConcentrations():
const response = await fetch('/data/geo/concentraciones_sector_censal.geojson');
const data = await response.json();
return data.features.map(convertConcentrationRecord);
```

### 3. Verify Data Structure

Ensure your data follows this structure:

**Key Join Field**: `SETU_CCNCT` (Census sector identifier)

**Required Fields in Sectors**:
- SETU_CCNCT
- geometry (Polygon or MultiPolygon)
- STP27_PERS (total population)
- STP34_1_ED through STP34_9_ED (age groups)
- ESTRATO_MAYORITARIO (majority stratum)
- IPM_PROMEDIO (average poverty index)

**Required Fields in Concentrations**:
- SETU_CCNCT (sector identifier)
- year (2010-2018)
- pollutant (PM2.5, PM10, NO2, SO₂, CO, O₃, Black Carbon)
- concentration (numeric value or null for missing data)

**Required Fields in Sociodemographic**:
- SETU_CCNCT (must match other files)
- All demographic fields listed above

## Customization

### Change Default Year

Edit `src/data/mockData.ts`:
```typescript
export const DEFAULT_YEAR: Year = 2018; // Change this value
```

### Change Default Pollutant

Edit `src/App.tsx`:
```typescript
const [selectedPollutant, setSelectedPollutant] = useState<Pollutant>('PM2.5'); // Change this
```

### Modify Available Pollutants

Edit `src/data/mockData.ts`:
```typescript
export const AVAILABLE_POLLUTANTS: Pollutant[] = [
  'PM2.5',
  'PM10',
  // Add or remove pollutants here
];
```

### Change Colors and Styling

Edit `src/utils/colorScales.ts` to modify color scales:
```typescript
export function getColorScale(pollutant: Pollutant): ColorScale {
  // Modify the colors array for each pollutant
}
```

Edit `tailwind.config.js` for global theme colors:
```javascript
theme: {
  extend: {
    colors: {
      // Modify colors here
    },
  },
}
```

### Adjust Map Center and Initial View

Edit `src/components/GeoMap.tsx`:
```typescript
<MapContainer
  center={[4.7111, -74.0721]} // Change coordinates
  zoom={12} // Change zoom level
  // ...
>
```

### Change Labels and Text

All UI text is hardcoded in components. Search for Spanish text like "Dashboard Geoespacial" and update as needed.

## Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Add Air Pollution Dashboard"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to https://vercel.com/new
   - Select your GitHub repository
   - Vercel automatically detects Vite
   - Set environment variables if needed
   - Click "Deploy"

3. **Configuration**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### Deploy to GitHub Pages

1. **Update `package.json`**:
   ```json
   {
     "homepage": "https://username.github.io/Air-Pollution-in-Bogota"
   }
   ```

2. **Update `vite.config.ts`**:
   ```typescript
   export default defineConfig({
     base: '/Air-Pollution-in-Bogota/',
     // ...
   })
   ```

3. **Create deployment script** or use GitHub Actions

### Deploy to Other Platforms

The `dist` folder contains a complete static website that can be deployed to:
- AWS S3 + CloudFront
- Google Cloud Storage
- Azure Static Web Apps
- Netlify
- Any static hosting service

## Scripts

```bash
# Development
npm run dev          # Start dev server with hot reload

# Building
npm run build        # Production build (optimized)
npm run preview      # Preview production build locally

# Linting
npm run lint         # TypeScript type checking
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Considerations

- Initial load time: ~2-3 seconds (network dependent)
- Map rendering: Optimized with Leaflet
- Data processing: Done client-side for responsiveness
- Bundle size: ~500KB uncompressed

## Known Limitations

- **Mock data**: Currently using generated test data (1 missing value for demo)
- **Data size**: Designed for ~10-100 sectors per view
- **Browser storage**: No data persistence (add IndexedDB if needed)
- **Offline capability**: Requires internet for map tiles

## Missing Data Handling

- Missing pollutant concentrations are displayed as "Sin dato"
- Sectors with missing data are shown in light gray on the map
- The sidebar clearly indicates when data is unavailable

## Error Handling

The app gracefully handles:
- Failed data loading
- Missing GeoJSON features
- Invalid concentration values
- Browser incompatibilities

## Security Considerations

- No API keys required (uses OpenStreetMap)
- No personal data collected
- HTTPS recommended for production
- CORS enabled for public data files

## Development Notes

### Adding a New Pollutant

1. Add to `Pollutant` type in `src/types/dashboard.ts`
2. Add to `AVAILABLE_POLLUTANTS` in `src/data/mockData.ts`
3. Add color scale in `src/utils/colorScales.ts`
4. Add unit in `getUnitForPollutant()` in `src/data/mockData.ts`

### Adding a New Year

1. Add to `Year` type in `src/types/dashboard.ts`
2. Add to `AVAILABLE_YEARS` in `src/data/mockData.ts`
3. Mock data will automatically generate values for the new year

### Modifying Component Layout

The main layout is in `src/components/AppLayout.tsx`. Components use:
- Tailwind CSS for styling
- Framer Motion for animations
- React Leaflet for mapping

## Troubleshooting

**Map not loading?**
- Check that Leaflet CSS is imported in `index.css`
- Verify OpenStreetMap is not blocked in your network

**Data not showing?**
- Check browser console for errors
- Verify data files are in the correct location
- Ensure SETU_CCNCT keys match across all files

**Slow performance?**
- Reduce the number of sectors rendered
- Optimize GeoJSON file size
- Enable browser caching

## Contributing

When making changes:
1. Keep TypeScript strict mode enabled
2. Follow the existing component structure
3. Update documentation for significant changes
4. Test in development mode before building
5. Use meaningful git commit messages

## License

This project is part of a research initiative for public health analysis in Bogotá.

## Support

For issues, questions, or suggestions:
1. Check the `docs/` folder for detailed documentation
2. Review the inline code comments
3. Examine the mock data structure for reference

## Citation

If you use this dashboard in research or analysis, please cite:
```
Air Pollution Dashboard - Bogotá
Dashboard Geoespacial de Calidad del Aire en Bogotá
GitHub: HaiderFonseca/Air-Pollution-in-Bogota
```

## Future Enhancements

Potential improvements for future versions:
- Real-time data updates
- Time series analysis charts
- Advanced filtering options
- Data export functionality
- Multi-language support
- Dark mode
- Comparison between sectors
- Predictive analysis
- Mobile app version

---

Built with ❤️ for environmental health analysis in Bogotá, Colombia.