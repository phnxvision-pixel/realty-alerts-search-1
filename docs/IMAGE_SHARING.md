# Image Sharing in Chat

## Overview
The Apartment Finder Pro messaging system now supports image sharing with a complete feature set including gallery selection, camera capture, cloud storage, and full-screen viewing with pinch-to-zoom.

## Features

### 1. Image Selection
- **Gallery Selection**: Choose multiple images from device photo library
- **Camera Capture**: Take new photos directly from the chat interface
- **Permission Handling**: Automatic permission requests for camera and gallery access

### 2. Image Upload
- **Cloud Storage**: Images uploaded to Supabase storage bucket `chat-images`
- **Organized Structure**: Images stored in folders by conversation ID
- **Progress Indicator**: Visual feedback during upload process
- **Multiple Images**: Support for uploading multiple images at once

### 3. Image Display
- **Thumbnail View**: Images displayed as 200x200 thumbnails in chat bubbles
- **Message Alignment**: Images follow same alignment as text messages (right for sender, left for receiver)
- **Tap to View**: Tap any image thumbnail to open full-screen viewer

### 4. Full-Screen Viewer
- **Pinch-to-Zoom**: Zoom in/out on images with pinch gesture
- **High Quality**: Full resolution images displayed
- **Easy Close**: Tap close button or swipe to dismiss

## Components

### ImagePickerButton
Location: `components/ImagePickerButton.tsx`

Provides image selection interface with options for:
- Taking a new photo with camera
- Selecting from photo gallery
- Multiple image selection support

### ImageViewer
Location: `components/ImageViewer.tsx`

Full-screen image viewer with:
- Pinch-to-zoom gesture support
- Smooth animations with React Native Reanimated
- Close button overlay
- Black background for focus

## Database Schema

Images are stored as messages with:
- `message_type`: 'image'
- `file_url`: Public URL to the image in Supabase storage
- `content`: 'Image' (placeholder text)

All other message features work with images:
- Read receipts
- Timestamps
- Emoji reactions
- Real-time updates

## Storage Structure

```
chat-images/
  └── {conversation_id}/
      ├── {timestamp}_{random}.jpg
      ├── {timestamp}_{random}.jpg
      └── ...
```

## Usage

### Sending Images
1. Tap the image icon in the chat input area
2. Choose "Take Photo" or "Choose from Gallery"
3. Select one or multiple images
4. Images upload automatically and appear in chat

### Viewing Images
1. Tap any image thumbnail in the chat
2. Image opens in full-screen viewer
3. Pinch to zoom in/out
4. Tap X button to close

## Technical Details

### Image Upload Process
1. User selects images via ImagePickerButton
2. Images converted to base64 format
3. Uploaded to Supabase storage with unique filenames
4. Public URLs generated for each image
5. Message records created with image URLs
6. Real-time updates notify other user

### Permissions Required
- Camera access (for taking photos)
- Photo library access (for selecting images)

### File Format
- Images stored as JPEG
- Automatic compression to 80% quality
- Unique filenames prevent conflicts

## Future Enhancements
- Image compression before upload
- Video sharing support
- File sharing (PDF, documents)
- Image editing before sending
- Image captions
