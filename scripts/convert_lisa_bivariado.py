#!/usr/bin/env python3
"""
Converts LISA Bivariado GPKG files to a single JSON file for the dashboard.

Usage (from project root):
    python scripts/convert_lisa_bivariado.py

Requires:
    pip install geopandas pandas

Output:
    public/data/lisa_bivariado/lisa_bivariado.json

Format:
    [{"SETU_CCNCT": "...", "pollutant": "PM2.5", "year": 2024, "LISA_bi_clase": "HH"}, ...]
"""

import json
import os
import sys
from pathlib import Path

try:
    import geopandas as gpd
    import pandas as pd
except ImportError:
    print("ERROR: geopandas and pandas are required.")
    print("Install with: pip install geopandas pandas")
    sys.exit(1)

# ── Paths ────────────────────────────────────────────────────────────────────
SCRIPT_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR.parent
INPUT_DIR = PROJECT_ROOT / "public" / "Lisa Bivariado"
# Fallback: check root-level folder (original location before reorganizing)
if not INPUT_DIR.exists():
    INPUT_DIR = PROJECT_ROOT / "Lisa Bivariado"
OUTPUT_DIR = PROJECT_ROOT / "public" / "data" / "lisa_bivariado"

# ── GPKG file → pollutant + year mapping ─────────────────────────────────────
GPKG_MAP = {
    "LISA_BIVAR_CO_IPM_2024.gpkg":    {"pollutant": "CO",    "year": 2024},
    "LISA_BIVAR_NO2_IPM_2024.gpkg":   {"pollutant": "NO2",   "year": 2024},
    "LISA_BIVAR_OZONO_IPM_2024.gpkg": {"pollutant": "O3",    "year": 2024},
    "LISA_BIVAR_PM10_IPM_2024.gpkg":  {"pollutant": "PM10",  "year": 2024},
    "LISA_BIVAR_PM2.5_IPM_2024.gpkg": {"pollutant": "PM2.5", "year": 2024},
    "LISA_BIVAR_SO2_IPM_2024.gpkg":   {"pollutant": "SO2",   "year": 2024},
    "LISA_BIVAR_eBC_IPM_2023.gpkg":   {"pollutant": "eBC",   "year": 2023},
}

# ── Normalize LISA cluster labels ─────────────────────────────────────────────
CLUSTER_NORM = {
    "hh": "HH", "high-high": "HH", "alto-alto": "HH", "high_high": "HH",
    "ll": "LL", "low-low": "LL",  "bajo-bajo": "LL", "low_low": "LL",
    "hl": "HL", "high-low": "HL", "alto-bajo": "HL", "high_low": "HL",
    "lh": "LH", "low-high": "LH", "bajo-alto": "LH", "low_high": "LH",
    # Variants of NS found in the actual GPKG data:
    "ns": "NS", "not significant": "NS", "no significativo": "NS",
    "no-significativo": "NS",   # ← actual value in GPKG: 'No-significativo'
    "non_significant": "NS", "not_significant": "NS", "none": "NS",
}


def normalize_cluster(val) -> str:
    if val is None:
        return "NS"
    try:
        import math
        if isinstance(val, float) and math.isnan(val):
            return "NS"
    except Exception:
        pass
    return CLUSTER_NORM.get(str(val).strip().lower(), "NS")


def find_column(columns, candidates) -> str | None:
    lower = {c.lower(): c for c in columns}
    for candidate in candidates:
        if candidate.lower() in lower:
            return lower[candidate.lower()]
    return None


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    if not INPUT_DIR.exists():
        print(f"ERROR: Input folder not found: {INPUT_DIR}")
        print("Make sure the 'public/Lisa Bivariado' folder exists in the project root.")
        sys.exit(1)

    all_records = []
    processed = 0
    skipped = 0

    for filename, meta in GPKG_MAP.items():
        filepath = INPUT_DIR / filename
        if not filepath.exists():
            print(f"  SKIP (not found): {filename}")
            skipped += 1
            continue

        print(f"Reading {filename} ...")
        try:
            gdf = gpd.read_file(filepath)
        except Exception as e:
            print(f"  ERROR reading {filename}: {e}")
            skipped += 1
            continue

        cols = list(gdf.columns)
        print(f"  Columns found: {cols}")

        id_col = find_column(cols, ["SETU_CCNCT", "setu_ccnct", "SETU", "FID", "id"])
        lisa_col = find_column(cols, [
            "LISA_bi_clase", "LISA_bi_class", "lisa_bi_clase", "lisa_bi_class",
            "cluster", "CLUSTER", "quad", "QUAD", "lisaclass",
        ])

        if id_col is None:
            print(f"  WARNING: No SETU_CCNCT-like column in {filename}. Skipping.")
            skipped += 1
            continue
        if lisa_col is None:
            print(f"  WARNING: No LISA_bi_clase-like column in {filename}. Skipping.")
            print(f"  Available columns: {cols}")
            skipped += 1
            continue

        count = 0
        for _, row in gdf.iterrows():
            raw_id = row[id_col]
            if pd.isna(raw_id) if hasattr(pd, "isna") else raw_id is None:
                continue
            # Normalize ID as plain string — NEVER convert via float().
            # float64 only has ~15-16 significant digits, so 18-digit SETU_CCNCT
            # values lose precision (e.g. 110011000000001101 → 110011000000001104),
            # collapsing hundreds of distinct IDs to the same wrong value.
            setu = str(raw_id).strip().rstrip(".0") if str(raw_id).strip().endswith(".0") else str(raw_id).strip()

            cluster = normalize_cluster(row[lisa_col])
            all_records.append({
                "SETU_CCNCT": setu,
                "pollutant": meta["pollutant"],
                "year": meta["year"],
                "LISA_bi_clase": cluster,
            })
            count += 1

        print(f"  -> {count} records extracted (pollutant={meta['pollutant']}, year={meta['year']})")
        processed += 1

    output_path = OUTPUT_DIR / "lisa_bivariado.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(all_records, f, ensure_ascii=False, separators=(",", ":"))

    print(f"\nDone.")
    print(f"  Files processed : {processed}")
    print(f"  Files skipped   : {skipped}")
    print(f"  Total records   : {len(all_records)}")
    print(f"  Output          : {output_path}")

    # Summary by pollutant
    from collections import Counter
    by_pollutant = Counter(r["pollutant"] for r in all_records)
    print("\nRecords per pollutant:")
    for p, n in sorted(by_pollutant.items()):
        print(f"  {p}: {n}")

    by_cluster = Counter(r["LISA_bi_clase"] for r in all_records)
    print("\nRecords per cluster:")
    for c, n in sorted(by_cluster.items()):
        print(f"  {c}: {n}")


if __name__ == "__main__":
    main()
