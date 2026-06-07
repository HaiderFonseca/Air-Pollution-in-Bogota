# 7.7 Análisis territorial por localidades

---

## 7.7.1 Nota metodológica: métricas normalizadas e IPM

### Normalización territorial

Las 19 localidades del Distrito Capital tienen tamaños muy distintos: desde 3 sectores censales (Antonio Nariño) hasta 70 (Suba). Comparar conteos absolutos de ocurrencias HH entre localidades penaliza sistemáticamente a las pequeñas. El análisis que sigue se basa en tres métricas normalizadas:

**Tasa de ocurrencia HH**

$$\text{tasa\_HH}_{l,p} = \frac{\text{ocurrencias HH}_{l,p}}{N_{\text{sectores},l} \times N_{\text{años},p}}$$

donde $N_{\text{años},p}$ es el número de años con datos LISA disponibles por contaminante: CO 15, PM₁₀ 15, PM₂.₅ 15, O₃ 15, NO₂ 13 (sin 2011–2012), SO₂ 13 (sin 2010 y 2013), eBC 3 (solo 2021–2023). La tasa oscila entre 0 y 1.

**Proporción de sectores con persistencia alta**

$$\text{prop\_persist}_{l,p} = \frac{\text{sectores con HH} \geq 10 \text{ años}}{N_{\text{sectores},l}}$$

Umbral ≥10 años para CO, NO₂, PM₁₀, PM₂.₅, SO₂, O₃. Para eBC: ≥2 de los 3 años disponibles (se reporta separado y no entra en el ranking de persistencia larga).

**Porcentaje de población en sectores HH (referencia: 2018)**

$$\text{pct\_pop\_HH}_{l,p} = \frac{\text{población en sectores HH en 2018}_{l,p}}{\text{población total}_{l}} \times 100$$

El **ranking compuesto para contaminantes primarios** (CO, NO₂, PM₁₀, PM₂.₅, SO₂) pondera: tasa HH media (30%), proporción persistente media (25%), % población en HH (20%), IPM promedio en sectores HH (15%), población vulnerable en HH (10%). O₃ se rankea de forma separada.

### Sobre el IPM

El Índice de Pobreza Multidimensional (IPM) utilizado es el IPM promedio de los hogares del sector censal, en escala original 0–1 (donde 0 = ningún hogar pobre por esta medida y 1 = todos los hogares pobres). **No es un porcentaje**. Valores observados en Bogotá van de 0,000 a 0,860, con media de 0,103 y mediana de 0,081.

Para el análisis de discriminación, los 641 sectores se dividen en cinco quintiles según su IPM. El **quintil Q1 agrupa los sectores con menor IPM** (menos pobres, IPM: 0,000–0,042) y el **quintil Q5 los de mayor IPM** (más pobres, IPM: 0,153–0,860).

| Quintil | IPM mín | IPM máx | IPM medio | N sectores |
|---|---|---|---|---|
| Q1 (menos pobre) | 0,000 | 0,042 | 0,027 | 129 |
| Q2 | 0,043 | 0,067 | 0,054 | 128 |
| Q3 | 0,067 | 0,098 | 0,082 | 128 |
| Q4 | 0,100 | 0,152 | 0,122 | 128 |
| Q5 (más pobre) | 0,153 | 0,860 | 0,230 | 128 |

---

## 7.7.2 Tabla A — Tasa de ocurrencia HH por localidad y contaminante

> Definición: tasa_HH = ocurrencias HH / (sectores × años disponibles). Rango [0, 1].

### Contaminantes primarios — cinco localidades con mayor tasa

**CO** (15 años)

| Localidad | Sectores | Ocurrencias HH | Tasa HH |
|---|---|---|---|
| Tunjuelito | 4 | 42 | 0,700 |
| Kennedy | 61 | 559 | 0,611 |
| Bosa | 10 | 70 | 0,467 |
| Ciudad Bolívar | 52 | 325 | 0,417 |
| Puente Aranda | 40 | 225 | 0,375 |

**NO₂** (13 años, sin datos 2011–2012)

