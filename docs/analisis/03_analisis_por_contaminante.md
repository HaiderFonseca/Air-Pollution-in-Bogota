# Análisis LISA por Contaminante

## 3.1. Panorama general de concentraciones

Antes de analizar los clusters, se presenta un resumen estadístico de las concentraciones registradas por contaminante (todos los sectores y años disponibles):

| Contaminante | Unidad | Media | Mediana | P5 | P95 | Mín | Máx |
|---|---|---|---|---|---|---|---|
| CO | µg/m³ | 905.2 | 912.1 | 530.7 | 1226.2 | 384.9 | 1894.5 |
| NO2 | µg/m³ | 30.4 | 29.9 | 16.1 | 41.0 | 11.3 | 49.0 |
| O3 | µg/m³ | 78.8 | 78.4 | 51.5 | 102.2 | 35.2 | 128.9 |
| PM10 | µg/m³ | 40.6 | 39.5 | 25.3 | 63.8 | 20.2 | 88.3 |
| PM2.5 | µg/m³ | 17.2 | 16.8 | 9.7 | 24.0 | 7.2 | 35.2 |
| SO2 | µg/m³ | 5.3 | 4.4 | 2.1 | 11.4 | 1.4 | 21.6 |
| eBC | µg/m³ | 4.2 | 4.1 | 2.8 | 5.6 | 2.2 | 6.2 |

*Nota: Los valores de CO son coherentes con concentraciones en µg/m³ para zonas urbanas (1 ppm CO ≈ 1145 µg/m³ a condiciones estándar; los valores observados equivalen a 0.34–1.66 ppm).*

---

## 3.2. PM2.5 — Material Particulado Fino

### Descripción y relevancia sanitaria

Las **partículas finas (PM2.5)** son partículas con diámetro aerodinámico inferior a 2.5 micrómetros. Por su tamaño reducido, penetran profundamente en el tracto respiratorio, atraviesan la barrera alveolar y pueden alcanzar el torrente sanguíneo. Las fuentes principales en entornos urbanos son la combustión de vehículos (especialmente diésel), la quema de biomasa, la actividad industrial y las reacciones secundarias en atmósfera.

La **Organización Mundial de la Salud (OMS)** establece una guía de calidad del aire de 5 µg/m³ (media anual, revisión 2021), mientras que la norma colombiana vigente (Resolución 2254 de 2017) establece 25 µg/m³ anuales. Los valores promedio observados en Bogotá (17.2 µg/m³) superan la guía OMS, aunque se sitúan dentro del límite nacional.

### Patrones LISA

**Número de clusters HH por año:**

| Año | HH | LL | NS |
|---|---|---|---|
| 2010 | 125 | 155 | 345 |
| 2011 | 131 | 164 | 330 |
| 2012 | 121 | 151 | 353 |
| 2013 | 115 | 166 | 344 |
| 2014 | 133 | 221 | 271 |
| 2015 | 131 | 169 | 325 |
| 2016 | 123 | 164 | 338 |
| 2017 | 148 | 156 | 321 |
| 2018 | 132 | 178 | 315 |
| 2019 | 106 | 155 | 364 |
| 2020 | 118 | 164 | 343 |
| 2021 | 109 | 158 | 358 |
| 2022 | 164 | 158 | 303 |
| 2023 | 137 | 185 | 303 |
| 2024 | 121 | 194 | 310 |

El número de clusters HH para PM2.5 oscila entre 106 (2019) y 164 (2022), sin una tendencia temporal clara de mejora o deterioro, lo que sugiere una distribución espacial relativamente estructural. Destaca el año 2022 como el de mayor intensidad de clusters HH.

### Localización de clusters HH

Las localidades con mayor acumulación de clusters HH para PM2.5 (suma 2010–2024) son:

1. **Kennedy:** 844 ocurrencias HH (∼21% del total de HH para PM2.5)
2. **Ciudad Bolívar:** 289
3. **Puente Aranda:** 283
4. **Fontibón:** 161
5. **Bosa:** 114

En el año de referencia (2018), los 132 sectores HH se distribuyen principalmente en Kennedy (52), Puente Aranda (36), Rafael Uribe Uribe (13) y Ciudad Bolívar (12).

Este patrón es geográficamente coherente con el suroccidente y occidente de Bogotá, donde confluyen altos volúmenes de tráfico (Autopista Sur, Avenida Boyacá, NQS), actividad industrial y zonas de alta densidad residencial con combustión doméstica.

### Clusters LL (baja concentración)

Los clusters LL se concentran en:
1. **San Cristóbal:** 588 ocurrencias LL — zona de ladera en el oriente, con menor presión vehicular e industrial
2. **Usaquén:** 485 — norte de la ciudad, con parques y menor densidad de vías arteriales de tráfico pesado
3. **Suba:** 428 — occidente norte, con zonas residenciales de mayor estratificación
4. **Santa Fe:** 224

