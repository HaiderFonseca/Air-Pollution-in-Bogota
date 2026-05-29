# Data Conversion Scripts

This folder contains Python scripts to convert raw geospatial and tabular data into web-friendly formats for the Air Pollution Dashboard.

## Overview

The dashboard requires data in specific formats:
- **Sectors**: GeoJSON with census sector polygons
- **Concentrations**: GeoJSON or JSON with pollutant concentrations by sector and year
- **Sociodemographics**: CSV or JSON with population and social indicators

These scripts automate the conversion from raw data sources.

## Prerequisites

Install required Python packages:

```bash
pip install geopandas pandas openpyxl pyogrio
```

Or install from requirements.txt:

```bash
pip install -r requirements.txt
```

## Input Data

The scripts expect raw data files in the `Datos/` folder:

- `Datos/BOGOTA_SECTOR_CENSAL/BOGOTA_SECTOR_CENSAL.shp` - Shapefile with census sector boundaries
- `Datos/MEDIA_ZONAL_SECTOR_CENSAL_2010_2024.gpkg` - GeoPackage with pollutant concentrations
- `Datos/SC_BOGOTA_VARIABLES_SOCIODEMO.xlsx` - Excel file with sociodemographic data

## Output Data

The scripts generate converted files in the `public/data/` folder:

```
public/data/
├── geo/
│   ├── sectores_censales_bogota.geojson
│   ├── concentraciones_sector_censal.geojson
│   └── concentraciones_sector_censal.json
└── tabular/
    ├── sociodemograficas_sector_censal.csv
    └── sociodemograficas_sector_censal.json
```

## Running the Conversion

From the project root:

```bash
python scripts/convert_data.py
```

The script will:
1. Read each raw data file
2. Validate the data structure
3. Reproject geospatial data to EPSG:4326 (WGS84) if needed
4. Save in the output formats
5. Report success/failure for each conversion

## Important Notes

### Coordinate Systems

All geospatial files are automatically reprojected to **EPSG:4326** (WGS84, latitude/longitude) because:
- This is the standard for web mapping
- Leaflet (our mapping library) requires WGS84
- GeoJSON standard specifies WGS84

### Join Key: SETU_CCNCT

All data is joined using the **SETU_CCNCT** field:
- This is the census sector identifier
- Must be consistent across shapefile, GPKG, and Excel
- The dashboard uses this key to match sectors with concentrations and demographics

### Data Validation

If the script reports missing columns, check:
1. The raw data files match the expected structure
2. Column names in source files (may differ between versions)
3. The data is not corrupted or in an unexpected format

### Available Years

The concentration data includes years from **2010 to 2024**:
- Dashboard shows data for all these years
- Default selected year is 2018

### Available Pollutants

Concentrations are provided for:
- PM2.5 (µg/m³)
- PM10 (µg/m³)
- NO2 (ppb)
- SO₂ (ppb)
- CO (ppm)
- O₃ (ppb)
- Black Carbon (µg/m³)

## Development Workflow

1. **Initial Setup**:
   ```bash
   pip install geopandas pandas openpyxl pyogrio
   python scripts/convert_data.py
   npm install
   npm run dev
   ```

2. **After Data Updates**:
   ```bash
   python scripts/convert_data.py
   # The dashboard will automatically use the new files
   # (no rebuild needed, just refresh the browser)
   ```

3. **Verification**:
   - Check that `public/data/` contains the new files
   - Open the browser dev console for any load errors
   - Verify sectors appear on the map
   - Test year and pollutant selectors

## Troubleshooting

### "ModuleNotFoundError: No module named 'geopandas'"

Install the dependencies:
```bash
pip install geopandas pandas openpyxl pyogrio
```

### "File not found" errors

Ensure the raw data files are in the `Datos/` folder:
- `Datos/BOGOTA_SECTOR_CENSAL/BOGOTA_SECTOR_CENSAL.shp`
- `Datos/MEDIA_ZONAL_SECTOR_CENSAL_2010_2024.gpkg`
- `Datos/SC_BOGOTA_VARIABLES_SOCIODEMO.xlsx`

### "CRS not found" or projection errors

This usually means the data has an unknown CRS. The script will attempt to proceed anyway. If needed, manually inspect the file with:

```python
import geopandas as gpd
gdf = gpd.read_file('Datos/BOGOTA_SECTOR_CENSAL/BOGOTA_SECTOR_CENSAL.shp')
print(gdf.crs)
```

### Missing columns in Excel/GPKG

The script will warn if expected columns are not found. Check:
1. Sheet name is 'Sheet1' for Excel
2. Column names match documentation
3. Data file is not corrupted

## Manual Conversion

If you prefer manual conversion, you can also use command-line tools:

### GDAL (ogr2ogr)

```bash
# Shapefile to GeoJSON
ogr2ogr -f GeoJSON -t_srs EPSG:4326 \
  public/data/geo/sectores_censales_bogota.geojson \
  Datos/BOGOTA_SECTOR_CENSAL/BOGOTA_SECTOR_CENSAL.shp

# GPKG to GeoJSON
ogr2ogr -f GeoJSON -t_srs EPSG:4326 \
  public/data/geo/concentraciones_sector_censal.geojson \
  Datos/MEDIA_ZONAL_SECTOR_CENSAL_2010_2024.gpkg
```

### Python/Pandas

```python
import pandas as pd

# Excel to CSV
df = pd.read_excel('Datos/SC_BOGOTA_VARIABLES_SOCIODEMO.xlsx', sheet_name='Sheet1')
df.to_csv('public/data/tabular/sociodemograficas_sector_censal.csv', index=False)
```

## Next Steps

After conversion:

1. Verify output files are valid:
   ```bash
   # Check file sizes (should not be empty)
   ls -lh public/data/geo/
   ls -lh public/data/tabular/
   ```

2. Run the dashboard:
   ```bash
   npm run dev
   ```

3. Test the map and data loading in the browser

4. Commit the converted data files (optional, but recommended for reproducibility):
   ```bash
   git add public/data/
   git commit -m "Add converted geospatial and demographic data"
   ```

## Reference

- [GeoJSON Specification](https://geojson.org/)
- [EPSG:4326 (WGS84)](https://epsg.io/4326)
- [Leaflet Documentation](https://leafletjs.com/)
- [GeoPandas Documentation](https://geopandas.org/)
