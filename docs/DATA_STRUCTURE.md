# Data Structure Documentation

## Overview

This document describes the data structure, requirements, and integration points for the Air Pollution Dashboard.

## Key Concept: SETU_CCNCT

**SETU_CCNCT** is the main join key across all datasets. This is a unique identifier for each census sector in Bogotá.

Example: `110010000100`

All data tables must use this field to establish relationships between:
- Geographic boundaries (sectors geometry)
- Air pollutant concentrations
- Sociodemographic variables

## Data Files

### 1. Census Sectors (Geographic Data)

**Current Location (Raw)**: `Datos/BOGOTA_SECTOR_CENSAL/BOGOTA_SECTOR_CENSAL.shp`

**Production Location**: `public/data/geo/sectores_censales_bogota.geojson`

**Format**: GeoJSON (converted from Shapefile)

**Structure**:
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[lon, lat], [lon, lat], ...]]
      },
      "properties": {
        "SETU_CCNCT": "110010000100",
        "name": "Sector Name",
        "locality": "Locality Name",
        "STP27_PERS": 15000,
        "STP34_1_ED": 1200,
        "STP34_2_ED": 1500,
        "STP34_3_ED": 5000,
        "STP34_4_ED": 2000,
        "STP34_5_ED": 1500,
        "STP34_6_ED": 1000,
        "STP34_7_ED": 1500,
        "STP34_8_ED": 900,
        "STP34_9_ED": 400,
        "ESTRATO_MAYORITARIO": "2",
        "IPM_PROMEDIO": 0.45
      }
    }
  ]
}
```

**Required Fields**:
- `SETU_CCNCT` - Sector identifier (string, unique)
- `geometry` - Polygon or MultiPolygon
- `STP27_PERS` - Total population (number)
- `STP34_1_ED` to `STP34_9_ED` - Age group counts (numbers)
- `ESTRATO_MAYORITARIO` - Socioeconomic stratum (string: "1"-"6")
- `IPM_PROMEDIO` - Average poverty index (number: 0-1)

**Conversion Command** (using ogr2ogr):
```bash
ogr2ogr -f GeoJSON public/data/geo/sectores_censales_bogota.geojson \
  Datos/BOGOTA_SECTOR_CENSAL/BOGOTA_SECTOR_CENSAL.shp
```

### 2. Pollutant Concentrations (Time Series)

**Current Location (Raw)**: `Datos/MEDIA_ZONAL_SECTOR_CENSAL_2010_2024.gpkg`

**Production Location**: `public/data/geo/concentraciones_sector_censal.geojson` or `.json`

**Format**: GeoJSON (converted from GeoPackage) or JSON

**Structure** (GeoJSON format):
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "SETU_CCNCT": "110010000100",
        "year": 2018,
        "pollutant": "PM2.5",
        "concentration": 28.5,
        "unit": "µg/m³"
      }
    }
  ]
}
```

**Structure** (JSON format):
```json
[
  {
    "SETU_CCNCT": "110010000100",
    "year": 2018,
    "pollutant": "PM2.5",
    "concentration": 28.5,
    "unit": "µg/m³"
  }
]
```

**Required Fields**:
- `SETU_CCNCT` - Sector identifier (must match sectors file)
- `year` - Year (integer: 2010-2018)
- `pollutant` - Pollutant name (string, see list below)
- `concentration` - Annual average concentration (number or null for missing)
- `unit` - Measurement unit (string)

**Available Pollutants**:
- PM2.5 (µg/m³)
- PM10 (µg/m³)
- NO2 (ppb)
- SO₂ (ppb)
- CO (ppm)
- O₃ (ppb)
- Black Carbon (µg/m³)

**Temporal Coverage**: 2010-2018 (9 years)

**Important Note**: Years must range from 2010 to 2018. The dashboard opens with 2018 as the default year. Do not include years beyond 2018.

**Conversion Command** (using ogr2ogr):
```bash
ogr2ogr -f GeoJSON public/data/geo/concentraciones_sector_censal.geojson \
  Datos/MEDIA_ZONAL_SECTOR_CENSAL_2010_2024.gpkg
```

