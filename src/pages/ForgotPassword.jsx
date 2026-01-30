import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Mail, ArrowRight, CheckCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await resetPassword(email);
      setSuccess(true);
      toast.success("Password reset email sent!");
    } catch (err) {
      toast.error(err.message || "Failed to send reset email");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[var(--bg-main)] px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="card text-center" style={{ padding: "2rem" }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-50 border-4 border-green-200 flex items-center justify-center"
            >
              <CheckCircle className="w-10 h-10 text-green-600" />
            </motion.div>
            <h1 className="text-3xl font-bold mb-3">Check Your Email</h1>
            <p className="text-[var(--text-secondary)] mb-8 text-lg">
              We've sent password reset instructions to<br />
              <strong className="text-[var(--text-primary)]">{email}</strong>
            </p>
            <Link 
              to="/signin" 
              className="w-full h-12 bg-[var(--primary-black)] text-white rounded-lg font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              Back to Sign In
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[var(--bg-main)] px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="card" style={{ padding: "2rem" }}>
          {/* Header */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-20 h-20 mx-auto mb-5 rounded-full bg-[var(--accent-pink)] flex items-center justify-center shadow-lg"
            >
              <Mail className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold mb-2">Forgot Password?</h1>
            <p className="text-[var(--text-secondary)]">
              Enter your email to receive reset instructions
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium mb-2 text-[var(--text-primary)]">
                Email Address <span className="text-[var(--accent-pink)]">*</span>
              </label>
              <input
                type="email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="input w-full h-12"
              />
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-[var(--primary-black)] text-white rounded-lg font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2 mt-8"
            >
              {isLoading ? (
                <>
                  <span className="spinner spinner-white" />
                  Sending...
                </>
              ) : (
                <>
                  Send Reset Link
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>

          {/* Back to Sign In Link */}
          <div className="mt-8 text-center">
            <Link
              to="/signin"
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors inline-flex items-center gap-1"
            >
              ← Back to Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
