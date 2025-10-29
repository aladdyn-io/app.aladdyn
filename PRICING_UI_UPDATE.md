# Pricing UI Update - Monthly/Yearly Toggle

## Overview
Updated the pricing section to properly display plans with a monthly/yearly toggle button, showing exactly 5 columns in the correct order: Freemium, Basic, Ecommerce, Pro, and Enterprise.

## Changes Made

### 1. **PricingSection Component** (`src/ui/components/PricingSection.tsx`)
- ✅ Added `isYearly` state for toggle functionality
- ✅ Implemented toggle button UI (Monthly/Yearly)
- ✅ Created `getDisplayPlans()` function to intelligently filter and display plans
- ✅ Added savings calculation for yearly plans
- ✅ Updated plan ordering: Freemium → Basic → Ecommerce → Pro → Enterprise
- ✅ Added discount badges and savings text
- ✅ Fixed price formatting with Indian locale (₹)

### 2. **PricingCard Component** (`src/ui/components/PricingCard.tsx`)
- ✅ Added `badge` prop for discount badges (e.g., "10% off")
- ✅ Added `savings` prop to show savings amount
- ✅ Updated badge positioning to support multiple badges
- ✅ Enhanced UI with savings information display

### 3. **Pricing Plans Seed** (`web-server/src/seed-plans.ts`)
- ✅ Updated yearly plans with 10% discount (instead of 20%)
- ✅ Pricing structure:
  - **Basic**: ₹1,999/month → ₹21,589/year (save ₹2,398)
  - **Ecommerce**: ₹5,499/month → ₹59,389/year (save ₹6,598)
  - **Pro**: ₹7,999/month → ₹86,389/year (save ₹9,598)

## UI Features

### Toggle Button
- Clean, modern toggle switch between Monthly and Yearly
- Active state shown with emerald color
- Text below toggle: "Save 10% with annual billing" (when yearly is selected)

### 5-Column Layout
```
┌──────────┬──────────┬───────────┬──────────┬────────────┐
│ Freemium │  Basic   │ Ecommerce │   Pro    │ Enterprise │
│  (Free)  │ ₹1,999/m │ ₹5,499/m  │ ₹7,999/m │  Contact   │
└──────────┴──────────┴───────────┴──────────┴────────────┘
```

### Plan Order (Left to Right)
1. **Freemium** - Free tier
2. **Basic** - Small businesses
3. **Ecommerce** - Online stores with Shopify
4. **Pro** - Most Popular (5 apps)
5. **Enterprise** - Custom solutions

### Badges
- **Most Popular**: Black badge on Pro plan
- **10% off**: Green badge on yearly plans
- **Current Plan**: Blue badge if user is subscribed

### Features Display
- Clean bullet points with checkmarks
- Consistent feature descriptions:
  - Apps count
  - Pages scraping limit
  - Shopify integration (if applicable)
  - Retrain capabilities
  - Chat limits
  - Analytics and Leads availability

## How It Works

### Monthly View
Shows base monthly plans with regular pricing.

### Yearly View
- Automatically switches to yearly pricing for each plan
- Shows annual cost (e.g., ₹21,589/year)
- Displays savings information (e.g., "Save 10% (₹2,398)")
- Shows "10% off" badge on applicable plans

### Smart Plan Mapping
The system intelligently maps:
- `basic` (monthly) ↔ `basic-yearly` (yearly)
- `ecommerce` (monthly) ↔ `ecommerce-yearly` (yearly)
- `pro` (monthly) ↔ `pro-yearly` (yearly)
- Freemium and Enterprise remain the same (no yearly variant)

## Database Structure

### Monthly Plans (5 plans)
1. `freemium` - ₹0
2. `basic` - ₹1,999
3. `ecommerce` - ₹5,499
4. `pro` - ₹7,999
5. `enterprise` - Contact

### Yearly Plans (3 plans)
1. `basic-yearly` - ₹21,589
2. `ecommerce-yearly` - ₹59,389
3. `pro-yearly` - ₹86,389

Total: **8 plans** in database, **5 columns** displayed at a time.

## Benefits

✅ **Clean UI**: No duplicate plans shown, proper toggle functionality
✅ **Correct Order**: Freemium left, Enterprise right
✅ **Savings Highlighted**: Clear savings display for yearly plans
✅ **Responsive**: Works on all screen sizes
✅ **Type Safe**: Full TypeScript support
✅ **Discount Badges**: Visual indicators for special offers
✅ **Indian Formatting**: Proper ₹ symbol and number formatting

## Usage

Navigate to the pricing page to see the new toggle in action. Toggle between Monthly and Yearly to see prices update automatically while maintaining the clean 5-column layout.

