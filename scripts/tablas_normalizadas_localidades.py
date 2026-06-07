"""
Tablas normalizadas de exposicion HH por localidad.
Genera tablas comparables entre localidades de distinto tamano usando
metricas normalizadas: tasa_HH, proporcion persistente, poblacion en HH.
"""
import json
import pandas as pd
import numpy as np
from pathlib import Path

BASE = Path(__file__).parent.parent
OUT = BASE / "docs" / "analisis" / "outputs"

# ── 1. CARGAR DATOS ────────────────────────────────────────────────────────────

sec_loc = pd.read_csv(OUT / "sectores_con_localidad.csv", dtype={"SETU_CCNCT": str})

socio = pd.read_csv(
    BASE / "public/data/tabular/sociodemograficas_sector_censal.csv",
    dtype={"SETU_CCNCT": str},
)
socio["SETU_CCNCT"] = socio["SETU_CCNCT"].astype(str).str.strip()
socio["total_pop"] = pd.to_numeric(socio["STP27_PERS"], errors="coerce").fillna(0)
socio["children_0_9"] = pd.to_numeric(socio["STP34_1_ED"], errors="coerce").fillna(0)
socio["older_60plus"] = sum(
    pd.to_numeric(socio[f"STP34_{i}_ED"], errors="coerce").fillna(0)
    for i in range(7, 10)
)
socio["IPM_PROMEDIO"] = pd.to_numeric(socio["IPM_PROMEDIO"], errors="coerce").fillna(0)
socio["ESTRATO_MAYORITARIO"] = socio["ESTRATO_MAYORITARIO"].astype(str).str.strip()

# Tabla de clusters por localidad/contaminante/anio
t2 = pd.read_csv(OUT / "tabla2_clusters_por_localidad_contaminante_ano.csv")

# Persistencia HH por sector
t5 = pd.read_csv(OUT / "tabla5_persistencia_HH_por_sector.csv", dtype={"SETU_CCNCT": str})
t5["SETU_CCNCT"] = t5["SETU_CCNCT"].astype(str).str.strip()

# Tabla4: poblacion por localidad/cluster/anio
t4 = pd.read_csv(OUT / "tabla4_poblacion_por_localidad_cluster.csv")

# Anos disponibles por contaminante (desde tabla1)
t1 = pd.read_csv(OUT / "tabla1_clusters_por_contaminante_ano.csv")
years_by_pollutant = (
    t1.groupby("pollutant")["year"].apply(lambda x: sorted(x.unique())).to_dict()
)
n_years_by_pollutant = {p: len(v) for p, v in years_by_pollutant.items()}
print("Anos disponibles por contaminante:")
for p, n in sorted(n_years_by_pollutant.items()):
    print(f"  {p}: {n} ({years_by_pollutant[p]})")

# Sectores por localidad
sectores_por_localidad = sec_loc.groupby("localidad")["SETU_CCNCT"].nunique().to_dict()

# Merge sectores con sociodemograficas
sec_socio = sec_loc.merge(
    socio[["SETU_CCNCT", "total_pop", "children_0_9", "older_60plus", "IPM_PROMEDIO"]],
    on="SETU_CCNCT",
    how="left",
)
pop_por_localidad = sec_socio.groupby("localidad")["total_pop"].sum().to_dict()

POLLUTANTS = ["CO", "NO2", "O3", "PM10", "PM2.5", "SO2", "eBC"]

# ── TABLA A: TASA HH POR LOCALIDAD Y CONTAMINANTE ─────────────────────────────

# Sumar ocurrencias HH por localidad y contaminante (todos los anos)
hh_agg = (
    t2[t2["HH"] > 0]
    .groupby(["localidad", "pollutant"])["HH"]
    .sum()
    .reset_index()
    .rename(columns={"HH": "ocurrencias_HH"})
)

localidades = sorted(sec_loc["localidad"].unique())

rows_a = []
for loc in localidades:
    n_sec = sectores_por_localidad.get(loc, 0)
    for p in POLLUTANTS:
        n_yr = n_years_by_pollutant.get(p, 0)
        occ = hh_agg.loc[
            (hh_agg["localidad"] == loc) & (hh_agg["pollutant"] == p), "ocurrencias_HH"
        ]
        occ_val = int(occ.iloc[0]) if len(occ) > 0 else 0
        tasa = round(occ_val / (n_sec * n_yr), 4) if (n_sec * n_yr) > 0 else 0.0
        rows_a.append(
            {
                "localidad": loc,
                "contaminante": p,
                "anos_disponibles": n_yr,
                "sectores_totales_localidad": n_sec,
                "ocurrencias_HH": occ_val,
                "tasa_HH": tasa,
            }
        )

