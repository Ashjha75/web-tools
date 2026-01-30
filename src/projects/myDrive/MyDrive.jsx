import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { HardDrive, RefreshCw, ArrowLeft, FileText, Database, CheckCircle, Cloud, Server } from "lucide-react";
import FileUpload from "./components/FileUpload";
import FileList from "./components/FileList";
import GoogleDriveFiles from "./components/GoogleDriveFiles";
import fileService from "./services/fileService";
import logo from "./assets/logo.svg";

export default function MyDrive() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("local"); // "local" or "google"

  const fetchFiles = async () => {
    setLoading(true);
    try {
      console.log("Fetching files from bucket...");
      const response = await fileService.listFiles();
      console.log("Files response:", response);
      console.log("Files array:", response.files);
      console.log("Total files:", response.total);
      setFiles(response.files || []);
    } catch (error) {
      console.error("Failed to fetch files:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleFileUploaded = () => {
    fetchFiles();
  };

  const handleFileDeleted = (fileId) => {
    setFiles((prev) => prev.filter((file) => file.$id !== fileId));
  };

  const handleFileRenamed = (fileId, newName) => {
    setFiles((prev) =>
      prev.map((file) =>
        file.$id === fileId ? { ...file, name: newName } : file
      )
    );
  };

  return (
    <div className="min-h-screen w-full bg-[var(--bg-main)] px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate("/")}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-sm sm:text-base font-medium inline-flex items-center gap-2 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </button>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <img src={logo} alt="myDrive Logo" className="w-12 h-12 sm:w-14 sm:h-14" />
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)]">
                  myDrive
                </h1>
                <p className="text-sm sm:text-base text-[var(--text-secondary)] mt-1">
                  Your personal cloud storage powered by Appwrite
                </p>
              </div>
            </div>

            <button
              onClick={fetchFiles}
              disabled={loading}
              className="btn btn-secondary flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          <div className="card p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[var(--accent-pink)] bg-opacity-10 flex items-center justify-center flex-shrink-0">
                <FileText className="w-7 h-7 text-[var(--accent-pink)]" />
              </div>
              <div className="flex-1">
                <p className="text-3xl font-bold text-[var(--text-primary)]">{files.length}</p>
                <p className="text-sm text-[var(--text-secondary)] mt-1">Total Files</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[var(--accent-pink)] bg-opacity-10 flex items-center justify-center flex-shrink-0">
                <Database className="w-7 h-7 text-[var(--accent-pink)]" />
              </div>
              <div className="flex-1">
                <p className="text-3xl font-bold text-[var(--text-primary)]">
                  {fileService.formatFileSize(
                    files.reduce((acc, file) => acc + (file.sizeOriginal || 0), 0)
                  )}
                </p>
                <p className="text-sm text-[var(--text-secondary)] mt-1">Total Size</p>
              </div>
            </div>
          </div>

          <div className="card p-6 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-7 h-7 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-3xl font-bold text-green-600">Active</p>
                <p className="text-sm text-[var(--text-secondary)] mt-1">Storage Status</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Storage Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8"
        >
          <div className="card p-2 inline-flex gap-2">
            <button
              onClick={() => setActiveTab("local")}
              className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                activeTab === "local"
                  ? "bg-[var(--accent-pink)] text-white shadow-lg"
                  : "text-[var(--text-secondary)] hover:bg-gray-100"
              }`}
            >
              <Server className="w-5 h-5" />
              Local Storage
            </button>
            <button
              onClick={() => setActiveTab("google")}
              className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                activeTab === "google"
                  ? "bg-blue-500 text-white shadow-lg"
                  : "text-[var(--text-secondary)] hover:bg-gray-100"
              }`}
            >
              <Cloud className="w-5 h-5" />
              Google Drive
            </button>
          </div>
        </motion.div>

        {/* Upload Section - Only for Local Storage */}
        {activeTab === "local" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <FileUpload onFileUploaded={handleFileUploaded} />
          </motion.div>
        )}

        {/* Files List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {activeTab === "local" ? (
            <div className="card p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
                <HardDrive className="w-6 h-6" />
                My Files
              </h2>
              <FileList
                files={files}
                onFileDeleted={handleFileDeleted}
                onFileRenamed={handleFileRenamed}
                loading={loading}
              />
            </div>
          ) : (
            <div className="card p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
                <Cloud className="w-6 h-6 text-blue-600" />
                Google Drive Files
              </h2>
              <GoogleDriveFiles />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
