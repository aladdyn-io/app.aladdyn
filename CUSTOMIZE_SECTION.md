# Chatbot Customization Section - Implementation Guide

## Overview
This implementation provides a stunning, professional customization interface for the AI chatbot widget with:
- **Split Layout**: Settings panel (left) + Live preview (right)
- **Top Action Bar**: Save button with status indicators
- **3 Pre-built Themes**: Professional Blue, Vibrant Green, Elegant Purple
- **Advanced Color Picker**: Gradient and solid color support
- **Real-time Preview**: See changes instantly in the iframe
- **Clean Architecture**: No legacy dependencies, React 19 compatible

## Features

### 1. **Theme Presets**
Three professionally designed themes that can be applied with one click:
- **Professional Blue** - Corporate, trustworthy design
- **Vibrant Green** - Fresh, energetic appearance
- **Elegant Purple** - Sophisticated, premium feel

### 2. **Customization Tabs**

#### Colors Tab
- **Header**: Background gradient + Text color
- **Bot Messages**: Bubble background + Text color
- **User Messages**: Bubble background + Text color with gradient support
- **Background**: Start and end colors for gradient
- **Button**: Background gradient + Text color
- **Input Field**: Background + Text color

#### Typography Tab
- Bot Name
- Bot Status
- Welcome Message
- Input Placeholder
- Font Size
- Font Family

#### Layout Tab
- Border Radius
- Box Shadow
- Button Shadow
- Input Border
- Bot Avatar URL
- User Avatar URL

### 3. **Color Picker System**
Uses `react-best-gradient-color-picker` for:
- Solid colors
- Linear gradients
- Custom CSS values
- Real-time updates

## Technical Implementation

### Component Structure
```
CustomizeSection.tsx
├── State Management (styles)
├── Theme Presets
├── Action Bar (Save Button)
├── Split Layout
│   ├── Settings Panel (480px fixed width)
│   │   ├── Theme Preset Cards
│   │   └── Tabbed Interface (Colors/Typography/Layout)
│   └── Preview Panel (Flexible)
│       └── Iframe with live widget preview
```

### API Integration

#### Endpoint: `/api/onboarding/customize`
**Method**: POST

**Request Body**:
```json
{
  "stage": 4,
  "genieId": "string",
  "styles": {
    "headerBg": "linear-gradient(135deg, #0d47a1, #1976d2)",
    "headerText": "#ffffff",
    "botName": "Support Assistant",
    "botStatus": "Always online",
    "botBubbleBg": "#e3f2fd",
    "botBubbleText": "#0d47a1",
    "userBubbleBg": "linear-gradient(135deg, #1976d2, #0d47a1)",
    "userBubbleText": "#ffffff",
    "bgFrom": "#e3f2fd",
    "bgTo": "#ede7f6",
    "chatBg": "linear-gradient(135deg, #e3f2fd, #ede7f6)",
    "fontSize": "16px",
    "fontFamily": "'Segoe UI', Roboto, sans-serif",
    "botAvatar": "https://i.pravatar.cc/150?img=1",
    "userAvatar": "https://i.pravatar.cc/150?img=2",
    "inputBg": "#ffffff",
    "inputBorder": "1px solid #64b5f6",
    "inputText": "#212121",
    "inputPlaceholder": "#9e9e9e",
    "buttonBg": "linear-gradient(135deg, #1976d2, #0d47a1)",
    "buttonText": "#ffffff",
    "buttonShadow": "0px 2px 6px rgba(25, 118, 210, 0.3)",
    "buttonHover": "linear-gradient(135deg, #1565c0, #0d47a1)",
    "borderRadius": "12px",
    "shadow": "0 4px 12px rgba(0, 0, 0, 0.15)",
    "welcomeMessage": "Hi! How can I help you today?",
    "placeholder": "Type your message..."
  }
}
```

**Response**:
```json
{
  "success": true,
  "message": "Customization saved successfully"
}
```

### Environment Variables

Create a `.env` file with:
```bash
# Backend API URL
VITE_GENIE_BACKEND_URL=http://localhost:3000

# Widget Preview URL (for iframe)
VITE_WIDGET_URL=https://ai-chat-widget-production.up.railway.app/
```

### Widget Integration

The widget should accept URL parameters for customization:
```
https://widget-url.com/?genieId=xxx&headerBg=...&headerText=...&botName=...
```

All style values are passed as URL parameters to the iframe for real-time preview.

## Usage

1. **Navigate to Customize Step**: Complete the onboarding flow (Website → Scrape → Prompt)
2. **Choose a Theme**: Click one of the three preset themes
3. **Fine-tune Colors**: Use the Colors tab to adjust individual colors
4. **Update Text**: Modify bot name, messages, and typography in the Typography tab
5. **Adjust Layout**: Change spacing, shadows, and avatars in the Layout tab
6. **Preview Changes**: See updates instantly in the live preview on the right
7. **Save**: Click the "Save Customization" button to persist changes

## Color Picker Usage

### For Solid Colors
1. Click on the color preview box
2. Use the color picker popup
3. Or manually enter CSS value in the input below

### For Gradients
1. Click on the color preview box
2. Use the gradient picker to:
   - Select multiple color stops
   - Adjust gradient angle
   - Choose gradient type
3. Or manually enter CSS gradient syntax

## Best Practices

### Colors
- Use high contrast for text readability
- Keep brand consistency across bot and user bubbles
- Test gradients on different screen sizes

### Typography
- Keep font size between 14px-18px for readability
- Use web-safe fonts or Google Fonts
- Keep messages concise and friendly

### Layout
- Border radius between 8px-16px for modern look
- Use subtle shadows for depth
- Ensure avatars are square (1:1 ratio)

## Package Dependencies

```json
{
  "react-best-gradient-color-picker": "^3.0.6"
}
```

**Note**: Already installed in the project. No additional installations needed.

## File Structure

```
src/
├── components/
│   ├── CustomizeSection.tsx       # Main customization component
│   └── OnboardingNavbar.tsx       # Navigation bar
└── pages/
    └── Onboarding.tsx              # Main onboarding flow
```

## Design Philosophy

1. **Visual First**: Large preview takes center stage
2. **Progressive Disclosure**: Tabs organize complexity
3. **Instant Feedback**: Real-time preview reduces guesswork
4. **Smart Defaults**: Professional themes out-of-the-box
5. **Flexible**: Support both simple colors and complex gradients

## Accessibility

- High contrast text/background combinations
- Clear labels for all inputs
- Keyboard navigable
- Screen reader friendly

## Performance

- Debounced preview updates
- Lazy-loaded color picker
- Optimized iframe rendering
- Minimal re-renders with focused state updates

## Future Enhancements

1. **Export/Import Themes**: Save custom themes
2. **Dark Mode**: Toggle between light/dark variants
3. **Animation Settings**: Configure transitions
4. **Mobile Preview**: Test on different device sizes
5. **A/B Testing**: Compare theme performance
6. **Brand Kit Import**: Extract colors from logo

## Troubleshooting

### Preview Not Updating
- Check widget URL in environment variables
- Verify genieId is being passed correctly
- Check browser console for CORS errors

### Color Picker Not Showing
- Ensure `react-best-gradient-color-picker` is installed
- Check z-index conflicts with other components
- Verify popup positioning

### Save Failing
- Verify backend endpoint is running
- Check genieId exists
- Review request payload format

## Support

For issues or questions:
1. Check environment variables are set
2. Verify backend API is running
3. Review browser console for errors
4. Check network tab for failed requests
