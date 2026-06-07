"""
Analisis por quintiles de IPM y corrección de IPM en todas las tablas.

- IPM se mantiene en escala original (0-1), NO como porcentaje.
- Q1 = sectores con menor IPM (menos pobres / mas ricos).
- Q5 = sectores con mayor IPM (mas pobres).
- Ratio quintil = tasa_HH_Qi / tasa_HH_Q1 por año y contaminante.
"""
import json
import pandas as pd
import numpy as np
from pathlib import Path

BASE = Path(__file__).parent.parent
OUT = BASE / "docs" / "analisis" / "outputs"

# ── 1. CARGAR DATOS ────────────────────────────────────────────────────────────

socio = pd.read_csv(
    BASE / "public/data/tabular/sociodemograficas_sector_censal.csv",
    dtype={"SETU_CCNCT": str},
)
socio["SETU_CCNCT"] = socio["SETU_CCNCT"].astype(str).str.strip()
socio["total_pop"]    = pd.to_numeric(socio["STP27_PERS"],  errors="coerce").fillna(0)
socio["children_0_9"] = pd.to_numeric(socio["STP34_1_ED"], errors="coerce").fillna(0)
socio["older_60plus"] = sum(
    pd.to_numeric(socio[f"STP34_{i}_ED"], errors="coerce").fillna(0)
    for i in range(7, 10)
)
socio["IPM"] = pd.to_numeric(socio["IPM_PROMEDIO"], errors="coerce").fillna(0)
socio["ESTRATO_MAYORITARIO"] = socio["ESTRATO_MAYORITARIO"].astype(str).str.strip()

sec_loc = pd.read_csv(OUT / "sectores_con_localidad.csv", dtype={"SETU_CCNCT": str})

with open(BASE / "public/data/lisa/lisa_clusters.json") as f:
    lisa_raw = json.load(f)
lisa = pd.DataFrame(lisa_raw)
lisa["SETU_CCNCT"] = lisa["SETU_CCNCT"].astype(str).str.strip()
lisa["pollutant"] = lisa["pollutant"].replace({"OZONO": "O3"})

t4 = pd.read_csv(OUT / "tabla4_poblacion_por_localidad_cluster.csv")
t5 = pd.read_csv(OUT / "tabla5_persistencia_HH_por_sector.csv", dtype={"SETU_CCNCT": str})
t5["SETU_CCNCT"] = t5["SETU_CCNCT"].astype(str).str.strip()
t1 = pd.read_csv(OUT / "tabla1_clusters_por_contaminante_ano.csv")

years_by_pollutant = (
    t1.groupby("pollutant")["year"].apply(lambda x: sorted(x.unique())).to_dict()
)
n_years_by_pollutant = {p: len(v) for p, v in years_by_pollutant.items()}

POLLUTANTS   = ["CO", "NO2", "O3", "PM10", "PM2.5", "SO2", "eBC"]
PRIMARIOS    = ["CO", "NO2", "PM10", "PM2.5", "SO2"]
CRITERIO_PERSIST = {"CO": 10, "NO2": 10, "O3": 10, "PM10": 10, "PM2.5": 10, "SO2": 10, "eBC": 2}

# ── 2. ASIGNAR QUINTILES DE IPM ───────────────────────────────────────────────
# Q1 = menor IPM (menos pobre), Q5 = mayor IPM (más pobre)
# Solo sectores con IPM > 0 participan en la división real;
# los sectores con IPM=0 van al Q1 (son los menos pobres del dataset).

socio["IPM_quintil"] = pd.qcut(
    socio["IPM"],
    q=5,
    labels=["Q1", "Q2", "Q3", "Q4", "Q5"],
    duplicates="drop",
)

# Rangos de cada quintil para reportar
quintil_ranges = (
    socio.groupby("IPM_quintil", observed=True)["IPM"]
    .agg(["min", "max", "count", "mean"])
    .rename(columns={"min": "IPM_min", "max": "IPM_max", "count": "n_sectores", "mean": "IPM_media"})
    .round(4)
)
print("Quintiles de IPM (Q1=menos pobre, Q5=mas pobre):")
print(quintil_ranges.to_string())
print()