| Localidad | Sectores | Ocurrencias HH | Tasa HH |
|---|---|---|---|
| Kennedy | 61 | 627 | 0,791 |
| Puente Aranda | 40 | 316 | 0,608 |
| Fontibón | 30 | 205 | 0,526 |
| Tunjuelito | 4 | 21 | 0,404 |
| Bosa | 10 | 52 | 0,400 |

**PM₁₀** (15 años)

| Localidad | Sectores | Ocurrencias HH | Tasa HH |
|---|---|---|---|
| Kennedy | 61 | 886 | 0,968 |
| Bosa | 10 | 136 | 0,907 |
| Tunjuelito | 4 | 47 | 0,783 |
| Ciudad Bolívar | 52 | 423 | 0,542 |
| Fontibón | 30 | 154 | 0,342 |

**PM₂.₅** (15 años)

| Localidad | Sectores | Ocurrencias HH | Tasa HH |
|---|---|---|---|
| Kennedy | 61 | 844 | 0,922 |
| Bosa | 10 | 114 | 0,760 |
| Tunjuelito | 4 | 44 | 0,733 |
| Puente Aranda | 40 | 283 | 0,472 |
| Ciudad Bolívar | 52 | 289 | 0,371 |

**SO₂** (13 años, sin datos 2010 y 2013)

| Localidad | Sectores | Ocurrencias HH | Tasa HH |
|---|---|---|---|
| Bosa | 10 | 85 | 0,654 |
| Ciudad Bolívar | 52 | 422 | 0,624 |
| Tunjuelito | 4 | 32 | 0,615 |
| Kennedy | 61 | 416 | 0,525 |
| Rafael Uribe Uribe | 33 | 148 | 0,345 |

**eBC** (3 años: 2021–2023; reportado separado)

| Localidad | Sectores | Ocurrencias HH | Tasa HH |
|---|---|---|---|
| Kennedy | 61 | 152 | 0,831 |
| Fontibón | 30 | 68 | 0,756 |
| Bosa | 10 | 21 | 0,700 |
| Tunjuelito | 4 | 8 | 0,667 |
| Ciudad Bolívar | 52 | 72 | 0,462 |

### O₃ — cinco localidades con mayor tasa

**O₃** (15 años)

| Localidad | Sectores | Ocurrencias HH | Tasa HH |
|---|---|---|---|
| Usaquén | 42 | 383 | 0,608 |
| Barrios Unidos | 25 | 225 | 0,600 |
| Suba | 70 | 591 | 0,563 |
| Chapinero | 45 | 316 | 0,468 |
| Engativá | 52 | 293 | 0,376 |

---

## 7.7.3 Tabla B — Proporción de sectores con persistencia HH alta

> Umbral: ≥10 años en HH para CO, NO₂, PM₁₀, PM₂.₅, SO₂ (series de 13–15 años). eBC excluido.

| Localidad | CO | NO₂ | PM₁₀ | PM₂.₅ | SO₂ | Media |
|---|---|---|---|---|---|---|
| Kennedy | 44,3% | 65,6% | **96,7%** | **96,7%** | 24,6% | **65,6%** |
| Tunjuelito | **75,0%** | 0,0% | **75,0%** | **75,0%** | 25,0% | **50,0%** |
| Bosa | 20,0% | 0,0% | **90,0%** | **80,0%** | **50,0%** | **48,0%** |
| Ciudad Bolívar | 32,7% | 0,0% | 48,1% | 30,8% | 44,2% | 31,2% |
| Puente Aranda | 22,5% | **30,0%** | 22,5% | 25,0% | 0,0% | 20,0% |
| Fontibón | 0,0% | 13,3% | 10,0% | 16,7% | 6,7% | 10,7% |
| Rafael Uribe Uribe | 3,0% | 0,0% | 0,0% | 0,0% | 6,1% | 1,8% |

*Demás localidades: proporción persistente = 0% para todos los contaminantes primarios con este umbral.*

En Kennedy, el 96,7% de los sectores (59 de 61) tuvieron PM₁₀ en HH durante ≥10 años; el mismo porcentaje para PM₂.₅. En Bosa, el 90% de sus sectores (9 de 10) fueron HH en PM₁₀ de forma persistente. Tunjuelito, con solo 4 sectores, muestra 75% de persistencia en CO, PM₁₀ y PM₂.₅.

---

## 7.7.4 Tabla C — Población en sectores HH (año de referencia: 2018)

