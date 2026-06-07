"""
Analisis completo de clusters LISA de calidad del aire en Bogota.
Genera tablas CSV y estadisticas para el informe de tesis.
"""
import json, csv, os, sys
from pathlib import Path
from collections import defaultdict, Counter

import pandas as pd
import geopandas as gpd
from shapely.geometry import shape, Point

BASE = Path(__file__).parent.parent
OUT = BASE / "docs" / "analisis" / "outputs"
OUT.mkdir(parents=True, exist_ok=True)

# ── 1. CARGAR DATOS ───────────────────────────────────────────────────────────
print("Cargando datos...")

# 1a. Localidades (shapefile)
print("  Localidades...")
loc_shp = BASE / "Datos" / "Localidades" / "Localidades_Lat_lon.shp"
localidades_gdf = gpd.read_file(loc_shp)
localidades_gdf = localidades_gdf.to_crs("EPSG:4326")
print(f"  Localidades cargadas: {len(localidades_gdf)} filas")
print(f"  Columnas localidades: {list(localidades_gdf.columns)}")
print(f"  Muestra:\n{localidades_gdf[['geometry']].head(2)}")
# Print all columns with first row
first = localidades_gdf.iloc[0].drop('geometry')
print(f"  Primera localidad: {dict(first)}")

# 1b. Sectores censales (shapefile con localidad ya asignada si existe)
print("  Sectores censales shapefile...")
try:
    shp_local = BASE / "Datos" / "BOGOTA_SECTOR_CENSAL" / "BOGOTA_SECTOR_CENSAL_local_final.shp"
    sectores_local_gdf = gpd.read_file(shp_local)
    sectores_local_gdf = sectores_local_gdf.to_crs("EPSG:4326")
    print(f"  Sectores con localidad: {len(sectores_local_gdf)} filas")
    print(f"  Columnas: {list(sectores_local_gdf.columns)}")
    first_s = sectores_local_gdf.iloc[0].drop('geometry')
    print(f"  Primera fila: {dict(first_s)}")
    has_local_file = True
except Exception as e:
    print(f"  Error: {e}")
    has_local_file = False

# 1c. Sectores base
print("  Sectores GeoJSON...")
with open(BASE / "public/data/geo/sectores_censales_bogota.geojson") as f:
    geo = json.load(f)
sectores = [{"SETU_CCNCT": str(ft["properties"]["SETU_CCNCT"]).strip(),
              "geometry": ft["geometry"]} for ft in geo["features"]]
print(f"  Sectores GeoJSON: {len(sectores)}")

# 1d. Concentraciones
print("  Concentraciones...")
with open(BASE / "public/data/geo/concentraciones_sector_censal.json") as f:
    conc_raw = json.load(f)
conc_df = pd.DataFrame(conc_raw)
conc_df["SETU_CCNCT"] = conc_df["SETU_CCNCT"].astype(str).str.strip()
# Normalize OZONO -> O3
conc_df["pollutant"] = conc_df["pollutant"].replace({"OZONO": "O3"})
print(f"  Concentraciones: {len(conc_df)} registros")

# 1e. Sociodemograficas
print("  Sociodemograficas...")
socio_df = pd.read_csv(BASE / "public/data/tabular/sociodemograficas_sector_censal.csv")
socio_df["SETU_CCNCT"] = socio_df["SETU_CCNCT"].astype(str).str.strip()
# Compute derived variables
socio_df["children_0_9"]  = pd.to_numeric(socio_df["STP34_1_ED"], errors="coerce").fillna(0)
socio_df["youth_10_19"]   = pd.to_numeric(socio_df["STP34_2_ED"], errors="coerce").fillna(0)
socio_df["adults_20_59"]  = sum(pd.to_numeric(socio_df[f"STP34_{i}_ED"], errors="coerce").fillna(0) for i in range(3, 7))
socio_df["older_60plus"]  = sum(pd.to_numeric(socio_df[f"STP34_{i}_ED"], errors="coerce").fillna(0) for i in range(7, 10))
socio_df["total_pop"]     = pd.to_numeric(socio_df["STP27_PERS"], errors="coerce").fillna(0)
socio_df["IPM_PROMEDIO"]  = pd.to_numeric(socio_df["IPM_PROMEDIO"], errors="coerce").fillna(0)
socio_df["ESTRATO_MAYORITARIO"] = socio_df["ESTRATO_MAYORITARIO"].astype(str)
print(f"  Sociodemograficas: {len(socio_df)} filas")