quintil_ranges.to_csv(OUT / "tablaQ0_rangos_quintiles_ipm.csv", encoding="utf-8-sig")

# DataFrame base: sector + localidad + socio + quintil
sec_base = sec_loc.merge(
    socio[["SETU_CCNCT", "total_pop", "children_0_9", "older_60plus", "IPM", "IPM_quintil", "ESTRATO_MAYORITARIO"]],
    on="SETU_CCNCT",
    how="left",
)

# ── 3. CORREGIR tabla_descriptiva_localidades.csv ─────────────────────────────

def estrato_mayoritario(s):
    valid = s[s.isin(["1","2","3","4","5","6"])]
    return valid.mode().iloc[0] if not valid.empty else "-"

def quintil_mayoritario(s):
    valid = s.dropna()
    return str(valid.mode().iloc[0]) if not valid.empty else "-"

tabla_loc = sec_base.groupby("localidad").agg(
    n_sectores=("SETU_CCNCT", "count"),
    poblacion_total=("total_pop", "sum"),
    ipm_promedio=("IPM", "mean"),
    estrato_mayoritario=("ESTRATO_MAYORITARIO", estrato_mayoritario),
    quintil_ipm_mayoritario=("IPM_quintil", quintil_mayoritario),
).reset_index()
tabla_loc["metodo_asignacion"] = "Centroide dentro del poligono de la localidad"
tabla_loc["poblacion_total"] = tabla_loc["poblacion_total"].astype(int)
tabla_loc["ipm_promedio"] = tabla_loc["ipm_promedio"].round(4)
tabla_loc = tabla_loc.sort_values("localidad").reset_index(drop=True)
tabla_loc.to_csv(OUT / "tabla_descriptiva_localidades.csv", index=False, encoding="utf-8-sig")
print("tabla_descriptiva_localidades.csv actualizada (IPM sin pct)")

# ── 4. RECALCULAR TABLAS A, B, C, D (IPM sin pct) ────────────────────────────

localidades = sorted(sec_loc["localidad"].unique())
sectores_por_localidad = sec_base.groupby("localidad")["SETU_CCNCT"].nunique().to_dict()
pop_por_localidad = sec_base.groupby("localidad")["total_pop"].sum().to_dict()

t2 = pd.read_csv(OUT / "tabla2_clusters_por_localidad_contaminante_ano.csv")
hh_agg = (
    t2[t2["HH"] > 0]
    .groupby(["localidad", "pollutant"])["HH"]
    .sum()
    .reset_index()
    .rename(columns={"HH": "ocurrencias_HH"})
)

# Tabla A
rows_a = []
for loc in localidades:
    n_sec = sectores_por_localidad.get(loc, 0)
    for p in POLLUTANTS:
        n_yr = n_years_by_pollutant.get(p, 0)
        occ = hh_agg.loc[(hh_agg["localidad"] == loc) & (hh_agg["pollutant"] == p), "ocurrencias_HH"]
        occ_val = int(occ.iloc[0]) if len(occ) > 0 else 0
        tasa = round(occ_val / (n_sec * n_yr), 4) if n_sec * n_yr > 0 else 0.0
        rows_a.append({"localidad": loc, "contaminante": p, "anos_disponibles": n_yr,
                        "sectores_totales_localidad": n_sec, "ocurrencias_HH": occ_val, "tasa_HH": tasa})
tabla_a = pd.DataFrame(rows_a)
tabla_a.to_csv(OUT / "tablaA_tasa_HH_por_localidad_contaminante.csv", index=False, encoding="utf-8-sig")

# Tabla B
rows_b = []
for loc in localidades:
    n_sec = sectores_por_localidad.get(loc, 0)
    for p in POLLUTANTS:
        umbral = CRITERIO_PERSIST[p]
        criterio = f"HH_years >= {umbral} (de {n_years_by_pollutant.get(p,0)} disponibles)"
        mask = (t5["localidad"] == loc) & (t5["pollutant"] == p) & (t5["HH_years_count"] >= umbral)
        n_pers = int(t5[mask]["SETU_CCNCT"].nunique())
        prop = round(n_pers / n_sec, 4) if n_sec > 0 else 0.0
        rows_b.append({"localidad": loc, "contaminante": p, "sectores_totales_localidad": n_sec,
                        "sectores_HH_persistentes": n_pers, "proporcion_persistente": prop, "criterio_usado": criterio})
