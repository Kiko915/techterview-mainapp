# TechTerview Loading System

## 📖 Overview

This project uses Next.js 13+ App Router's built-in loading system with branded TechTerview loading screens. The loading system provides a smooth user experience with branded animations and contextual loading messages.

## 🔧 How It Works

### Next.js Loading Files
In the App Router, `loading.js` files automatically create loading UI that wraps page components. The loading UI shows immediately while the page content is being loaded.

```
src/app/
├── loading.js                    # Global loading for all routes
├── dashboard/
│   ├── loading.js               # Dashboard main loading
│   ├── account/
│   │   └── loading.js           # Account page loading
│   ├── settings/
│   │   └── loading.js           # Settings page loading
│   ├── coding-challenge/
│   │   └── loading.js           # Coding challenge loading
│   └── mock-interviews/
│       └── loading.js           # Mock interviews loading
```

## 🎨 Components

### 1. `TechTerviewLoader`
**Location:** `src/components/ui/loading.jsx`

Main branded loading component with:
- ✅ Animated TechTerview logo with spinning border
- ✅ Pulsing brand colors ([#354fd2])
- ✅ Customizable loading message
- ✅ Bouncing dots animation
- ✅ Responsive design

**Usage:**
```jsx
import { TechTerviewLoader } from "@/components/ui/loading";

export default function Loading() {
  return <TechTerviewLoader message="Loading your dashboard..." />;
}
```

### 2. `DashboardSkeleton`
**Location:** `src/components/ui/loading.jsx`

Dashboard-specific skeleton with:
- ✅ Sidebar skeleton (menu items)
- ✅ Top navigation skeleton
- ✅ Content grid skeleton
- ✅ Realistic dashboard layout preview

**Usage:**
```jsx
import { DashboardSkeleton } from "@/components/ui/loading";

export default function DashboardLoading() {
  return <DashboardSkeleton />;
}
```

### 3. `PageLoader`
**Location:** `src/components/ui/loading.jsx`

Minimal loading component for specific pages:
- ✅ Spinning border animation
- ✅ Custom title and subtitle
- ✅ Compact design for in-page loading

**Usage:**
```jsx
import { PageLoader } from "@/components/ui/loading";

export default function AccountLoading() {
  return (
    <PageLoader 
      title="Loading Account Settings"
      subtitle="Preparing your profile..."
    />
  );
}
```

## 📁 File Structure

```
src/
├── components/ui/
│   └── loading.jsx              # Reusable loading components
├── app/
│   ├── loading.js               # Global app loading
│   └── dashboard/
│       ├── loading.js           # Dashboard loading
│       ├── account/
│       │   └── loading.js       # Account loading
│       ├── settings/
│       │   └── loading.js       # Settings loading
│       ├── coding-challenge/
│       │   └── loading.js       # Coding challenge loading
│       └── mock-interviews/
│           └── loading.js       # Mock interviews loading
```

## 🎯 Loading States

### Route-Specific Messages:
- **Global:** "Loading TechTerview..."
- **Dashboard:** "Loading your dashboard..."
- **Account:** "Loading Account Settings" + "Preparing your profile and security settings..."
- **Settings:** "Loading Settings" + "Preparing your preferences and configuration..."
- **Coding Challenge:** "Preparing Coding Challenge" + "Loading challenges and test environment..."
- **Mock Interviews:** "Setting Up Mock Interview" + "Preparing interview questions and video setup..."

## 🎨 Design System

### Colors
- **Primary:** `#354fd2` (TechTerview blue)
- **Secondary:** `#4a90e2` (Lighter blue for gradients)
- **Background:** `from-gray-50 via-white to-gray-100` (Subtle gradient)

### Animations
- **Spinning Border:** 1s linear infinite rotation
- **Pulse:** 2s ease-in-out infinite opacity change
- **Bounce:** Staggered bounce animation for dots
- **Skeleton:** Pulse animation for loading placeholders

## 📱 Responsive Behavior

All loading components are fully responsive:
- ✅ **Mobile:** Compact layout with smaller logo and text
- ✅ **Tablet:** Medium-sized elements with proper spacing
- ✅ **Desktop:** Full-sized branded loading experience

## ⚡ Performance

- **Lightweight:** Minimal CSS and JavaScript
- **Instant:** Shows immediately on navigation
- **Smooth:** Seamless transitions with CSS animations
- **Accessible:** Proper ARIA labels and semantic markup

## 🔮 Future Enhancements

1. **Progress Indicators:** Add real progress tracking for file uploads/data loading
2. **Custom Animations:** Page-specific loading animations (e.g., code syntax highlighting for coding challenges)
3. **Error States:** Branded error loading states with retry buttons
4. **Preloading:** Smart preloading of commonly accessed routes

## 💡 Usage Tips

1. **Keep messages contextual** - Match loading messages to the expected content
2. **Use appropriate components** - `TechTerviewLoader` for full-page, `PageLoader` for sections
3. **Consider loading time** - For long operations, consider progress indicators
4. **Test on slow connections** - Ensure loading states look good on various connection speeds

## 🛠️ Customization

To create a new loading page:

1. Create `loading.js` in the route directory
2. Import the appropriate loading component
3. Customize the message for the context
4. Export the component

Example:
```jsx
import { PageLoader } from "@/components/ui/loading";

export default function NewFeatureLoading() {
  return (
    <PageLoader 
      title="Loading New Feature"
      subtitle="Setting up your personalized experience..."
    />
  );
}
```

---

**Status:** ✅ **COMPLETE** - Comprehensive branded loading system implemented!