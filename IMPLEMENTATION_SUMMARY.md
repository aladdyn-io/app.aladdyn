# CustomizeSection Integration - Implementation Summary

## Changes Made

### 1. **CustomizeSection Component** (`src/components/CustomizeSection.tsx`)

#### Before:
```tsx
interface CustomizeSectionProps {
  websiteData: WebsiteData | null
}

export function CustomizeSection({ websiteData }: CustomizeSectionProps) {
  // Used websiteData?.genieId directly
  sp.set('genieId', websiteData?.genieId || '')
```

#### After:
```tsx
import { getCurrentGenieId } from '@/lib/utils'

interface CustomizeSectionProps {
  websiteData: WebsiteData | null
  genieId?: string  // ✅ NEW: Optional direct genieId prop
}

export function CustomizeSection({ websiteData, genieId: propGenieId }: CustomizeSectionProps) {
  // ✅ Hierarchical resolution
  const genieId = propGenieId || websiteData?.genieId || getCurrentGenieId()
  
  // ✅ All API calls updated to use single genieId variable
  sp.set('genieId', genieId || '')
  if (!genieId) { toast.error(...) }
```

**Changes:**
- ✅ Added `getCurrentGenieId` import for fallback
- ✅ Added optional `genieId` prop to interface
- ✅ Implemented hierarchical resolution logic
- ✅ Updated `buildPreviewUrl()` to use resolved genieId
- ✅ Updated `handleSave()` to validate against genieId
- ✅ Updated `handleDeploy()` to use resolved genieId

---

### 2. **Scripts Component** (`src/pages/genie/scripts.tsx`)

#### Before:
```tsx
import { Button } from '@/ui/components/Button';  // ❌ Wrong path
import { Input } from '@/ui/components/Input';    // ❌ Wrong path
const [activeView, setActiveView] = useState<'chat' | 'website' | 'preview'>('preview');
const [,] = useState({ /* unused bot styles */ });

{activeView === 'preview' ? (
  <div className="h-full w-full ">
    {getCurrentGenieId() && <CustomizeSection websiteData={null} genieId={getCurrentGenieId()} />}
  </div>
)}
```

#### After:
```tsx
import { Button } from '@/components/ui/button';     // ✅ Correct path
import { Input } from '@/components/ui/input';       // ✅ Correct path
import { getCurrentGenieId } from '@/lib/utils';

export function GenieScripts() {
  const genieId = getCurrentGenieId();  // ✅ Get once at component level
  const [activeView, setActiveView] = useState<'chat' | 'website' | 'customize'>('customize');
  
  // ✅ Removed unused empty state with bot styles
  
  if (!genieId) {  // ✅ Early return with user feedback
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold ...">Scripts</h1>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-yellow-800">No Genie ID found. Please select a genie from the dashboard first.</p>
        </div>
      </div>
    );
  }
  
  {activeView === 'customize' ? (  // ✅ Renamed from 'preview'
    <div className="h-full w-full overflow-auto bg-white rounded-lg">
      {genieId && <CustomizeSection websiteData={null} genieId={genieId} />}
    </div>
  ) : ...}
}
```

**Changes:**
- ✅ Fixed component imports (from `@/ui/` to `@/components/ui/`)
- ✅ Added `getCurrentGenieId` import
- ✅ Extract genieId at component level instead of inline
- ✅ Removed unused bot styles state
- ✅ Renamed 'preview' tab to 'customize'
- ✅ Added early return with user feedback when genieId is missing
- ✅ Pass genieId directly to CustomizeSection
- ✅ Added overflow-auto to handle large forms

---

### 3. **Onboarding Component** (`src/pages/Onboarding.tsx`)
✅ Already compatible - passes `websiteData` containing `genieId`

---

## API Integration Pattern

### Endpoints Used

#### 1. Save Customization (Stage 4)
```
POST /api/onboarding/customize
{
  stage: 4,
  genieId: string,
  styles: CustomizeStyles
}
```

#### 2. Deploy Chatbot (Stage 5)
```
POST /api/onboarding/create-chatbot
{
  stage: 5,
  genieId: string
}
```

---

## GenieId Resolution Hierarchy

```typescript
const genieId = propGenieId || websiteData?.genieId || getCurrentGenieId()
```

