# Setup Guide: Air Pollution Dashboard with Real Data

This guide walks you through setting up the Air Pollution Dashboard with real Bogotá census sector data.

## Quick Start (with Real Data)

### 1. Prerequisites

- Node.js 16+ and npm 7+
- Python 3.7+
- Git

### 2. Clone and Install

```bash
git clone https://github.com/HaiderFonseca/Air-Pollution-in-Bogota.git
cd Air-Pollution-in-Bogota

# Install Node.js dependencies
npm install

# Install Python dependencies for data conversion
pip install geopandas pandas openpyxl pyogrio fiona
```

### 3. Convert Raw Data to Web Formats

The raw data files are located in the `Datos/` folder:
- `Datos/BOGOTA_SECTOR_CENSAL/BOGOTA_SECTOR_CENSAL.shp` - Census sector boundaries
- `Datos/MEDIA_ZONAL_SECTOR_CENSAL_2010_2024.gpkg` - Pollutant concentrations (2010-2024)
- `Datos/SC_BOGOTA_VARIABLES_SOCIODEMO.xlsx` - Sociodemographic data

Run the conversion script:

```bash
python scripts/convert_data.py
```

Expected output:
```
============================================================
Conversion Summary
============================================================
SHAPEFILE       ✓ SUCCESS
GPKG            ✓ SUCCESS
EXCEL           ✓ SUCCESS

All conversions completed successfully!
Data files are ready in public/data/
```

### 4. Verify Converted Files

The script generates web-friendly files in `public/data/`:

```bash
ls -lh public/data/geo/
# sectores_censales_bogota.geojson (641 sectors, real geometry)
# concentraciones_sector_censal.geojson
# concentraciones_sector_censal.json (56,000+ records, long format)

ls -lh public/data/tabular/
# sociodemograficas_sector_censal.csv
# sociodemograficas_sector_censal.json
```

### 5. Run the Dashboard

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

The dashboard will:
1. Load real census sector polygons from the GeoJSON
2. Load real concentration data from the JSON
3. Display Bogotá with 641 sectors colored by pollutant concentration
4. Allow selection from years 2010-2024
5. Show all 7 pollutants

### 6. Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder, ready to deploy.

## Data Structure

### Sectors (GeoJSON)

File: `public/data/geo/sectores_censales_bogota.geojson`

**Format:** GeoJSON with census sector polygons
**Records:** 641 sectors
**Key Fields:**
- `SETU_CCNCT`: Census sector identifier (join key)
- `geometry`: Polygon or MultiPolygon (WGS84/EPSG:4326)
- `STP27_PERS`: Total population
- `STP34_1_ED` through `STP34_9_ED`: Age groups (0-9, 10-19, ..., 70+)
- `ESTRATO_MAYORITARIO`: Majority socioeconomic stratum
- `IPM_PROMEDIO`: Average poverty index

### Concentrations (JSON, Long Format)

File: `public/data/geo/concentraciones_sector_censal.json`

**Format:** JSON array of records
**Records:** 56,159 concentration values (631 sectors × ~89 pollutant-year combinations)
**Fields:**
```json
{
  "SETU_CCNCT": "11001000001101",
  "pollutant": "PM2.5",
  "year": 2018,
  "concentration": 23.45
}
```

**Available Pollutants:**
- PM2.5 (µg/m³) - 2010-2024
- PM10 (µg/m³) - 2010-2024
- NO2 (ppb) - 2010-2024 (missing 2011-2012)
- SO2 (ppb) - 2011-2024 (missing 2010)
- CO (ppm) - 2010-2024
- O3 (ppb) - 2010-2024
- eBC (µg/m³) - 2021-2024 only

**Available Years:** 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024

### Sociodemographics (CSV)

File: `public/data/tabular/sociodemograficas_sector_censal.csv`

**Records:** 641 sectors
**Key Fields:**
- `SETU_CCNCT`: Census sector identifier (join key)
- `STP27_PERS`: Total population
- `STP34_1_ED`: Children 0-9
- `STP34_2_ED`: Youth 10-19
- `STP34_3_ED` through `STP34_9_ED`: Age groups
- `ESTRATO_MAYORITARIO`: Socioeconomic stratum
- `IPM_PROMEDIO`: Poverty index

## Conversion Details

