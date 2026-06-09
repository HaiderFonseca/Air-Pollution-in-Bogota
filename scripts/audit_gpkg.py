#!/usr/bin/env python3
"""Quick audit of GPKG files in Lisa Bivariado/"""
import sys
from pathlib import Path
try:
    import geopandas as gpd
except ImportError:
    print("Need geopandas: pip install geopandas")
    sys.exit(1)

SCRIPT_DIR = Path(__file__).parent
ROOT = SCRIPT_DIR.parent
bivar_dir = ROOT / "Lisa Bivariado"

for f in sorted(bivar_dir.glob("*.gpkg")):
    gdf = gpd.read_file(f)
    unique = gdf["SETU_CCNCT"].nunique()
    counts = dict(gdf["LISA_bi_clase"].value_counts())
    print(f"{f.name}")
    print(f"  rows={len(gdf)}  unique_SETU={unique}")
    print(f"  clusters: {counts}")
    print()
