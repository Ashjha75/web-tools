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
    <div className="min-h-screen w-full bg-gradient-to-br from-[var(--bg-main)] to-gray-100 px-4 sm:px-6 lg:px-8 py-10 flex items-start justify-center">
      <div className="w-full max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 space-y-2"
        >
          <button
            onClick={() => navigate("/")}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-sm sm:text-base font-medium inline-flex items-center gap-2 transition-colors"
          >
            ← Back to Projects
          </button>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)] drop-shadow-sm">My Profile</h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="rounded-3xl shadow-2xl bg-white p-8 flex flex-col items-center border border-gray-100 h-full">
              <div className="w-24 h-24 mb-5 rounded-full bg-gradient-to-br from-[var(--accent-pink)] to-pink-500 flex items-center justify-center shadow-xl border-4 border-white">
                <User className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-xl font-bold mb-1 text-[var(--text-primary)] text-center w-full truncate">{user?.name || "User"}</h2>
              <p className="text-[var(--text-secondary)] mb-4 text-sm text-center w-full truncate">{user?.email}</p>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-semibold border border-green-200 shadow-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Active
              </div>
              <div className="mt-8 w-full">
                <button
                  onClick={handleLogout}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold shadow-md hover:from-red-600 hover:to-red-700 transition-all focus:outline-none focus:ring-2 focus:ring-red-300 disabled:opacity-60 disabled:cursor-not-allowed text-base"
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
            </div>
          </motion.div>

          {/* Account Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="rounded-3xl shadow-2xl bg-white p-8 border border-gray-100 h-full flex flex-col">
              <h3 className="text-xl sm:text-2xl font-extrabold mb-6 text-[var(--text-primary)]">Account Information</h3>
              <div className="space-y-4 flex-1">
                {/* User ID */}
                <div className="py-3 border-b border-[var(--border-light)] grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-1 sm:gap-4 items-center">
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)]">User ID</p>
                  <p className="font-mono text-xs sm:text-sm break-all text-[var(--text-primary)]">{user?.$id}</p>
                </div>

                {/* Email */}
                <div className="py-3 border-b border-[var(--border-light)] grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-1 sm:gap-4 items-center">
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)]">Email</p>
                  <p className="font-medium text-xs sm:text-sm break-words text-[var(--text-primary)]">{user?.email}</p>
                </div>

                {/* Account Created */}
                <div className="py-3 border-b border-[var(--border-light)] grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-1 sm:gap-4 items-center">
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)]">Member Since</p>
                  <p className="font-medium text-xs sm:text-sm text-[var(--text-primary)]">{formatDate(user?.$createdAt)}</p>
                </div>

                {/* Email Verification */}
                <div className="py-3 grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-1 sm:gap-4 items-center">
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)]">Email Verification</p>
                  <span className={`inline-flex items-center gap-2 w-fit px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold shadow-sm border ${
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