> Fuente: Censo 2018. Sectores con clúster HH en 2018 por contaminante. IPM en escala 0–1.

### PM₂.₅

| Localidad | Pobl. total | Pobl. en HH | % en HH | Niños 0–9 en HH | Adults. ≥60 en HH | IPM medio HH |
|---|---|---|---|---|---|---|
| Tunjuelito | 44.579 | 44.558 | **100,0** | 5.001 | 5.698 | 0,107 |
| Puente Aranda | 209.115 | 194.117 | 92,8 | 21.127 | 29.785 | 0,074 |
| Kennedy | 1.244.606 | 1.091.379 | 87,7 | 135.126 | 145.773 | 0,094 |
| Antonio Nariño | 6.613 | 5.170 | 78,2 | 551 | 888 | 0,078 |
| Los Mártires | 70.865 | 28.539 | 40,3 | 3.200 | 3.925 | 0,056 |
| Bosa | 455.814 | 109.490 | 24,0 | 16.074 | 10.620 | 0,137 |
| Ciudad Bolívar | 602.195 | 79.501 | 13,2 | 10.225 | 6.756 | 0,123 |

### PM₁₀

| Localidad | Pobl. total | Pobl. en HH | % en HH | IPM medio HH |
|---|---|---|---|---|
| Tunjuelito | 44.579 | 44.558 | **100,0** | 0,107 |
| Kennedy | 1.244.606 | 1.242.789 | **99,9** | 0,094 |
| Bosa | 455.814 | 381.311 | 83,7 | 0,134 |
| Ciudad Bolívar | 602.195 | 406.127 | 67,4 | 0,151 |
| Puente Aranda | 209.115 | 97.302 | 46,5 | 0,068 |

### NO₂

| Localidad | Pobl. total | Pobl. en HH | % en HH | IPM medio HH |
|---|---|---|---|---|
| Tunjuelito | 44.579 | 44.579 | **100,0** | 0,105 |
| Ciudad Bolívar | 602.195 | 524.746 | 87,1 | 0,174 |
| Rafael Uribe Uribe | 328.042 | 274.397 | 83,6 | 0,102 |
| Antonio Nariño | 6.613 | 5.170 | 78,2 | 0,078 |
| Kennedy | 1.244.606 | 973.804 | 78,2 | 0,092 |

### CO

| Localidad | Pobl. total | Pobl. en HH | % en HH | IPM medio HH |
|---|---|---|---|---|
| Tunjuelito | 44.579 | 44.579 | **100,0** | 0,105 |
| Ciudad Bolívar | 602.195 | 556.910 | 92,5 | 0,166 |
| Rafael Uribe Uribe | 328.042 | 290.384 | 88,5 | 0,098 |
| Antonio Nariño | 6.613 | 5.170 | 78,2 | 0,078 |
| Puente Aranda | 209.115 | 108.617 | 51,9 | 0,073 |

---

## 7.7.5 Tabla D — Ranking final por localidad (contaminantes primarios)

> Ranking compuesto: tasa HH media (30%) + proporción persistente media (25%) + % población en HH (20%) + IPM en HH (15%) + población vulnerable en HH (10%). O₃ rankeado por separado. IPM en escala 0–1.

### Ranking contaminantes primarios (CO, NO₂, PM₁₀, PM₂.₅, SO₂)

| Rango | Localidad | Tasa HH media | Prop. persist. media | % Pobl. en HH | IPM medio HH | Score |
|---|---|---|---|---|---|---|
| 1 | **Kennedy** | 0,763 | 65,6% | 77,2 | 0,094 | 0,926 |
| 2 | **Tunjuelito** | 0,647 | 50,0% | 95,8 | 0,107 | 0,780 |
| 3 | **Bosa** | 0,637 | 48,0% | 54,0 | 0,116 | 0,702 |
| 4 | **Ciudad Bolívar** | 0,433 | 31,2% | 70,0 | 0,123 | 0,604 |
| 5 | **Puente Aranda** | 0,379 | 20,0% | 51,2 | 0,074 | 0,442 |
| 6 | Fontibón | 0,302 | 10,7% | 9,8 | 0,107 | 0,314 |
| 7 | Rafael Uribe Uribe | 0,235 | 1,8% | 41,8 | 0,084 | 0,302 |
| 8 | Antonio Nariño | 0,177 | 0,0% | 46,9 | 0,078 | 0,263 |
| 9 | Los Mártires | 0,109 | 0,0% | 13,8 | 0,056 | 0,143 |
| 10–19 | (demás) | < 0,10 | 0,0% | < 10 | — | < 0,04 |