### Persistencia

- **105 sectores** presentan persistencia HH ≥10 años para PM2.5, con una mediana de 7 años.
- Los sectores más persistentes se ubican en Kennedy, Puente Aranda y los límites entre Kennedy y Ciudad Bolívar.
- Esta persistencia sugiere que los factores estructurales (infraestructura vial, industria, densidad) que generan los clusters son estables en el tiempo.

### Población expuesta

En 2018, aproximadamente **1.87 millones de personas** habitaban sectores HH para PM2.5, incluyendo más de **234.000 niños** (0–9 años) y **235.000 adultos mayores** (60+). El IPM promedio en sectores HH (0.090) supera al de sectores LL (0.092), con diferencias moderadas.

### Interpretación

El patrón de PM2.5 es consistente con hipótesis que vinculan las altas concentraciones en el suroccidente bogotano con el corredor de tráfico pesado de la Autopista Sur y la Avenida Boyacá, así como con la actividad industrial de Puente Aranda y la alta densidad vehicular de Kennedy. La persistencia temporal de los clusters refuerza la idea de que los determinantes de la exposición son estructurales y no episódicos.

---

## 3.3. PM10 — Material Particulado Grueso

### Descripción y relevancia sanitaria

Las **partículas PM10** (diámetro ≤10 µm) incluyen polvo mineral, esporas, partículas de construcción y viales. Afectan el sistema respiratorio superior y, en exposición prolongada, el sistema cardiovascular. La norma OMS 2021 establece 15 µg/m³ anuales; la norma colombiana, 50 µg/m³. Los valores promedio observados (40.6 µg/m³) superan la guía OMS y se acercan al límite nacional.

### Patrones LISA

PM10 presenta la **mayor persistencia de clusters HH** del conjunto de contaminantes analizados:

| Indicador | Valor |
|---|---|
| Sectores con HH ≥ 10 años | 112 |
| Mediana de años HH | 11 |
| Máximo de años HH | 15 (sectores con HH cada año, 2010–2024) |
| Promedio de años HH | 8.9 |

Existen **sectores con HH absoluta** (los 15 años disponibles), ubicados principalmente en Kennedy, Ciudad Bolívar, Bosa y Tunjuelito. Esto sugiere que la exposición a PM10 en estas zonas es una condición crónica, no transitoria.

### Localización de clusters HH

1. **Kennedy:** 886 ocurrencias HH
2. **Ciudad Bolívar:** 423
3. **Puente Aranda:** 175
4. **Fontibón:** 154
5. **Bosa:** 136

### Clusters LL

1. **San Cristóbal:** 605
2. **Santa Fe:** 396
3. **Usaquén:** 388
4. **Suba:** 371
5. **Chapinero:** 309

El contraste entre el suroccidente (HH) y el oriente-norte (LL) es especialmente marcado para PM10, posiblemente por la combinación de polvo resuspendido en vías sin pavimentar del sur, tráfico pesado y actividad constructiva.

### Población expuesta

En 2018, **2.40 millones de personas** habitaban sectores HH para PM10, con **314.820 niños** y **270.994 adultos mayores**. Es la cifra de exposición más alta entre todos los contaminantes analizados en ese año.

### Interpretación

La extrema persistencia de clusters HH para PM10 en el arco sur de la ciudad (Kennedy–Bosa–Ciudad Bolívar) sugiere la acción combinada y continua de: (i) tráfico de carga en las vías arteriales del suroccidente, (ii) actividad constructiva, (iii) resuspensión de polvo en vías con déficit de pavimentación y arborización, y (iv) posible contribución de la zona industrial de Puente Aranda. La magnitud de la población expuesta y la cronicidad del patrón lo convierten en el hallazgo de mayor urgencia sanitaria del análisis.

---

## 3.4. NO2 — Dióxido de Nitrógeno

### Descripción y relevancia sanitaria

El **NO2** es un contaminante primario producto de la combustión a altas temperaturas, principalmente en motores de vehículos y plantas industriales. Es un precursor del ozono troposférico y del material particulado secundario. Provoca inflamación del tracto respiratorio, reduce la función pulmonar y agrava condiciones asmáticas. La norma OMS 2021 es de 10 µg/m³ anuales.

**Nota:** Los datos disponibles para NO2 no incluyen los años 2011 y 2012, por lo que el análisis de persistencia cubre 13 años.

### Patrones LISA

El número de clusters HH para NO2 muestra mayor variabilidad que PM2.5 o PM10:

- Años con mayor intensidad HH: 2016 (191), 2017 (209), 2021 (190)
- Años sin datos: 2011, 2012
- Promedio años HH por sector con al menos 1 HH: 4.5 años

### Localización de clusters HH