tabla_b = pd.DataFrame(rows_b)
tabla_b.to_csv(OUT / "tablaB_proporcion_persistente_por_localidad_contaminante.csv", index=False, encoding="utf-8-sig")

# Tabla C (IPM sin pct)
rows_c = []
for loc in localidades:
    pop_total = int(pop_por_localidad.get(loc, 0))
    for p in POLLUTANTS:
        sub = t4[(t4["localidad"] == loc) & (t4["pollutant"] == p) & (t4["year"] == 2018) & (t4["cluster"] == "HH")]
        if len(sub) > 0:
            row = sub.iloc[0]
            pop_hh  = int(row["total_population"])
            ninos   = int(row["children_0_9"])
            mayores = int(row["older_adults_60_plus"])
            ipm_hh  = round(row["avg_IPM"], 4)           # ← sin pct
            sec_hh  = int(row["sector_count"])
        else:
            pop_hh = ninos = mayores = sec_hh = 0
            ipm_hh = 0.0
        pct_pop = round(100 * pop_hh / pop_total, 1) if pop_total > 0 else 0.0
        rows_c.append({"localidad": loc, "contaminante": p,
                        "poblacion_total_localidad": pop_total, "sectores_HH_en_2018": sec_hh,
                        "poblacion_en_sectores_HH": pop_hh, "porcentaje_poblacion_en_HH": pct_pop,
                        "ninos_0_9_en_HH": ninos, "adultos_60mas_en_HH": mayores,
                        "IPM_promedio_HH": ipm_hh})          # ← nombre sin pct
tabla_c = pd.DataFrame(rows_c)
tabla_c.to_csv(OUT / "tablaC_poblacion_en_HH_2018.csv", index=False, encoding="utf-8-sig")

# Tabla D (IPM sin pct)
def minmax(s):
    mn, mx = s.min(), s.max()
    return (s - mn) / (mx - mn) if mx != mn else pd.Series(0.0, index=s.index)

rows_d = []
for loc in localidades:
    n_sec = sectores_por_localidad.get(loc, 0)
    pop_total = int(pop_por_localidad.get(loc, 0))
    sub_a = tabla_a[(tabla_a["localidad"] == loc) & (tabla_a["contaminante"].isin(PRIMARIOS))]
    tasa_prim = round(sub_a["tasa_HH"].mean(), 4)
    tasa_o3   = round(tabla_a.loc[(tabla_a["localidad"] == loc) & (tabla_a["contaminante"] == "O3"), "tasa_HH"].values[0], 4)
    sub_b = tabla_b[(tabla_b["localidad"] == loc) & (tabla_b["contaminante"].isin(PRIMARIOS))]
    prop_pers = round(sub_b["proporcion_persistente"].mean(), 4)
    if len(sub_b) > 0 and sub_b["proporcion_persistente"].max() > 0:
        idx_max = sub_b["proporcion_persistente"].idxmax()
        cont_max = sub_b.loc[idx_max, "contaminante"]
        max_prop = sub_b.loc[idx_max, "proporcion_persistente"]
    else:
        cont_max, max_prop = "-", 0.0
    sub_c = tabla_c[(tabla_c["localidad"] == loc) & (tabla_c["contaminante"].isin(PRIMARIOS))]
    pct_pop_medio = round(sub_c["porcentaje_poblacion_en_HH"].mean(), 1)
    sub_c_pm25 = tabla_c[(tabla_c["localidad"] == loc) & (tabla_c["contaminante"] == "PM2.5")]
    if len(sub_c_pm25) > 0:
        r = sub_c_pm25.iloc[0]
        ninos_hh   = int(r["ninos_0_9_en_HH"])
        mayores_hh = int(r["adultos_60mas_en_HH"])
        ipm_hh_pm25 = r["IPM_promedio_HH"]          # ← sin pct
        pop_hh_pm25 = int(r["poblacion_en_sectores_HH"])
        pct_pm25    = r["porcentaje_poblacion_en_HH"]
    else:
        ninos_hh = mayores_hh = pop_hh_pm25 = 0
        ipm_hh_pm25 = pct_pm25 = 0.0
    rows_d.append({"localidad": loc, "n_sectores": n_sec, "poblacion_total": pop_total,
                    "tasa_HH_primarios_media": tasa_prim, "tasa_HH_O3": tasa_o3,
                    "prop_sectores_persistentes_media": prop_pers,
                    "contaminante_mayor_persistencia": cont_max,
                    "max_prop_persistente": round(max_prop, 4),
                    "pct_pop_en_HH_primarios_medio": pct_pop_medio,
                    "pop_en_HH_PM25_2018": pop_hh_pm25, "pct_pop_en_HH_PM25": pct_pm25,
                    "ninos_0_9_en_HH_PM25": ninos_hh, "adultos_60mas_en_HH_PM25": mayores_hh,
                    "IPM_promedio_HH_PM25": ipm_hh_pm25})   # ← sin pct

