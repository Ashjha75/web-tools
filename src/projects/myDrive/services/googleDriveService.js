/* global gapi */

class GoogleDriveService {
  constructor() {
    this.accessToken = null;
    this.tokenClient = null;
  }

  // Initialize Google Identity Services
  async initClient() {
    try {
      if (this.tokenClient) return true;

      // Load the Google Identity Services library
      await new Promise((resolve, reject) => {
        if (window.google?.accounts?.oauth2) {
          resolve();
        } else {
          const script = document.createElement("script");
          script.src = "https://accounts.google.com/gsi/client";
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        }
      });

      // Initialize token client
      this.tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        scope: import.meta.env.VITE_GOOGLE_SCOPES,
        callback: (response) => {
          if (response.access_token) {
            this.accessToken = response.access_token;
          }
        },
      });

      console.log("Google Identity Services initialized successfully");
      return true;
    } catch (error) {
      console.error("Error initializing Google Identity Services:", error);
      throw error;
    }
  }

  // Sign in to Google
  async signIn() {
    try {
      if (!this.tokenClient) {
        await this.initClient();
      }

      return new Promise((resolve, reject) => {
        this.tokenClient.callback = (response) => {
          if (response.error) {
            reject(response);
          } else {
            this.accessToken = response.access_token;
            resolve(true);
          }
        };
        this.tokenClient.requestAccessToken({ prompt: "consent" });
      });
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  }

  // Sign out from Google
  async signOut() {
    try {
      if (this.accessToken) {
        await window.google.accounts.oauth2.revoke(this.accessToken);
        this.accessToken = null;
      }
      return true;
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  }

  // Check if signed in
  isSignedIn() {
    return !!this.accessToken;
  }

  // Get user profile
  async getUserProfile() {
    try {
      if (!this.accessToken) {
        throw new Error("User not signed in");
      }

      const response = await fetch(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get user profile");
      }

      return await response.json();
    } catch (error) {
      console.error("Error getting user profile:", error);
      throw error;
    }
  }

  // List files from Google Drive
  async listFiles(pageSize = 100, pageToken = null) {
    try {
      if (!this.accessToken) {
        throw new Error("User not signed in");
      }

      let url = `https://www.googleapis.com/drive/v3/files?pageSize=${pageSize}&fields=nextPageToken,files(id,name,mimeType,size,createdTime,modifiedTime,thumbnailLink,webViewLink,webContentLink,iconLink,parents)&orderBy=modifiedTime desc`;

      if (pageToken) {
        url += `&pageToken=${pageToken}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to list files");
      }

      return await response.json();
    } catch (error) {
      console.error("Error listing files:", error);
      throw error;
    }
  }

  // Search files
  async searchFiles(query) {
    try {
      if (!this.accessToken) {
        throw new Error("User not signed in");
      }

      const url = `https://www.googleapis.com/drive/v3/files?q=name contains '${encodeURIComponent(
        query
      )}' and trashed=false&pageSize=50&fields=files(id,name,mimeType,size,createdTime,modifiedTime,thumbnailLink,webViewLink,webContentLink,iconLink)&orderBy=modifiedTime desc`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to search files");
      }

      const result = await response.json();
      return result.files;
    } catch (error) {
      console.error("Error searching files:", error);
      throw error;
    }
  }

  // Get file by ID
  async getFile(fileId) {
    try {
      if (!this.accessToken) {
        throw new Error("User not signed in");
      }

      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?fields=id,name,mimeType,size,createdTime,modifiedTime,thumbnailLink,webViewLink,webContentLink,iconLink,description`,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get file");
      }

      return await response.json();
    } catch (error) {
      console.error("Error getting file:", error);
      throw error;
    }
  }

  // Download file
  async downloadFile(fileId, fileName) {
    try {
      if (!this.accessToken) {
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
      if (!this.accessToken) {
        throw new Error("User not signed in");
      }

      const fileMetadata = {
        name: folderName,
        mimeType: "application/vnd.google-apps.folder",
      };

      if (parentId) {
        fileMetadata.parents = [parentId];
      }

      const response = await fetch(
        "https://www.googleapis.com/drive/v3/files?fields=id,name",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(fileMetadata),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create folder");
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating folder:", error);
      throw error;
    }
  }

  // Upload file
  async uploadFile(file, parentId = null) {
    try {
      if (!this.accessToken) {
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
      if (!this.accessToken) {
        throw new Error("User not signed in");
      }

      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete file");
      }

      return true;
    } catch (error) {
      console.error("Error deleting file:", error);
      throw error;
    }
  }

  // Get storage quota
  async getStorageQuota() {
    try {
      if (!this.accessToken) {
        throw new Error("User not signed in");
      }

      const response = await fetch(
        "https://www.googleapis.com/drive/v3/about?fields=storageQuota,user",
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get storage quota");
      }

      const result = await response.json();
      return result.storageQuota;
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