Or convert to JSON:
```python
import fiona
with fiona.open('Datos/MEDIA_ZONAL_SECTOR_CENSAL_2010_2024.gpkg') as src:
    import json
    features = [f for f in src]
    with open('public/data/geo/concentraciones_sector_censal.json', 'w') as f:
        json.dump(features, f)
```

### 3. Sociodemographic Variables

**Current Location (Raw)**: `Datos/SC_BOGOTA_VARIABLES_SOCIODEMO.xlsx`

**Production Location**: `public/data/tabular/sociodemograficas_sector_censal.csv` or `.json`

**Sheet Name**: Sheet1

**Format**: CSV or JSON

**Structure** (CSV format):
```csv
SETU_CCNCT,STP27_PERS,STP34_1_ED,STP34_2_ED,...,ESTRATO_MAYORITARIO,IPM_PROMEDIO
110010000100,15000,1200,1500,...,2,0.45
110010000200,22500,1800,2300,...,3,0.38
```

**Structure** (JSON format):
```json
[
  {
    "SETU_CCNCT": "110010000100",
    "STP27_PERS": 15000,
    "STP34_1_ED": 1200,
    "STP34_2_ED": 1500,
    "STP34_3_ED": 5000,
    "STP34_4_ED": 2000,
    "STP34_5_ED": 1500,
    "STP34_6_ED": 1000,
    "STP34_7_ED": 1500,
    "STP34_8_ED": 900,
    "STP34_9_ED": 400,
    "ESTRATO_MAYORITARIO": "2",
    "IPM_PROMEDIO": 0.45
  }
]
```

**Required Fields**:
- `SETU_CCNCT` - Sector identifier (must match sectors file)
- `STP27_PERS` - Total population (number)
- `STP34_1_ED` - Children 0-9 years (number)
- `STP34_2_ED` - Youth 10-19 years (number)
- `STP34_3_ED` - Adults 20-29 years (number)
- `STP34_4_ED` - Adults 30-39 years (number)
- `STP34_5_ED` - Adults 40-49 years (number)
- `STP34_6_ED` - Adults 50-59 years (number)
- `STP34_7_ED` - Adults 60-69 years (number)
- `STP34_8_ED` - Adults 70-79 years (number)
- `STP34_9_ED` - Adults 80+ years (number)
- `ESTRATO_MAYORITARIO` - Majority socioeconomic stratum (string: "1"-"6")
- `IPM_PROMEDIO` - Average multidimensional poverty index (number: 0-1)

**Conversion Command** (using pandas):
```python
import pandas as pd
df = pd.read_excel('Datos/SC_BOGOTA_VARIABLES_SOCIODEMO.xlsx', sheet_name='Sheet1')
df.to_csv('public/data/tabular/sociodemograficas_sector_censal.csv', index=False)
```

Or to JSON:
```python
import pandas as pd
df = pd.read_excel('Datos/SC_BOGOTA_VARIABLES_SOCIODEMO.xlsx', sheet_name='Sheet1')
df.to_json('public/data/tabular/sociodemograficas_sector_censal.json', orient='records')
```

## Data Relationships (Join Logic)

```
┌─────────────────────────┐
│ Sectors (Geometry)      │
│ SETU_CCNCT              │
│ ├─ Boundaries           │
│ ├─ Location            │
│ └─ Demographics        │
└────────────┬────────────┘
             │
             │ JOIN on SETU_CCNCT
             │
        ┌────┴────┐
        │          │
┌───────▼───────────┐    ┌──────────────────────┐
│ Concentrations    │    │ Sociodemographics    │
│ SETU_CCNCT        │    │ SETU_CCNCT           │
│ Year              │    │ ├─ Population        │
│ Pollutant         │    │ ├─ Age groups        │
│ Concentration     │    │ ├─ Stratum          │
└───────────────────┘    │ └─ IPM              │
                         └──────────────────────┘
```

## Calculated Fields

The dashboard calculates the following fields from raw demographic data:

