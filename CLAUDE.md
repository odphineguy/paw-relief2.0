# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Paw Relief is a React-based mobile web application for tracking dog allergies, symptoms, medications, and environmental allergens. The app helps pet owners manage their dog's health by logging symptoms, tracking triggers, scanning food ingredients, and monitoring local allergen levels.

## Development Commands

```bash
npm install              # Install dependencies
npm run dev             # Start development server (runs on https://localhost:3000)
npm run build           # Build for production
npm run preview         # Preview production build
```

**Important:** Development server runs on HTTPS (port 3000) to support camera/geolocation APIs required for barcode scanning and location-based allergen alerts.

## Architecture

### Data Flow & State Management

**Context Providers** (App.tsx wraps everything):
- `ThemeProvider` - Manages light/dark mode (persisted to localStorage)
- `DogProvider` - Central state for dogs, selected dog, and CRUD operations

**DogContext Pattern:**
- Single source of truth for all dog data
- Automatically selects first dog on initial load
- All pages access via `const { selectedDog, dogs, addDog } = useDogs()`
- `selectedDog` determines what data is shown across all pages

**Data Persistence:**
- Backend: Supabase PostgreSQL database
- All CRUD operations in `services/api.ts`
- Database uses snake_case, app uses camelCase (mapping in api.ts)
- Current user: Hardcoded temporary user ID (`00000000-0000-0000-0000-000000000001`) until auth is implemented

### Key Database Schema Mappings

```
Database (snake_case)  →  TypeScript (camelCase)
user_id                →  userId
photo_url              →  photoUrl
known_allergies        →  knownAllergies
created_at             →  createdAt
```

### Page Architecture

**Main Navigation Pages** (BottomNav):
1. **Dashboard** - Overview with symptom distribution chart, recent symptoms, reminders
2. **Logs** - Symptom history with filtering and charts
3. **Meds** - Medication/treatment reminders with toggle completion
4. **Profile** - Dog profile, settings, barcode scanner

**Key Sub-Pages:**
- **TriggerDetective** (`/trigger-detective`) - Log triggers and view patterns chart
- **TriggerAnalysis** (`/trigger-analysis`) - Detailed trigger breakdown with percentages
- **AllergenAlerts** (`/allergen-alerts`) - Location-based allergen info with map
- **CreateDogProfile** (`/create-dog-profile`) - Manage multiple dog profiles

**Routing:**
- Uses HashRouter for GitHub Pages compatibility
- Mobile-first design (max-width: 448px container)
- All routes defined in App.tsx

### External APIs & Services

**Barcode Scanner:**
- Library: `html5-qrcode` for camera access
- First checks local Supabase cache
- Falls back to OpenFoodFacts API (free, no key needed)
- Caches results to local database

**Allergen Alerts:**
- Geolocation API for user location
- BigDataCloud for reverse geocoding (city name)
- Open-Meteo for weather and air quality (free, no key needed)
- Pollen levels estimated from AQI data

**Static Maps:**
- MapBox Static API (using public demo token)
- Fallback to OpenStreetMap tiles on error

### Component Organization

**Shared Components** (`components/`):
- `icons.tsx` - All SVG icons exported as React components
- `BottomNav.tsx` - Persistent bottom navigation
- `Header.tsx` - Page headers with back button
- `BarcodeScannerModal.tsx` - Camera-based barcode scanner
- `SymptomLoggerModal.tsx` - Modal for logging symptoms (no triggers currently)
- `TriggerLoggerModal.tsx` - Modal for logging standalone triggers
- `ThemeSwitch.tsx` - Dark mode toggle

**Icon System:**
Add new icons to `components/icons.tsx`:
```typescript
export const NewIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="SVG_PATH_DATA" />
    </Icon>
);
```

**Icon Styling Convention:**
- Use solid blue background (`bg-blue-500 dark:bg-blue-600`) with white icons for active/upcoming items
- Use gray background (`bg-gray-100 dark:bg-gray-700`) with gray icons for completed/inactive items
- Standard icon box size: `w-12 h-12 rounded-lg`

### Environment Variables

