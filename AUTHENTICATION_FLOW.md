# Firebase Authentication Flow Documentation

## Overview

Your Techterview WebApp now has a complete authentication and onboarding flow implemented with Firebase.

## Authentication Flow

### 1. User Registration/Login
- **Signup (`/auth/signup`)**: New users register with email/password or Google
- **Login (`/auth/login`)**: Existing users sign in with email/password or Google
- After successful authentication, users are redirected to `/onboarding`

### 2. Onboarding Process
- **Onboarding (`/onboarding`)**: Required for all users who haven't completed onboarding
- Collects: Username, Full Name, Role (Recruiter/Candidate), Skill (Frontend/Backend/UI-UX), Experience Level (Beginner/Intermediate/Expert)
- After completion, users are redirected to `/dashboard`

### 3. Protected Dashboard
- **Dashboard (`/dashboard`)**: Only accessible to authenticated and onboarded users
- Shows personalized content based on user profile
- Includes logout functionality

## Components

### AuthGuard Component
The `AuthGuard` component protects routes and manages the authentication flow:

```jsx
import AuthGuard from '@/components/AuthGuard';

// For pages that require onboarding to be completed
<AuthGuard requireOnboarding={true}>
  {children}
</AuthGuard>

// For pages that require authentication but not onboarding
<AuthGuard requireOnboarding={false}>
  {children}
</AuthGuard>
```

### Firebase Utilities

#### Authentication Functions
```javascript
import { signInWithEmail, signUpWithEmail, signInWithGoogle, logOut } from '@/lib/firebase';
import { useAuth } from '@/lib/useAuth';

// In your component
const { user, loading } = useAuth();

// Sign in/up functions
await signInWithEmail(email, password);
await signUpWithEmail(email, password);
await signInWithGoogle();
await logOut();
```

#### Firestore Operations
```javascript
import { createUser, getUserByUID, updateUser } from '@/lib/firestore';

// Create user profile (during signup)
await createUser({
  uid: user.uid,
  email: user.email,
  displayName: 'User Name',
  onboardingCompleted: false
});

// Get user profile
const profile = await getUserByUID(user.uid);

// Update user profile (during onboarding)
await updateUser(user.uid, {
  username: 'johndoe',
  role: 'candidate',
  skill: 'Frontend Development',
  experienceLevel: 'Intermediate',
  onboardingCompleted: true
});
```

## Data Structure

### User Document in Firestore
```javascript
{
  uid: "firebase-auth-uid",
  email: "user@example.com",
  displayName: "John Doe",
  username: "johndoe",
  role: "candidate", // or "recruiter"
  skill: "Frontend Development", // or "Backend Development", "UI/UX"
  experienceLevel: "Intermediate", // or "Beginner", "Expert"
  profileComplete: true,
  onboardingCompleted: true,
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp()
}
```

## Route Protection

### Automatic Redirects
The AuthGuard handles all redirects automatically:

1. **Not authenticated** → `/auth/login`
2. **Authenticated but not onboarded** → `/onboarding` 
3. **Authenticated and onboarded** → `/dashboard`
4. **Already onboarded trying to access onboarding** → `/dashboard`

### Usage in Pages

#### Dashboard Layout (Already Implemented)
```javascript
export default function DashboardLayout({ children }) {
  return (
    <AuthGuard requireOnboarding={true}>
      {/* Dashboard UI */}
    </AuthGuard>
  );
}
```

#### Other Protected Pages
```javascript
"use client";
import AuthGuard from '@/components/AuthGuard';

export default function SomeProtectedPage() {
  return (
    <AuthGuard requireOnboarding={true}>
      <div>Protected content here</div>
    </AuthGuard>
  );
}
```

#### Pages That Don't Require Onboarding
```javascript
"use client";
import AuthGuard from '@/components/AuthGuard';

export default function ProfilePage() {
  return (
    <AuthGuard requireOnboarding={false}>
      <div>User can access even without onboarding</div>
    </AuthGuard>
  );
}
```

## User Experience Flow

### New User Journey
1. Visit `/auth/signup`
2. Register with email/password or Google
3. Automatically redirected to `/onboarding`
4. Complete 6-step onboarding process
5. Redirected to `/dashboard`
6. Access to all dashboard features

### Returning User Journey
1. Visit `/auth/login`
2. Sign in with credentials
3. AuthGuard checks onboarding status:
   - If not onboarded: → `/onboarding`
   - If onboarded: → `/dashboard`

### Dashboard Features
- Personalized welcome message with user's name
- User avatar with initials in navbar
- Dropdown menu showing user info
- Functional logout button
- Protected navigation to all dashboard sections

## Testing the Flow

1. **Test New User Registration**:
   ```bash
   npm run dev
   # Visit http://localhost:3000/auth/signup
   # Register with new account
   # Should redirect to onboarding
   ```

2. **Test Onboarding**:
   - Complete all 6 steps
   - Verify data is saved to Firestore
   - Should redirect to dashboard

3. **Test Login Flow**:
   - Sign out from dashboard
   - Login with existing account
   - Should skip onboarding and go to dashboard

4. **Test Route Protection**:
   - Try accessing `/dashboard` while logged out
   - Should redirect to `/auth/login`

## Firebase Console Monitoring

Monitor your authentication and database in the Firebase Console:
- **Authentication**: https://console.firebase.google.com/project/techterview-webapp/authentication
- **Firestore**: https://console.firebase.google.com/project/techterview-webapp/firestore

Your authentication flow is now complete and ready for production use!