### Ranking O₃ (separado)

| Rango | Localidad | Tasa HH O₃ |
|---|---|---|
| 1 | Usaquén | 0,608 |
| 2 | Barrios Unidos | 0,600 |
| 3 | Suba | 0,563 |
| 4 | Chapinero | 0,468 |
| 5 | Engativá | 0,376 |
| 6 | Teusaquillo | 0,323 |
| 7 | Fontibón | 0,196 |

---

## 7.7.6 Síntesis narrativa

### Patrones en contaminantes primarios

**Kennedy** encabeza el ranking normalizado con una tasa HH media de 0,763 sobre los cinco contaminantes primarios. La persistencia estructural se confirma: el 96,7% de sus sectores tuvieron PM₁₀ en HH durante al menos 10 de los 15 años disponibles, y el mismo porcentaje para PM₂.₅. En 2018, el 87,7% de su población (≈1,09 millones) residía en sectores HH de PM₂.₅, y el 99,9% en sectores HH de PM₁₀. El IPM promedio en esos sectores es 0,094.

**Tunjuelito** emerge con especial fuerza al normalizar. Con solo 4 sectores, muestra una tasa HH de 0,700 para CO, 0,783 para PM₁₀ y el 95,8% de su población en sectores HH en 2018. La proporción de persistencia (75% para CO, PM₁₀ y PM₂.₅) es comparable a la de localidades mucho mayores. Tunjuelito ocupa el segundo lugar en el ranking normalizado pese a su escasa representación en los conteos absolutos.

**Bosa** registra la tercera posición con tasa media 0,637: 0,907 para PM₁₀ y 0,760 para PM₂.₅. El 90% de sus sectores tienen PM₁₀ persistente (≥10 años), y el 83,7% de su población (≈381.000 hab.) residía en sectores HH de PM₁₀ en 2018. Su IPM promedio en sectores HH de PM₁₀ es 0,134, el más alto del grupo para ese contaminante.

**Ciudad Bolívar** (cuarto) no domina en ningún contaminante individual; su tasa más alta corresponde a SO₂ (0,624), diferenciándose del resto del grupo. Combina exposición múltiple con el IPM más alto entre las cinco primeras localidades (0,123 en sectores HH de PM₂.₅). En 2018, el 87,1% de su población residía en sectores HH de NO₂ y el 92,5% en HH de CO.

**Puente Aranda** (quinto) destaca en NO₂ (tasa 0,608) y PM₂.₅ (0,472). El 30% de sus sectores tienen NO₂ persistente ≥10 años, segunda posición solo detrás de Kennedy. Su IPM promedio en sectores HH es el más bajo del grupo (0,074), lo que contrasta con las demás localidades críticas.

**Fontibón** (sexto) muestra su valor más alto en eBC (tasa 0,756) y NO₂ (0,526). El porcentaje de población en HH es bajo en términos medios (9,8% para PM₂.₅ en 2018), lo que contrasta con su posición cuando se compara en conteos absolutos sin normalizar.

**Rafael Uribe Uribe** (séptimo) aparece en SO₂ (0,345) y CO (0,238). En 2018, el 88,5% de su población estuvo en sectores HH de CO y el 83,6% en HH de NO₂; su relevancia en cuanto a exposición poblacional supera lo que sugieren sus tasas agregadas.

### El patrón de O₃: localidades del norte y nor-occidente

Las localidades con mayor tasa HH en O₃ son Usaquén (0,608), Barrios Unidos (0,600), Suba (0,563) y Chapinero (0,468). Estas mismas localidades tienen tasas bajas o nulas en contaminantes primarios. El patrón es complementario: zonas con alta exposición a PM₂.₅ y PM₁₀ tienden a tener baja exposición a O₃, y viceversa, lo cual es consistente con la química troposférica del ozono.

### Diferencia entre contaminantes primarios y O₃