# 1f. LISA clusters
print("  LISA clusters...")
with open(BASE / "public/data/lisa/lisa_clusters.json") as f:
    lisa_raw = json.load(f)
lisa_df = pd.DataFrame(lisa_raw)
lisa_df["SETU_CCNCT"] = lisa_df["SETU_CCNCT"].astype(str).str.strip()
print(f"  LISA records: {len(lisa_df)}")
print(f"  Pollutants LISA: {sorted(lisa_df['pollutant'].unique())}")
print(f"  Years LISA: {sorted(lisa_df['year'].unique())}")

# ── 2. CRUCE ESPACIAL SECTORES ↔ LOCALIDADES ─────────────────────────────────
print("\nCruce espacial sectores censales con localidades...")

# Try to use the _local_final shapefile which may already have locality info
localidad_col = None
if has_local_file:
    cols = [c.upper() for c in sectores_local_gdf.columns]
    for possible in ["NOMBRE_LOC", "LOC_NOMBRE", "LOCALIDAD", "NOM_LOCAL", "NOMBREL",
                     "LocNombre", "Nombre", "NOMBRE"]:
        if possible.upper() in cols:
            localidad_col = sectores_local_gdf.columns[cols.index(possible.upper())]
            break
    print(f"  Columna de localidad encontrada en _local_final: {localidad_col}")
    if localidad_col:
        sector_loc_map = dict(zip(
            sectores_local_gdf["SETU_CCNCT"].astype(str).str.strip(),
            sectores_local_gdf[localidad_col].astype(str)
        ))
        print(f"  Sectores con localidad asignada: {len(sector_loc_map)}")
        print(f"  Localidades unicas: {sorted(set(sector_loc_map.values()))[:5]}...")

# If not found from file, do spatial join
if not localidad_col:
    print("  Haciendo cruce espacial con centroide de sectores...")
    # Build sector centroids GeoDataFrame
    records = []
    for s in sectores:
        try:
            geom = shape(s["geometry"])
            centroid = geom.centroid
            records.append({"SETU_CCNCT": s["SETU_CCNCT"],
                           "geometry": centroid})
        except Exception:
            pass
    centroids_gdf = gpd.GeoDataFrame(records, crs="EPSG:4326")

    # Find locality name column
    loc_cols = [c for c in localidades_gdf.columns if c != "geometry"]
    print(f"  Columnas localidades: {loc_cols}")
    # Try common names
    loc_name_col = None
    for possible in ["NOMBRE", "Nombre", "NOMBREL", "LOCALIDAD", "Localidad",
                     "LOC_NOMBRE", "NOM_LOCAL", "LocNombre", "name"]:
        if possible in localidades_gdf.columns:
            loc_name_col = possible
            break
    if loc_name_col is None:
        loc_name_col = loc_cols[0] if loc_cols else None
    print(f"  Usando columna de nombre: {loc_name_col}")

    # Spatial join centroid → localidad
    joined = gpd.sjoin(centroids_gdf, localidades_gdf[[loc_name_col, "geometry"]],
                       how="left", predicate="within")
    sector_loc_map = dict(zip(joined["SETU_CCNCT"], joined[loc_name_col].fillna("Sin asignar")))
    localidad_col = loc_name_col
    print(f"  Sectores con localidad: {sum(1 for v in sector_loc_map.values() if v != 'Sin asignar')}")
    print(f"  Sin asignar: {sum(1 for v in sector_loc_map.values() if v == 'Sin asignar')}")
    print(f"  Localidades unicas: {sorted(set(sector_loc_map.values()))[:8]}...")

