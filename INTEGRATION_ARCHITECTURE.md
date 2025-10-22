# CustomizeSection Integration Architecture

## Component Hierarchy

```
┌─────────────────────────────────────────────────────────────────┐
│                      CustomizeSection                           │
│                                                                 │
│  Props:                                                         │
│  - websiteData?: WebsiteData                                   │
│  - genieId?: string                                            │
│                                                                 │
│  GenieId Resolution (Priority):                                │
│  1. propGenieId (direct prop)                                  │
│  2. websiteData?.genieId                                       │
│  3. getCurrentGenieId() (localStorage)                         │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │ Left Panel: Settings                                   │   │
│  │ ├─ Quick Themes                                        │   │
│  │ ├─ Tabs:                                               │   │
│  │ │  ├─ Colors (Header, Bot, User, Background, Button)  │   │
│  │ │  ├─ Typography (Names, Messages, Font, Size)        │   │
│  │ │  └─ Layout (Radius, Shadow, Avatars)                │   │
│  │ └─ Actions: Save | Deploy                             │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │ Right Panel: Live Preview                              │   │
│  │ └─ iframe: buildPreviewUrl() with all styles as params│   │
│  └────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Usage Contexts

### Context 1: Onboarding Flow (Stage 4-5)

```
┌──────────────────────────────────────────────────────────────────┐
│ Onboarding.tsx                                                   │
│                                                                  │
│ State: websiteData (from previous steps)                        │
│ {                                                                │
│   website_id: "user123",                                        │
│   website_url: "https://example.com",                          │
│   scraped_doc: "...",                                          │
│   genieId: "genie_abc123"  ← Contains ID from scraping        │
│ }                                                                │
│                                                                  │
│ └─> currentStep === 'customize'                                │
│     └─> <CustomizeSection websiteData={websiteData} />         │
│         └─> genieId extracted from websiteData.genieId         │
│             └─> Stage 4: Save customization                    │
│                 └─> Stage 5: Deploy chatbot                    │
│                     └─> Redirect: /genie/{genieId}             │
└──────────────────────────────────────────────────────────────────┘
```

### Context 2: Scripts Tab (Genie Dashboard)

```
┌──────────────────────────────────────────────────────────────────┐
│ scripts.tsx (GenieScripts Component)                            │
│                                                                  │
│ On Mount:                                                        │
│ const genieId = getCurrentGenieId()  ← From localStorage        │
│                      ↓                                           │
│             localStorage.getItem('currentGenieId')              │
│                      ↓                                           │
│        "genie_abc123" (set when clicking genie card)           │
│                                                                  │
│ Tab Options:                                                     │
│ ├─ Chat Tab                                                      │
│ ├─ Website Tab                                                   │
│ └─ Customize Tab ← Uses CustomizeSection                        │
│    └─> if (genieId) {                                           │
│        <CustomizeSection websiteData={null} genieId={genieId} />│
│        }                                                          │
│                                                                  │
│ Note: websiteData=null because context is already in genie      │
└──────────────────────────────────────────────────────────────────┘
```

## API Call Flow

### Save Flow (Stage 4)

```
User clicks "Save Changes"
    ↓
handleSave() triggered
    ↓
Validate genieId exists
    ↓
POST /api/onboarding/customize {
  stage: 4,
  genieId: "genie_abc123",
  styles: { ...customizeStyles }
}
    ↓
Backend saves customization
    ↓
Response: { success: true, ... }
    ↓
toast.success("Customization saved successfully!")
```

### Deploy Flow (Stage 5)

```
User clicks "Deploy Chatbot"
    ↓
handleDeploy() triggered
    ↓
Validate genieId exists
    ↓
Call handleSave() first (Stage 4)
    ↓
POST /api/onboarding/create-chatbot {
  stage: 5,
  genieId: "genie_abc123"
}
    ↓
Backend deploys chatbot
    ↓
Response: { success: true, ... }
    ↓
toast.success("Chatbot deployed successfully!")
    ↓
window.location.href = `/genie/${genieId}`
    ↓