Los contaminantes primarios muestran HH concentrado en el suroccidente/occidente (Kennedy, Tunjuelito, Bosa, Ciudad Bolívar, Puente Aranda). El O₃ presenta el patrón inverso, con exposición alta en norte y nor-occidente. Ambos patrones son estructurales —tasas HH > 0,4 en las localidades líderes durante 13–15 años— y no responden a episodios puntuales.

### Sobre las causas: hipótesis territoriales para la discusión

Los patrones observados son consistentes con hipótesis sobre fuentes y dinámicas territoriales que deberán contrastarse con datos de inventarios de emisiones, movilidad o uso del suelo:

- La alta tasa HH de eBC en Fontibón y Kennedy podría estar asociada a proximidad a operaciones aeroportuarias y logísticas (eBC como marcador de combustión diésel). *Hipótesis territorial, pendiente de contraste.*
- La dominancia del SO₂ en Ciudad Bolívar respecto al resto de localidades HH es compatible con fuentes de combustión de baja calidad o actividades extractivas en la periferia sur. *Hipótesis territorial, pendiente de contraste.*
- El bajo rendimiento en contaminantes primarios de la ladera oriental (San Cristóbal, Usme, Santa Fe) es consistente con menor actividad industrial-vial y posibles efectos de dispersión topográfica. *Hipótesis territorial, pendiente de contraste.*

---

## 7.7.7 Análisis de discriminación por quintiles de IPM

### Definición y objetivo

Para evaluar si la exposición a clústeres HH varía según el nivel de pobreza de los sectores —y en qué magnitud—, se calcula para cada (contaminante, año) la tasa de ocurrencia HH por quintil de IPM y el **ratio de exposición** respecto al quintil Q1 (base = sectores menos pobres):

$$\text{ratio}_{q,p,t} = \frac{\text{tasa\_HH}_{q,p,t}}{\text{tasa\_HH}_{Q1,p,t}}$$

Un ratio > 1 indica que los sectores del quintil $q$ tienen mayor probabilidad de estar en clúster HH que los sectores de menor pobreza (Q1). Un ratio < 1 indica lo contrario.

### Ratios medios por quintil y contaminante (promediados en todos los años)

| Quintil | IPM medio | CO | NO₂ | PM₁₀ | PM₂.₅ | SO₂ | O₃ | eBC |
|---|---|---|---|---|---|---|---|---|
| Q1 (base) | 0,027 | 1,00 | 1,00 | 1,00 | 1,00 | 1,00 | 1,00 | 1,00 |
| Q2 | 0,054 | 1,37 | 1,38 | 1,62 | 1,50 | 1,53 | 0,94 | 2,17 |
| Q3 | 0,082 | 2,20 | 1,72 | 2,56 | 2,31 | 3,48 | 0,86 | 2,95 |
| Q4 | 0,122 | 1,91 | 1,30 | 2,59 | 2,09 | **5,18** | 0,68 | **3,22** |
| Q5 (más pobre) | 0,230 | 1,25 | 0,84 | 1,76 | 1,32 | **5,02** | 0,34 | 2,27 |

### Tasa HH media por quintil y contaminante

| Quintil | CO | NO₂ | PM₁₀ | PM₂.₅ | SO₂ | O₃ | eBC |
|---|---|---|---|---|---|---|---|
| Q1 | 0,152 | 0,212 | 0,109 | 0,131 | 0,082 | 0,380 | 0,107 |
| Q2 | 0,186 | 0,277 | 0,173 | 0,189 | 0,113 | 0,325 | 0,224 |
| Q3 | 0,261 | 0,329 | 0,272 | 0,292 | 0,239 | 0,227 | 0,286 |
| Q4 | 0,219 | 0,236 | 0,275 | 0,250 | 0,303 | 0,158 | 0,299 |
| Q5 | 0,142 | 0,158 | 0,188 | 0,158 | 0,273 | 0,067 | 0,203 |

### Ratio de PM₂.₅ por quintil y año (evolución temporal)

