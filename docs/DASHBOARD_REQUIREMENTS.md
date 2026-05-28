# Dashboard Requirements

## Functional Requirements

### 1. User Initialization

When the user opens the dashboard:
- [ ] Map is centered on Bogotá
- [ ] All Bogotá census sectors are visible
- [ ] Selected pollutant is PM2.5
- [ ] Selected year is 2018
- [ ] No sector is selected by default
- [ ] Detail panel shows empty state with invitation to select

### 2. Pollutant Selection

When user clicks a pollutant tab:
- [ ] A smooth smoke/blur transition appears
- [ ] Transition lasts 700-1500ms
- [ ] Map colors update based on new pollutant
- [ ] Legend updates to show new pollutant scale
- [ ] Year remains the same
- [ ] Selected sector remains selected (if available)
- [ ] Transition is elegant and institutional (no cartoonish effects)

Available pollutants:
- PM2.5
- PM10
- NO2
- SO₂
- CO
- O₃
- Black Carbon

### 3. Year Selection

When user selects a year:
- [ ] Year tab highlights
- [ ] Map colors update immediately (no transition needed)
- [ ] Legend updates if ranges change
- [ ] Concentration values in detail panel update
- [ ] Sociodemographic variables stay the same (constant across years)
- [ ] Selected sector stays selected

Available years: 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018

Default year: 2018

### 4. Map Interaction

#### Viewing
- [ ] User can zoom with mouse wheel
- [ ] User can pan by dragging
- [ ] User can zoom out to see broader Colombia context
- [ ] Initial view shows all of Bogotá

#### Hover
- [ ] Hovering over a sector shows a tooltip with:
  - Sector name
  - SETU_CCNCT identifier
  - Current pollutant concentration
  - Concentration label (Muy bajo, Bajo, Moderado, Alto, Muy alto)
- [ ] Hover state is visually distinct

#### Click
- [ ] Clicking a sector selects it
- [ ] Selected sector is highlighted with stronger border
- [ ] Selection is persistent until deselected
- [ ] Detail panel updates immediately
- [ ] Multiple clicks on same sector deselect it

### 5. Detail Panel

When sector is selected, panel shows:
- [ ] Sector name
- [ ] SETU_CCNCT identifier
- [ ] Current pollutant concentration (large, prominent)
- [ ] Measurement unit
- [ ] Year of data
- [ ] Total population (large number, formatted)
- [ ] Age distribution with visual bars:
  - 0-9 years with count and percentage
  - 10-19 years with count and percentage
  - 20-59 years with count and percentage
  - 60+ years with count and percentage
- [ ] Socioeconomic stratum (readable label)
- [ ] IPM average value
- [ ] Close button to deselect

When no sector is selected, panel shows:
- [ ] Empty state message
- [ ] Icon or visual placeholder
- [ ] Invitation to click on a sector
- [ ] No error messages

### 6. Legend

The legend shows:
- [ ] Currently selected pollutant name
- [ ] Color scale with 6-8 color ranges
- [ ] Break points for each color
- [ ] Measurement unit
- [ ] Missing data indicator (light gray)
- [ ] Updates when pollutant or year changes
- [ ] Is positioned below the map in left sidebar

### 7. Header

The header includes:
- [ ] Dashboard title: "Dashboard Geoespacial de Calidad del Aire en Bogotá"
- [ ] Subtitle: "Concentraciones anuales por sector censal y variables sociodemográficas"
- [ ] Currently selected pollutant name/badge
- [ ] Currently selected year display
- [ ] All pollutant tabs (not dropdown)
- [ ] All year tabs (not dropdown)
- [ ] "Centrar Bogotá" button to return map to initial view

### 8. Missing Data Handling

- [ ] Sectors with missing pollutant data are shown in light gray
- [ ] Missing values don't break the map rendering
- [ ] Detail panel shows "Sin dato" when concentration is missing
- [ ] Users can still interact with sectors even if data is missing
- [ ] Legend includes missing data explanation

### 9. Navigation

- [ ] "Centrar Bogotá" button centers and zooms the map to show all Bogotá
- [ ] Works from any map position or zoom level
- [ ] Is clearly visible and accessible
- [ ] Button has hover state indicating interactivity

### 10. Responsiveness

- [ ] Dashboard works on desktop (1920x1080+)
- [ ] Dashboard works on tablet (768px+)
- [ ] Dashboard works on smaller screens (with layout adjustments)
- [ ] Touch interactions work on mobile
- [ ] No horizontal scrolling on any screen size

## UI/UX Requirements

### Visual Style

- [ ] Clean, white background
- [ ] Soft gray surfaces and borders
- [ ] Soft blue-gray or muted pastel accents
- [ ] No neon or saturated colors
- [ ] No emojis
- [ ] No childish or playful visuals
- [ ] Premium, institutional appearance
- [ ] Similar to modern iOS interface
- [ ] Elegant and lightweight feel

### Typography

- [ ] Clear, readable fonts
- [ ] System fonts (Apple font stack)
- [ ] Strong visual hierarchy
- [ ] Appropriate font sizes
- [ ] Proper contrast ratios (WCAG AA minimum)

