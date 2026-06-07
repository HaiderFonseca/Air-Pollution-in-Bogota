# Análisis de Clusters LISA de Calidad del Aire en Bogotá (2010–2024)
## Índice General del Análisis

> **Tesis de Maestría — Universidad de los Andes**
> Análisis externo al dashboard web. No modifica la aplicación.

---

### Archivos del análisis

| # | Archivo | Contenido |
|---|---|---|
| 1 | [01_resumen_ejecutivo.md](./01_resumen_ejecutivo.md) | Hallazgos principales, tablas clave, implicaciones para política pública |
| 2 | [02_metodologia.md](./02_metodologia.md) | Datos, unidades de análisis, LISA, cruce con localidades, limitaciones |
| 3 | [03_analisis_por_contaminante.md](./03_analisis_por_contaminante.md) | PM2.5, PM10, NO2, SO2, CO, O3, eBC — descripción, patrones LISA, localidades |
| 4 | [04_persistencia_espacial.md](./04_persistencia_espacial.md) | Análisis temporal de clusters HH/LL, sectores críticos, exposición crónica |
| 5 | [05_analisis_sociodemografico.md](./05_analisis_sociodemografico.md) | Población expuesta, IPM, estrato, niños, adultos mayores, justicia ambiental |
| 6 | [06_analisis_territorial_localidades.md](./06_analisis_territorial_localidades.md) | Análisis por localidad, corredores urbanos, ranking de prioridad |
| 7 | [07_conclusiones_recomendaciones.md](./07_conclusiones_recomendaciones.md) | Conclusiones, hipótesis explicativas, recomendaciones, limitaciones |

### Tablas y outputs

Los archivos CSV y JSON generados están en [`outputs/`](./outputs/):

| Archivo | Descripción |
|---|---|
| `sectores_con_localidad.csv` | 641 sectores con su localidad asignada |
| `tabla0_estadisticas_concentracion.csv` | Estadísticas descriptivas por contaminante |
| `tabla0b_evolucion_temporal.csv` | Evolución temporal de concentraciones |
| `tabla1_clusters_por_contaminante_ano.csv` | Clusters HH/LL/NS por contaminante y año |
| `tabla2_clusters_por_localidad_contaminante_ano.csv` | Clusters por localidad, contaminante y año |
| `tabla3_poblacion_expuesta_por_cluster.csv` | Población en cada tipo de cluster |
| `tabla4_poblacion_por_localidad_cluster.csv` | Población por localidad y cluster |
| `tabla5_persistencia_HH_por_sector.csv` | Persistencia HH por sector censal |
| `tabla6_persistencia_LL_por_sector.csv` | Persistencia LL por sector censal |
| `tabla7_ranking_sectores_criticos_HH.csv` | Top sectores de riesgo compuesto |
| `tabla8_ranking_localidades_criticas.csv` | Ranking de localidades críticas |
| `tabla9_persistencia_HH_por_localidad.csv` | Persistencia HH categorizada por localidad |
| `resumen_estadistico.json` | Estadísticas clave en JSON |

### Scripts

| Script | Descripción |
|---|---|
| `scripts/convert_lisa.py` | Convierte GPKG a JSON consolidado de clusters LISA |
| `scripts/analisis_completo.py` | Genera todas las tablas de outputs |

---

### Datos utilizados

| Dataset | Fuente | Registros |
|---|---|---|
| Sectores censales (GeoJSON) | DANE | 641 sectores |
| Concentraciones anuales (JSON) | Modelación/interpolación | 56.159 registros |
| Sociodemografía (CSV) | Censo DANE 2018 | 641 sectores |
| Clusters LISA (JSON) | Análisis Moran Local | 55.625 registros |
| Localidades (SHP) | Bogotá D.C. | 19 localidades |

---

### Hallazgos clave (síntesis)

- **Kennedy** es la localidad con mayor exposición acumulada a contaminantes primarios (PM2.5, PM10, NO2, CO, eBC)
- **Ciudad Bolívar** tiene el mayor IPM en sectores HH (0.122 para SO2), la mayor injusticia ambiental
- **O3** tiene patrón opuesto: HH en Suba, Usaquén, Chapinero (norte)
- **PM10** tiene 112 sectores con HH persistente ≥10 años (mediana: 11 años)
- ~**1 de cada 5 niños** de Bogotá vive en sectores HH persistentes para PM10
- Los clusters HH de contaminantes primarios se concentran sistemáticamente en sectores con mayor IPM (mayor pobreza)

---

*Generado a partir de datos reales del dashboard geoespacial de calidad del aire en Bogotá.*
*No modifica ningún componente de la aplicación web.*
