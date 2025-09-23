// Cloudinary configuration using environment variables
export const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'di64iiq19';
export const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'civic-issues';
export const CLOUDINARY_API_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

// Debug logging
console.log('Cloudinary Config:', {
  cloudName: CLOUDINARY_CLOUD_NAME,
  preset: CLOUDINARY_UPLOAD_PRESET,
  envCloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  envPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
});

// Validation
if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
  console.error('Missing Cloudinary configuration. Please set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in your .env file');
}