1. **Kennedy:** 627 ocurrencias HH
2. **Puente Aranda:** 316
3. **Fontibón:** 205
4. **Engativá:** 168
5. **Ciudad Bolívar:** 144

El patrón de NO2 sugiere fuerte asociación con los ejes viales de occidente (Autopista Medellín, Calle 80, Avenida El Dorado, Autopista Sur) y con la actividad industrial de Puente Aranda y Fontibón, coherente con la dinámica de combustión de vehículos a gasolina y gas.

### Clusters LL

1. **Usaquén:** 374
2. **Suba:** 326
3. **Chapinero:** 309

Los clusters LL en el norte sugieren menor densidad de tráfico pesado y mayor presencia de vías con mejor gestión de emisiones.

### Interpretación

El patrón de NO2 es el más consistente con la hipótesis de exposición vehicular en corredores de alto tráfico. La concentración de clusters HH en Kennedy, Puente Aranda y Fontibón coincide geográficamente con los accesos a la ciudad desde el occidente y con el tráfico de camiones de carga hacia las zonas industriales. La fuerte presencia en Engativá es compatible con la influencia del Aeropuerto El Dorado y las vías aledañas.

---

## 3.5. SO2 — Dióxido de Azufre

### Descripción y relevancia sanitaria

El **SO2** es un contaminante primario producto de la combustión de combustibles que contienen azufre (diésel, carbón, fueloil). En el contexto urbano, sus principales fuentes son vehículos diésel, industrias y generación termoeléctrica. Puede causar broncoespasmo, irritación respiratoria y, en combinación con partículas, efectos cardiovasculares. Es también precursor de sulfatos secundarios (PM2.5 secundario).

**Disponibilidad:** SO2 no tiene datos en 2010 ni 2013, lo que limita la serie temporal a 12 años.

### Patrones LISA

- SO2 presenta el **mayor IPM promedio en sectores HH** (0.122), indicando que las zonas con mayor exposición concentran las poblaciones más pobres.
- Los clusters HH son más numerosos en los años recientes (2022: 150, 2023: 166, 2024: 131).

### Localización de clusters HH

1. **Ciudad Bolívar:** 422 ocurrencias HH
2. **Kennedy:** 416
3. **Rafael Uribe Uribe:** 148
4. **Usme:** 131
5. **San Cristóbal:** 102

Este patrón difiere ligeramente de PM2.5 y PM10 en cuanto a la importancia relativa de **Ciudad Bolívar** como zona crítica para SO2, lo que podría estar asociado a fuentes domésticas de combustión de carbón y biomasa en sectores periurbanos del sur.

### Clusters LL

1. **Chapinero:** 388
2. **Suba:** 379
3. **Engativá:** 315

### Interpretación

El patrón sur-intenso del SO2 (Ciudad Bolívar, Usme, San Cristóbal) es consistente con hipótesis que vinculan las altas concentraciones con: (i) combustión doméstica de carbón y materiales de baja calidad en sectores de bajos ingresos, (ii) actividad industrial en áreas periféricas del sur (ladrilleras, talleres, pequeña industria), y (iii) tráfico de vehículos diésel en los accesos al sur de la ciudad. La fuerte asociación con sectores de alto IPM refuerza la dimensión de injusticia ambiental.

---

## 3.6. CO — Monóxido de Carbono

### Descripción y relevancia sanitaria

El **CO** es un gas incoloro e inodoro producto de la combustión incompleta de combustibles orgánicos. Se une a la hemoglobina con mayor afinidad que el O₂, reduciendo la capacidad de transporte de oxígeno en sangre. En exposición aguda puede ser letal; en exposición crónica, afecta el sistema nervioso central y cardiovascular. La norma OMS (2021) es de 4 mg/m³ para 24 horas.

Los valores observados (385–1895 µg/m³) corresponden a medias anuales; a corto plazo, los picos pueden ser significativamente superiores.

### Patrones LISA

El CO presenta una dinámica intermedia de persistencia (media 5.2 años, máximo 14 años). El número de clusters HH oscila entre 75 (2010) y 156 (2022), con una tendencia al alza que podría sugerir incremento en la exposición en zonas críticas.

### Localización de clusters HH

1. **Kennedy:** 559 ocurrencias HH
2. **Ciudad Bolívar:** 325
3. **Puente Aranda:** 225
4. **Rafael Uribe Uribe:** 143
5. **Chapinero:** 132

La presencia de **Chapinero** en el top 5 es notable y podría estar relacionada con el alto flujo vehicular en el eje de la Avenida Caracas y el corredor de la Calle 72.

### Clusters LL

1. **Suba:** 454
2. **Usaquén:** 320
3. **San Cristóbal:** 312

### Interpretación

