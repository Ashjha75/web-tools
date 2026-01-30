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
    <div className="min-h-screen w-full bg-[var(--bg-main)] px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate("/")}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-4 inline-flex items-center gap-2 transition-colors"
          >
            ← Back to Projects
          </button>
          <h1 className="text-4xl font-bold">My Profile</h1>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-1"
          >
            <div className="card text-center" style={{ padding: "2rem", overflow: "hidden" }}>
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[var(--accent-pink)] flex items-center justify-center shadow-lg">
                <User className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-xl font-bold mb-2 break-words px-2">{user?.name || "User"}</h2>
              <p className="text-[var(--text-secondary)] mb-6 break-words text-xs px-2">{user?.email}</p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 text-green-700 text-sm font-medium border border-green-200">
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
            <div className="card" style={{ padding: "2rem" }}>
              <h3 className="text-2xl font-bold mb-6">Account Information</h3>
              
              <div className="space-y-4">
                {/* User ID */}
                <div className="py-3 border-b border-[var(--border-light)]">
                  <p className="text-sm text-[var(--text-secondary)] mb-1">User ID</p>
                  <p className="font-mono text-sm break-all">{user?.$id}</p>
                </div>

                {/* Email */}
                <div className="py-3 border-b border-[var(--border-light)]">
                  <p className="text-sm text-[var(--text-secondary)] mb-1">Email</p>
                  <p className="font-medium break-words">{user?.email}</p>
                </div>

                {/* Account Created */}
                <div className="py-3 border-b border-[var(--border-light)]">
                  <p className="text-sm text-[var(--text-secondary)] mb-1">Member Since</p>
                  <p className="font-medium">{formatDate(user?.$createdAt)}</p>
                </div>

                {/* Email Verification */}
                <div className="py-3">
                  <p className="text-sm text-[var(--text-secondary)] mb-1">Email Verification</p>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                    user?.emailVerification 
                      ? "bg-green-100 text-green-700" 
                      : "bg-yellow-100 text-yellow-700"
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
          className="mt-6"
        >
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="w-full sm:w-auto h-12 px-6 bg-red-50 text-red-600 border border-red-200 rounded-lg font-medium hover:bg-red-100 transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="spinner" />
                Logging out...
              </>
            ) : (
              <>
                <LogOut className="w-5 h-5" />
                Logout
              </>
            )}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