### How the Conversion Works

1. **Shapefile Conversion**
   - Reads: `Datos/BOGOTA_SECTOR_CENSAL/BOGOTA_SECTOR_CENSAL.shp`
   - Checks CRS (coordinate reference system)
   - Reprojects to EPSG:4326 (WGS84) if needed
   - Saves as GeoJSON

2. **GPKG Conversion**
   - Reads: `Datos/MEDIA_ZONAL_SECTOR_CENSAL_2010_2024.gpkg`
   - Converts from pivot format (columns = pollutant_year) to long format
   - Normalizes pollutant names: OZONO → O3
   - Filters out null/missing values
   - Reprojects to EPSG:4326
   - Saves as both GeoJSON (with geometry) and JSON (tabular)

3. **Excel Conversion**
   - Reads: `Datos/SC_BOGOTA_VARIABLES_SOCIODEMO.xlsx` (Sheet1)
   - Extracts all demographic columns
   - Saves as CSV and JSON

### Pollutant Name Mapping

| GPKG Name | App Name | Unit  |
|-----------|----------|-------|
| CO        | CO       | ppm   |
| NO2       | NO2      | ppb   |
| OZONO     | O3       | ppb   |
| PM10      | PM10     | µg/m³ |
| PM2.5     | PM2.5    | µg/m³ |
| SO2       | SO2      | ppb   |
| eBC       | eBC      | µg/m³ |

## Troubleshooting

### "ModuleNotFoundError: No module named 'geopandas'"

Install Python dependencies:
```bash
pip install geopandas pandas openpyxl pyogrio fiona
```

### "File not found" errors

Ensure raw data files exist:
```bash
ls -la Datos/BOGOTA_SECTOR_CENSAL/BOGOTA_SECTOR_CENSAL.shp
ls -la Datos/MEDIA_ZONAL_SECTOR_CENSAL_2010_2024.gpkg
ls -la Datos/SC_BOGOTA_VARIABLES_SOCIODEMO.xlsx
```

### Map not showing sectors

Check:
1. Did conversion succeed? Look for files in `public/data/geo/`
2. Is server serving the files? Check browser Network tab
3. Check browser console for errors: F12 → Console

### Sectors visible but no colors

Check:
1. Concentration data loaded? Check Network tab for `concentraciones_sector_censal.json`
2. Selected year/pollutant available for all sectors?
3. Check browser console for warnings

### Data loading uses mock data

This happens when real files are not found. The app will:
- Log "Real sector data not found, using mock data"
- Fall back to 6 mock sectors

To verify real data is loaded:
1. Open browser DevTools (F12)
2. Check Console tab
3. Should see: "Loaded 641 real census sectors"
4. Should see: "Loaded 56159 real concentration records"

## Performance Notes

- **Initial load:** 1-2 seconds (network dependent)
- **Sector count:** 641 (manageable by Leaflet)
- **Concentration records:** 56,159 (efficient with long format)
- **Map rendering:** Optimized with GeoJSON layer
- **Bundle size:** ~420KB gzipped

## Notes on Data Availability

- **2010-2024:** Full coverage for PM2.5, PM10, CO, O3
- **2011-2024:** NO2 (missing 2010-2012)
- **2011-2024:** SO2 (missing 2010)
- **2021-2024:** eBC (Black Carbon, limited availability)
- **Missing values:** Displayed as "Sin dato" (No data) on sectors

## Updating Data

If raw data files are updated:

```bash
python scripts/convert_data.py
```

The script will:
1. Read updated raw files
2. Regenerate GeoJSON and JSON
3. Overwrite previous converted files

No code changes needed - the dashboard automatically uses the new files.

## Next Steps

1. Run `npm run dev` to see the dashboard live
2. Click on sectors to see detail panel with concentrations and demographics
3. Change year with year selector (15 years available)
4. Change pollutant with pollutant tabs
5. Use "Centrar Bogotá" to reset map view

## Documentation

- **Data Structure:** See `Datos/` folder and converted files in `public/data/`
- **Conversion Details:** See `scripts/README.md`
- **Development:** See main `README.md`

## Support

For issues:
1. Check console for error messages (F12 → Console)
2. Verify conversion script ran successfully
3. Check file sizes in `public/data/` (should not be empty)
4. Review this guide for common issues
