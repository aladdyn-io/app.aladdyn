# CustomizeSection Integration - Quick Reference

## 📋 What Was Done

### Component Updates

#### CustomizeSection (`src/components/CustomizeSection.tsx`)
```
✅ Added getCurrentGenieId import
✅ Added optional genieId prop
✅ Implemented hierarchical ID resolution
✅ Updated all API calls to use resolved genieId
✅ Added early validation for missing genieId
```

#### Scripts Component (`src/pages/genie/scripts.tsx`)
```
✅ Fixed import paths (ui/ → components/ui/)
✅ Added getCurrentGenieId hook
✅ Renamed 'preview' tab to 'customize'
✅ Integrated CustomizeSection with genieId
✅ Added graceful error handling
✅ Removed unused bot styles state
```

---

## 🔄 How It Works

### Three Ways to Pass GenieId

#### 1️⃣ Direct Prop (Scripts Tab)
```tsx
const genieId = getCurrentGenieId()
<CustomizeSection genieId={genieId} />
```

#### 2️⃣ WebsiteData (Onboarding)
```tsx
const websiteData = { genieId: "genie_123", ... }
<CustomizeSection websiteData={websiteData} />
```

#### 3️⃣ Auto-Resolve (Fallback)
```tsx
<CustomizeSection />  // Uses localStorage automatically
```

---

## 🎯 Use Cases

### Use Case 1: Onboarding Flow
- **Stage**: 4 (Customization)
- **Input**: `websiteData` with `genieId` from previous steps
- **Actions**: Save or Deploy
- **Output**: Redirect to `/genie/{genieId}`

### Use Case 2: Dashboard Scripts Tab
- **Stage**: Existing genie management
- **Input**: `genieId` from localStorage (set when clicking dashboard)
- **Actions**: Modify and re-save customization
- **Output**: Updated customization applied

### Use Case 3: Direct URL Access
- **Stage**: Any
- **Input**: `genieId` from URL or localStorage
- **Actions**: View/edit customization
- **Output**: Preview in real-time

---

## 🚀 API Endpoints

### POST /api/onboarding/customize (Stage 4)
```json
{
  "stage": 4,
  "genieId": "genie_abc123",
  "styles": {
    "headerBg": "#0d47a1",
    "headerText": "#ffffff",
    "botName": "Support Bot",
    // ... 22 more style properties
  }
}
```
**Response**: `{ success: true, data: {...} }`

### POST /api/onboarding/create-chatbot (Stage 5)
```json
{
  "stage": 5,
  "genieId": "genie_abc123"
}
```
**Response**: `{ success: true, deployed: true }`  
**Action**: Redirects to `/genie/{genieId}`

---

## 📊 Component State

### CustomizeSection State
```typescript
const [styles, setStyles] = useState<CustomizeStyles>()
const [isSaving, setIsSaving] = useState(false)
const [isDeploying, setIsDeploying] = useState(false)
const [activeColorPicker, setActiveColorPicker] = useState<string | null>(null)
```

### GenieScripts State
```typescript
const genieId = getCurrentGenieId()                    // ✅ Retrieved once
const [activeView, setActiveView] = 
  useState<'chat' | 'website' | 'customize'>()        // ✅ Tab selection
```

---

## 🔐 Error Handling

| Error | Component | Handling |
|-------|-----------|----------|
| No genieId | GenieScripts | Early return with message |
| No genieId | CustomizeSection | Toast error + return |
| API fails (save) | CustomizeSection | Toast error message |
| API fails (deploy) | CustomizeSection | Toast error message |
| Invalid JSON | Both | Toast error + console.error |

---

## 🎨 UI Flow in Scripts Tab