tabla_d = pd.DataFrame(rows_d)
for col in ["score_tasa","score_persist","score_pct_pop","score_ipm","score_vulnerable"]:
    pass
tabla_d["score_tasa"]       = minmax(tabla_d["tasa_HH_primarios_media"])
tabla_d["score_persist"]    = minmax(tabla_d["prop_sectores_persistentes_media"])
tabla_d["score_pct_pop"]    = minmax(tabla_d["pct_pop_en_HH_primarios_medio"])
tabla_d["score_ipm"]        = minmax(tabla_d["IPM_promedio_HH_PM25"])
tabla_d["score_vulnerable"] = minmax(tabla_d["ninos_0_9_en_HH_PM25"] + tabla_d["adultos_60mas_en_HH_PM25"])
tabla_d["score_compuesto"]  = (
    tabla_d["score_tasa"]       * 0.30 +
    tabla_d["score_persist"]    * 0.25 +
    tabla_d["score_pct_pop"]    * 0.20 +
    tabla_d["score_ipm"]        * 0.15 +
    tabla_d["score_vulnerable"] * 0.10
).round(4)
tabla_d = tabla_d.sort_values("score_compuesto", ascending=False).reset_index(drop=True)
tabla_d["rango_primarios"] = range(1, len(tabla_d) + 1)
o3_rank = tabla_d.sort_values("tasa_HH_O3", ascending=False).reset_index(drop=True)
o3_rank["rango_O3"] = range(1, len(o3_rank) + 1)
tabla_d = tabla_d.merge(o3_rank[["localidad","rango_O3"]], on="localidad")
tabla_d.to_csv(OUT / "tablaD_ranking_normalizado_localidades.csv", index=False, encoding="utf-8-sig")
print("Tablas A-D recalculadas (IPM correcto)\n")

# ── 5. TABLA E: RATIO HH POR QUINTIL, CONTAMINANTE Y AÑO ──────────────────────
# Para cada (pollutant, year):
#   total sectores en ese año con datos de LISA, por quintil
#   sectores HH por quintil
#   tasa_HH_Qi = HH_sectores_Qi / total_sectores_Qi
#   ratio_Qi   = tasa_HH_Qi / tasa_HH_Q1   (Q1 = menos pobre = base)

# LISA completo enriquecido con quintil
lisa_q = lisa.merge(
    socio[["SETU_CCNCT", "IPM", "IPM_quintil"]],
    on="SETU_CCNCT",
    how="left",
)
lisa_q = lisa_q.dropna(subset=["IPM_quintil"])
lisa_q["IPM_quintil"] = lisa_q["IPM_quintil"].astype(str)

QUINTILES = ["Q1", "Q2", "Q3", "Q4", "Q5"]

