# Mydrive - Cloud Storage Project

A personal cloud storage application built with React and Appwrite Storage API.

## Features

- 📤 **File Upload**: Drag-and-drop or click to upload any file type
- 📋 **File Management**: View all uploaded files with details (name, size, date)
- 📥 **Download**: Download any file to your local machine
- ✏️ **Rename**: Rename files directly in the UI
- 🗑️ **Delete**: Remove files securely
- 📊 **Storage Stats**: View total files and storage usage
- 🎨 **Modern UI**: Beautiful gradient design with smooth animations

## Setup Instructions

### 1. Appwrite Configuration

1. Go to your Appwrite Console
2. Create a new Storage Bucket:
   - Navigate to **Storage** section
   - Click **Create Bucket**
   - Give it a name (e.g., "Mydrive")
   - Copy the **Bucket ID**

3. Set Bucket Permissions:
   - Go to bucket **Settings** > **Permissions**
   - Add permission: `role:member` with Read, Create, Update, Delete access
   - Or add `role:all` for public access (not recommended for production)

### 2. Environment Variables

Add these variables to your `.env` file:

```env
VITE_MYDRIVE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_MYDRIVE_APPWRITE_PROJECT_ID=your_project_id_here
VITE_MYDRIVE_BUCKET_ID=your_bucket_id_here
```

Replace:
- `your_project_id_here` with your Appwrite Project ID
- `your_bucket_id_here` with your Storage Bucket ID

### 3. Run the Application

```bash
npm run dev
```

Navigate to `/projects/mydrive` to access Mydrive.

## File Structure

```
src/projects/myDrive/
├── assets/
│   └── logo.svg              # Mydrive logo
├── components/
│   ├── FileUpload.jsx        # Upload component with drag-and-drop
│   └── FileList.jsx          # File list with CRUD operations
├── services/
│   ├── appwriteConfig.js     # Appwrite client configuration
│   └── fileService.js        # File operations service layer
└── MyDrive.jsx               # Main page component
```

## Technologies Used

- **React 19**: UI framework
- **Appwrite**: Backend and storage
- **Framer Motion**: Animations
- **Lucide React**: Icons
- **React Hot Toast**: Notifications
- **Tailwind CSS**: Styling

## API Methods

The `fileService` provides:
- `uploadFile(file, onProgress)` - Upload with progress tracking
- `listFiles(limit, offset)` - List all files
- `getFileDownload(fileId)` - Get download URL
- `deleteFile(fileId, fileName)` - Delete file
- `updateFile(fileId, newName)` - Rename file
- `getFile(fileId)` - Get file details

## Security Notes

- Files are stored in Appwrite Storage
- Access is controlled by Appwrite permissions
- User must be authenticated to access Mydrive
- Always use role-based permissions in production

## Future Enhancements

- [ ] File preview for images/PDFs
- [ ] Folder organization
- [ ] File sharing with links
- [ ] Search and filter files
- [ ] Bulk operations
- [ ] File versioning

## Support

For issues or questions, please open an issue on the repository.
