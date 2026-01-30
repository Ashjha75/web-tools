import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);

    try {
      await signup(email, password, name);
      toast.success("Account created successfully!");
      navigate("/");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

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
              <User className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold mb-2">Create Account</h1>
            <p className="text-[var(--text-secondary)]">
              Join to manage your projects
            </p>
          </div>


          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium mb-2 text-[var(--text-primary)]">
                Full Name <span className="text-[var(--accent-pink)]">*</span>
              </label>
              <input
                type="text"
                name="name"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
                className="input w-full h-12"
              />
            </div>

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

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium mb-2 text-[var(--text-primary)]">
                Password <span className="text-[var(--accent-pink)]">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="new-password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  required
                  minLength={8}
                  className="input w-full h-12 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors font-medium"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
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
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>

          {/* Sign In Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-[var(--text-secondary)]">
              Already have an account?{" "}
              <Link
                to="/signin"
                className="text-[var(--accent-pink)] hover:opacity-80 font-semibold transition-opacity"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