```
┌──────────────────────────────────┐
│ Scripts Page Header              │
│ Title: "Scripts"                 │
│ Tabs: [Chat] [Website] [Customize]
└──────────────────────────────────┘
           │
    Click on "Customize"
           │
           ▼
┌──────────────────────────────────┐
│ CustomizeSection Loaded          │
│ (if genieId exists)              │
│                                  │
│ Left Panel:                       │
│ ├─ Quick Themes                  │
│ ├─ Colors Tab ✓                  │
│ ├─ Typography Tab                │
│ └─ Layout Tab                    │
│                                  │
│ Right Panel:                      │
│ └─ Live Preview (iframe)         │
│                                  │
│ Bottom Actions:                   │
│ [Save Changes] [Deploy Chatbot]  │
└──────────────────────────────────┘
```

---

## 📝 Configuration Reference

### Default Theme (Professional Blue)
```javascript
headerBg: 'linear-gradient(135deg, #0d47a1, #1976d2)'
botBubbleBg: '#e3f2fd'
userBubbleBg: 'linear-gradient(135deg, #1976d2, #0d47a1)'
buttonBg: 'linear-gradient(135deg, #1976d2, #0d47a1)'
```

### Customizable Properties (25 Total)
- Colors: 10 properties (header, bot, user, background, button, input)
- Typography: 8 properties (names, messages, font, size)
- Layout: 7 properties (avatars, radius, shadow, placeholders)

---

## ✅ Verification Checklist

```
✅ TypeScript compilation: PASS
✅ CustomizeSection exports correctly
✅ GenieScripts imports correctly
✅ genieId resolution logic works
✅ API calls include correct stage
✅ Error handling functional
✅ Redirect after deployment works
✅ LocalStorage integration functional
✅ No breaking changes
✅ All imports use correct paths
✅ Type safety maintained
✅ No unused imports/variables
```

---

## 🔗 Related Files

### Main Components
- `src/components/CustomizeSection.tsx` - Customization UI & logic
- `src/pages/genie/scripts.tsx` - Scripts page with CustomizeSection

### Support Files
- `src/lib/utils.ts` - `getCurrentGenieId()` function
- `src/pages/Onboarding.tsx` - Onboarding flow (already compatible)
- `src/pages/home/dashboard.tsx` - Sets genieId in localStorage

### Documentation
- `API_INTEGRATION_SUMMARY.md` - API reference
- `INTEGRATION_ARCHITECTURE.md` - Architecture diagrams
- `IMPLEMENTATION_SUMMARY.md` - Detailed changes

---

## 🚀 Next Steps

### To Use CustomizeSection Elsewhere
1. Import: `import { CustomizeSection } from '@/components/CustomizeSection'`
2. Get genieId: `const genieId = getCurrentGenieId()`
3. Render: `<CustomizeSection genieId={genieId} />`

### To Add New Features
1. Update `CustomizeStyles` interface
2. Add UI controls in appropriate tab
3. Update API payload if needed
4. Test with both usage contexts

---

## 📞 Support

### Common Issues

**Issue**: "No Genie ID found" in Scripts
- **Solution**: Click on a genie card in the dashboard first to set localStorage

**Issue**: Preview not loading
- **Solution**: Check `VITE_WIDGET_URL` environment variable

**Issue**: Save fails
- **Solution**: Check console for API error details, verify backend is running

**Issue**: Deploy fails
- **Solution**: Ensure customization was saved first (handleDeploy calls handleSave)

---

## 📚 Learning Resources

| Topic | Location |
|-------|----------|
| API Details | `API_INTEGRATION_SUMMARY.md` |
| Architecture | `INTEGRATION_ARCHITECTURE.md` |
| Implementation | `IMPLEMENTATION_SUMMARY.md` |
| Component Code | `src/components/CustomizeSection.tsx` |
| Usage Example | `src/pages/genie/scripts.tsx` |

---

## 🎓 Summary

The CustomizeSection is now **fully integrated** into:
- ✅ Onboarding flow (Stage 4-5)
- ✅ Scripts tab (Customize view)
- ✅ Direct access via localStorage

With **flexible genieId resolution** supporting:
- ✅ Direct props
- ✅ WebsiteData embedding
- ✅ LocalStorage fallback

And **complete API integration** for:
- ✅ Customization saving
- ✅ Chatbot deployment
- ✅ Error handling
- ✅ User feedback

**Status: ✅ PRODUCTION READY**
