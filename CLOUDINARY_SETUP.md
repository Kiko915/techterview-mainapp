# Cloudinary Setup Instructions

## 1. Create a Cloudinary Account

1. Go to [cloudinary.com](https://cloudinary.com/) and create a free account
2. After signing up, go to your Dashboard

## 2. Get Your Credentials

From your Cloudinary Dashboard, copy the following:
- **Cloud Name** - Found in your dashboard URL or account details
- **API Key** - Found in your account details (not needed for client-side uploads)
- **API Secret** - Found in your account details (not needed for client-side uploads)

## 3. Create an Upload Preset

1. Go to Settings → Upload → Upload presets
2. Click "Add upload preset"
3. Set the following settings:
   - **Preset name**: `techterview_profile_uploads` (or any name you prefer)
   - **Signing Mode**: `Unsigned` (for client-side uploads)
   - **Folder**: `techterview/profile-images` (optional, for organization)
   - **Transformation** (recommended for profile images):
     - Width: 400, Height: 400
     - Crop: Fill
     - Gravity: Face (for better face centering)
   - **Format**: Auto
   - **Quality**: Auto
   - **Access Control**: Public (for profile images)
4. Click "Save"

## 4. Update Environment Variables

Update your `.env.local` file with your Cloudinary credentials:

```env
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_actual_cloud_name_here
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=techterview_profile_uploads
```

Replace:
- `your_actual_cloud_name_here` with your actual Cloud Name from step 2
- `techterview_profile_uploads` with your upload preset name from step 3

## 5. Security Considerations

- The upload preset is set to "unsigned" for simplicity
- For production, consider implementing server-side uploads with signed URLs
- You can add upload restrictions in the upload preset (file size, format, etc.)
- Consider implementing image moderation for user-uploaded content

## 6. Features Included

- ✅ Drag and drop file upload
- ✅ Click to select file upload
- ✅ 10MB file size limit
- ✅ Image format validation (JPEG, PNG, WebP, GIF)
- ✅ Upload progress indicator
- ✅ Image preview before upload
- ✅ Automatic image optimization (400x400px, face detection)
- ✅ Integration with Firebase user profile storage

## 7. Testing

After setting up:
1. Restart your development server
2. Go to the Account page
3. Click "Upload" button on profile picture section
4. Test drag and drop or click to upload functionality

## Troubleshooting

- Make sure your environment variables are correctly set
- Check that your upload preset is set to "unsigned"
- Verify your cloud name is correct (check the dashboard URL)
- Check browser console for any error messages