tabla_a = pd.DataFrame(rows_a)
tabla_a.to_csv(OUT / "tablaA_tasa_HH_por_localidad_contaminante.csv", index=False, encoding="utf-8-sig")
print(f"\nTabla A guardada: {len(tabla_a)} filas")

# ── TABLA B: PROPORCION DE SECTORES PERSISTENTES ──────────────────────────────

# Para PM2.5, PM10, CO, NO2, SO2, O3: persistencia alta = HH >= 10 anios
# Para eBC (3 anios disponibles): persistencia alta = HH >= 2 anios
CRITERIO_PERSISTENCIA = {
    "CO": ("HH_years_count >= 10", 10),
    "NO2": ("HH_years_count >= 10", 10),
    "O3": ("HH_years_count >= 10", 10),
    "PM10": ("HH_years_count >= 10", 10),
    "PM2.5": ("HH_years_count >= 10", 10),
    "SO2": ("HH_years_count >= 10", 10),
    "eBC": ("HH_years_count >= 2 (de 3 disponibles)", 2),
}

rows_b = []
for loc in localidades:
    n_sec = sectores_por_localidad.get(loc, 0)
    for p in POLLUTANTS:
        umbral = CRITERIO_PERSISTENCIA[p][1]
        criterio_texto = CRITERIO_PERSISTENCIA[p][0]

        # Sectores de esta localidad con persistencia HH >= umbral en este contaminante
        mask = (
            (t5["localidad"] == loc)
            & (t5["pollutant"] == p)
            & (t5["HH_years_count"] >= umbral)
        )
        n_persistentes = int(t5[mask]["SETU_CCNCT"].nunique())
        prop = round(n_persistentes / n_sec, 4) if n_sec > 0 else 0.0

        rows_b.append(
            {
                "localidad": loc,
                "contaminante": p,
                "sectores_totales_localidad": n_sec,
                "sectores_HH_persistentes": n_persistentes,
                "proporcion_persistente": prop,
                "criterio_usado": criterio_texto,
            }
        )

tabla_b = pd.DataFrame(rows_b)
tabla_b.to_csv(OUT / "tablaB_proporcion_persistente_por_localidad_contaminante.csv", index=False, encoding="utf-8-sig")
print(f"Tabla B guardada: {len(tabla_b)} filas")

# ── TABLA C: POBLACION EN SECTORES HH (REFERENCIA 2018) ────────────────────────

# Sectores que fueron HH en 2018 por contaminante
hh_2018 = t4[(t4["year"] == 2018) & (t4["cluster"] == "HH")][
    ["localidad", "pollutant", "total_population", "children_0_9", "older_adults_60_plus", "avg_IPM", "sector_count"]
].copy()
hh_2018.columns = [
    "localidad", "contaminante", "pop_en_HH_2018",
    "ninos_0_9_en_HH", "adultos_60mas_en_HH", "IPM_promedio_HH", "sectores_HH_2018"
]
hh_2018["IPM_promedio_HH_pct"] = (hh_2018["IPM_promedio_HH"] * 100).round(1)

# Poblacion total por localidad (fija del censo)
pop_loc = sec_socio.groupby("localidad").agg(
    poblacion_total_localidad=("total_pop", "sum")
).reset_index()

rows_c = []
for loc in localidades:
    pop_total = int(pop_por_localidad.get(loc, 0))
    for p in POLLUTANTS:
        sub = hh_2018[(hh_2018["localidad"] == loc) & (hh_2018["contaminante"] == p)]
        if len(sub) > 0:
            row = sub.iloc[0]
            pop_hh = int(row["pop_en_HH_2018"])
            ninos = int(row["ninos_0_9_en_HH"])
            mayores = int(row["adultos_60mas_en_HH"])
            ipm = round(row["IPM_promedio_HH_pct"], 1)
            sec_hh = int(row["sectores_HH_2018"])
        else:
            pop_hh = 0
            ninos = 0
            mayores = 0
            ipm = 0.0
            sec_hh = 0

        pct_pop = round(100 * pop_hh / pop_total, 1) if pop_total > 0 else 0.0

        rows_c.append(
            {
                "localidad": loc,
                "contaminante": p,
                "poblacion_total_localidad": pop_total,
                "sectores_HH_en_2018": sec_hh,
                "poblacion_en_sectores_HH": pop_hh,
                "porcentaje_poblacion_en_HH": pct_pop,
                "ninos_0_9_en_HH": ninos,
                "adultos_60mas_en_HH": mayores,
                "IPM_promedio_HH_pct": ipm,
            }
        )