El patrón de CO es muy coherente con la distribución del tráfico vehicular en Bogotá. La concentración de clusters HH en el suroccidente (Kennedy, Ciudad Bolívar, Puente Aranda) y el occidente (Fontibón) coincide con los principales corredores de tráfico pesado y zonas de mayor congestión. La presencia en Chapinero sugiere posible influencia del corredor norte-sur de la Carrera 7a y la Avenida Caracas.

---

## 3.7. O3 — Ozono Troposférico

### Descripción y relevancia sanitaria

El **ozono troposférico** es un **contaminante secundario**: no se emite directamente sino que se forma en la atmósfera por reacciones fotoquímicas entre NOₓ y compuestos orgánicos volátiles (COVs) en presencia de radiación solar ultravioleta. Esta naturaleza secundaria explica su patrón espacial diferenciado respecto a los contaminantes primarios.

El O3 provoca irritación de las vías respiratorias, reduce la función pulmonar y puede agravar asma y enfermedades pulmonares crónicas. En concentraciones altas también tiene efectos cardíacos.

### Patrones LISA — Patrón espacial opuesto

El O3 presenta el patrón espacial **más distinto** del conjunto. Sus clusters HH se concentran en el **norte y noroccidente** de la ciudad, mientras que sus clusters LL se ubican en el **sur y occidente**, precisamente donde se concentran los HH de los demás contaminantes:

**Localidades con mayor HH para O3:**
1. **Suba:** 591 ocurrencias HH
2. **Usaquén:** 383
3. **Chapinero:** 316
4. **Engativá:** 293
5. **Barrios Unidos:** 225

**Localidades con mayor LL para O3:**
1. **Kennedy:** 375
2. **San Cristóbal:** 374
3. **Puente Aranda:** 361
4. **Rafael Uribe Uribe:** 291
5. **Ciudad Bolívar:** 272

Este patrón inverso —HH de O3 donde hay LL de PM2.5, y LL de O3 donde hay HH de PM2.5— es una señal de la **titración de O3 por NO**: en zonas de alto tráfico (sur y occidente), el NO emitido directamente reacciona con el O3, consumiéndolo. En zonas más alejadas del tráfico intenso, el O3 se acumula porque hay menos NO disponible para su destrucción.

### Persistencia

- **44 sectores** presentan persistencia HH ≥10 años para O3
- La persistencia media es de 6.3 años (segunda mayor después de PM10 y PM2.5)
- Los sectores más persistentes se ubican en Suba, Usaquén y Chapinero

### Interpretación

La formación de O3 en el norte de Bogotá es consistente con: (i) mayor radiación solar recibida en zonas con menor oclusión por edificaciones, (ii) menor concentración de NO (que destruye O3) por menor intensidad de tráfico pesado, (iii) transporte de O3 y sus precursores desde el centro de la ciudad hacia la periferia norte por acción de los vientos. Este patrón plantea una hipótesis de justicia ambiental diferenciada: las localidades del norte experimentan mayor exposición a O3 (contaminante secundario), mientras que las del sur sufren mayor exposición a contaminantes primarios.

---

## 3.8. eBC — Carbono Negro Equivalente (Carbono Elemental / Black Carbon)

### Descripción y relevancia sanitaria

El **eBC (equivalent Black Carbon)** o carbono negro es un componente del material particulado fino, generado principalmente por la combustión incompleta de combustibles fósiles (especialmente diésel) y biomasa. Tiene importancia climática (absorbedor de radiación solar) y sanitaria: penetra hasta los alvéolos pulmonares y se asocia con enfermedades cardiovasculares y respiratorias. Es un marcador proxy de exposición a emisiones de tráfico diésel.

**Disponibilidad:** Datos LISA solo para 2021, 2022 y 2023.

### Patrones LISA

Con solo 3 años de datos, la interpretación es necesariamente más limitada. Sin embargo, el patrón es consistente con el de otros contaminantes de origen vehicular:

| Año | HH | LL |
|---|---|---|
| 2021 | 165 | 170 |
| 2022 | 134 | 161 |
| 2023 | 120 | 176 |

### Localización de clusters HH

1. **Kennedy:** 152
2. **Ciudad Bolívar:** 72
3. **Fontibón:** 68
4. **Engativá:** 49
5. **Rafael Uribe Uribe:** 22

### Clusters LL

1. **San Cristóbal**
2. **Santa Fe**
3. **Chapinero**

### Interpretación

El patrón de eBC es coherente con la hipótesis de exposición a tráfico diésel: Kennedy, Ciudad Bolívar y Fontibón concentran rutas de transporte masivo (TransMilenio, buses), vehículos de carga y transporte intermunicipal. La coincidencia con los patrones de PM2.5 y PM10 sugiere que el carbono negro es una fracción importante de la carga de material particulado en estas zonas. La corta serie temporal impide conclusiones sobre tendencias.
