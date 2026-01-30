import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, LogOut, Edit2, Save, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    const result = await logout();
    if (result.success) {
      navigate("/signin");
    }
    setIsLoading(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen w-full bg-[var(--bg-main)] px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate("/")}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-4 inline-flex items-center gap-2"
          >
            ← Back to Projects
          </button>
          <h1 className="text-3xl sm:text-4xl font-bold">My Profile</h1>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-1"
          >
            <div className="card text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-[var(--accent-pink)] to-[var(--accent-blue)] flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-xl font-bold mb-1">{user?.name || "User"}</h2>
              <p className="text-[var(--text-secondary)] text-sm mb-4">{user?.email}</p>
              <div className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                ✓ Verified
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
            <div className="card">
              <h3 className="text-xl font-bold mb-6">Account Information</h3>
              
              <div className="space-y-4">
                {/* User ID */}
                <div className="flex items-start justify-between py-3 border-b border-[var(--border-light)]">
                  <div>
                    <p className="text-sm text-[var(--text-secondary)] mb-1">User ID</p>
                    <p className="font-mono text-sm">{user?.$id}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start justify-between py-3 border-b border-[var(--border-light)]">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-[var(--text-tertiary)]" />
                    <div>
                      <p className="text-sm text-[var(--text-secondary)] mb-1">Email</p>
                      <p className="font-medium">{user?.email}</p>
                    </div>
                  </div>
                </div>

                {/* Account Created */}
                <div className="flex items-start justify-between py-3 border-b border-[var(--border-light)]">
                  <div>
                    <p className="text-sm text-[var(--text-secondary)] mb-1">Member Since</p>
                    <p className="font-medium">{formatDate(user?.$createdAt)}</p>
                  </div>
                </div>

                {/* Email Verification */}
                <div className="flex items-start justify-between py-3">
                  <div>
                    <p className="text-sm text-[var(--text-secondary)] mb-1">Email Verification</p>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                      user?.emailVerification 
                        ? "bg-green-100 text-green-700" 
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {user?.emailVerification ? "✓ Verified" : "⚠ Not Verified"}
                    </span>
                  </div>
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
          className="mt-6 flex flex-col sm:flex-row gap-4"
        >
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="btn btn-secondary btn-rounded flex-1 sm:flex-none"
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
