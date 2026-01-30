import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { User, Mail, LogOut, Edit2, Save, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/signin");
    } catch (err) {
      toast.error(err.message || "Failed to logout");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[var(--bg-main)] to-gray-100 px-2 py-10 flex items-center justify-center">
      <div className="w-full max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
        >
          <button
            onClick={() => navigate("/")}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-base font-medium inline-flex items-center gap-2 transition-colors"
          >
            ← Back to Projects
          </button>
          <h1 className="text-4xl font-extrabold tracking-tight text-[var(--text-primary)] drop-shadow-sm">My Profile</h1>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-1"
          >
            <div className="rounded-3xl shadow-2xl bg-white/90 text-center p-8 flex flex-col items-center border border-gray-100">
              <div className="w-28 h-28 mb-6 rounded-full bg-gradient-to-br from-[var(--accent-pink)] to-pink-400 flex items-center justify-center shadow-xl border-4 border-white">
                <User className="w-14 h-14 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-1 break-words px-2 text-[var(--text-primary)]">{user?.name || "User"}</h2>
              <p className="text-[var(--text-secondary)] mb-4 break-words text-sm px-2">{user?.email}</p>
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-green-100 text-green-700 text-base font-semibold border border-green-200 shadow-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Active
              </div>
            </div>
          </motion.div>

          {/* Account Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-2"
          >
            <div className="rounded-3xl shadow-2xl bg-white/95 p-8 border border-gray-100">
              <h3 className="text-2xl font-extrabold mb-8 text-[var(--text-primary)]">Account Information</h3>
              <div className="space-y-6">
                {/* User ID */}
                <div className="py-3 border-b border-[var(--border-light)] flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-[var(--text-secondary)] mb-1 sm:mb-0">User ID</p>
                  <p className="font-mono text-sm break-all text-right">{user?.$id}</p>
                </div>

                {/* Email */}
                <div className="py-3 border-b border-[var(--border-light)] flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-[var(--text-secondary)] mb-1 sm:mb-0">Email</p>
                  <p className="font-medium break-words text-right">{user?.email}</p>
                </div>

                {/* Account Created */}
                <div className="py-3 border-b border-[var(--border-light)] flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-[var(--text-secondary)] mb-1 sm:mb-0">Member Since</p>
                  <p className="font-medium text-right">{formatDate(user?.$createdAt)}</p>
                </div>

                {/* Email Verification */}
                <div className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-[var(--text-secondary)] mb-1 sm:mb-0">Email Verification</p>
                  <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm border ${
                    user?.emailVerification 
                      ? "bg-green-100 text-green-700 border-green-200" 
                      : "bg-yellow-100 text-yellow-700 border-yellow-200"
                  }`}>
                    {user?.emailVerification ? "✓ Verified" : "⚠ Not Verified"}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-10 flex justify-end"
        >
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-red-400 to-red-600 text-white font-bold shadow-lg hover:from-red-500 hover:to-red-700 transition-all focus:outline-none focus:ring-2 focus:ring-red-300 disabled:opacity-60 disabled:cursor-not-allowed text-lg"
          >
            {isLoading ? (
              <>
                <span className="spinner border-white border-2" />
                Logging out...
              </>
            ) : (
              <>
                <LogOut className="w-6 h-6" />
                Logout
              </>
            )}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
