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
          className="mb-8"
        >
          <button
            onClick={() => navigate("/")}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-base font-medium inline-flex items-center gap-2 transition-colors mb-2"
          >
            ← Back to Projects
          </button>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)] drop-shadow-sm text-left">My Profile</h1>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-1"
          >
            <div className="rounded-3xl shadow-2xl bg-white/90 text-center p-8 flex flex-col items-center border border-gray-100 relative">
              <div className="w-24 h-24 mb-5 rounded-full bg-gradient-to-br from-[var(--accent-pink)] to-pink-400 flex items-center justify-center shadow-xl border-4 border-white">
                <User className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-lg font-bold mb-1 break-words px-2 text-[var(--text-primary)] max-w-full truncate">{user?.name || "User"}</h2>
              <p className="text-[var(--text-secondary)] mb-4 break-words text-xs px-2 max-w-full truncate">{user?.email}</p>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-semibold border border-green-200 shadow-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Active
              </div>
              {/* Logout Button (mobile/desktop) */}
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="mt-6 w-full flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-red-400 to-red-600 text-white font-bold shadow-lg hover:from-red-500 hover:to-red-700 transition-all focus:outline-none focus:ring-2 focus:ring-red-300 disabled:opacity-60 disabled:cursor-not-allowed text-base"
              >
                {isLoading ? (
                  <>
                    <span className="spinner border-white border-2" />
                    Logging out...
                  </>
                ) : (
                  <>
                    <LogOut className="w-5 h-5" />
                    Logout
                  </>
                )}
              </button>
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
              <h3 className="text-xl sm:text-2xl font-extrabold mb-6 text-[var(--text-primary)] text-left">Account Information</h3>
              <div className="space-y-5">
                {/* User ID */}
                <div className="py-2 border-b border-[var(--border-light)] flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] mb-1 sm:mb-0">User ID</p>
                  <p className="font-mono text-xs sm:text-sm break-all text-right">{user?.$id}</p>
                </div>

                {/* Email */}
                <div className="py-2 border-b border-[var(--border-light)] flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] mb-1 sm:mb-0">Email</p>
                  <p className="font-medium break-words text-right text-xs sm:text-sm max-w-xs truncate">{user?.email}</p>
                </div>

                {/* Account Created */}
                <div className="py-2 border-b border-[var(--border-light)] flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] mb-1 sm:mb-0">Member Since</p>
                  <p className="font-medium text-right text-xs sm:text-sm">{formatDate(user?.$createdAt)}</p>
                </div>

                {/* Email Verification */}
                <div className="py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] mb-1 sm:mb-0">Email Verification</p>
                  <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold shadow-sm border ${
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
      </div>
    </div>
  );
}