### Shapes and Spacing

- [ ] Large border radius (24-32px) for main containers
- [ ] Pill-shaped buttons and tabs (border-radius: 999px)
- [ ] No rigid rectangular blocks
- [ ] Generous whitespace
- [ ] Consistent padding and margins
- [ ] Soft shadows for depth
- [ ] Subtle borders (light gray)

### Animations and Transitions

- [ ] Smoke transition between pollutants (700-1500ms)
- [ ] Smooth hover states for buttons and tabs
- [ ] Smooth selected states for tabs
- [ ] Fade transitions for panels
- [ ] Subtle scale animations on interaction
- [ ] Loading spinner for data fetching
- [ ] No excessive or distracting animations

### Components

- **Header**: Full-width, white background, border-bottom
- **Map**: Central protagonist, large and prominent
- **Tabs**: Pill-shaped, with active/inactive states
- **Buttons**: Pill-shaped, with hover effects
- **Cards**: Rounded corners (24px+), soft shadows
- **Detail Panel**: Scroll-able, organized sections
- **Legend**: Compact, positioned below map

## Technical Requirements

### Performance

- [ ] Initial page load < 3 seconds
- [ ] Map renders all sectors without lag
- [ ] Tab switching is instant
- [ ] No unnecessary re-renders
- [ ] Smooth 60fps animations
- [ ] Minimal memory usage

### Compatibility

- [ ] Works in Chrome/Edge 90+
- [ ] Works in Firefox 88+
- [ ] Works in Safari 14+
- [ ] Works on mobile browsers
- [ ] No console errors
- [ ] No deprecated APIs

### Code Quality

- [ ] TypeScript with strict mode
- [ ] No `any` types
- [ ] All types properly defined
- [ ] Clean component structure
- [ ] Reusable utility functions
- [ ] Clear comments on complex logic
- [ ] No hardcoded values (use constants)
- [ ] Proper error handling

### Build

- [ ] `npm install` succeeds without errors
- [ ] `npm run dev` starts server on port 3000
- [ ] `npm run build` creates optimized dist/ folder
- [ ] No build warnings or errors
- [ ] Vite config properly set up

## Data Requirements

### Sectors

- [ ] Each sector has a unique SETU_CCNCT identifier
- [ ] Each sector has valid polygon geometry
- [ ] Each sector has demographic data (population, age groups)
- [ ] Each sector has socioeconomic variables (stratum, IPM)

### Concentrations

- [ ] Available for all 9 years (2010-2018)
- [ ] Available for all 7 pollutants
- [ ] Numeric values or null (for missing)
- [ ] Measurement units specified
- [ ] Can join to sectors via SETU_CCNCT

### Sociodemographics

- [ ] Join key: SETU_CCNCT
- [ ] All required fields present
- [ ] Age groups sum to total population (approximately)
- [ ] IPM values between 0-1
- [ ] Stratum values 1-6

## Functional Rules

### State Management

- [ ] selectedPollutant starts as "PM2.5"
- [ ] selectedYear starts as 2018
- [ ] selectedSector starts as null
- [ ] availableYears = [2010, 2011, ..., 2018]
- [ ] availablePollutants = [PM2.5, PM10, NO2, SO₂, CO, O₃, Black Carbon]

### Transitions

- [ ] When pollutant changes: show smoke transition, then update map
- [ ] When year changes: just update map colors (no transition)
- [ ] When sector changes: highlight in detail panel

### Data Integrity

- [ ] Do not mix years incorrectly
- [ ] Do not change sociodemographic values by year
- [ ] Do not present mock data as real
- [ ] Do not invent concentration values

## Things NOT to Do

- [ ] ❌ Use monitoring stations as main concept
- [ ] ❌ Build a station-based dashboard
- [ ] ❌ Use emojis anywhere
- [ ] ❌ Use childish or playful design
- [ ] ❌ Use strong neon colors
- [ ] ❌ Use saturated colors
- [ ] ❌ Create basic square tabs
- [ ] ❌ Use dropdown for pollutant selection
- [ ] ❌ Use basic dropdown for year selection
- [ ] ❌ Include years after 2018
- [ ] ❌ Mix years incorrectly in displays
- [ ] ❌ Change demographic values by year
- [ ] ❌ Invent data values and claim they're real
- [ ] ❌ Leave as static mockup only
- [ ] ❌ Create Lovable-specific files
- [ ] ❌ Reference Lovable in code or documentation

## Success Criteria

The dashboard is considered complete when:

1. ✅ It visually matches the institutional, premium iOS style
2. ✅ All functional requirements are met
3. ✅ Mock data loads and displays correctly
4. ✅ Map interaction works smoothly
5. ✅ Transitions are elegant and performant
6. ✅ No TypeScript errors
7. ✅ No build errors
8. ✅ Runs locally with `npm run dev`
9. ✅ Builds successfully with `npm run build`
10. ✅ Documentation is complete and accurate
11. ✅ Ready to connect real data by updating data loading functions
12. ✅ Can be deployed to production easily

---

For implementation details, see PROJECT_GUIDE.md
For data structure, see DATA_STRUCTURE.md
