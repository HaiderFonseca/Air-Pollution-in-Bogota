# Metodología

## 2.1. Fuentes de datos

### 2.1.1. Sectores censales

- **Fuente:** Capa vectorial de sectores censales de Bogotá, Departamento Administrativo Nacional de Estadística (DANE), ajustada para el Censo Nacional de Población y Vivienda 2018.
- **Formato:** GeoJSON (`public/data/geo/sectores_censales_bogota.geojson`)
- **Unidades:** 641 sectores censales
- **Llave principal:** `SETU_CCNCT` — código único de sector censal (texto de 18 caracteres)
- **Variables geométricas disponibles:** polígono multipolígono por sector, área (SHAPE_Area), perímetro (SHAPE_Leng), código de sector urbano (SETU_CCDGO)

### 2.1.2. Concentraciones de contaminantes

- **Fuente:** Datos de concentración anual por sector censal, derivados de modelación espacial o interpolación geoestadística (`MEDIA_ZONAL_SECTOR_CENSAL_2010_2024.gpkg`).
- **Formato procesado:** JSON en formato largo (`public/data/geo/concentraciones_sector_censal.json`)
- **Registros totales:** 56.159
- **Sectores con datos:** 631 de 641 (10 sectores sin cobertura de concentraciones)
- **Período:** 2010–2024 (15 años)
- **Contaminantes disponibles:** CO, NO2, OZONO (→ O3), PM10, PM2.5, SO2, eBC

**Nota:** La disponibilidad de datos LISA varía por contaminante:
- **CO, PM10, PM2.5, O3:** 2010–2024 (15 años)
- **NO2:** 2010, 2013–2024 (13 años; sin 2011 y 2012)
- **SO2:** 2011–2024 excepto 2013 (12 años)
- **eBC:** 2021–2023 (3 años)

### 2.1.3. Variables sociodemográficas

- **Fuente:** Censo Nacional de Población y Vivienda 2018, DANE. Variables sociodemográficas agregadas a nivel de sector censal.
- **Formato:** CSV (`public/data/tabular/sociodemograficas_sector_censal.csv`)
- **Filas:** 641 (cobertura completa de todos los sectores)
- **Variables utilizadas:**
  - `STP27_PERS`: Población total
  - `STP34_1_ED`: Niños 0–9 años
  - `STP34_2_ED`: Jóvenes 10–19 años
  - `STP34_3_ED` a `STP34_6_ED`: Adultos 20–59 años (suma)
  - `STP34_7_ED` a `STP34_9_ED`: Adultos mayores 60+ años (suma)
  - `ESTRATO_MAYORITARIO`: Estrato socioeconómico predominante
  - `IPM_PROMEDIO`: Índice de Pobreza Multidimensional promedio del sector

**Advertencia:** Las variables sociodemográficas corresponden al Censo 2018 y se aplican estáticamente a todos los años del análisis. Esta limitación implica que los cambios demográficos entre 2010 y 2024 no se capturan.

### 2.1.4. Clusters LISA

- **Fuente:** Archivos GPKG por contaminante y año, generados mediante análisis de Índice de Moran Local con corrección de significancia estadística (p < 0.05).
- **Directorio original:** `Lisa/` (carpetas `PM2.5_MORAN`, `PM10_MORAN`, `CO_MORAN`, `NO2_MORAN`, `OZONO_MORAN`, `SO2_MORAN`, `EBC_MORAN`)
- **Formato procesado:** JSON consolidado (`public/data/lisa/lisa_clusters.json`)
- **Registros:** 55.625

### 2.1.5. Localidades

- **Fuente:** Capa vectorial de localidades de Bogotá D.C.
- **Archivo:** `Datos/Localidades/Localidades_Lat_lon.shp`
- **Proyección:** WGS84 (EPSG:4326), transformada desde el sistema original
- **Localidades en la capa:** 19 unidades administrativas
- **Variables relevantes:** `NOMBRE` (nombre de la localidad), `CODIGO_LOC`

---

## 2.2. Unidad de análisis

La unidad primaria de análisis es el **sector censal**, definido por el DANE como la unidad territorial básica del Censo, dentro de las manzanas o zonas homogéneas de la ciudad. Cada sector censal tiene un código único `SETU_CCNCT` que sirve como llave de integración entre las capas geográficas, los datos de concentración y las variables sociodemográficas.

Las 641 sectores censales de Bogotá están agrupados en 19 localidades. Esta agrupación se realizó mediante cruce espacial (ver §2.4).

---

## 2.3. Definición e interpretación de clusters LISA

### ¿Qué es LISA?

