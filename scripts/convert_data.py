#!/usr/bin/env python3
"""
Convert Data Script for Air Pollution Dashboard
Converts raw spatial and tabular data to web-friendly formats

Input:
- Datos/BOGOTA_SECTOR_CENSAL/BOGOTA_SECTOR_CENSAL.shp (Shapefile)
- Datos/MEDIA_ZONAL_SECTOR_CENSAL_2010_2024.gpkg (GeoPackage)
- Datos/SC_BOGOTA_VARIABLES_SOCIODEMO.xlsx (Excel)

Output:
- public/data/geo/sectores_censales_bogota.geojson
- public/data/geo/concentraciones_sector_censal.geojson
- public/data/tabular/sociodemograficas_sector_censal.csv

IMPORTANT: All geospatial data is reprojected to EPSG:4326 (WGS84)
"""

import geopandas as gpd
import pandas as pd
import json
import sys
from pathlib import Path

# Get project root
PROJECT_ROOT = Path(__file__).parent.parent

def convert_shapefile_to_geojson():
    """Convert Bogotá census sector shapefile to GeoJSON"""
    print("Converting shapefile to GeoJSON...")
    
    shapefile_path = PROJECT_ROOT / "Datos/BOGOTA_SECTOR_CENSAL/BOGOTA_SECTOR_CENSAL.shp"
    output_path = PROJECT_ROOT / "public/data/geo/sectores_censales_bogota.geojson"
    
    if not shapefile_path.exists():
        print(f"ERROR: Shapefile not found at {shapefile_path}")
        return False
    
    try:
        # Read shapefile
        gdf = gpd.read_file(shapefile_path)
        print(f"  Loaded shapefile with {len(gdf)} features")
        print(f"  Current CRS: {gdf.crs}")
        print(f"  Columns: {list(gdf.columns)}")
        
        # Reproject to EPSG:4326 if needed
        if gdf.crs and gdf.crs.to_string() != "EPSG:4326":
            gdf = gdf.to_crs("EPSG:4326")
            print(f"  Reprojected to EPSG:4326")
        
        # Ensure SETU_CCNCT column exists (the join key)
        if 'SETU_CCNCT' not in gdf.columns:
            print(f"  WARNING: SETU_CCNCT column not found in shapefile")
            print(f"  Available columns: {list(gdf.columns)}")
            # Try common alternatives
            setu_cols = [col for col in gdf.columns if 'SETU' in col.upper() or 'CCNCT' in col.upper() or 'SECTOR' in col.upper()]
            if setu_cols:
                print(f"  Potential sector ID columns: {setu_cols}")
        
        # Save to GeoJSON
        gdf.to_file(output_path, driver='GeoJSON')
        print(f"  ✓ Saved to {output_path}")
        return True
        
    except Exception as e:
        print(f"  ERROR converting shapefile: {e}")
        return False


def convert_gpkg_to_geojson():
    """Convert pollutant concentration GeoPackage to GeoJSON
    
    The GPKG has a pivot-table structure: each column is pollutant_year
    We'll convert it to a long format JSON with records: 
    {SETU_CCNCT, pollutant, year, concentration}
    """
    print("Converting GeoPackage to JSON (long format)...")
    
    gpkg_path = PROJECT_ROOT / "Datos/MEDIA_ZONAL_SECTOR_CENSAL_2010_2024.gpkg"
    json_output_path = PROJECT_ROOT / "public/data/geo/concentraciones_sector_censal.json"
    
    if not gpkg_path.exists():
        print(f"ERROR: GPKG file not found at {gpkg_path}")
        return False
    
    try:
        import fiona
        
        # List available layers
        print("  Available layers in GPKG:")
        layers = fiona.listlayers(gpkg_path)
        for layer in layers:
            print(f"    - {layer}")
        
        if not layers:
            print(f"  ERROR: No layers found in GPKG")
            return False
        
        # Read the first layer (concentration data)
        layer_name = layers[0]
        print(f"  Reading layer: {layer_name}")
        gdf = gpd.read_file(gpkg_path, layer=layer_name)
        print(f"  Loaded with {len(gdf)} records")
        print(f"  Current CRS: {gdf.crs}")
        
        # Keep geometry for GeoJSON version
        gdf_geo = gdf.copy()
        if gdf_geo.crs and gdf_geo.crs.to_string() != "EPSG:4326":
            gdf_geo = gdf_geo.to_crs("EPSG:4326")
            print(f"  Reprojected to EPSG:4326 for GeoJSON version")
        
        # Save GeoJSON version
        geojson_output_path = PROJECT_ROOT / "public/data/geo/concentraciones_sector_censal.geojson"
        gdf_geo.to_file(geojson_output_path, driver='GeoJSON')
        print(f"  ✓ Saved GeoJSON to {geojson_output_path}")
        
        # Convert to long format for web consumption
        # Drop geometry for JSON version
        df = gdf.drop('geometry', axis=1)
        
        # Find all pollutant_year columns
        # Columns are like: CO_2010, NO2_2018, PM2.5_2023, etc.
        concentration_columns = []
        for col in df.columns:
            if col not in ['SETU_CCNCT', 'SETU_CCDGO']:
                concentration_columns.append(col)
        
        print(f"  Found {len(concentration_columns)} concentration columns")
        
        # Convert from wide to long format
        records = []
        for idx, row in df.iterrows():
            sector_id = row['SETU_CCNCT']
            
            for col in concentration_columns:
                # Parse column name: pollutant_year
                parts = col.rsplit('_', 1)
                if len(parts) == 2:
                    pollutant = parts[0]
                    try:
                        year = int(parts[1])
                    except ValueError:
                        continue
                    
                    concentration = row[col]
                    
                    # Skip NaN values
                    if pd.isna(concentration):
                        continue
                    
                    records.append({
                        'SETU_CCNCT': sector_id,
                        'pollutant': pollutant,
                        'year': year,
                        'concentration': float(concentration)
                    })
        
        print(f"  Generated {len(records)} concentration records (long format)")
        
        # Save JSON version
        with open(json_output_path, 'w', encoding='utf-8') as f:
            json.dump(records, f, indent=2)
        print(f"  ✓ Saved JSON to {json_output_path}")
        
        return True
        
    except ImportError:
        print(f"  WARNING: fiona not installed, trying alternative method...")
        try:
            gdf = gpd.read_file(gpkg_path)
            geojson_output_path = PROJECT_ROOT / "public/data/geo/concentraciones_sector_censal.geojson"
            
            if gdf.crs and gdf.crs.to_string() != "EPSG:4326":
                gdf = gdf.to_crs("EPSG:4326")
            
            gdf.to_file(geojson_output_path, driver='GeoJSON')
            print(f"  ✓ Saved GeoJSON to {geojson_output_path}")
            return True
        except Exception as e:
            print(f"  ERROR: {e}")
            return False
    except Exception as e:
        print(f"  ERROR converting GPKG: {e}")
        import traceback
        traceback.print_exc()
        return False


