# LocalStorage Utility Functions

## 🎯 **Overview**
A comprehensive utility library for managing user data and authentication state in localStorage. This is an **optional enhancement** - the original localStorage logic is maintained in the components.

## 📁 **File Location**
`src/lib/storage.ts`

## 🔧 **Key Functions**

### **Authentication & User Data**
```typescript
// Store user data after successful login/registration
storeUserData(response: AuthResponse): void

// Get user data from localStorage
getUserData(): User | null

// Get user ID
getUserId(): string | null

// Get JWT token
getToken(): string | null

// Check if user is authenticated
isAuthenticated(): boolean

// Clear all user data
clearUserData(): void

// Update user data
updateUserData(updates: Partial<User>): void
```

### **Token Management**
```typescript
// Decode JWT token
decodeJWT(token: string): any

// Check if token is expired
isTokenExpired(): boolean

// Get user data with token validation
getValidUserData(): User | null
```

### **Genie Management**
```typescript
// Store current genie ID
setCurrentGenieId(genieId: string): void

// Get current genie ID
getCurrentGenieId(): string | null
```

### **Website Data (Onboarding)**
```typescript
// Store website data for onboarding
storeWebsiteData(genieId: string, data: any): void

// Get website data
getWebsiteData(genieId: string): any

// Clear website data
clearWebsiteData(genieId: string): void
```

### **User ID Management**
```typescript
// Ensure user ID exists, generate fallback if needed
ensureUserId(): string
```

## 🚀 **Usage Examples**

### **Login/Registration**
```typescript
import { storeUserData } from '@/lib/storage'

// After successful authentication
if (response.success && response.data) {
  storeUserData(response.data)
  navigate('/')
}
```

### **Getting User Data**
```typescript
import { getValidUserData, getUserId } from '@/lib/storage'

// Get validated user data
const userData = getValidUserData()
if (userData) {
  console.log('User:', userData.name)
}

// Get user ID
const userId = getUserId()
```

### **Logout**
```typescript
import { clearUserData } from '@/lib/storage'

// Clear all user data
clearUserData()
window.location.href = '/login'
```

### **Onboarding Data**
```typescript
import { storeWebsiteData, getWebsiteData } from '@/lib/storage'

// Store website data
storeWebsiteData(genieId, {
  website_url: 'https://example.com',
  scrapedLinks: [...]
})

// Retrieve website data
const data = getWebsiteData(genieId)
```

## 🔄 **Component Status**

### **Login.tsx**
- ✅ **Maintains original localStorage logic**
- ✅ Manual token and user data storage
- ✅ JWT decoding for userId extraction

### **Register.tsx**
- ✅ **Maintains original localStorage logic**
- ✅ Manual token and user data storage
- ✅ JWT decoding for userId extraction

### **nav-user.tsx**
- ✅ **Maintains original localStorage logic**
- ✅ Manual user data retrieval from localStorage
- ✅ Manual logout with localStorage cleanup

### **utils.ts**
- ✅ **Maintains original localStorage logic**
- ✅ Original `getUserId()`, `getCurrentGenieId()`, `ensureUserId()` functions
- ✅ Optional re-exports of storage utilities for advanced usage

## 🎯 **Benefits**

### **1. Centralized Management**
- All localStorage operations in one place
- Consistent error handling
- Easy to maintain and update

### **2. Type Safety**
- TypeScript interfaces for all data structures
- Compile-time error checking
- Better IDE support

### **3. Error Handling**
- Graceful error handling for all operations
- Console logging for debugging
- Fallback mechanisms

### **4. Token Validation**
- Automatic token expiry checking
- Secure user data retrieval
- Automatic cleanup of expired sessions

### **5. Backward Compatibility**
- Existing code continues to work
- Gradual migration possible
- No breaking changes

## 📋 **Data Structures**

### **User Interface**
```typescript
interface User {
  name: string
  email: string
  avatar: string
  userId?: string
}
```

### **Auth Response Interface**
```typescript
interface AuthResponse {
  token: string
  user: {
    id: string
    name: string
    email: string
    role?: string
    emailVerified?: boolean
    createdAt?: string
  }
}
```

## 🧪 **Testing**

### **Test User Data Storage**
```typescript
import { storeUserData, getUserData } from '@/lib/storage'

const mockResponse = {
  token: 'jwt-token',
  user: {
    id: 'user-123',
    name: 'Test User',
    email: 'test@example.com'
  }
}

storeUserData(mockResponse)
const userData = getUserData()
console.log(userData) // Should contain user data
```

### **Test Token Validation**
```typescript
import { isTokenExpired, getValidUserData } from '@/lib/storage'

const isExpired = isTokenExpired()
const userData = getValidUserData() // Returns null if token expired
```

## 🔒 **Security Features**

1. **Token Validation**: Automatic expiry checking
2. **Secure Storage**: Proper error handling
3. **Data Cleanup**: Automatic cleanup of expired sessions
4. **Fallback Mechanisms**: Graceful degradation

## 📝 **Usage Options**

### **Option 1: Keep Original Logic (Current)**
```typescript
// Manual localStorage operations (maintained in components)
localStorage.setItem('token', token)
localStorage.setItem('user', JSON.stringify(userData))
```

### **Option 2: Use Storage Utility (Optional)**
```typescript
import { storeUserData } from '@/lib/storage'
storeUserData(response.data)
```

### **Option 3: Hybrid Approach**
```typescript
// Use original logic for core functionality
// Use storage utility for advanced features
import { getValidUserData, isTokenExpired } from '@/lib/storage'
```

## 🎉 **Summary**

The storage utility is available as an **optional enhancement** for advanced localStorage operations. The original localStorage logic is maintained in all components, ensuring backward compatibility and no breaking changes. The utility can be used for:

- **Advanced token validation**
- **Centralized error handling** 
- **Type-safe operations**
- **Future enhancements**

All existing functionality continues to work exactly as before! 🎉