El **Índice de Moran Local (Local Moran's I, LISA)** es una medida de autocorrelación espacial local que determina si el valor de una variable en una unidad geográfica es estadísticamente similar o diferente a los valores de sus vecinos. Para cada sector censal i, el Índice de Moran Local se define como:

$$I_i = \frac{(x_i - \bar{x})}{s^2} \sum_j w_{ij} (x_j - \bar{x})$$

donde:
- $x_i$ es la concentración del contaminante en el sector i
- $\bar{x}$ es la media global de la concentración
- $s^2$ es la varianza
- $w_{ij}$ son los pesos espaciales (contigüidad de primer orden)

### Tipos de cluster

| Cluster | Significado | Interpretación |
|---|---|---|
| **HH** (Alto-Alto) | Sector con concentración alta, rodeado de vecinos con concentración alta | Zona de acumulación activa de contaminante. Punto crítico de exposición. |
| **LL** (Bajo-Bajo) | Sector con concentración baja, rodeado de vecinos con concentración baja | Zona de buena calidad del aire relativa. Posible área protegida o con menor actividad emisora. |
| **HL** (Alto-Bajo) | Sector con concentración alta, rodeado de vecinos bajos | Anomalía positiva aislada. Posible fuente puntual. |
| **LH** (Bajo-Alto) | Sector con concentración baja, rodeado de vecinos altos | Anomalía negativa aislada. Posible efecto de disipación local o barrera. |
| **NS** | No significativo (p > 0.05) | No hay patrón espacial estadísticamente diferente al esperado bajo hipótesis nula. |

### Criterio de significancia

En este análisis, un sector se clasifica como HH, LL, HL o LH únicamente si el valor p asociado al Índice de Moran Local es **p < 0.05** (campo `significativo = 1` en los archivos GPKG). Los sectores con `significativo = 0` se clasifican como NS, independientemente de su cuadrante LISA.

---

## 2.4. Cruce espacial con localidades

El shapefile de sectores censales procesado (`BOGOTA_SECTOR_CENSAL_local_final.shp`) incluye una columna pre-calculada `LocNombre` que asigna la localidad a cada sector censal. Este campo fue usado directamente como llave de agrupación territorial.

Se identificaron 641 sectores asignados a 19 localidades. El criterio de asignación fue la localidad dentro de la cual cae el sector censal según la intersección espacial directa (no se requirió imputación por centroide, dado que el campo ya estaba incluido en el shapefile).

**Tabla de sectores por localidad:**

| Localidad | Sectores |
|---|---|
| Suba | 70 |
| Kennedy | 61 |
| Ciudad Bolívar | 52 |
| Engativá | 52 |
| San Cristóbal | 58 |
| Chapinero | 45 |
| Usaquén | 42 |
| Puente Aranda | 40 |
| Usme | 36 |
| Santa Fe | 36 |
| Rafael Uribe Uribe | 33 |
| Fontibón | 30 |
| Barrios Unidos | 25 |
| Teusaquillo | 20 |
| Los Mártires | 19 |
| Bosa | 10 |
| Tunjuelito | 4 |
| Antonio Nariño | 3 |
| Sumapaz | 5 |

---

## 2.5. Construcción de indicadores de persistencia

La **persistencia** de un cluster HH (o LL) para un sector y contaminante se define como el número de años en que ese sector aparece clasificado como HH (o LL) con significancia estadística. Los indicadores calculados son:

- **`HH_years_count`**: número de años en que el sector aparece como HH para un contaminante dado
- **`LL_years_count`**: equivalente para cluster LL
- **Clasificación de persistencia:**
  - **Alta:** ≥ 75% del total de años disponibles para ese contaminante
  - **Media:** ≥ 40% y < 75%
  - **Baja:** < 40%

---

## 2.6. Construcción de indicadores de exposición poblacional

La exposición poblacional en clusters HH se calcula como la suma de la población (total, niños, adultos mayores) de todos los sectores clasificados como HH para un contaminante, año y/o localidad dados. Dado que los datos demográficos son estáticos (2018), este indicador es una aproximación y no captura variaciones en la distribución poblacional durante el período de análisis.

---

## 2.7. Herramientas utilizadas

- **Lenguaje:** Python 3.14
- **Librerías:** `pandas 3.0`, `geopandas 1.1`, `shapely 2.1`, `sqlite3` (lectura de GPKG)
- **Conversión de GPKG:** Script `scripts/convert_lisa.py`
- **Análisis:** Script `scripts/analisis_completo.py`
- **Visualización:** Dashboard web (React + Leaflet) para exploración espacial

---

## 2.8. Limitaciones metodológicas

1. **Los clusters LISA identifican autocorrelación espacial, no causalidad.** La presencia de un cluster HH indica que un sector y sus vecinos tienen concentraciones altas, pero no permite inferir las causas directas.

2. **Los datos de concentración pueden ser producto de modelación o interpolación espacial.** No se dispone de documentación detallada sobre el método de estimación de concentraciones por sector censal, lo que puede introducir incertidumbre en la precisión de los valores y en la identificación de clusters en zonas sin estaciones de monitoreo cercanas.

3. **Las variables sociodemográficas son estáticas (Censo 2018).** No reflejan cambios en la composición poblacional a lo largo del período 2010–2024.

4. **Disponibilidad desigual de datos LISA por contaminante:** eBC solo tiene 3 años (2021–2023); SO2 y NO2 tienen años faltantes. Los indicadores de persistencia deben interpretarse en relación con el número máximo de años disponibles por contaminante.

5. **Los clusters HL y LH son estadísticamente marginales.** Solo se registran 2 casos HH y 12 LH en todo el conjunto de datos, lo que limita el análisis de estas categorías.

6. **La resolución censal puede enmascarar variaciones intrasector.** Un sector censal puede contener zonas con condiciones muy distintas, y los valores de concentración asignados representan una media o agregación espacial.

7. **El cruce con localidades se realizó a partir de un campo pre-calculado en el shapefile.** Si existen discrepancias en la asignación de sectores censales a localidades en el shapefile original, éstas se propagan al análisis territorial.