# ── 3. GUARDAR TABLA SECTORES CON LOCALIDAD ──────────────────────────────────
print("\nGuardando tabla sectores_con_localidad.csv...")
sector_loc_df = pd.DataFrame([
    {"SETU_CCNCT": k, "localidad": v}
    for k, v in sector_loc_map.items()
])
sector_loc_df["criterio"] = "centroide_dentro_de_localidad"
sector_loc_df.to_csv(OUT / "sectores_con_localidad.csv", index=False)
print(f"  Guardado: {len(sector_loc_df)} filas")

# ── 4. ENRIQUECER LISA CON LOCALIDAD Y SOCIODEM ───────────────────────────────
print("\nEnriqueciendo LISA con localidad y sociodem...")
lisa_df["localidad"] = lisa_df["SETU_CCNCT"].map(sector_loc_map).fillna("Sin asignar")

# Merge sociodemographic
lisa_full = lisa_df.merge(socio_df[["SETU_CCNCT","total_pop","children_0_9",
                                    "youth_10_19","adults_20_59","older_60plus",
                                    "IPM_PROMEDIO","ESTRATO_MAYORITARIO"]],
                          on="SETU_CCNCT", how="left")
print(f"  Lisa enriquecido: {len(lisa_full)} filas")

# ── 5. TABLA 1: CLUSTERS POR CONTAMINANTE Y AÑO ──────────────────────────────
print("\nTabla 1: clusters por contaminante y año...")
cluster_counts = lisa_df.groupby(["pollutant","year","cluster"]).size().unstack(fill_value=0)
cluster_counts = cluster_counts.reset_index()
for c in ["HH","LL","HL","LH","NS"]:
    if c not in cluster_counts.columns:
        cluster_counts[c] = 0
cluster_counts["total"] = cluster_counts[["HH","LL","HL","LH","NS"]].sum(axis=1)
cluster_counts.to_csv(OUT / "tabla1_clusters_por_contaminante_ano.csv", index=False)
print(f"  Guardado: {len(cluster_counts)} filas")

# ── 6. TABLA 2: CLUSTERS POR LOCALIDAD, CONTAMINANTE Y AÑO ──────────────────
print("Tabla 2: clusters por localidad, contaminante y año...")
t2 = lisa_full.groupby(["localidad","pollutant","year","cluster"]).size().unstack(fill_value=0).reset_index()
for c in ["HH","LL","HL","LH","NS"]:
    if c not in t2.columns:
        t2[c] = 0
t2.to_csv(OUT / "tabla2_clusters_por_localidad_contaminante_ano.csv", index=False)
print(f"  Guardado: {len(t2)} filas")

# ── 7. TABLA 3: POBLACION EXPUESTA POR CLUSTER ────────────────────────────────
print("Tabla 3: población expuesta por cluster...")
pop_agg = lisa_full.groupby(["pollutant","year","cluster"]).agg(
    total_population=("total_pop","sum"),
    children_0_9=("children_0_9","sum"),
    youth_10_19=("youth_10_19","sum"),
    adults_20_59=("adults_20_59","sum"),
    older_adults_60_plus=("older_60plus","sum"),
    avg_IPM=("IPM_PROMEDIO","mean"),
    sector_count=("SETU_CCNCT","count")
).reset_index()
pop_agg.to_csv(OUT / "tabla3_poblacion_expuesta_por_cluster.csv", index=False)
print(f"  Guardado: {len(pop_agg)} filas")

# ── 8. TABLA 4: POBLACION POR LOCALIDAD Y CLUSTER ────────────────────────────
print("Tabla 4: población por localidad y cluster...")
pop_loc = lisa_full.groupby(["localidad","pollutant","year","cluster"]).agg(
    total_population=("total_pop","sum"),
    children_0_9=("children_0_9","sum"),
    older_adults_60_plus=("older_60plus","sum"),
    avg_IPM=("IPM_PROMEDIO","mean"),
    sector_count=("SETU_CCNCT","count")
).reset_index()
pop_loc.to_csv(OUT / "tabla4_poblacion_por_localidad_cluster.csv", index=False)
print(f"  Guardado: {len(pop_loc)} filas")

