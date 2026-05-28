# Project Guide

## Overview

This guide explains how the Air Pollution Dashboard is organized, what each part does, and where to make changes.

## Project Structure

```
src/
├── components/          # React components
├── data/               # Data loading and mock data
├── types/              # TypeScript interfaces
├── utils/              # Utility functions
├── App.tsx             # Main app component
├── main.tsx            # Entry point
└── index.css           # Global styles
```

## Component Architecture

### Hierarchy

```
App (Main component with state management)
└── AppLayout (Main layout)
    ├── DashboardHeader (Tabs and controls)
    │   ├── PollutantTabs
    │   └── YearTabs
    ├── GeoMap (Interactive map)
    │   └── GeoJSONLayer (per sector)
    ├── SectorDetailPanel (Right sidebar)
    └── Legend (Below map)

Plus overlays:
- SmokeTransition (Pollutant change animation)
- LoadingState (Initial data load)
- EmptyState (No sector selected)
```

### Component Responsibilities

#### App.tsx
**Purpose**: Main application component, state management

**State manages**:
- `sectors` - All census sector features
- `concentrations` - All pollutant concentration records
- `selectedPollutant` - Currently selected pollutant (PM2.5, etc.)
- `selectedYear` - Currently selected year (2010-2018)
- `selectedSector` - Currently selected sector details
- `isTransitioning` - Whether smoke transition is active
- `loading` - Whether data is loading

**Key functions**:
- `loadData()` - Loads sectors and concentrations
- `handlePollutantChange()` - Changes pollutant with transition
- `handleYearChange()` - Changes year
- `handleSectorSelect()` - Selects a sector
- `handleSectorDeselect()` - Deselects sector

**Update frequency**: Every interaction with tabs or map

#### AppLayout.tsx
**Purpose**: Main layout structure combining all components

**Props**: 
- All dashboard data and state
- All state handlers
- Transition state

**Layout**: 3-column responsive grid
- Left: Map + Legend
- Right: Detail panel
- Top: Header

#### DashboardHeader.tsx
**Purpose**: Header with title, controls, and buttons

**Contains**:
- Dashboard title and description
- PollutantTabs component
- YearTabs component
- "Centrar Bogotá" button

**Props**:
- `selectedPollutant` / `onPollutantChange`
- `selectedYear` / `onYearChange`
- `onCenterBogota`

#### PollutantTabs.tsx
**Purpose**: Premium iOS-style pill tabs for pollutant selection

**Displays**: All available pollutants
- PM2.5, PM10, NO2, SO₂, CO, O₃, Black Carbon

**Interaction**:
- Click selects pollutant
- Active state shows dark background
- Inactive state shows light background with border

**Styling**:
- Rounded pill shape (border-radius: 999px)
- Smooth hover and active states
- Shadow on active

#### YearTabs.tsx
**Purpose**: Compact year selector tabs

**Displays**: Years 2010-2018 (all 9 years)

**Interaction**:
- Click selects year
- Visual feedback for selection

#### GeoMap.tsx
**Purpose**: Interactive Leaflet map showing census sectors

**Features**:
- OpenStreetMap base layer
- GeoJSON layers for each sector
- Color-coded by concentration
- Hover tooltip with info
- Click to select
- Initial center on Bogotá

**Data displayed**:
- Sector boundaries (polygons)
- Sector names
- Current pollutant concentration
- Color based on concentration level

**Interaction**:
- Zoom with mouse wheel
- Pan by dragging
- Hover shows tooltip
- Click selects sector

#### SectorDetailPanel.tsx
**Purpose**: Right sidebar showing selected sector details

**When selected, shows**:
- Sector name and SETU_CCNCT
- Current pollutant concentration (large)
- Total population
- Age distribution with visual bars
- Socioeconomic stratum
- IPM value
- Close button

**When empty, shows**:
- Empty state with icon
- Message inviting sector selection

#### Legend.tsx
**Purpose**: Color scale legend for current pollutant

**Shows**:
- Pollutant name
- Measurement unit
- Color scale breaks
- Label for each color range
- Missing data indicator

**Updates**: When pollutant or year changes