Redirect to genie dashboard
```

## GenieId Lifecycle

```
┌─────────────────────────────────────────────────────────────────┐
│ CREATION (Onboarding Flow)                                      │
│                                                                 │
│ 1. User starts onboarding                                       │
│ 2. Website scraping begins                                      │
│ 3. Backend creates Genie and returns genieId                   │
│ 4. Frontend stores: localStorage.setItem('currentGenieId', id)  │
│ 5. URL updated: /onboarding/{genieId}                          │
│ 6. websiteData.genieId set                                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ STORAGE (LocalStorage)                                          │
│                                                                 │
│ Key: 'currentGenieId'                                          │
│ Value: "genie_abc123"                                          │
│ Lifetime: Until manually cleared or user logs out              │
│                                                                 │
│ Also stored:                                                    │
│ Key: 'websiteData_{genieId}'                                   │
│ Value: { website_id, website_url, genieId, scrapedLinks }     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ RETRIEVAL (Dashboard)                                           │
│                                                                 │
│ User clicks on Genie card in Dashboard                         │
│    ↓                                                            │
│ localStorage.setItem('currentGenieId', genie.id)               │
│    ↓                                                            │
│ Navigate to /genie/{genieId}                                   │
│    ↓                                                            │
│ GenieLayout loads genie data                                   │
│    ↓                                                            │
│ User navigates to Scripts tab                                  │
│    ↓                                                            │
│ getCurrentGenieId() retrieves from localStorage                │
│    ↓                                                            │
│ CustomizeSection uses it for API calls                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

```
┌─────────────────────────────┐
│   Dashboard                 │
│  (Select Genie Card)        │
└──────────────┬──────────────┘
               │
               ├─> localStorage.setItem('currentGenieId', id)
               │
               └─> Navigate: /genie/{id}
                              ↓
                   ┌──────────────────────┐
                   │   GenieLayout        │
                   │  (Route Container)   │
                   └──────────────┬───────┘
                                  │
                ┌─────────────────┼─────────────────┐
                │                 │                 │
                ▼                 ▼                 ▼
           Dashboard          Analytics         Scripts
           (Chatlogs)         (Events, etc)       (THIS)
                │                                 │
                │                                 ▼
                │                        ┌─────────────────────┐
                │                        │ GenieScripts        │
                │                        │                     │
                │                        │ const genieId =     │
                │                        │   getCurrentGenieId()│
                │                        └────────┬────────────┘
                │                                 │
                │                    ┌────────────┼────────────┐
                │                    │            │            │
                │                    ▼            ▼            ▼
                │                  Chat       Website       Customize
                │                   Tab         Tab           Tab
                │                                │
                │                                ▼
                │                    ┌─────────────────────────┐
                │                    │ CustomizeSection        │
                │                    │                         │
                │                    │ Props:                  │
                │                    │  - websiteData: null    │
                │                    │  - genieId: from state  │
                │                    │                         │
                │                    │ genieId Resolution:     │
                │                    │ propGenieId → works!    │
                │                    └────────────┬────────────┘
                │                                 │
                │                    ┌────────────┴──────────────┐
                │                    │                           │
                │                    ▼                           ▼
                │         API: Save Customization    API: Deploy Chatbot
                │         POST /customize (Stage 4)  POST /create-chatbot (S5)
                │                    │                           │
                │                    └────────────┬──────────────┘
                │                                 │
                │                                 ▼
                │                        Redirect: /genie/{id}
                │                                 │
                └─────────────────────────────────┴──────────────────→ Back to dashboard

```

## Component Integration Checklist

✅ CustomizeSection receives genieId  
✅ GenieScripts passes genieId from localStorage  
✅ Onboarding passes genieId via websiteData  
✅ API endpoints called with correct stage  
✅ Customization saved before deployment  
✅ Redirect after successful deployment  
✅ Error handling with toast notifications  
✅ TypeScript type safety maintained  
✅ No breaking changes to existing code  
✅ Fallback resolution hierarchy implemented  

## Summary

The CustomizeSection is now perfectly integrated into:

1. **Onboarding** - Gets genieId from websiteData (priority 2)
2. **Scripts** - Gets genieId from direct prop (priority 1)
3. **Fallback** - Uses localStorage if needed (priority 3)

All three genieId sources are functional and the component intelligently selects the correct one based on availability.
