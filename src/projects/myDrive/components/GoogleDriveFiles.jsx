import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cloud,
  Download,
  Trash2,
  FolderPlus,
  Search,
  RefreshCw,
  LogOut,
  User,
  HardDrive,
} from "lucide-react";
import toast from "react-hot-toast";
import googleDriveService from "../services/googleDriveService";
import FileIcon from "./FileIcon";

function GoogleDriveFiles() {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [storageQuota, setStorageQuota] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    initGoogleDrive();
  }, []);

  const initGoogleDrive = async () => {
    try {
      await googleDriveService.initClient();
      const signedIn = googleDriveService.isSignedIn();
      setIsSignedIn(signedIn);
      
      // If user is already signed in (token in localStorage), load their data
      if (signedIn) {
        await loadUserData();
      }
    } catch (error) {
      console.error("Failed to initialize Google Drive:", error);
      toast.error("Failed to initialize Google Drive");
    }
  };

  const loadUserData = async () => {
    try {
      const profile = await googleDriveService.getUserProfile();
      setUserProfile(profile);
      await loadFiles();
      await loadStorageQuota();
    } catch (error) {
      console.error("Failed to load user data:", error);
    }
  };

  const loadFiles = async () => {
    try {
      setIsLoading(true);
      const result = await googleDriveService.listFiles();
      setFiles(result.files || []);
    } catch (error) {
      console.error("Failed to load files:", error);
      toast.error("Failed to load files from Google Drive");
    } finally {
      setIsLoading(false);
    }
  };

  const loadStorageQuota = async () => {
    try {
      const quota = await googleDriveService.getStorageQuota();
      setStorageQuota(quota);
    } catch (error) {
      console.error("Failed to load storage quota:", error);
    }
  };

  const handleSignIn = async () => {
    try {
      await googleDriveService.signIn();
      setIsSignedIn(true);
      toast.success("Signed in to Google Drive successfully!");
      await loadUserData();
    } catch (error) {
      console.error("Failed to sign in:", error);
      toast.error("Failed to sign in to Google Drive");
    }
  };

  const handleSignOut = async () => {
    try {
      await googleDriveService.signOut();
      setIsSignedIn(false);
      setUserProfile(null);
      setFiles([]);
      setStorageQuota(null);
      toast.success("Signed out successfully");
    } catch (error) {
      console.error("Failed to sign out:", error);
      toast.error("Failed to sign out");
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      await loadFiles();
      return;
    }

    try {
      setIsLoading(true);
      const results = await googleDriveService.searchFiles(searchQuery);
      setFiles(results || []);
    } catch (error) {
      console.error("Failed to search files:", error);
      toast.error("Failed to search files");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (fileId, fileName) => {
    try {
      toast.loading(`Downloading ${fileName}...`, { id: fileId });
      await googleDriveService.downloadFile(fileId, fileName);
      toast.success(`Downloaded ${fileName}`, { id: fileId });
    } catch (error) {
      console.error("Failed to download file:", error);
      toast.error("Failed to download file", { id: fileId });
    }
  };

  const handleDelete = async (fileId, fileName) => {
    if (!window.confirm(`Are you sure you want to delete "${fileName}"?`)) {
      return;
    }

    try {
      setDeletingId(fileId);
      await googleDriveService.deleteFile(fileId);
      setFiles(files.filter((f) => f.id !== fileId));
      toast.success(`Deleted ${fileName}`);
    } catch (error) {
      console.error("Failed to delete file:", error);
      toast.error("Failed to delete file");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card p-12 max-w-md w-full text-center"
        >
          <div className="w-20 h-20 rounded-2xl bg-blue-500 flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Cloud className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-3">
            Connect Google Drive
          </h2>
          <p className="text-[var(--text-secondary)] mb-8">
            Sign in to access and manage your Google Drive files
          </p>
          <button onClick={handleSignIn} className="btn btn-pink w-full">
            <Cloud className="w-5 h-5" />
            Sign in with Google
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Profile & Stats */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {userProfile?.imageUrl ? (
              <img
                src={userProfile.imageUrl}
                alt={userProfile.name}
                className="w-14 h-14 rounded-full border-2 border-[var(--accent-pink)]"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="w-7 h-7 text-blue-600" />
              </div>
            )}
            <div>
              <h3 className="text-lg font-bold text-[var(--text-primary)]">
                {userProfile?.name}
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                {userProfile?.email}
              </p>
            </div>
          </div>

          {storageQuota && (
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-sm text-[var(--text-secondary)]">Storage Used</p>
                <p className="text-lg font-bold text-[var(--text-primary)]">
                  {googleDriveService.formatFileSize(storageQuota.usage)} /{" "}
                  {googleDriveService.formatFileSize(storageQuota.limit)}
                </p>
              </div>
              <button
                onClick={handleSignOut}
                className="btn btn-secondary flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="card p-4">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search files in Google Drive..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border-2 border-[var(--border-light)] focus:border-[var(--accent-pink)] outline-none text-[var(--text-primary)]"
            />
          </div>
          <button onClick={handleSearch} className="btn btn-pink">
            <Search className="w-5 h-5" />
            Search
          </button>
          <button
            onClick={loadFiles}
            className="btn btn-secondary"
            disabled={isLoading}
          >
            <RefreshCw
              className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* Files List */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="spinner-pink border-4 w-12 h-12"></div>
        </div>
      ) : files.length === 0 ? (
        <div className="card p-12 text-center">
          <HardDrive className="w-16 h-16 text-[var(--text-secondary)] mx-auto mb-4 opacity-50" />
          <p className="text-lg text-[var(--text-secondary)]">
            {searchQuery ? "No files found" : "No files in Google Drive"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {files.map((file, index) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="card p-5 hover:shadow-xl transition-all border-2 border-transparent hover:border-blue-500 hover:border-opacity-20"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* File Icon & Info */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                    {file.thumbnailLink ? (
                      <img
                        src={file.thumbnailLink}
                        alt={file.name}
                        className="w-full h-full rounded-xl object-cover"
                      />
                    ) : file.iconLink ? (
                      <img
                        src={file.iconLink}
                        alt={file.name}
                        className="w-8 h-8"
                      />
                    ) : (
                      <FileIcon mimeType={file.mimeType} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[var(--text-primary)] text-base truncate">
                      {file.name}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">
                      {file.size
                        ? `${googleDriveService.formatFileSize(file.size)} • `
                        : ""}
                      {formatDate(file.modifiedTime)}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {file.webViewLink && (
                    <a
                      href={file.webViewLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-200"
                      title="Open in Google Drive"
                    >
                      <Cloud className="w-5 h-5" />
                    </a>
                  )}
                  {file.mimeType !== "application/vnd.google-apps.folder" && (
                    <button
                      onClick={() => handleDownload(file.id, file.name)}
                      className="p-2.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-transparent hover:border-green-200"
                      title="Download"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(file.id, file.name)}
                    disabled={deletingId === file.id}
                    className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 border border-transparent hover:border-red-200"
                    title="Delete"
                  >
                    {deletingId === file.id ? (
                      <span className="spinner border-red-600 border-2 w-5 h-5"></span>
                    ) : (
                      <Trash2 className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default GoogleDriveFiles;
