import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { HardDrive, RefreshCw, ArrowLeft } from "lucide-react";
import FileUpload from "./components/FileUpload";
import FileList from "./components/FileList";
import fileService from "./services/fileService";
import logo from "./assets/logo.svg";

export default function MyDrive() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

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
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center justify-center">
      <div className="w-[87%] ">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate("/")}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-sm sm:text-base font-medium inline-flex items-center gap-2 transition-colors mb-4 px-3 py-2 rounded-full hover:bg-white/60 border border-transparent hover:border-gray-200 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </button>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <img src={logo} alt="myDrive Logo" className="w-14 h-14 sm:w-16 sm:h-16" />
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
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-200 text-[var(--text-primary)] font-medium disabled:opacity-50"
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                <HardDrive className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--text-primary)]">{files.length}</p>
                <p className="text-sm text-[var(--text-secondary)]">Total Files</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--text-primary)]">
                  {fileService.formatFileSize(
                    files.reduce((acc, file) => acc + (file.sizeOriginal || 0), 0)
                  )}
                </p>
                <p className="text-sm text-[var(--text-secondary)]">Total Size</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
                <span className="text-2xl">🚀</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--text-primary)]">Active</p>
                <p className="text-sm text-[var(--text-secondary)]">Storage Status</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <FileUpload onFileUploaded={handleFileUploaded} />
        </motion.div>

        {/* Files List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 sm:p-8">
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
        </motion.div>
      </div>
    </div>
  );
}
