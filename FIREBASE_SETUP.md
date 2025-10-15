# Firebase Integration Setup

## Overview

Your Techterview WebApp has been successfully integrated with Firebase backend services. This includes:

- **Firebase Authentication**: Email/password and Google sign-in
- **Cloud Firestore**: NoSQL database for storing users, interviews, and questions
- **Firebase Hosting**: Ready for deployment (optional)

## Project Configuration

### Firebase Project
- **Project ID**: `techterview-webapp`
- **Project Name**: Techterview WebApp
- **Web App ID**: `1:283033835367:web:53f3024a9ce8dad4f681c2`

### Services Enabled
1. **Authentication**
   - Email/Password provider
   - Google Sign-In provider
2. **Cloud Firestore**
   - Database in `us-central1` region
3. **Firebase Storage** (configured but not yet enabled)

## File Structure

```
src/
├── lib/
│   ├── firebase.js          # Firebase configuration and auth functions
│   ├── useAuth.js          # Custom React hook for authentication
│   └── firestore.js        # Firestore database operations
├── app/auth/
│   ├── login/page.js       # Updated with Firebase authentication
│   └── signup/page.js      # Updated with Firebase authentication
└── components/
    └── AuthStatus.jsx      # Authentication status component

scripts/
└── seedData.js            # Sample data seeding script

.env.local                 # Environment variables
firebase.json              # Firebase configuration file
firestore.rules           # Firestore security rules
```

## Environment Variables

The following environment variables are configured in `.env.local`:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCW_aeuoNfRLJwD9srn726wICxtUAtzZDc
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=techterview-webapp.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=techterview-webapp
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=techterview-webapp.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=283033835367
NEXT_PUBLIC_FIREBASE_APP_ID=1:283033835367:web:53f3024a9ce8dad4f681c2
```

## Next Steps

### 1. Enable Firebase Services
Before deploying, you need to enable the required APIs:

1. Visit [Firebase Console](https://console.firebase.google.com/project/techterview-webapp)
2. Go to **Authentication** → **Sign-in method**
3. Enable **Email/Password** and **Google** providers
4. For Google Sign-in, add your domain to authorized domains

### 2. Deploy Firestore
```bash
firebase deploy --only firestore
```

### 3. Enable Firestore API
If you get API errors, visit:
https://console.developers.google.com/apis/api/firestore.googleapis.com/overview?project=techterview-webapp

### 4. Test Authentication
Your login and signup pages (`/auth/login` and `/auth/signup`) now include:
- Email/password authentication
- Google Sign-in
- Error handling
- Loading states
- Automatic redirect after successful authentication

### 5. Seed Sample Data (Optional)
Run the seeding script to populate your database with sample interview questions:

```bash
node scripts/seedData.js
```

## Available Firebase Functions

### Authentication Functions
```javascript
import { signInWithEmail, signUpWithEmail, signInWithGoogle, logOut } from '@/lib/firebase';

// Sign in with email/password
await signInWithEmail(email, password);

// Sign up with email/password  
await signUpWithEmail(email, password);

// Sign in with Google
await signInWithGoogle();

// Sign out
await logOut();
```

### Firestore Functions
```javascript
import { createUser, getUser, createInterview, getQuestions } from '@/lib/firestore';

// Create user profile
await createUser(userData);

// Get user by ID
const user = await getUser(userId);

// Create interview record
await createInterview(interviewData);

// Get questions by category/difficulty
const questions = await getQuestions('JavaScript', 'easy', 10);
```

### Authentication Hook
```javascript
import { useAuth } from '@/lib/useAuth';

function MyComponent() {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please sign in</div>;
  
  return <div>Welcome {user.email}!</div>;
}
```

## Data Models

### User Document
```javascript
{
  uid: "firebase-uid",
  email: "user@example.com",
  displayName: "User Name",
  profileComplete: false,
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp()
}
```

### Interview Document  
```javascript
{
  userId: "firebase-uid",
  title: "Frontend Developer Interview",
  company: "Tech Corp",
  position: "Frontend Developer",
  status: "scheduled|completed|cancelled",
  scheduledDate: timestamp,
  duration: 3600, // seconds
  questions: ["question-id-1", "question-id-2"],
  responses: [...],
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp()
}
```

### Question Document
```javascript
{
  question: "What is the difference between let, const, and var?",
  category: "JavaScript",
  difficulty: "easy",
  type: "technical|behavioral|experience",
  tags: ["variables", "scope", "hoisting"],
  sampleAnswer: "...",
  followUpQuestions: ["..."],
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp()
}
```

## Security Rules

The Firestore security rules are configured to:
- Allow authenticated users to read/write their own data
- Prevent unauthorized access
- Include temporary open access (expires tomorrow) for development

## Deployment

To deploy to Firebase Hosting:

```bash
# Build your Next.js app
npm run build

# Initialize hosting (if not done)
firebase init hosting

# Deploy
firebase deploy
```

## Troubleshooting

### Common Issues
1. **API not enabled**: Visit the Google Cloud Console to enable required APIs
2. **CORS errors**: Add your domain to Firebase Auth authorized domains  
3. **Environment variables**: Ensure `.env.local` is not in `.gitignore`
4. **Import errors**: Check that all Firebase imports use the v9+ SDK syntax

### Support
- [Firebase Documentation](https://firebase.google.com/docs)
- [Next.js with Firebase Guide](https://firebase.google.com/docs/web/setup#add-sdk-and-initialize)
- [Firebase Console](https://console.firebase.google.com/)

Your Firebase backend is now ready to support your Techterview WebApp's authentication, data storage, and user management needs!