#### SmokeTransition.tsx
**Purpose**: Elegant smoke/blur effect during pollutant change

**Features**:
- Semi-transparent overlay
- Blur effect
- Floating mist particles
- Smooth animation
- 700-1500ms duration

#### LoadingState.tsx
**Purpose**: Shows loading spinner while data loads

**Features**:
- Rotating spinner
- "Cargando datos..." message
- Centered on screen
- Fade animation

#### EmptyState.tsx
**Purpose**: Shows when no sector is selected

**Features**:
- Icon
- Descriptive message
- Tags showing available features
- Encourages interaction

## Data Flow

```
User opens app
    ↓
App loads sectors and concentrations
    ↓
LoadingState shown while loading
    ↓
Render AppLayout with loaded data
    ↓
User interacts with tabs/map
    ↓
State updates
    ↓
Components re-render based on new state
```

## State Management

All state is managed in `App.tsx`. Components receive:
- Current state values
- Handler functions to update state

Pattern:
```typescript
// In App.tsx
const [selectedPollutant, setSelectedPollutant] = useState<Pollutant>('PM2.5');

const handlePollutantChange = (pollutant: Pollutant) => {
  // ... logic ...
  setSelectedPollutant(pollutant);
};

// Pass to child component
<AppLayout
  selectedPollutant={selectedPollutant}
  onPollutantChange={handlePollutantChange}
  // ...
/>

// In child component
<PollutantTabs
  selected={selectedPollutant}
  onChange={onPollutantChange}
/>
```

## Utility Functions

### dataUtils.ts
**Purpose**: Data loading and processing

**Key functions**:
- `loadSectors()` - Load sector GeoJSON
- `loadConcentrations()` - Load concentration data
- `getSectorData()` - Get detailed data for one sector
- `getConcentration()` - Get value for sector/pollutant/year
- `getConcentrationRange()` - Get min/max for scale
- `convertGeoJSONFeature()` - Transform raw GeoJSON
- `convertConcentrationRecord()` - Transform raw data
- `isMissingData()` - Check if value is null

**Usage**:
```typescript
const sectors = await loadSectors();
const concentration = getConcentration(setuCcnct, 'PM2.5', 2018, allConcentrations);
```

### colorScales.ts
**Purpose**: Color mapping for concentration values

**Key functions**:
- `getColorScale(pollutant)` - Get scale info for pollutant
- `getColorForConcentration(pollutant, value)` - Get color hex
- `getConcentrationLabel(pollutant, value)` - Get "Muy alto", etc.

**Usage**:
```typescript
const color = getColorForConcentration('PM2.5', 28.5); // Returns hex color
const label = getConcentrationLabel('PM2.5', 28.5); // Returns "Muy alto"
```

### formatters.ts
**Purpose**: Text formatting for display

**Key functions**:
- `formatNumber(value, decimals)` - Format float
- `formatLargeNumber(value)` - Add thousand separators
- `formatConcentrationWithUnit(value, pollutant)` - Format with unit
- `formatIPM(value)` - Format poverty index
- `getStratumName(stratum)` - Get readable stratum label
- `calculateAgePercentage(group, total)` - Calculate %

**Usage**:
```typescript
const text = formatLargeNumber(15000); // "15,000"
const label = getStratumName("2"); // "Estrato 2 (Bajo)"
```

## Type Definitions

All types are in `src/types/dashboard.ts`:

- `Pollutant` - Union type of all pollutants
- `Year` - Union type of available years
- `SectorFeature` - Census sector with geometry
- `SectorDemographics` - Population data
- `PollutantConcentration` - Year/pollutant value
- `SelectedSector` - Sector with all its data
- `ColorScale` - Color mapping definition
- `DashboardState` - All dashboard state
- `MapBounds` - Map position info

**Usage**:
```typescript
import { Pollutant, Year, SectorFeature } from './types/dashboard';

const pollutant: Pollutant = 'PM2.5';
const year: Year = 2018;
const sector: SectorFeature = {
  // ...
};
```

## Mock Data

**Location**: `src/data/mockData.ts`

