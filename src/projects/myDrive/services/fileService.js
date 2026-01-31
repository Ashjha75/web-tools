import { storage, BUCKET_ID, account } from "./appwriteConfig";
import { ID, Permission, Role } from "appwrite";
import toast from "react-hot-toast";
import { File, Image, Video, Music, FileText, Archive } from "lucide-react";

class FileService {
  // Upload a file
  async uploadFile(file, onProgress) {
    try {
      console.log("Uploading file:", file.name, "to bucket:", BUCKET_ID);
      
      // Upload with explicit public permissions
      const response = await storage.createFile(
        BUCKET_ID,
        ID.unique(),
        file,
        [
          Permission.read(Role.any()),
          Permission.update(Role.any()),
          Permission.delete(Role.any())
        ]
      );
      
      console.log("Upload response:", response);
      console.log("File permissions:", response.$permissions);
      toast.success(`${file.name} uploaded successfully!`);
      return response;
    } catch (error) {
      console.error("Upload error:", error);
      console.error("Upload error details:", JSON.stringify(error, null, 2));
      toast.error(error.message || "Failed to upload file");
      throw error;
    }
  }

  // List all files
  async listFiles(limit = 100, offset = 0) {
    try {
      // Check auth status
      try {
        const user = await account.get();
        console.log("Current user:", user.email, user.$id);
      } catch (authError) {
        console.log("User not authenticated or session expired");
      }
      
      console.log("Listing files with BUCKET_ID:", BUCKET_ID);
      const response = await storage.listFiles(BUCKET_ID);
      console.log("Raw storage response:", response);
      console.log("Files with permissions:", response.files.map(f => ({
        name: f.name,
        id: f.$id,
        permissions: f.$permissions
      })));
      return response;
    } catch (error) {
      console.error("List files error:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      toast.error(error.message || "Failed to fetch files");
      throw error;
    }
  }

  // Get file for download
  getFileDownload(fileId) {
    try {
      const result = storage.getFileDownload(BUCKET_ID, fileId);
      return result;
    } catch (error) {
      console.error("Download error:", error);
      toast.error(error.message || "Failed to download file");
      throw error;
    }
  }

  // Get file preview (for images)
  getFilePreview(fileId, width = 400, height = 400) {
    try {
      return storage.getFilePreview(BUCKET_ID, fileId, width, height);
    } catch (error) {
      console.error("Preview error:", error);
      return null;
    }
  }

  // Delete a file
  async deleteFile(fileId, fileName) {
    try {
      await storage.deleteFile(BUCKET_ID, fileId);
      toast.success(`${fileName} deleted successfully!`);
      return true;
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.message || "Failed to delete file");
      throw error;
    }
  }

  // Update/Rename file (by updating metadata)
  async updateFile(fileId, newName) {
    try {
      const response = await storage.updateFile(BUCKET_ID, fileId, newName);
      toast.success("File renamed successfully!");
      return response;
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.message || "Failed to rename file");
      throw error;
    }
  }

  // Get file details
  async getFile(fileId) {
    try {
      const response = await storage.getFile(BUCKET_ID, fileId);
      return response;
    } catch (error) {
      console.error("Get file error:", error);
      toast.error(error.message || "Failed to get file details");
      throw error;
    }
  }

  // Format file size
  formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  }

  // Get file extension/type icon
  getFileIcon(mimeType) {
    const baseClass = "w-7 h-7";
    if (!mimeType) return <File className={`${baseClass} text-[var(--accent-pink)]`} />;
    if (mimeType.startsWith("image/")) return <Image className={`${baseClass} text-indigo-500`} />;
    if (mimeType.startsWith("video/")) return <Video className={`${baseClass} text-rose-500`} />;
    if (mimeType.startsWith("audio/")) return <Music className={`${baseClass} text-emerald-500`} />;
    if (mimeType.includes("pdf")) return <FileText className={`${baseClass} text-red-500`} />;
    if (mimeType.includes("word") || mimeType.includes("document")) return <FileText className={`${baseClass} text-blue-600`} />;
    if (mimeType.includes("excel") || mimeType.includes("spreadsheet")) return <FileText className={`${baseClass} text-green-600`} />;
    if (mimeType.includes("powerpoint") || mimeType.includes("presentation")) return <FileText className={`${baseClass} text-orange-500`} />;
    if (mimeType.includes("zip") || mimeType.includes("rar") || mimeType.includes("compressed")) return <Archive className={`${baseClass} text-amber-600`} />;
    if (mimeType.includes("text")) return <FileText className={`${baseClass} text-gray-500`} />;
    return <File className={`${baseClass} text-[var(--accent-pink)]`} />;
  }
}

export default new FileService();