# ── 9. TABLA 5: PERSISTENCIA HH POR SECTOR ───────────────────────────────────
print("Tabla 5: persistencia HH por sector...")
hh_only = lisa_full[lisa_full["cluster"]=="HH"]
persist_hh = hh_only.groupby(["SETU_CCNCT","pollutant"]).agg(
    localidad=("localidad","first"),
    HH_years_count=("year","count"),
    years_as_HH=("year",lambda x: list(sorted(x.tolist()))),
    total_population=("total_pop","first"),
    children_0_9=("children_0_9","first"),
    older_adults_60_plus=("older_60plus","first"),
    IPM_PROMEDIO=("IPM_PROMEDIO","first"),
    ESTRATO_MAYORITARIO=("ESTRATO_MAYORITARIO","first")
).reset_index()
persist_hh["years_as_HH"] = persist_hh["years_as_HH"].apply(lambda x: ";".join(str(y) for y in x))
persist_hh = persist_hh.sort_values(["pollutant","HH_years_count"], ascending=[True,False])
persist_hh.to_csv(OUT / "tabla5_persistencia_HH_por_sector.csv", index=False)
print(f"  Guardado: {len(persist_hh)} filas")

# ── 10. TABLA 6: PERSISTENCIA LL POR SECTOR ──────────────────────────────────
print("Tabla 6: persistencia LL por sector...")
ll_only = lisa_full[lisa_full["cluster"]=="LL"]
persist_ll = ll_only.groupby(["SETU_CCNCT","pollutant"]).agg(
    localidad=("localidad","first"),
    LL_years_count=("year","count"),
    years_as_LL=("year",lambda x: list(sorted(x.tolist()))),
    total_population=("total_pop","first"),
    children_0_9=("children_0_9","first"),
    older_adults_60_plus=("older_60plus","first"),
    IPM_PROMEDIO=("IPM_PROMEDIO","first"),
    ESTRATO_MAYORITARIO=("ESTRATO_MAYORITARIO","first")
).reset_index()
persist_ll["years_as_LL"] = persist_ll["years_as_LL"].apply(lambda x: ";".join(str(y) for y in x))
persist_ll = persist_ll.sort_values(["pollutant","LL_years_count"], ascending=[True,False])
persist_ll.to_csv(OUT / "tabla6_persistencia_LL_por_sector.csv", index=False)
print(f"  Guardado: {len(persist_ll)} filas")

# ── 11. TABLA 7: RANKING SECTORES CRITICOS HH ────────────────────────────────
print("Tabla 7: ranking sectores críticos HH...")
# Multi-pollutant HH persistence
hh_multi = hh_only.groupby("SETU_CCNCT").agg(
    localidad=("localidad","first"),
    total_HH_records=("cluster","count"),
    pollutants_HH=("pollutant",lambda x: ";".join(sorted(set(x)))),
    total_population=("total_pop","first"),
    children_0_9=("children_0_9","first"),
    older_adults_60_plus=("older_60plus","first"),
    IPM_PROMEDIO=("IPM_PROMEDIO","first"),
    ESTRATO_MAYORITARIO=("ESTRATO_MAYORITARIO","first")
).reset_index()
hh_multi["score"] = (
    hh_multi["total_HH_records"] * 0.4 +
    hh_multi["IPM_PROMEDIO"] * 100 * 0.3 +
    (hh_multi["children_0_9"] / (hh_multi["total_population"].clip(1))) * 100 * 0.15 +
    (hh_multi["older_adults_60_plus"] / (hh_multi["total_population"].clip(1))) * 100 * 0.15
)
hh_multi = hh_multi.sort_values("score", ascending=False).head(50)
hh_multi.to_csv(OUT / "tabla7_ranking_sectores_criticos_HH.csv", index=False)
print(f"  Guardado: {len(hh_multi)} filas")