**Provides**:
- `MOCK_SECTORS` - 6 sample sectors with geometry
- `AVAILABLE_POLLUTANTS` - List of all pollutants
- `AVAILABLE_YEARS` - List of years
- `DEFAULT_YEAR` - Initial year (2018)
- `generateMockConcentrations()` - Creates fake data
- `getConcentrationValue()` - Get specific value

**Current data**:
- 6 census sectors with polygon coordinates
- 9 years of data
- 7 pollutants
- 1 intentional missing value

**To add more sectors**:
1. Add to `MOCK_SECTORS` array
2. Include geometry (polygon coordinates in [lon, lat] format)
3. Include all demographic fields
4. Data will auto-generate for all years/pollutants

## Styling

### Global Styles
**File**: `src/index.css`

**Includes**:
- Tailwind imports
- Global resets
- Leaflet customizations
- Smooth scrolling
- Custom scrollbar
- Animations (fadeIn, slideUp)

### Tailwind Configuration
**File**: `tailwind.config.js`

**Customizations**:
- Extended color palette (stone variations)
- Custom border radius (xl, 2xl, 3xl)
- Custom shadows (soft, md-soft, lg-soft)
- Typography plugin

### Component Styling
**Approach**: Utility-first with Tailwind

**Pattern**:
```tsx
<button className="px-4 py-2 rounded-full bg-stone-800 text-white hover:bg-stone-900">
  Click me
</button>
```

**Color palette**:
- White background
- Stone-50 to Stone-900 for different values
- Minimal accent colors

## Configuration Files

### vite.config.ts
**Purpose**: Vite build configuration

**Key settings**:
- React plugin enabled
- Dev port: 3000
- Output dir: dist
- Auto open browser on dev

**Modify** if you need different:
- Port number
- Build output location
- Environment variables

### tailwind.config.js
**Purpose**: Tailwind CSS configuration

**Customize**:
- Colors
- Border radius
- Shadows
- Typography

### tsconfig.json
**Purpose**: TypeScript configuration

**Settings**:
- Strict mode enabled
- React JSX support
- Module resolution
- No unused vars warnings

**Do not disable strict mode** - it helps catch errors

### package.json
**Purpose**: Dependencies and scripts

**Scripts**:
- `dev` - Start dev server
- `build` - Create production build
- `preview` - Preview production build
- `lint` - TypeScript check

**Dependencies**:
- React, ReactDOM
- React Leaflet, Leaflet
- Framer Motion
- Tailwind CSS

## How to Make Changes

### Change Default Pollutant

**File**: `src/App.tsx`

```typescript
// Line with selectedPollutant state
const [selectedPollutant, setSelectedPollutant] = useState<Pollutant>('PM2.5');
// Change 'PM2.5' to your choice
```

### Change Default Year

**File**: `src/data/mockData.ts`

```typescript
export const DEFAULT_YEAR: Year = 2018;
// Change to any year between 2010-2018
```

### Add a New Pollutant

1. **Add to type** (`src/types/dashboard.ts`):
```typescript
export type Pollutant = 'PM2.5' | 'PM10' | 'NO2' | 'SO₂' | 'CO' | 'O₃' | 'Black Carbon' | 'NEW_POLLUTANT';
```

2. **Add to list** (`src/data/mockData.ts`):
```typescript
export const AVAILABLE_POLLUTANTS: Pollutant[] = [
  // ... existing ...
  'NEW_POLLUTANT',
];
```

3. **Add color scale** (`src/utils/colorScales.ts`):
```typescript
'NEW_POLLUTANT': {
  pollutant: 'NEW_POLLUTANT',
  min: 0,
  max: 100,
  breaks: [10, 25, 50, 75, 100],
  unit: 'unit',
  colors: ['#e8f5e9', /* ... */],
},
```

4. **Update mock data** to include values for the new pollutant

### Add a New Year

1. **Add to type** (`src/types/dashboard.ts`):
```typescript
export type Year = 2010 | 2011 | /* ... */ | 2018 | 2019;
```

2. **Add to list** (`src/data/mockData.ts`):
```typescript
export const AVAILABLE_YEARS: Year[] = [
  2010, 2011, /* ... */, 2018, 2019
];
```