rows_e = []
for (poll, yr), grp in lisa_q.groupby(["pollutant", "year"]):
    # Total sectores con LISA en ese año/contaminante, por quintil
    total_q = grp.groupby("IPM_quintil")["SETU_CCNCT"].nunique()
    hh_q    = grp[grp["cluster"] == "HH"].groupby("IPM_quintil")["SETU_CCNCT"].nunique()

    tasas = {}
    for q in QUINTILES:
        tot = int(total_q.get(q, 0))
        hh  = int(hh_q.get(q, 0))
        tasa = round(hh / tot, 4) if tot > 0 else np.nan
        tasas[q] = tasa

    tasa_q1 = tasas.get("Q1", np.nan)
    for q in QUINTILES:
        tasa_qi = tasas.get(q, np.nan)
        if pd.notna(tasa_q1) and tasa_q1 > 0 and pd.notna(tasa_qi):
            ratio = round(tasa_qi / tasa_q1, 3)
        elif pd.notna(tasa_q1) and tasa_q1 == 0 and pd.notna(tasa_qi) and tasa_qi > 0:
            ratio = np.nan  # indefinido (division por cero)
        else:
            ratio = 1.0 if q == "Q1" else np.nan
        tot_q = int(total_q.get(q, 0))
        hh_q_val = int(hh_q.get(q, 0))
        rows_e.append({
            "contaminante": poll, "año": yr, "quintil_IPM": q,
            "n_sectores_en_LISA": tot_q,
            "n_sectores_HH": hh_q_val,
            "tasa_HH": tasa_qi,
            "ratio_vs_Q1": ratio,
        })

tabla_e = pd.DataFrame(rows_e)
tabla_e.to_csv(OUT / "tablaE_ratio_HH_quintil_contaminante_ano.csv", index=False, encoding="utf-8-sig")
print(f"Tabla E guardada: {len(tabla_e)} filas")

# ── 6. TABLA F: RESUMEN QUINTIL × CONTAMINANTE (promediado en el tiempo) ──────

rows_f = []
for (poll, q), grp in tabla_e.groupby(["contaminante", "quintil_IPM"]):
    tasa_media = round(grp["tasa_HH"].mean(), 4)
    ratio_medio = round(grp["ratio_vs_Q1"].mean(), 3)
    rows_f.append({
        "contaminante": poll, "quintil_IPM": q,
        "tasa_HH_media": tasa_media,
        "ratio_medio_vs_Q1": ratio_medio,
    })
tabla_f = pd.DataFrame(rows_f)
tabla_f.to_csv(OUT / "tablaF_resumen_ratio_quintil_contaminante.csv", index=False, encoding="utf-8-sig")
print(f"Tabla F guardada: {len(tabla_f)} filas\n")

# ── 7. IMPRIMIR RESULTADOS ────────────────────────────────────────────────────

print("=== TABLA F: RATIO MEDIO HH POR QUINTIL Y CONTAMINANTE ===")
pivot_f = tabla_f.pivot(index="quintil_IPM", columns="contaminante", values="ratio_medio_vs_Q1")
pivot_f = pivot_f.reindex(QUINTILES)[["CO","NO2","PM10","PM2.5","SO2","O3","eBC"]]
print(pivot_f.round(2).to_string())

print()
print("=== TASA HH MEDIA POR QUINTIL Y CONTAMINANTE ===")
pivot_tasa = tabla_f.pivot(index="quintil_IPM", columns="contaminante", values="tasa_HH_media")
pivot_tasa = pivot_tasa.reindex(QUINTILES)[["CO","NO2","PM10","PM2.5","SO2","O3","eBC"]]
print(pivot_tasa.round(4).to_string())

print()
print("=== IPM por quintil ===")
print(quintil_ranges.to_string())

print()
print("=== RATIO PARA PM2.5 POR AÑO (muestra) ===")
pm25_e = tabla_e[tabla_e["contaminante"] == "PM2.5"].pivot(index="año", columns="quintil_IPM", values="ratio_vs_Q1")
pm25_e = pm25_e.reindex(columns=QUINTILES)
print(pm25_e.round(2).to_string())

print()
print("=== RATIO PARA NO2 POR AÑO (muestra) ===")
no2_e = tabla_e[tabla_e["contaminante"] == "NO2"].pivot(index="año", columns="quintil_IPM", values="ratio_vs_Q1")
no2_e = no2_e.reindex(columns=QUINTILES)
print(no2_e.round(2).to_string())

print("\nListo. Archivos guardados en docs/analisis/outputs/")