# ── 12. TABLA 8: RANKING LOCALIDADES CRITICAS ────────────────────────────────
print("Tabla 8: ranking localidades críticas HH...")
loc_rank = lisa_full[lisa_full["cluster"]=="HH"].groupby(["localidad","pollutant"]).agg(
    HH_sector_years=("cluster","count"),
    total_pop_HH=("total_pop","sum"),
    children_0_9_HH=("children_0_9","sum"),
    older_60_HH=("older_60plus","sum"),
    avg_IPM_HH=("IPM_PROMEDIO","mean")
).reset_index()
loc_rank_agg = loc_rank.groupby("localidad").agg(
    total_HH_sector_years=("HH_sector_years","sum"),
    max_pop_HH=("total_pop_HH","sum"),
    max_children=("children_0_9_HH","sum"),
    max_older=("older_60_HH","sum"),
    avg_IPM_HH=("avg_IPM_HH","mean"),
    pollutants_count=("pollutant","count")
).reset_index().sort_values("total_HH_sector_years", ascending=False)
loc_rank_agg.to_csv(OUT / "tabla8_ranking_localidades_criticas.csv", index=False)
print(f"  Guardado: {len(loc_rank_agg)} filas")

# ── 13. ESTADISTICAS DESCRIPTIVAS DE CONCENTRACION ───────────────────────────
print("\nEstadísticas descriptivas de concentración...")
conc_stats = conc_df.groupby("pollutant")["concentration"].agg(
    count="count", mean="mean", median="median",
    p5=lambda x: x.quantile(0.05), p25=lambda x: x.quantile(0.25),
    p75=lambda x: x.quantile(0.75), p95=lambda x: x.quantile(0.95),
    min="min", max="max", std="std"
).reset_index()
conc_stats.to_csv(OUT / "tabla0_estadisticas_concentracion.csv", index=False)
print(f"  Guardado")

# ── 14. EVOLUCION TEMPORAL DE CONCENTRACION ───────────────────────────────────
print("Evolución temporal de concentración...")
conc_evol = conc_df.groupby(["pollutant","year"])["concentration"].agg(
    mean="mean", median="median",
    p25=lambda x: x.quantile(0.25), p75=lambda x: x.quantile(0.75)
).reset_index()
conc_evol.to_csv(OUT / "tabla0b_evolucion_temporal.csv", index=False)
print(f"  Guardado")

# ── 15. PERSISTENCIA HH POR LOCALIDAD ────────────────────────────────────────
print("Persistencia HH por localidad...")
persist_loc_hh = hh_only.groupby(["localidad","pollutant","SETU_CCNCT"]).agg(
    years=("year","count")
).reset_index()
# Categorize persistence
def cat_persist(n, max_years):
    if n >= max_years * 0.75: return "Alta"
    if n >= max_years * 0.4:  return "Media"
    return "Baja"
max_years_by_poll = lisa_df.groupby("pollutant")["year"].nunique().to_dict()
persist_loc_hh["max_years"] = persist_loc_hh["pollutant"].map(max_years_by_poll)
persist_loc_hh["persistencia"] = persist_loc_hh.apply(
    lambda r: cat_persist(r["years"], r["max_years"]), axis=1)
persist_loc_hh_summary = persist_loc_hh.groupby(["localidad","pollutant","persistencia"]).agg(
    n_sectores=("SETU_CCNCT","count")
).reset_index()
persist_loc_hh_summary.to_csv(OUT / "tabla9_persistencia_HH_por_localidad.csv", index=False)
print(f"  Guardado")

# ── 16. RESUMEN GENERAL ───────────────────────────────────────────────────────
print("\n\n" + "="*60)
print("RESUMEN GENERAL DE RESULTADOS")
print("="*60)

print(f"\nSectores censales totales: {len(sectores)}")
print(f"Sectores con datos de concentración: {conc_df['SETU_CCNCT'].nunique()}")
print(f"Sectores con datos LISA: {lisa_df['SETU_CCNCT'].nunique()}")
print(f"Sectores con datos sociodem: {len(socio_df)}")