3. **Update mock data** to include concentrations for the new year

### Change Color Scheme

**File**: `src/utils/colorScales.ts`

```typescript
export function getColorScale(pollutant: Pollutant): ColorScale {
  const scales: Record<Pollutant, ColorScale> = {
    'PM2.5': {
      // Change colors array:
      colors: ['#new-color-1', '#new-color-2', /* ... */],
      // ...
    },
  };
}
```

**Color recommendations**:
- Green (#e8f5e9) for low concentrations
- Yellow (#ffd54f) for moderate
- Orange (#ff9800) for high
- Red (#e53935) for very high

### Change Map Center/Zoom

**File**: `src/components/GeoMap.tsx`

```typescript
<MapContainer
  center={[4.7111, -74.0721]} // [latitude, longitude]
  zoom={12} // Zoom level: lower = further, higher = closer
  // ...
>
```

**Bogotá coordinates**:
- Center: [4.7111, -74.0721]
- Zoom for full view: 11-12
- Initial bounds: [4.5, -74.3] to [4.9, -73.8]

### Connect Real Data

**File**: `src/utils/dataUtils.ts`

Replace the mock data loading in:
1. `loadSectors()` - Load real GeoJSON
2. `loadConcentrations()` - Load real concentrations

**Example**:
```typescript
export async function loadSectors(): Promise<SectorFeature[]> {
  const response = await fetch('/data/geo/sectores_censales_bogota.geojson');
  const geojson = await response.json();
  return geojson.features.map(convertGeoJSONFeature);
}
```

## Debugging

### Enable Browser Dev Tools

```
F12 or Right-click → Inspect
```

**Console**: Check for errors and warnings

**Network**: Verify data loads correctly

### TypeScript Errors

Run:
```bash
npm run lint
```

This will show all TypeScript errors that must be fixed before building.

### Performance Issues

- Check if map has too many sectors
- Reduce polygon complexity
- Use browser dev tools Performance tab

### Missing Data

Check:
1. SETU_CCNCT keys match between all files
2. Years are in 2010-2018 range
3. Pollutant names match exactly
4. GeoJSON is valid (use geojsonlint.com)

## Testing Locally

1. **Start dev server**:
```bash
npm run dev
```

2. **Open in browser**: http://localhost:3000

3. **Test features**:
   - Click pollutant tabs (should show transition)
   - Click year tabs (should update map)
   - Click sectors on map (should select)
   - Check detail panel updates
   - Test zoom/pan on map

4. **Check console**: Should be no errors

5. **Test production build**:
```bash
npm run build
npm run preview
```

## Deployment

### Deploy to Vercel

1. Push to GitHub
2. Go to https://vercel.com/new
3. Select repository
4. Vercel auto-detects Vite
5. Click Deploy

### Deploy to GitHub Pages

Update `package.json` and `vite.config.ts` with base path, then push to gh-pages branch.

### Deploy to other platforms

The `dist` folder is a complete static website - can be uploaded anywhere.

## Performance Tips

1. **Reduce sectors**: If map is slow, use fewer mock sectors
2. **Simplify geometry**: Reduce decimal places in coordinates
3. **Lazy load**: Components already use React.lazy pattern
4. **Cache data**: Browser caches static files automatically
5. **Compress**: Enable gzip on your hosting

## Common Issues and Solutions

| Issue | Solution |
|-------|----------|
| Map doesn't appear | Check Leaflet CSS import in index.css |
| Data not showing | Verify SETU_CCNCT matches across files |
| Slow performance | Reduce number of sectors or simplify geometry |
| TypeScript errors | Run `npm run lint` to see all errors |
| Styles look wrong | Clear browser cache (Ctrl+Shift+Del) |
| Build fails | Check node version (16+), delete node_modules, npm install |

## Next Steps

1. Install dependencies: `npm install`
2. Run locally: `npm run dev`
3. Explore the dashboard
4. Try changing configuration values
5. When ready, connect real data
6. Deploy to production

---

For requirements details, see DASHBOARD_REQUIREMENTS.md
For data structure, see DATA_STRUCTURE.md
For main README, see ../README.md
