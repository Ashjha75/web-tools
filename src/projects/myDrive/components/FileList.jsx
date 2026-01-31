import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Trash2, Edit2, X, Check } from "lucide-react";
import fileService from "../services/fileService";

export default function FileList({ files, onFileDeleted, onFileRenamed, loading }) {
  const [editingFile, setEditingFile] = useState(null);
  const [newFileName, setNewFileName] = useState("");
  const [isDeleting, setIsDeleting] = useState(null);
  const [isRenaming, setIsRenaming] = useState(false);

  const handleDownload = (fileId, fileName) => {
    try {
      const url = fileService.getFileDownload(fileId);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const handleDelete = async (fileId, fileName) => {
    if (!window.confirm(`Are you sure you want to delete "${fileName}"?`)) {
      return;
    }

    setIsDeleting(fileId);
    try {
      await fileService.deleteFile(fileId, fileName);
      onFileDeleted(fileId);
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setIsDeleting(null);
    }
  };

  const startRename = (file) => {
    setEditingFile(file.$id);
    setNewFileName(file.name);
  };

  const cancelRename = () => {
    setEditingFile(null);
    setNewFileName("");
  };

  const handleRename = async (fileId) => {
    if (!newFileName.trim()) {
      return;
    }

    setIsRenaming(true);
    try {
      await fileService.updateFile(fileId, newFileName.trim());
      onFileRenamed(fileId, newFileName.trim());
      setEditingFile(null);
      setNewFileName("");
    } catch (error) {
      console.error("Rename failed:", error);
    } finally {
      setIsRenaming(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="spinner spinner-pink w-12 h-12"></div>
      </div>
    );
  }

  if (!files || files.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[var(--text-secondary)] text-lg">No files yet. Upload your first file!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {files.map((file, index) => (
        <motion.div
          key={file.$id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="card p-5 hover:shadow-xl transition-all border-2 border-transparent hover:border-[var(--accent-pink)] hover:border-opacity-20"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* File Icon & Info */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                {fileService.getFileIcon(file.mimeType)}
              </div>
              <div className="flex-1 min-w-0">
                {editingFile === file.$id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newFileName}
                      onChange={(e) => setNewFileName(e.target.value)}
                      className="input flex-1 text-sm"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleRename(file.$id);
                        if (e.key === "Escape") cancelRename();
                      }}
                    />
                    <button
                      onClick={() => handleRename(file.$id)}
                      disabled={isRenaming}
                      className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                      title="Save"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button
                      onClick={cancelRename}
                      className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Cancel"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 className="font-semibold text-[var(--text-primary)] text-base truncate">
                      {file.name}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">
                      {fileService.formatFileSize(file.sizeOriginal)} • {formatDate(file.$createdAt)}
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Actions */}
            {editingFile !== file.$id && (
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => handleDownload(file.$id, file.name)}
                  className="p-2.5 text-[var(--accent-pink)] hover:bg-pink-50 rounded-lg transition-colors border border-transparent hover:border-[var(--accent-pink)] hover:border-opacity-20"
                  title="Download"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  onClick={() => startRename(file)}
                  className="p-2.5 text-[var(--text-secondary)] hover:bg-gray-100 rounded-lg transition-colors border border-transparent hover:border-gray-300"
                  title="Rename"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(file.$id, file.name)}
                  disabled={isDeleting === file.$id}
                  className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 border border-transparent hover:border-red-200"
                  title="Delete"
                >
                  {isDeleting === file.$id ? (
                    <span className="spinner border-red-600 border-2 w-5 h-5"></span>
                  ) : (
                    <Trash2 className="w-5 h-5" />
                  )}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