tabla_c = pd.DataFrame(rows_c)
tabla_c.to_csv(OUT / "tablaC_poblacion_en_HH_2018.csv", index=False, encoding="utf-8-sig")
print(f"Tabla C guardada: {len(tabla_c)} filas")

# ── TABLA D: RANKING FINAL ─────────────────────────────────────────────────────

# Metricas compuestas por localidad (excluyendo eBC del ranking de persistencia >= 10)
PRIMARIOS = ["CO", "NO2", "PM10", "PM2.5", "SO2"]
TODOS = ["CO", "NO2", "O3", "PM10", "PM2.5", "SO2", "eBC"]
PRIMARIOS_SIN_EBC = ["CO", "NO2", "PM10", "PM2.5", "SO2"]

rows_d = []
for loc in localidades:
    n_sec = sectores_por_localidad.get(loc, 0)
    pop_total = int(pop_por_localidad.get(loc, 0))

    # Tasa HH promedio para contaminantes primarios (excl O3, excl eBC por ahora)
    sub_a = tabla_a[(tabla_a["localidad"] == loc) & (tabla_a["contaminante"].isin(PRIMARIOS_SIN_EBC))]
    tasa_hh_primarios = round(sub_a["tasa_HH"].mean(), 4)

    # Tasa HH para O3 por separado
    sub_o3 = tabla_a[(tabla_a["localidad"] == loc) & (tabla_a["contaminante"] == "O3")]
    tasa_hh_o3 = round(sub_o3["tasa_HH"].iloc[0], 4) if len(sub_o3) > 0 else 0.0

    # Proporcion media de sectores persistentes (solo contaminantes con serie >= 10 anos)
    sub_b = tabla_b[(tabla_b["localidad"] == loc) & (tabla_b["contaminante"].isin(PRIMARIOS_SIN_EBC))]
    prop_persistente_media = round(sub_b["proporcion_persistente"].mean(), 4)

    # Max proporcion persistente (cual contaminante es el mas critico)
    if len(sub_b) > 0 and sub_b["proporcion_persistente"].max() > 0:
        idx_max = sub_b["proporcion_persistente"].idxmax()
        contam_max_persist = sub_b.loc[idx_max, "contaminante"]
        max_prop_persist = sub_b.loc[idx_max, "proporcion_persistente"]
    else:
        contam_max_persist = "-"
        max_prop_persist = 0.0

    # % poblacion en sectores HH en 2018 (promedio primarios)
    sub_c = tabla_c[(tabla_c["localidad"] == loc) & (tabla_c["contaminante"].isin(PRIMARIOS_SIN_EBC))]
    pct_pop_hh_medio = round(sub_c["porcentaje_poblacion_en_HH"].mean(), 1)

    # Poblacion vulnerable (ninos + mayores) en HH en 2018 para PM2.5 (el mas relevante)
    sub_c_pm25 = tabla_c[(tabla_c["localidad"] == loc) & (tabla_c["contaminante"] == "PM2.5")]
    if len(sub_c_pm25) > 0:
        ninos_hh = int(sub_c_pm25.iloc[0]["ninos_0_9_en_HH"])
        mayores_hh = int(sub_c_pm25.iloc[0]["adultos_60mas_en_HH"])
        ipm_hh_pm25 = sub_c_pm25.iloc[0]["IPM_promedio_HH_pct"]
        pop_hh_pm25 = int(sub_c_pm25.iloc[0]["poblacion_en_sectores_HH"])
        pct_pop_pm25 = sub_c_pm25.iloc[0]["porcentaje_poblacion_en_HH"]
    else:
        ninos_hh = 0
        mayores_hh = 0
        ipm_hh_pm25 = 0.0
        pop_hh_pm25 = 0
        pct_pop_pm25 = 0.0

    rows_d.append(
        {
            "localidad": loc,
            "n_sectores": n_sec,
            "poblacion_total": pop_total,
            "tasa_HH_primarios_media": tasa_hh_primarios,
            "tasa_HH_O3": tasa_hh_o3,
            "prop_sectores_persistentes_media": prop_persistente_media,
            "contaminante_mayor_persistencia": contam_max_persist,
            "max_prop_persistente": round(max_prop_persist, 4),
            "pct_pop_en_HH_primarios_medio": pct_pop_hh_medio,
            "pop_en_HH_PM25_2018": pop_hh_pm25,
            "pct_pop_en_HH_PM25": pct_pop_pm25,
            "ninos_0_9_en_HH_PM25": ninos_hh,
            "adultos_60mas_en_HH_PM25": mayores_hh,
            "IPM_promedio_HH_PM25_pct": ipm_hh_pm25,
        }
    )

