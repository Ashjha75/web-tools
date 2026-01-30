import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, X, FileUp } from "lucide-react";
import fileService from "../services/fileService";

export default function FileUpload({ onFileUploaded }) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    addFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    addFiles(files);
  };

  const addFiles = (files) => {
    const newFiles = files.map((file) => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      progress: 0,
      status: "pending", // pending, uploading, completed, error
    }));
    setSelectedFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (id) => {
    setSelectedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const uploadFiles = async () => {
    const filesToUpload = selectedFiles.filter((f) => f.status === "pending");
    if (filesToUpload.length === 0) return;

    setUploadingFiles((prev) => [...prev, ...filesToUpload.map((f) => f.id)]);

    for (const fileData of filesToUpload) {
      try {
        // Update status to uploading
        setSelectedFiles((prev) =>
          prev.map((f) =>
            f.id === fileData.id ? { ...f, status: "uploading" } : f
          )
        );

        // Upload with progress tracking
        await fileService.uploadFile(fileData.file, (progress) => {
          const percentage = (progress.sizeUploaded / progress.sizeOriginal) * 100;
          setSelectedFiles((prev) =>
            prev.map((f) =>
              f.id === fileData.id ? { ...f, progress: Math.round(percentage) } : f
            )
          );
        });

        // Mark as completed
        setSelectedFiles((prev) =>
          prev.map((f) =>
            f.id === fileData.id ? { ...f, status: "completed", progress: 100 } : f
          )
        );

        // Notify parent component
        onFileUploaded();
      } catch (error) {
        // Mark as error
        setSelectedFiles((prev) =>
          prev.map((f) =>
            f.id === fileData.id ? { ...f, status: "error" } : f
          )
        );
      } finally {
        setUploadingFiles((prev) => prev.filter((id) => id !== fileData.id));
      }
    }

    // Auto-remove completed files after 2 seconds
    setTimeout(() => {
      setSelectedFiles((prev) => prev.filter((f) => f.status !== "completed"));
    }, 2000);
  };

  const clearCompleted = () => {
    setSelectedFiles((prev) => prev.filter((f) => f.status === "pending" || f.status === "uploading"));
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative rounded-3xl border-2 border-dashed p-12 sm:p-16 text-center cursor-pointer
          transition-all duration-300 card
          ${
            isDragging
              ? "border-[var(--accent-pink)] bg-pink-50 scale-105"
              : "border-[var(--border-light)] hover:border-[var(--accent-pink)] hover:bg-gray-50 hover:shadow-lg"
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: isDragging ? 1.1 : 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-20 h-20 rounded-2xl bg-[var(--accent-pink)] flex items-center justify-center shadow-xl">
            <FileUp className="w-10 h-10 text-white" />
          </div>
          <div>
            <p className="text-xl font-bold text-[var(--text-primary)] mb-2">
              {isDragging ? "Drop files here" : "Click to upload or drag and drop"}
            </p>
            <p className="text-sm text-[var(--text-secondary)]">
              Support for any file type
            </p>
          </div>
        </motion.div>
      </div>

      {/* Selected Files List */}
      {selectedFiles.length > 0 && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              Selected Files ({selectedFiles.length})
            </h3>
            <button
              onClick={clearCompleted}
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              Clear Completed
            </button>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto">
            {selectedFiles.map((fileData) => (
              <div
                key={fileData.id}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200"
              >
                <span className="text-2xl flex-shrink-0">
                  {fileService.getFileIcon(fileData.file.type)}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{fileData.file.name}</p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {fileService.formatFileSize(fileData.file.size)}
                  </p>
                  {fileData.status === "uploading" && (
                    <div className="mt-2">
                      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[var(--accent-pink)] transition-all duration-300"
                          style={{ width: `${fileData.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-[var(--accent-pink)] mt-1">{fileData.progress}%</p>
                    </div>
                  )}
                  {fileData.status === "completed" && (
                    <p className="text-xs text-green-600 mt-1">✓ Uploaded</p>
                  )}
                  {fileData.status === "error" && (
                    <p className="text-xs text-red-600 mt-1">✗ Failed</p>
                  )}
                </div>
                {fileData.status === "pending" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(fileData.id);
                    }}
                    className="p-1.5 text-gray-600 hover:bg-white rounded-lg transition-colors flex-shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {selectedFiles.some((f) => f.status === "pending") && (
            <button
              onClick={uploadFiles}
              disabled={uploadingFiles.length > 0}
              className="btn btn-pink w-full mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {uploadingFiles.length > 0 ? (
                <>
                  <span className="spinner border-white border-2"></span>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Upload {selectedFiles.filter((f) => f.status === "pending").length} File(s)
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
