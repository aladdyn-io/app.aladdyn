# CustomizeSection API Integration Summary

## Overview
The CustomizeSection component has been integrated into both the **Onboarding** flow and the **Scripts** component (genie/scripts.tsx). It handles chatbot customization with save/deploy functionality.

## API Endpoints Used

### 1. **Save Customization**
- **Endpoint**: `POST /api/onboarding/customize`
- **Stage**: 4
- **Request Body**:
  ```json
  {
    "stage": 4,
    "genieId": "string",
    "styles": {
      "headerBg": "string",
      "headerText": "string",
      "botName": "string",
      "botStatus": "string",
      "botBubbleBg": "string",
      "botBubbleText": "string",
      "userBubbleBg": "string",
      "userBubbleText": "string",
      "bgFrom": "string",
      "bgTo": "string",
      "chatBg": "string",
      "fontSize": "string",
      "fontFamily": "string",
      "botAvatar": "string",
      "userAvatar": "string",
      "inputBg": "string",
      "inputBorder": "string",
      "inputText": "string",
      "inputPlaceholder": "string",
      "buttonBg": "string",
      "buttonText": "string",
      "buttonShadow": "string",
      "buttonHover": "string",
      "borderRadius": "string",
      "shadow": "string",
      "welcomeMessage": "string",
      "placeholder": "string"
    }
  }
  ```
- **Purpose**: Save chatbot customization settings
- **Response**: Success confirmation with saved data

### 2. **Deploy Chatbot**
- **Endpoint**: `POST /api/onboarding/create-chatbot`
- **Stage**: 5
- **Request Body**:
  ```json
  {
    "stage": 5,
    "genieId": "string"
  }
  ```
- **Purpose**: Deploy the chatbot and make it live
- **Response**: Success confirmation with deployment details
- **Redirect**: After successful deployment, redirects to `/genie/{genieId}`

## GenieId Resolution Strategy

The CustomizeSection uses a hierarchical approach to resolve the genieId:

```typescript
const genieId = propGenieId || websiteData?.genieId || getCurrentGenieId()
```

### Priority Order:
1. **Direct prop**: `genieId` passed directly to the component
2. **WebsiteData**: `websiteData.genieId` from props
3. **LocalStorage**: `getCurrentGenieId()` from localStorage

This ensures maximum flexibility across different contexts.

## Integration Points

### In Onboarding (src/pages/Onboarding.tsx)
```tsx
{currentStep === 'customize' && (
  <Card className="shadow-lg border-0 bg-white">
    <CardContent className="p-6">
      <CustomizeSection websiteData={websiteData} />
    </CardContent>
  </Card>
)}
```

- `websiteData` contains the `genieId` from the scraping and prompt selection steps
- Called after Stage 3 (prompt selection) is complete
- No direct `genieId` prop needed as it's embedded in websiteData

### In Scripts (src/pages/genie/scripts.tsx)
```tsx
const genieId = getCurrentGenieId();

{activeView === 'customize' ? (
  <div className="h-full w-full overflow-auto bg-white rounded-lg">
    {genieId && <CustomizeSection websiteData={null} genieId={genieId} />}
  </div>
) : ...}
```

- Called from the **Customize** tab in the Scripts page
- Uses `genieId` from localStorage via `getCurrentGenieId()`
- Passes `websiteData={null}` since the data is already available from the dashboard context

## UI Features

### Customization Options

#### Colors Tab:
- Header (background, text)
- Bot messages (bubble background, text)
- User messages (bubble background, text)
- Background gradient (start, end colors)
- Button styling (background, text, shadow, hover)
- Input field (background, text)

#### Typography Tab:
- Bot name
- Bot status
- Welcome message
- Placeholder text
- Font selection (12 font options)
- Font size
- Line height

#### Layout Tab:
- Border radius
- Shadow settings
- Avatar URLs (bot and user)
- Spacing configurations

### Quick Themes
Pre-configured theme templates:
- **Professional Blue**: Corporate look
- **Vibrant Green**: Fresh, modern feel
- **Elegant Purple**: Premium appearance

### Actions
- **Save Changes**: Saves customization without deploying
- **Deploy Chatbot**: Saves and deploys the chatbot live

## Data Flow

### Onboarding Flow:
```
Website Selection → URL Scraping → Prompt Configuration → Customize → Deploy
                                                                ↓
                                         CustomizeSection handles Stage 4 & 5
```

### Scripts Page Flow:
```
Dashboard (Select Genie) → Scripts Tab → Customize Tab → CustomizeSection
         ↓
    localStorage stores genieId
         ↓
    getCurrentGenieId() retrieves it
         ↓
    CustomizeSection uses it for API calls
```

## Environment Variables

Required:
- `VITE_GENIE_BACKEND_URL`: Backend API base URL
- `VITE_WIDGET_URL`: Widget iframe URL (defaults to production URL)

## Error Handling

- Toast notifications for all user actions
- Error messages displayed for:
  - Missing genieId
  - Failed API requests
  - Network errors
- Graceful degradation when genieId is not available

## Type Definitions

### CustomizeStyles
Interface containing all customizable chatbot styling properties (25 properties total)

### CustomizeSectionProps
```typescript
interface CustomizeSectionProps {
  websiteData: WebsiteData | null
  genieId?: string
}
```

### WebsiteData
```typescript
interface WebsiteData {
  website_id: string
  website_url: string
  scraped_doc: string
  genieId?: string
}
```

## Key Functions

### `buildPreviewUrl()`
Constructs the preview iframe URL with all style parameters as query strings

### `handleSave()`
Makes POST request to `/api/onboarding/customize` with Stage 4

### `handleDeploy()`
1. Calls `handleSave()` first
2. Makes POST request to `/api/onboarding/create-chatbot` with Stage 5
3. Redirects to `/genie/{genieId}` on success

### `applyTheme()`
Applies one of the pre-configured themes to the current styles

## Next Steps

To use CustomizeSection in other components:
1. Import the component: `import { CustomizeSection } from '@/components/CustomizeSection'`
2. Pass either `websiteData` with genieId or a direct `genieId` prop
3. Handle the deployment redirect as needed

Example:
```tsx
<CustomizeSection 
  websiteData={websiteData} 
  genieId={genieId} 
/>
```