tabla_d = pd.DataFrame(rows_d)

# Ranking compuesto (normalizado 0-1 para cada metrica, luego promedio)
def minmax(series):
    mn, mx = series.min(), series.max()
    if mx == mn:
        return pd.Series([0.0] * len(series), index=series.index)
    return (series - mn) / (mx - mn)

tabla_d["score_tasa"] = minmax(tabla_d["tasa_HH_primarios_media"])
tabla_d["score_persist"] = minmax(tabla_d["prop_sectores_persistentes_media"])
tabla_d["score_pct_pop"] = minmax(tabla_d["pct_pop_en_HH_primarios_medio"])
tabla_d["score_ipm"] = minmax(tabla_d["IPM_promedio_HH_PM25_pct"])
tabla_d["score_vulnerable"] = minmax(tabla_d["ninos_0_9_en_HH_PM25"] + tabla_d["adultos_60mas_en_HH_PM25"])
tabla_d["score_compuesto"] = (
    tabla_d["score_tasa"] * 0.30
    + tabla_d["score_persist"] * 0.25
    + tabla_d["score_pct_pop"] * 0.20
    + tabla_d["score_ipm"] * 0.15
    + tabla_d["score_vulnerable"] * 0.10
).round(4)

tabla_d = tabla_d.sort_values("score_compuesto", ascending=False).reset_index(drop=True)
tabla_d["rango_primarios"] = range(1, len(tabla_d) + 1)

# Ranking separado para O3
tabla_d_o3 = tabla_d.sort_values("tasa_HH_O3", ascending=False).reset_index(drop=True)
tabla_d_o3["rango_O3"] = range(1, len(tabla_d_o3) + 1)
tabla_d = tabla_d.merge(tabla_d_o3[["localidad", "rango_O3"]], on="localidad")

tabla_d.to_csv(OUT / "tablaD_ranking_normalizado_localidades.csv", index=False, encoding="utf-8-sig")
print(f"Tabla D guardada: {len(tabla_d)} filas")

# ── IMPRIMIR RESUMEN ──────────────────────────────────────────────────────────

print("\n=== TABLA A: TASA HH - TOP 10 POR CONTAMINANTE ===")
for p in POLLUTANTS:
    sub = tabla_a[tabla_a["contaminante"] == p].sort_values("tasa_HH", ascending=False).head(5)
    print(f"\n  {p}:")
    for _, row in sub.iterrows():
        print(f"    {row['localidad']}: tasa={row['tasa_HH']:.4f} ({row['ocurrencias_HH']} HH / {row['sectores_totales_localidad']} sec x {row['anos_disponibles']} anos)")

print("\n=== TABLA B: PROPORCION PERSISTENTE - TOP 5 POR CONTAMINANTE ===")
for p in PRIMARIOS_SIN_EBC:
    sub = tabla_b[tabla_b["contaminante"] == p].sort_values("proporcion_persistente", ascending=False).head(5)
    print(f"\n  {p}:")
    for _, row in sub.iterrows():
        print(f"    {row['localidad']}: {row['sectores_HH_persistentes']}/{row['sectores_totales_localidad']} = {row['proporcion_persistente']:.2%}")

print("\n=== TABLA C: % POBLACION EN HH 2018 - TOP 5 POR CONTAMINANTE ===")
for p in ["PM2.5", "PM10", "NO2", "CO"]:
    sub = tabla_c[tabla_c["contaminante"] == p].sort_values("porcentaje_poblacion_en_HH", ascending=False).head(5)
    print(f"\n  {p}:")
    for _, row in sub.iterrows():
        print(f"    {row['localidad']}: {row['porcentaje_poblacion_en_HH']}% ({int(row['poblacion_en_sectores_HH']):,} hab)")

print("\n=== TABLA D: RANKING FINAL CONTAMINANTES PRIMARIOS ===")
cols_show = ["rango_primarios", "localidad", "tasa_HH_primarios_media", "prop_sectores_persistentes_media",
             "pct_pop_en_HH_primarios_medio", "IPM_promedio_HH_PM25_pct", "score_compuesto"]
print(tabla_d[cols_show].to_string(index=False))

print("\n=== RANKING O3 ===")
cols_o3 = ["rango_O3", "localidad", "tasa_HH_O3"]
print(tabla_d.sort_values("rango_O3")[cols_o3].head(10).to_string(index=False))

print("\nListo. Tablas guardadas en docs/analisis/outputs/")
