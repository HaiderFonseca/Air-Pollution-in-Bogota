"""
Convert LISA GPKG files to a single JSON file for the dashboard.
Output: public/data/lisa/lisa_clusters.json

Each record: { SETU_CCNCT, pollutant, year, cluster }
cluster: "HH" | "LL" | "HL" | "LH" | "NS"  (NS = not significant)
"""

import sqlite3
import json
import os
import re
from pathlib import Path

BASE_DIR = Path(__file__).parent.parent
LISA_DIR = BASE_DIR / "Lisa"
OUTPUT_FILE = BASE_DIR / "public" / "data" / "lisa" / "lisa_clusters.json"

POLLUTANT_MAP = {
    "PM2.5": "PM2.5",
    "PM25":  "PM2.5",
    "PM10":  "PM10",
    "NO2":   "NO2",
    "OZONO": "O3",
    "O3":    "O3",
    "CO":    "CO",
    "SO2":   "SO2",
    "EBC":   "eBC",
    "eBC":   "eBC",
}

def normalize_pollutant(raw: str) -> str:
    return POLLUTANT_MAP.get(raw, raw)

# Pattern: LISA_<POLLUTANT>_<YEAR>.gpkg
FILENAME_RE = re.compile(r"^LISA_(.+?)_(\d{4})\.gpkg$", re.IGNORECASE)

records = []
seen_files = 0
skipped = 0

for gpkg_path in sorted(LISA_DIR.rglob("*.gpkg")):
    m = FILENAME_RE.match(gpkg_path.name)
    if not m:
        continue

    raw_pollutant = m.group(1)
    year = int(m.group(2))
    pollutant = normalize_pollutant(raw_pollutant)

    seen_files += 1
    try:
        conn = sqlite3.connect(str(gpkg_path))
        cur = conn.cursor()
        cur.execute("SELECT SETU_CCNCT, significativo, cuadrante FROM LISA")
        rows = cur.fetchall()
        conn.close()
    except Exception as e:
        print(f"  ERROR reading {gpkg_path.name}: {e}")
        skipped += 1
        continue

    for (setu, significativo, cuadrante) in rows:
        cluster = cuadrante if significativo else "NS"
        records.append({
            "SETU_CCNCT": str(setu).strip(),
            "pollutant": pollutant,
            "year": year,
            "cluster": cluster,
        })

    print(f"  {gpkg_path.parent.name}/{gpkg_path.name}: {len(rows)} rows, pollutant={pollutant}, year={year}")

OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(records, f, ensure_ascii=False, separators=(",", ":"))

print(f"\nDone. {seen_files} files processed, {skipped} skipped.")
print(f"Total records: {len(records)}")
print(f"Output: {OUTPUT_FILE}")

# Quick summary
from collections import Counter
by_pollutant = Counter(r["pollutant"] for r in records)
by_cluster = Counter(r["cluster"] for r in records)
print(f"By pollutant: {dict(by_pollutant)}")
print(f"By cluster: {dict(by_cluster)}")
