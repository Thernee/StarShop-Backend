# File Upload & Media Management Module

This module provides file upload functionality with support for both Cloudinary and AWS S3 storage providers. It allows for uploading, retrieving, and deleting files with proper metadata tracking.

## Features

- File upload to Cloudinary or AWS S3
- File metadata storage in database
- User-specific file management
- File type categorization (image, document, other)
- Secure access control

## Installation

1. Install the required packages:

```bash
npm install cloudinary multer multer-storage-cloudinary @aws-sdk/client-s3 multer-s3 uuid
```

2. Set up environment variables in your `.env` file:

```
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=your_region
AWS_S3_BUCKET=your_bucket_name

FILE_UPLOAD_LIMIT=10
```

## Usage

### Module Integration

1. Import the module routes in your main application:

```typescript
import { fileRoutes } from './modules/files';
import express from 'express';

const app = express();

// Use file routes
app.use('/files', fileRoutes);
```

### API Endpoints

#### Upload a File to Cloudinary

```
POST /files/upload
```

Requirements:
- Authentication required
- Form data with a field named 'file'

#### Upload a File to AWS S3

```
POST /files/upload/s3
```

Requirements:
- Authentication required
- Form data with a field named 'file'

#### Get User Files

```
GET /files/my
```

Requirements:
- Authentication required

#### Get File by ID

```
GET /files/:id
```

#### Get Files by Type

```
GET /files/type/:type
```

Valid types: 'image', 'document', 'other'

#### Delete a File

```
DELETE /files/:id
```

Requirements:
- Authentication required
- User must be the owner of the file

## Implementation Details

### File Entity

The file entity stores metadata about uploaded files:

- `id`: UUID identifier
- `url`: Public URL to access the file
- `type`: File type (image, document, other)
- `filename`: Original filename
- `mimetype`: MIME type
- `size`: File size in bytes
- `providerType`: Storage provider ('cloudinary' or 's3')
- `providerPublicId`: Provider-specific identifier
- `uploadedBy`: User who uploaded the file
- `uploadedAt`: Upload timestamp

### Storage Providers

#### Cloudinary

Cloudinary is configured to store files in organized folders based on file type:
- Images -> `/images/`
- Documents -> `/documents/`
- Other files -> `/other/`

#### AWS S3

S3 storage follows a similar organization pattern as Cloudinary, with files sorted into folders based on type.

## Testing

Run tests using:

```bash
npm test
```

## Security Considerations

- File size is limited to 10MB
- Only specific file types are allowed (images, documents)
- Authentication is required for upload and deletion
- Users can only delete their own files