```typescript
// Age group aggregations for easier display
children_0_9 = STP34_1_ED
youth_10_19 = STP34_2_ED
adults_20_59 = STP34_3_ED + STP34_4_ED + STP34_5_ED + STP34_6_ED
older_adults_60_plus = STP34_7_ED + STP34_8_ED + STP34_9_ED

// Age percentages (calculated on demand)
age_percentage = (age_group_count / STP27_PERS) * 100
```

## Important Data Rules

1. **SETU_CCNCT Consistency**: All files must use the same SETU_CCNCT values. Mismatched IDs will cause data to not appear on the map.

2. **Temporal Coverage**: Data must cover all years from 2010 to 2018. If a year is missing for a pollutant, it should be represented as `null` or omitted (system will treat as missing).

3. **Demographic Stability**: Sociodemographic variables (age groups, stratum, IPM) are assumed to remain **constant across all years**. Only pollutant concentrations vary by year.

4. **Missing Data Handling**: Missing pollutant concentration values should be represented as:
   - `null` in JSON
   - Empty cell in CSV
   - No entry in the concentrations table
   
   The UI will display these as "Sin dato" (no data).

5. **Default Year**: The dashboard always opens with **2018** as the default year. Ensure this year has data for all pollutants.

6. **Pollutant Names**: Must exactly match one of these:
   - PM2.5
   - PM10
   - NO2
   - SO₂ (note: contains special character)
   - CO
   - O₃ (note: contains special character)
   - Black Carbon

## Data Validation Checklist

Before deploying real data:

- [ ] All sectors have valid SETU_CCNCT (no duplicates, no nulls)
- [ ] All sectors have valid Polygon or MultiPolygon geometry
- [ ] All sectors have demographic data (non-null, non-zero population)
- [ ] All concentration records have valid SETU_CCNCT matching a sector
- [ ] All years are in range 2010-2018
- [ ] All pollutants match the approved list
- [ ] Concentration values are numeric or null (no invalid strings)
- [ ] Units are specified correctly for each pollutant
- [ ] No demographic data changes across years (intentional)
- [ ] GeoJSON files are valid (use geojsonlint.com to verify)

## File Size Considerations

- Sectors GeoJSON: ~500KB (depending on polygon complexity)
- Concentrations: ~50-100KB
- Sociodemographic CSV: ~20KB
- Total: ~600KB-1MB (acceptable for web)

If file sizes are too large:
1. Simplify polygon geometries (reduce decimal places)
2. Compress GeoJSON using gzip
3. Consider splitting into multiple smaller files by locality

## Mock Data Reference

For testing and development, the system includes mock data with:
- 6 sample sectors
- 9 years (2010-2018)
- 7 pollutants
- All age groups and demographic variables
- 1 intentional missing value (2011 PM2.5 for sector 110010000500)

Mock data is loaded from `src/data/mockData.ts` and demonstrates the expected data structure.

## Integration Points in Code

When connecting real data, update these functions in `src/utils/dataUtils.ts`:

1. **loadSectors()** - Load from GeoJSON
2. **loadConcentrations()** - Load from GeoJSON or JSON
3. **convertGeoJSONFeature()** - Map raw GeoJSON to internal structure
4. **convertConcentrationRecord()** - Map raw data to internal structure

See inline comments in the file for implementation details.

## Performance Tips

- Limit number of sectors to 100-500 per view for optimal performance
- Use simplified geometries (reduce coordinate precision)
- Consider splitting data by locality if needed
- Enable browser caching for static data files
- Use GZIP compression for file transfers

## Quality Assurance

Before deploying:
1. Verify data against source spreadsheets
2. Check for outliers in concentration values
3. Validate geographic coordinates (should be in Bogotá bounds)
4. Test with different browsers and devices
5. Compare visualizations against expected patterns

## Troubleshooting Data Issues

**Sectors not appearing on map?**
- Check SETU_CCNCT values match
- Verify GeoJSON geometry is valid
- Ensure coordinates are in lon/lat format

**Concentrations not showing?**
- Verify year is in 2010-2018 range
- Check pollutant name matches exactly
- Ensure SETU_CCNCT values are in both files

**Performance issues?**
- Reduce number of sectors
- Simplify polygon geometries
- Check file sizes

---

For more information, see README.md and PROJECT_GUIDE.md