def convert_excel_to_csv():
    """Convert sociodemographic Excel file to CSV"""
    print("Converting Excel to CSV...")
    
    excel_path = PROJECT_ROOT / "Datos/SC_BOGOTA_VARIABLES_SOCIODEMO.xlsx"
    output_path = PROJECT_ROOT / "public/data/tabular/sociodemograficas_sector_censal.csv"
    
    if not excel_path.exists():
        print(f"ERROR: Excel file not found at {excel_path}")
        return False
    
    try:
        # Read Excel file
        df = pd.read_excel(excel_path, sheet_name='Sheet1')
        print(f"  Loaded Excel with {len(df)} rows")
        print(f"  Columns: {list(df.columns)}")
        
        # Ensure SETU_CCNCT exists
        if 'SETU_CCNCT' not in df.columns:
            print(f"  WARNING: SETU_CCNCT column not found in Excel")
            print(f"  Available columns: {list(df.columns)}")
            # Try to find sector ID column
            setu_cols = [col for col in df.columns if 'SETU' in col.upper() or 'SECTOR' in col.upper() or 'CCNCT' in col.upper()]
            if setu_cols:
                print(f"  Potential sector ID columns: {setu_cols}")
        
        # Verify required demographic columns
        required_cols = [
            'STP27_PERS',
            'STP34_1_ED', 'STP34_2_ED', 'STP34_3_ED', 'STP34_4_ED', 
            'STP34_5_ED', 'STP34_6_ED', 'STP34_7_ED', 'STP34_8_ED', 'STP34_9_ED',
            'ESTRATO_MAYORITARIO', 'IPM_PROMEDIO'
        ]
        
        missing_cols = [col for col in required_cols if col not in df.columns]
        if missing_cols:
            print(f"  WARNING: Missing columns: {missing_cols}")
            print(f"  Will proceed with available columns")
        
        # Save to CSV
        df.to_csv(output_path, index=False, encoding='utf-8')
        print(f"  ✓ Saved to {output_path}")
        
        # Also save JSON version
        json_output_path = PROJECT_ROOT / "public/data/tabular/sociodemograficas_sector_censal.json"
        records = df.to_dict('records')
        with open(json_output_path, 'w', encoding='utf-8') as f:
            json.dump(records, f, indent=2, default=str)
        print(f"  ✓ Also saved JSON version to {json_output_path}")
        
        return True
        
    except Exception as e:
        print(f"  ERROR converting Excel: {e}")
        import traceback
        traceback.print_exc()
        return False


def main():
    print("=" * 60)
    print("Air Pollution Dashboard - Data Conversion Script")
    print("=" * 60)
    print()
    
    results = {
        'shapefile': convert_shapefile_to_geojson(),
        'gpkg': convert_gpkg_to_geojson(),
        'excel': convert_excel_to_csv(),
    }
    
    print()
    print("=" * 60)
    print("Conversion Summary")
    print("=" * 60)
    
    for name, success in results.items():
        status = "✓ SUCCESS" if success else "✗ FAILED"
        print(f"{name.upper():15} {status}")
    
    if all(results.values()):
        print()
        print("All conversions completed successfully!")
        print("Data files are ready in public/data/")
        print()
        print("Next steps:")
        print("1. Verify the generated files are correct")
        print("2. Run: npm install && npm run dev")
        print("3. The dashboard should now display real Bogotá sectors")
        return 0
    else:
        print()
        print("Some conversions failed. Please check the errors above.")
        return 1


if __name__ == '__main__':
    sys.exit(main())
