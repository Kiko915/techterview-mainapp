# Firebase Storage Setup and Usage Guide

## What's Configured

✅ **Firebase Storage Rules** - Located in `storage.rules`
✅ **Firebase Configuration** - Updated `firebase.json`

## Security Rules Explained

Your storage rules include three main patterns:

1. **Public Images** (`/images/{imageId}`)
   - Anyone can read
   - Only authenticated users can upload
   - Max size: 5MB
   - Images only

2. **User Private Files** (`/users/{userId}/{allPaths=**}`)
   - Users can only access their own files
   - Full read/write access to own folder

3. **Profile Pictures** (`/profile-pictures/{userId}`)
   - Anyone can read (for displaying profiles)
   - Users can only upload their own
   - Max size: 2MB
   - Images only

## Installation

Install the Firebase SDK:

```bash
npm install firebase
```

## Basic Setup

```javascript
// firebase.js
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  // Your config object
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
```

## Usage Examples

### 1. Upload a File

```javascript
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

async function uploadFile(file, path) {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    console.log('File uploaded successfully!');
    return downloadURL;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
}

// Usage
const file = event.target.files[0];
const url = await uploadFile(file, `images/${Date.now()}_${file.name}`);
```

### 2. Upload with Progress

```javascript
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

function uploadWithProgress(file, path, onProgress) {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress(progress);
      },
      (error) => reject(error),
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadURL);
      }
    );
  });
}
```

### 3. Profile Picture Upload

```javascript
async function uploadProfilePicture(userId, file) {
  if (!file.type.startsWith('image/')) {
    throw new Error('Only images are allowed');
  }
  
  if (file.size > 2 * 1024 * 1024) { // 2MB
    throw new Error('File too large');
  }
  
  const path = `profile-pictures/${userId}`;
  return await uploadFile(file, path);
}
```

### 4. Delete a File

```javascript
import { ref, deleteObject } from 'firebase/storage';

async function deleteFile(path) {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
    console.log('File deleted successfully');
  } catch (error) {
    console.error('Delete failed:', error);
    throw error;
  }
}
```

### 5. List Files

```javascript
import { ref, listAll, getDownloadURL } from 'firebase/storage';

async function listFiles(path) {
  try {
    const storageRef = ref(storage, path);
    const result = await listAll(storageRef);
    
    const fileUrls = await Promise.all(
      result.items.map(async (itemRef) => ({
        name: itemRef.name,
        url: await getDownloadURL(itemRef)
      }))
    );
    
    return fileUrls;
  } catch (error) {
    console.error('List failed:', error);
    throw error;
  }
}
```

## React Hook Example

```javascript
// useFirebaseStorage.js
import { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

export function useFirebaseStorage() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadFile = (file, path) => {
    return new Promise((resolve, reject) => {
      setUploading(true);
      setProgress(0);

      const storageRef = ref(storage, path);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
        },
        (error) => {
          setUploading(false);
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setUploading(false);
          setProgress(0);
          resolve(downloadURL);
        }
      );
    });
  };

  return { uploadFile, uploading, progress };
}
```

## Deployment

Deploy your storage rules:

```bash
firebase deploy --only storage
```

Or deploy everything:

```bash
firebase deploy
```

## Next Steps

1. **Get Firebase Config**: Use `firebase_get_sdk_config` to get your Firebase configuration
2. **Install Dependencies**: `npm install firebase`
3. **Initialize Firebase**: Create your Firebase configuration file
4. **Test Upload**: Try uploading a file to verify everything works
5. **Deploy Rules**: Run `firebase deploy --only storage`

## Security Notes

- Files in the `/images/` folder are publicly readable
- User folders (`/users/{userId}/`) are private to each user
- Profile pictures are readable by all but only writable by the owner
- File size limits are enforced (5MB for images, 2MB for profile pictures)
- Only image files are allowed for profile pictures and general images