total_pop = socio_df["total_pop"].sum()
print(f"\nPoblación total Bogotá (sectores): {total_pop:,.0f}")

print("\nLocalidades identificadas:")
locs = sorted(set(sector_loc_map.values()))
for l in locs:
    n = sum(1 for v in sector_loc_map.values() if v == l)
    print(f"  {l}: {n} sectores")

print("\nClusters LISA totales (todos los contaminantes y años):")
for cluster, count in lisa_df["cluster"].value_counts().items():
    pct = 100*count/len(lisa_df)
    print(f"  {cluster}: {count:,} ({pct:.1f}%)")

print("\nClusters LISA significativos (HH, LL, HL, LH):")
sig = lisa_df[lisa_df["cluster"].isin(["HH","LL","HL","LH"])]
for cluster in ["HH","LL","HL","LH"]:
    n = (sig["cluster"]==cluster).sum()
    print(f"  {cluster}: {n:,}")

print("\nPoblación en sectores HH (por contaminante, todos los años, promedio):")
hh_pop = lisa_full[lisa_full["cluster"]=="HH"].groupby("pollutant")["total_pop"].sum()
print(hh_pop)

print("\nConcentraciones promedio por contaminante:")
print(conc_df.groupby("pollutant")["concentration"].describe()[["mean","50%","min","max"]].to_string())

print("\nEvolucion de clusters HH por contaminante:")
hh_per_year = lisa_df[lisa_df["cluster"]=="HH"].groupby(["pollutant","year"]).size().unstack(fill_value=0)
print(hh_per_year.to_string())

print("\nEvolucion de clusters LL por contaminante:")
ll_per_year = lisa_df[lisa_df["cluster"]=="LL"].groupby(["pollutant","year"]).size().unstack(fill_value=0)
print(ll_per_year.to_string())

print("\nLocalidades con mayor número de sectores HH (todos contaminantes y años):")
top_loc_hh = (lisa_full[lisa_full["cluster"]=="HH"]
              .groupby("localidad").size()
              .sort_values(ascending=False).head(10))
print(top_loc_hh.to_string())

print("\nTop 5 sectores con mayor persistencia HH (todos contaminantes):")
top_hh = persist_hh[persist_hh["HH_years_count"]>0].nlargest(10,"HH_years_count")
print(top_hh[["SETU_CCNCT","localidad","pollutant","HH_years_count","total_population","IPM_PROMEDIO"]].to_string())

# Save summary as JSON for report writing
summary = {
    "n_sectores": len(sectores),
    "n_sectores_conc": int(conc_df["SETU_CCNCT"].nunique()),
    "n_sectores_lisa": int(lisa_df["SETU_CCNCT"].nunique()),
    "n_sectores_socio": len(socio_df),
    "total_pop": float(total_pop),
    "n_localidades": len([l for l in locs if l != "Sin asignar"]),
    "localidades": [l for l in locs if l != "Sin asignar"],
    "n_contaminantes": int(lisa_df["pollutant"].nunique()),
    "n_anos": int(lisa_df["year"].nunique()),
    "cluster_counts": lisa_df["cluster"].value_counts().to_dict(),
    "conc_stats": conc_stats.set_index("pollutant")[["mean","median","p5","p95"]].to_dict(),
    "hh_by_pollutant": hh_per_year.to_dict(),
    "ll_by_pollutant": ll_per_year.to_dict(),
    "top_localidades_hh": top_loc_hh.to_dict(),
    "pop_HH_by_pollutant": lisa_full[lisa_full["cluster"]=="HH"].groupby("pollutant")["total_pop"].sum().to_dict(),
    "pop_LL_by_pollutant": lisa_full[lisa_full["cluster"]=="LL"].groupby("pollutant")["total_pop"].sum().to_dict(),
}
with open(OUT / "resumen_estadistico.json", "w", encoding="utf-8") as f:
    json.dump(summary, f, ensure_ascii=False, indent=2, default=str)

print("\n\nARCHIVOS GENERADOS:")
for f in sorted(OUT.iterdir()):
    print(f"  {f.name}")

print("\nListo.")
