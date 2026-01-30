/* global gapi */

class GoogleDriveService {
  constructor() {
    this.isInitialized = false;
    this.isSignedIn = false;
    this.accessToken = null;
  }

  // Initialize Google API
  async initClient() {
    try {
      if (this.isInitialized) return true;

      await new Promise((resolve) => {
        gapi.load("client:auth2", resolve);
      });

      await gapi.client.init({
        apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
        clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        discoveryDocs: [import.meta.env.VITE_GOOGLE_DISCOVERY_DOCS],
        scope: import.meta.env.VITE_GOOGLE_SCOPES,
      });

      // Listen for sign-in state changes
      gapi.auth2.getAuthInstance().isSignedIn.listen((isSignedIn) => {
        this.isSignedIn = isSignedIn;
        if (isSignedIn) {
          this.accessToken = gapi.auth2
            .getAuthInstance()
            .currentUser.get()
            .getAuthResponse().access_token;
        }
      });

      // Check if already signed in
      this.isSignedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
      if (this.isSignedIn) {
        this.accessToken = gapi.auth2
          .getAuthInstance()
          .currentUser.get()
          .getAuthResponse().access_token;
      }

      this.isInitialized = true;
      console.log("Google Drive API initialized successfully");
      return true;
    } catch (error) {
      console.error("Error initializing Google Drive API:", error);
      throw error;
    }
  }

  // Sign in to Google
  async signIn() {
    try {
      if (!this.isInitialized) {
        await this.initClient();
      }

      const authInstance = gapi.auth2.getAuthInstance();
      await authInstance.signIn();
      this.isSignedIn = true;
      this.accessToken = authInstance
        .currentUser.get()
        .getAuthResponse().access_token;

      return true;
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  }

  // Sign out from Google
  async signOut() {
    try {
      if (!this.isInitialized) return;

      const authInstance = gapi.auth2.getAuthInstance();
      await authInstance.signOut();
      this.isSignedIn = false;
      this.accessToken = null;

      return true;
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  }

  // Get user profile
  async getUserProfile() {
    try {
      if (!this.isSignedIn) {
        throw new Error("User not signed in");
      }

      const user = gapi.auth2.getAuthInstance().currentUser.get();
      const profile = user.getBasicProfile();

      return {
        id: profile.getId(),
        name: profile.getName(),
        email: profile.getEmail(),
        imageUrl: profile.getImageUrl(),
      };
    } catch (error) {
      console.error("Error getting user profile:", error);
      throw error;
    }
  }

  // List files from Google Drive
  async listFiles(pageSize = 100, pageToken = null) {
    try {
      if (!this.isSignedIn) {
        throw new Error("User not signed in");
      }

      const params = {
        pageSize: pageSize,
        fields:
          "nextPageToken, files(id, name, mimeType, size, createdTime, modifiedTime, thumbnailLink, webViewLink, webContentLink, iconLink, parents)",
        orderBy: "modifiedTime desc",
      };

      if (pageToken) {
        params.pageToken = pageToken;
      }

      const response = await gapi.client.drive.files.list(params);
      return response.result;
    } catch (error) {
      console.error("Error listing files:", error);
      throw error;
    }
  }

  // Search files
  async searchFiles(query) {
    try {
      if (!this.isSignedIn) {
        throw new Error("User not signed in");
      }

      const response = await gapi.client.drive.files.list({
        q: `name contains '${query}' and trashed=false`,
        pageSize: 50,
        fields:
          "files(id, name, mimeType, size, createdTime, modifiedTime, thumbnailLink, webViewLink, webContentLink, iconLink)",
        orderBy: "modifiedTime desc",
      });

      return response.result.files;
    } catch (error) {
      console.error("Error searching files:", error);
      throw error;
    }
  }

  // Get file by ID
  async getFile(fileId) {
    try {
      if (!this.isSignedIn) {
        throw new Error("User not signed in");
      }

      const response = await gapi.client.drive.files.get({
        fileId: fileId,
        fields:
          "id, name, mimeType, size, createdTime, modifiedTime, thumbnailLink, webViewLink, webContentLink, iconLink, description",
      });

      return response.result;
    } catch (error) {
      console.error("Error getting file:", error);
      throw error;
    }
  }

  // Download file
  async downloadFile(fileId, fileName) {
    try {
      if (!this.isSignedIn || !this.accessToken) {
        throw new Error("User not signed in");
      }

      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to download file");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      console.error("Error downloading file:", error);
      throw error;
    }
  }

  // Create folder
  async createFolder(folderName, parentId = null) {
    try {
      if (!this.isSignedIn) {
        throw new Error("User not signed in");
      }

      const fileMetadata = {
        name: folderName,
        mimeType: "application/vnd.google-apps.folder",
      };

      if (parentId) {
        fileMetadata.parents = [parentId];
      }

      const response = await gapi.client.drive.files.create({
        resource: fileMetadata,
        fields: "id, name",
      });

      return response.result;
    } catch (error) {
      console.error("Error creating folder:", error);
      throw error;
    }
  }

  // Upload file
  async uploadFile(file, parentId = null) {
    try {
      if (!this.isSignedIn || !this.accessToken) {
        throw new Error("User not signed in");
      }

      const metadata = {
        name: file.name,
        mimeType: file.type,
      };

      if (parentId) {
        metadata.parents = [parentId];
      }

      const form = new FormData();
      form.append(
        "metadata",
        new Blob([JSON.stringify(metadata)], { type: "application/json" })
      );
      form.append("file", file);

      const response = await fetch(
        "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,size",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
          body: form,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      return await response.json();
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  }

  // Delete file
  async deleteFile(fileId) {
    try {
      if (!this.isSignedIn) {
        throw new Error("User not signed in");
      }

      await gapi.client.drive.files.delete({
        fileId: fileId,
      });

      return true;
    } catch (error) {
      console.error("Error deleting file:", error);
      throw error;
    }
  }

  // Get storage quota
  async getStorageQuota() {
    try {
      if (!this.isSignedIn) {
        throw new Error("User not signed in");
      }

      const response = await gapi.client.drive.about.get({
        fields: "storageQuota, user",
      });

      return response.result.storageQuota;
    } catch (error) {
      console.error("Error getting storage quota:", error);
      throw error;
    }
  }

  // Format file size
  formatFileSize(bytes) {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  }

  // Get file icon based on mime type
  getFileIcon(mimeType) {
    if (!mimeType) return "📄";

    if (mimeType.includes("folder")) return "📁";
    if (mimeType.includes("image")) return "🖼️";
    if (mimeType.includes("video")) return "🎥";
    if (mimeType.includes("audio")) return "🎵";
    if (mimeType.includes("pdf")) return "📕";
    if (
      mimeType.includes("document") ||
      mimeType.includes("word") ||
      mimeType.includes("text")
    )
      return "📝";
    if (mimeType.includes("spreadsheet") || mimeType.includes("excel"))
      return "📊";
    if (mimeType.includes("presentation") || mimeType.includes("powerpoint"))
      return "📽️";
    if (mimeType.includes("zip") || mimeType.includes("compressed"))
      return "📦";

    return "📄";
  }
}

const googleDriveService = new GoogleDriveService();
export default googleDriveService;
