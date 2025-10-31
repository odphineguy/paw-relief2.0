# Pet Images Folder

This folder is used to store uploaded pet images for the Paw Relief app.

## How to add images:

1. **Through the app**: Use the "Upload Photo" button when creating or editing a dog profile
2. **Manually**: Place image files directly in this folder

## Supported formats:
- JPG/JPEG
- PNG
- Maximum file size: 5MB

## File naming:
- Images uploaded through the app will be automatically named with the format: `{dog_name}_{timestamp}.{extension}`
- Example: `Buddy_1703123456789.jpg`

## Notes:
- Images are served from the `/assets/pet-images/` path
- For production deployment, consider using a cloud storage service like AWS S3 or Cloudinary
- Always ensure images are properly optimized for web use