| Año | Q1 | Q2 | Q3 | Q4 | Q5 |
|---|---|---|---|---|---|
| 2010 | 1,00 | 1,41 | 2,15 | 1,81 | 1,15 |
| 2011 | 1,00 | 1,32 | 1,92 | 1,67 | 1,14 |
| 2012 | 1,00 | 1,77 | 2,34 | 2,68 | 1,75 |
| 2013 | 1,00 | 2,00 | 2,84 | 3,79 | 2,17 |
| 2014 | 1,00 | 1,62 | 2,29 | 2,18 | 1,42 |
| 2015 | 1,00 | 1,43 | 2,39 | 2,63 | 2,17 |
| 2016 | 1,00 | 1,66 | 2,71 | 2,81 | 2,35 |
| 2017 | 1,00 | 1,04 | 1,66 | 1,18 | 0,72 |
| 2018 | 1,00 | 1,18 | 1,94 | 1,30 | 0,69 |
| 2019 | 1,00 | 1,31 | 1,97 | 1,54 | 0,95 |
| 2020 | 1,00 | 1,58 | 1,98 | 1,13 | 0,63 |
| 2021 | 1,00 | 1,18 | 1,62 | 0,70 | 0,54 |
| 2022 | 1,00 | 1,56 | 2,94 | 2,33 | 1,51 |
| 2023 | 1,00 | 1,77 | 3,12 | 3,31 | 1,58 |
| 2024 | 1,00 | 1,64 | 2,83 | 2,34 | 1,01 |

### Ratio de NO₂ por quintil y año

| Año | Q1 | Q2 | Q3 | Q4 | Q5 |
|---|---|---|---|---|---|
| 2010 | 1,00 | 0,95 | 1,18 | 0,63 | 0,42 |
| 2013 | 1,00 | 1,19 | 1,68 | 0,94 | 0,67 |
| 2014 | 1,00 | 0,97 | 1,07 | 0,46 | 0,45 |
| 2015 | 1,00 | 1,38 | 1,60 | 1,32 | 0,67 |
| 2016 | 1,00 | 1,53 | 1,79 | 1,30 | 0,87 |
| 2017 | 1,00 | 1,02 | 0,99 | 0,85 | 0,67 |
| 2018 | 1,00 | 1,38 | 2,86 | 2,69 | 1,63 |
| 2019 | 1,00 | 2,23 | 3,05 | 2,60 | 1,58 |
| 2020 | 1,00 | 1,18 | 1,91 | 1,93 | 0,96 |
| 2021 | 1,00 | 1,80 | 1,73 | 1,26 | 0,65 |
| 2022 | 1,00 | 1,48 | 1,55 | 1,02 | 0,85 |
| 2023 | 1,00 | 1,35 | 1,45 | 0,94 | 0,75 |
| 2024 | 1,00 | 1,50 | 1,48 | 0,94 | 0,77 |

### Interpretación de los patrones por quintil

**Patrón no monótono para contaminantes primarios**

El hallazgo más relevante del análisis por quintiles es que la exposición no aumenta de forma lineal con la pobreza. Para PM₂.₅, PM₁₀, CO, NO₂ y eBC, el ratio máximo se concentra en Q3 y Q4 —los quintiles de pobreza media-alta (IPM 0,067–0,152)—, no en Q5 (el más pobre, IPM > 0,153). Los sectores del Q5 tienen, en muchos años y contaminantes, ratios inferiores a los de Q3 y Q4, y en varios casos inferiores a 1 (menores que Q1).

Este patrón es consistente con la distribución espacial de la pobreza en Bogotá: los sectores del Q5 se concentran en la periferia sur (Ciudad Bolívar rural, Usme alta, Sumapaz), zonas que frecuentemente muestran clústeres LL o NS en contaminantes primarios, pese a ser las más pobres. Los sectores con mayor exposición HH son los de pobreza media-alta (Q3–Q4) ubicados en las zonas urbanas densas del suroccidente (Kennedy urbano, Tunjuelito, Bosa, periurbano de Ciudad Bolívar). Este resultado sugiere que **la pobreza urbana consolidada —no la pobreza periférica— es la que se superpone en mayor medida con la exposición a contaminantes primarios**.

**SO₂ y eBC: los gradientes más pronunciados**