**Required for local development** (.env.local):
```
GEMINI_API_KEY=your_key_here
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

**Vite Environment:**
- Only `VITE_` prefixed variables are exposed to client
- `GEMINI_API_KEY` exposed via custom define in vite.config.ts
- Access via `import.meta.env.VITE_*`

### Styling System

**Tailwind CSS** with custom theme colors:
- Uses custom color tokens (primary, accent, card-light/dark, etc.)
- Dark mode via `dark:` prefix (controlled by ThemeContext)
- All Tailwind config in `tailwind.config.js`

**Common Color Variables:**
```
bg-background-light / dark:bg-background-dark
text-foreground-light / dark:text-foreground-dark
bg-card-light / dark:bg-card-dark
bg-primary, text-primary
```

**Chart Color Palette** (used across Dashboard and Trigger Analysis):
```javascript
// Hex colors for consistency
'#3b82f6' // blue
'#10b981' // green
'#a855f7' // purple
'#f97316' // orange
'#ec4899' // pink
'#06b6d4' // cyan
```

**Important:** When using dynamic colors in charts, use inline `style={{ backgroundColor: color }}` instead of Tailwind classes (dynamic class names don't work with Tailwind)

### Type System

**Central type definitions** in `types.ts`:
- `Dog` - Pet profile with allergies and birthday
- `SymptomLog` - Allergy symptom entries with severity (1-5)
- `TriggerLog` - Standalone trigger tracking (food, location, weather, pollen, products, environment)
- `Reminder` - Medications/treatments with repeat intervals
- `ProductInfo` - Barcode scanned products
- Enums: `SymptomType`, `TriggerType`, `ReminderType`

**Important:** The app has TWO separate trigger tracking systems:
1. **TriggerLog** (in `trigger_logs` table) - Standalone trigger entries created via Trigger Detective page
2. **SymptomLog.triggers** (array field) - Triggers associated with specific symptoms (currently not used in UI)

### Common Patterns

**Date Formatting:**
```typescript
import { format } from 'date-fns';
format(new Date(dog.birthday), 'MMMM d, yyyy')
```

**API Calls:**
```typescript
import { getDogs, addDog, getSymptomLogs, getTriggerLogs, addTriggerLog } from '../services/api';
const dogs = await getDogs();
const triggers = await getTriggerLogs(dogId);
```

**Trigger Logging:**
```typescript
await addTriggerLog({
    dogId: selectedDog.id,
    triggerType: TriggerType.FOOD,
    details: {},
    location: 'City Park', // optional
    notes: 'Ate chicken treats',
    loggedDate: new Date().toISOString(),
});
```

**Accessing Selected Dog:**
```typescript
const { selectedDog } = useDogs();
if (!selectedDog) return <div>No dog selected</div>;
```

**Theme Access:**
```typescript
const { theme, toggleTheme } = useTheme();
// theme is 'light' | 'dark'
```

## Deployment

**Platform:** Vercel
- Automatic deployments on push to main branch
- Environment variables configured in Vercel dashboard
- Production URL: paw-relief2-0.vercel.app

**Build Configuration:**
- Vite builds to `dist/` folder
- HTTPS required for camera/geolocation features
- HashRouter enables GitHub Pages compatibility

## Database Management

**SQL Scripts:**
- `supabase-migration.sql` - Initial database schema setup
- `fix-rls-policies.sql` - Row Level Security policy fixes
- `seed-database.sql` - Sample data for testing
- `clear-trigger-logs.sql` - Delete all trigger logs
- `clear-symptom-logs.sql` - Delete all symptom logs

**Database Tables:**
- `dogs` - Pet profiles
- `symptom_logs` - Symptom entries (severity, notes, photo)
- `trigger_logs` - Standalone trigger entries (type, location, notes)
- `reminders` - Medications and treatments
- `products` - Barcode scanned product cache

## Development Guidelines

**Code Style:**
- Do what has been asked; nothing more, nothing less
- ALWAYS prefer editing existing files over creating new ones
- NEVER proactively create documentation files (*.md) or README files unless explicitly requested
- Only use emojis if user explicitly requests it

**Component Conventions:**
- Follow existing patterns in similar components
- Maintain consistent blue theme for active items (`bg-blue-500/600` with white icons)
- Use proper TypeScript types from `types.ts`
- Handle loading and error states appropriately

**Data Handling:**
- Always fetch data in `useEffect` with proper dependencies
- Use camelCase in TypeScript, snake_case in database queries (mapping in api.ts)
- Remember to reload or refetch data after mutations

## Known Issues & TODOs

- Authentication not yet implemented (using hardcoded user ID: `00000000-0000-0000-0000-000000000001`)
- Pollen data is estimated from AQI (no dedicated pollen API integrated)
- Some pet food products may not be in OpenFoodFacts database
- Photo upload functionality not implemented (placeholder removed to avoid random images)
- Symptom logger currently saves triggers as empty array (trigger UI not connected)
