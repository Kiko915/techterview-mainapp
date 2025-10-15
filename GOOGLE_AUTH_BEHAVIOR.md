# Google Authentication Behavior

## Overview

The Google Sign-In/Sign-Up functionality has been updated to behave differently on login vs signup pages to prevent account creation during login attempts.

## New Behavior

### Login Page (`/auth/login`)

**Google Sign-In Button**: "Sign in with Google"

**Behavior**:
- ✅ **Existing User**: If the Google account is already associated with a user in our Firestore database, the user signs in successfully
- ❌ **New User**: If the Google account is NOT in our database, the user is signed out immediately and receives an error:
  > "No account found with this Google account. Please sign up first."

### Signup Page (`/auth/signup`) 

**Google Sign-Up Button**: "Sign up with Google"

**Behavior**:
- ✅ **New User**: Creates a new Firebase Auth account and Firestore user profile, then redirects to onboarding
- ❌ **Existing User**: If the Google account already exists in our database, the account creation is cancelled and shows error:
  > "An account with this Google email already exists. Please sign in instead."

## Technical Implementation

### Login Page Logic
```javascript
import { signInWithGoogleExistingOnly } from '@/lib/firebase';

const handleGoogleSignIn = async () => {
  try {
    await signInWithGoogleExistingOnly();
    // Success - redirect to onboarding/dashboard
  } catch (error) {
    // Error shown: "No account found with this Google account. Please sign up first."
  }
};
```

### Signup Page Logic
```javascript
import { signUpWithGoogle } from '@/lib/firebase';

const handleGoogleSignUp = async () => {
  try {
    const userCredential = await signUpWithGoogle();
    
    // Check if user already exists in Firestore
    const existingUser = await getUserByEmail(userCredential.user.email);
    
    if (existingUser) {
      await userCredential.user.delete(); // Clean up Firebase Auth
      setError('An account with this Google email already exists. Please sign in instead.');
      return;
    }
    
    // Create new user profile and redirect to onboarding
    await createUser({ ... });
  } catch (error) {
    // Handle other errors
  }
};
```

### Firebase Functions

#### `signInWithGoogleExistingOnly()`
- Attempts Google Sign-In
- Checks if user exists in Firestore database
- If user doesn't exist: signs out immediately and throws error
- If user exists: proceeds with sign-in

#### `signUpWithGoogle()`
- Attempts Google Sign-In (which can create new Firebase Auth accounts)
- Returns the user credential for further processing
- The signup page then handles checking for existing users

## User Experience

### Scenario 1: New User Journey
1. User goes to `/auth/signup`
2. Clicks "Sign up with Google" 
3. Completes Google OAuth
4. **If account is new**: Creates profile → redirects to onboarding
5. **If account exists**: Shows error message suggesting to use login page

### Scenario 2: Existing User Journey  
1. User goes to `/auth/login`
2. Clicks "Sign in with Google"
3. Completes Google OAuth
4. **If account exists in database**: Signs in → redirects based on onboarding status
5. **If account doesn't exist**: Shows error message suggesting to use signup page

### Scenario 3: Wrong Page Usage
- **Existing user tries signup**: Error message directs them to login
- **New user tries login**: Error message directs them to signup

## Error Messages

| Scenario | Page | Error Message |
|----------|------|---------------|
| New user tries to login | `/auth/login` | "No account found with this Google account. Please sign up first." |
| Existing user tries to signup | `/auth/signup` | "An account with this Google email already exists. Please sign in instead." |
| Popup cancelled | Any | "Sign-in was cancelled." or "Sign-up was cancelled." |

## Testing the Behavior

### Test 1: New User Signup
1. Go to `/auth/signup`
2. Click "Sign up with Google" 
3. Use a Google account not yet registered
4. **Expected**: Account created → redirected to onboarding

### Test 2: New User Login (Should Fail)
1. Use a Google account not yet registered
2. Go to `/auth/login` 
3. Click "Sign in with Google"
4. **Expected**: Error message about no account found

### Test 3: Existing User Login
1. Complete Test 1 first to create an account
2. Sign out completely
3. Go to `/auth/login`
4. Click "Sign in with Google" with the same account
5. **Expected**: Successful login → redirected to dashboard

### Test 4: Existing User Signup (Should Fail)
1. Use a Google account that's already registered
2. Go to `/auth/signup`
3. Click "Sign up with Google"
4. **Expected**: Error message about account already existing

## Benefits

✅ **Clear Separation**: Login and signup have distinct behaviors
✅ **No Accidental Accounts**: Can't accidentally create accounts during login
✅ **Better UX**: Clear error messages guide users to the correct page  
✅ **Data Integrity**: Prevents duplicate or orphaned accounts
✅ **User Intent**: Respects whether user intended to login vs signup

This ensures that Google authentication behaves predictably and prevents the confusion of automatic account creation during login attempts.