| Priority | Source | Context | Example |
|----------|--------|---------|---------|
| 1 | Direct prop `genieId` | Scripts tab | `<CustomizeSection genieId={genieId} />` |
| 2 | `websiteData.genieId` | Onboarding flow | From scraping/prompt steps |
| 3 | `getCurrentGenieId()` | LocalStorage fallback | Retrieved on demand |

---

## Data Flow

### Onboarding (Full Journey)
```
Select Website → Scrape URLs → Configure Prompt → Customize → Deploy
                                                      ↓
                            CustomizeSection (receives via websiteData)
                            - Save customization (Stage 4)
                            - Deploy chatbot (Stage 5)
                            - Redirect to /genie/{genieId}
```

### Scripts Tab (Direct Access)
```
Dashboard → Click Genie Card → /genie/{id}
              ├─ Sets localStorage['currentGenieId'] = id
              └─ GenieLayout loads
                 └─ Scripts Tab → Customize
                    ├─ GenieScripts gets genieId via getCurrentGenieId()
                    └─ CustomizeSection receives as prop
                       - Can save/update customization
                       - Can re-deploy chatbot
```

---

## Error Handling

| Scenario | Handling |
|----------|----------|
| No genieId in Scripts | Early return with user-friendly message |
| No genieId in CustomizeSection | Toast error: "No Genie ID found" |
| API save fails | Toast error with backend message |
| API deploy fails | Toast error with backend message |
| Missing backend URL | Error via import.meta.env check |

---

## Type Safety

### Interfaces

```typescript
interface CustomizeSectionProps {
  websiteData: WebsiteData | null
  genieId?: string                    // ✅ Optional but flexible
}

interface WebsiteData {
  website_id: string
  website_url: string
  scraped_doc: string
  genieId?: string                    // ✅ Optional in WebsiteData
}

interface CustomizeStyles {
  // 25 styling properties
  headerBg: string
  headerText: string
  botName: string
  botStatus: string
  // ... (full list in CustomizeSection.tsx)
  welcomeMessage: string
  placeholder: string
}
```

---

## Testing Checklist

- [ ] Onboarding flow completes without errors
- [ ] CustomizeSection receives genieId from websiteData in onboarding
- [ ] CustomizeSection receives genieId as prop in scripts
- [ ] Save customization API call succeeds
- [ ] Deploy chatbot API call succeeds
- [ ] Redirect to genie dashboard works
- [ ] LocalStorage stores/retrieves genieId correctly
- [ ] Scripts tab shows error when no genieId
- [ ] All imports are correct (no path errors)
- [ ] TypeScript compilation passes

---

## File Changes Summary

| File | Change Type | Description |
|------|-------------|-------------|
| `src/components/CustomizeSection.tsx` | Modified | Added flexible genieId prop + resolution logic |
| `src/pages/genie/scripts.tsx` | Modified | Integrated CustomizeSection in customize tab |
| `src/lib/utils.ts` | (unchanged) | Already has `getCurrentGenieId()` |
| `src/pages/Onboarding.tsx` | (unchanged) | Already compatible |

---

## Benefits

✅ **Flexibility** - Works in multiple contexts with different genieId sources  
✅ **Consistency** - Same API pattern used across all flows  
✅ **Maintainability** - Single point of configuration (CustomizeSection)  
✅ **Type Safety** - Full TypeScript support throughout  
✅ **Error Handling** - Comprehensive error messages and fallbacks  
✅ **User Experience** - Smooth transitions and clear feedback  
✅ **Scalability** - Easy to add more integration points  

---

## Quick Start Guide

### Using CustomizeSection in a New Component

```tsx
import { CustomizeSection } from '@/components/CustomizeSection'
import { getCurrentGenieId } from '@/lib/utils'

export function MyComponent() {
  const genieId = getCurrentGenieId()
  const websiteData = { /* ... */ }
  
  // Option 1: Via prop
  return <CustomizeSection genieId={genieId} />
  
  // Option 2: Via websiteData
  return <CustomizeSection websiteData={websiteData} />
  
  // Option 3: Via localStorage (automatic)
  return <CustomizeSection />  // Will use getCurrentGenieId() internally
}
```

---

## Documentation Files Created

1. **API_INTEGRATION_SUMMARY.md** - Complete API reference and integration points
2. **INTEGRATION_ARCHITECTURE.md** - Visual diagrams and data flow documentation

These provide reference for future maintenance and development.
