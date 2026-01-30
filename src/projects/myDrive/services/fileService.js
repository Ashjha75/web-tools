import { storage, BUCKET_ID } from "./appwriteConfig";
import { ID } from "appwrite";
import toast from "react-hot-toast";

class FileService {
  // Upload a file
  async uploadFile(file, onProgress) {
    try {
      const response = await storage.createFile(
        BUCKET_ID,
        ID.unique(),
        file,
        undefined,
        onProgress
      );
      toast.success(`${file.name} uploaded successfully!`);
      return response;
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload file");
      throw error;
    }
  }

  // List all files
  async listFiles(limit = 100, offset = 0) {
    try {
      const response = await storage.listFiles(BUCKET_ID, [], limit, offset);
      return response;
    } catch (error) {
      console.error("List files error:", error);
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
    if (!mimeType) return "📄";
    if (mimeType.startsWith("image/")) return "🖼️";
    if (mimeType.startsWith("video/")) return "🎥";
    if (mimeType.startsWith("audio/")) return "🎵";
    if (mimeType.includes("pdf")) return "📕";
    if (mimeType.includes("word") || mimeType.includes("document")) return "📘";
    if (mimeType.includes("excel") || mimeType.includes("spreadsheet")) return "📗";
    if (mimeType.includes("powerpoint") || mimeType.includes("presentation")) return "📙";
    if (mimeType.includes("zip") || mimeType.includes("rar") || mimeType.includes("compressed")) return "📦";
    if (mimeType.includes("text")) return "📝";
    return "📄";
  }
}

export default new FileService();