SO₂ presenta los ratios más extremos del análisis. Los sectores Q4 tienen en promedio 5,18 veces la tasa HH de los sectores Q1, y los Q5 tienen 5,02 veces. A diferencia de otros contaminantes, la desigualdad en SO₂ mantiene valores altos incluso en Q5, lo que indica que este contaminante no responde al patrón "urban poor periferia = LL". eBC también muestra ratios elevados en Q3–Q4 (2,95 y 3,22 respectivamente), lo cual es relevante dado que solo se dispone de 3 años de datos.

**O₃: desigualdad inversa y más robusta**

El ozono presenta el patrón opuesto con mayor consistencia: el ratio disminuye monótonamente de Q1 a Q5 en promedio. Los sectores Q1 (menos pobres) tienen la mayor tasa HH de O₃ (0,380), mientras que los Q5 tienen apenas 0,067. El ratio Q5/Q1 es 0,34, indicando que los sectores más pobres tienen solo un tercio de la probabilidad de estar en HH de O₃ respecto a los más ricos. Esta desigualdad inversa es la más estable en el tiempo de todas las observadas.

**Variación temporal**

Los ratios no son constantes en el tiempo. Para PM₂.₅, los años 2013, 2016 y 2022–2023 muestran los mayores gradientes Q3/Q1 (> 2,7), mientras que 2017–2021 presentan diferencias menores. Para NO₂, la variación interanual es considerable: en 2010 el ratio Q4 es solo 0,63 (los sectores Q4 tienen menor tasa HH que Q1), mientras que en 2018–2019 supera 2,6. Esta variabilidad sugiere que la desigualdad en la exposición no es un rasgo perfectamente estable sino modulado por factores que varían interanualmente (condiciones meteorológicas, cambios en el parque automotor, reorganización de actividades productivas), cuyo análisis detallado excede el alcance de este trabajo.

### Figuras recomendadas para esta sección

- **Figura 7.7.e** — Gráfico de líneas: ratio HH por quintil (eje y) para cada contaminante primario (una línea por quintil, eje x = año). Permite visualizar la variación temporal de la desigualdad.
- **Figura 7.7.f** — Heatmap: ratio medio Q3/Q1 y Q5/Q1 por contaminante (filas) y quintil (columnas). Síntesis visual del patrón no monótono.
- **Figura 7.7.g** — Mapa coroplético: quintil IPM por sector censal, superpuesto con contorno de zonas HH persistentes.

---

## 7.7.8 Figuras y tablas recomendadas (sección completa)

1. **Figura 7.7.a** — Mapa coroplético: tasa HH de PM₂.₅ por localidad.
2. **Figura 7.7.b** — Mapa coroplético: tasa HH de O₃ por localidad (contraste norte/sur).
3. **Figura 7.7.c** — Barras apiladas: proporción de sectores persistentes por localidad y contaminante (solo localidades con proporción > 0).
4. **Figura 7.7.d** — Scatter: tasa HH primarios (x) vs. IPM promedio en HH (y), tamaño = población total.
5. **Figura 7.7.e** — Líneas: ratio HH por quintil y año, para PM₂.₅ y SO₂.
6. **Figura 7.7.f** — Heatmap: ratio medio por contaminante y quintil.
7. **Figura 7.7.g** — Mapa: quintil IPM por sector, con superposición de sectores HH persistentes.
8. **Tabla 7.7.A** — Tasa HH por localidad y contaminante (completa, 19 × 7).
9. **Tabla 7.7.B** — Proporción persistente por localidad y contaminante.
10. **Tabla 7.7.C** — Población en HH en 2018 (PM₂.₅ y PM₁₀).
11. **Tabla 7.7.D** — Ranking normalizado final.
12. **Tabla 7.7.E** — Ratio HH por quintil, contaminante y año (datos completos).
13. **Tabla 7.7.F** — Resumen ratio medio por quintil y contaminante.

---

*Archivos CSV de respaldo:*
- `tablaQ0_rangos_quintiles_ipm.csv`
- `tablaA_tasa_HH_por_localidad_contaminante.csv`
- `tablaB_proporcion_persistente_por_localidad_contaminante.csv`
- `tablaC_poblacion_en_HH_2018.csv`
- `tablaD_ranking_normalizado_localidades.csv`
- `tablaE_ratio_HH_quintil_contaminante_ano.csv`
- `tablaF_resumen_ratio_quintil_contaminante.csv`
- `tabla_descriptiva_localidades.csv`
