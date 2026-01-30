import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import "./App.css";
import { databases, DATABASE_ID, COLLECTION_ID } from "./lib/appwrite";
import { AppwriteException } from "appwrite";
import { Tiles } from "./components/Tiles";
import { useAuth } from "./context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { User, LogOut, HardDrive } from "lucide-react";

function App() {
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Fetch projects from Appwrite database
  async function fetchProjects() {
    if (status === "loading") return;
    setStatus("loading");
    setError(null);

    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID
      );
      setProjects(response.documents);
      setStatus("success");
    } catch (err) {
      const errorMessage = err.message || "Failed to load projects";
      setError(errorMessage);
      setStatus("error");
      toast.error(errorMessage);
      console.error("Error fetching projects:", err);
    }
  }

  // Fetch projects on component mount
  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-[var(--bg-main)] w-full">
      {/* Navigation Bar */}
      <nav className="relative z-30 bg-[var(--bg-card)] border-b border-[var(--border-light)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/logo.svg" alt="Logo" className="h-7 w-7" />
              <p className="text-lg font-bold">Projects Portfolio</p>
            </div>
            <div className="flex items-center gap-4">
              {user && (
                <>
                  <Link
                    to="/profile"
                    className="btn btn-secondary btn-sm flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">{user.name}</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Tiles Background */}
      <section className="relative w-full min-h-[600px] sm:min-h-[700px] flex flex-col items-center justify-center overflow-hidden text-center">
        {/* Tiles Background */}
        <div className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden">
          <Tiles rows={60} cols={20} tileSize="sm" className="sm:hidden" />
          <Tiles rows={100} cols={25} tileSize="md" className="hidden sm:flex" />
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--bg-main)]/50 to-[var(--bg-main)] pointer-events-none z-10" />
        
        {/* Hero Content */}
        <div className="flex relative justify-center z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl  text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[var(--bg-card)] border border-[var(--border-light)] mb-6 sm:mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-[var(--accent-pink)] animate-pulse" />
              <span className="text-xs sm:text-sm font-medium text-[var(--text-secondary)]">
                New: Appwrite v1.6 Integration
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight"
            >
              My Projects{" "}
              <span className="text-[var(--text-secondary)]">Portfolio</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-base sm:text-lg md:text-xl text-[var(--text-secondary)] mb-8 sm:mb-10 max-w-2xl mx-auto"
            >
              Explore my collection of web applications, tools, and creative projects built with modern technologies.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center"
            >
              <button
                onClick={fetchProjects}
                disabled={status === "loading"}
                className="btn btn-primary btn-responsive btn-rounded w-full sm:w-auto"
              >
                {status === "loading" ? (
                  <>
                    <span className="spinner spinner-white" />
                    Loading...
                  </>
                ) : (
                  <>
                    View Projects
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
              
              <button className="btn btn-secondary btn-responsive btn-rounded w-full sm:w-auto">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact Me
              </button>
            </motion.div>

            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 flex items-center justify-center gap-2 text-sm text-[var(--text-tertiary)]"
            >
              <svg className="w-4 h-4 text-[var(--accent-pink)]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Powered by Appwrite
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="w-full px-4 sm:px-6 py-8 sm:py-12 md:py-16 flex justify-center items-center relative z-10"
      >
        <div className="w-full max-w-6xl">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">Featured Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* myDrive Project Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="card hover:shadow-2xl transition-shadow cursor-pointer"
              onClick={() => navigate("/projects/mydrive")}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <HardDrive className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">myDrive</h3>
                  <p className="text-xs text-[var(--text-secondary)]">Cloud Storage</p>
                </div>
              </div>
              <p className="text-sm text-[var(--text-secondary)] mb-4">
                Personal cloud storage powered by Appwrite. Upload, manage, and share your files securely.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="badge badge-primary text-xs">React</span>
                <span className="badge badge-primary text-xs">Appwrite</span>
                <span className="badge badge-primary text-xs">Storage</span>
              </div>
              <button className="btn btn-primary btn-sm w-full">
                Open myDrive
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Projects Section */}
      {status === "success" && projects.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full px-4 sm:px-6 py-8 sm:py-12 md:py-16 flex justify-center items-center relative z-10"
        >
          <div className="w-full max-w-6xl">
            <div className="card">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <h2 className="text-xl sm:text-2xl font-bold">My Projects</h2>
                  <span className="badge badge-success text-xs sm:text-sm">{projects.length} projects</span>
                </div>
              </div>
            
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="whitespace-nowrap">S.No</th>
                      <th className="whitespace-nowrap">Project Name</th>
                      <th className="whitespace-nowrap hidden md:table-cell">Description</th>
                      <th className="whitespace-nowrap">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project, index) => (
                      <motion.tr
                        key={project.$id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <td className="font-mono text-xs sm:text-sm whitespace-nowrap">
                          {index + 1}
                        </td>
                        <td className="font-semibold text-sm sm:text-base">
                          {project.name || "Untitled Project"}
                        </td>
                        <td className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-xs truncate hidden md:table-cell">
                          {project.description || "No description available"}
                        </td>
                        <td>
                          <a
                            href={project.url || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-pink"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View
                          </a>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            </div>
          </div>
        </motion.section>
      )}

      {/* Error State */}
      {status === "error" && (
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full px-4 sm:px-6 py-8 sm:py-12 md:py-16 flex justify-center items-center relative z-10"
        >
          <div className="w-full max-w-2xl">
            <div className="card text-center">
              <div className="mb-4">
                <svg className="w-16 h-16 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Failed to Load Projects</h3>
              <p className="text-[var(--text-secondary)] mb-4">{error}</p>
              <button
                onClick={fetchProjects}
                className="btn btn-primary btn-rounded"
              >
                Try Again
              </button>
            </div>
          </div>
        </motion.section>
      )}

      {/* Empty State */}
      {status === "success" && projects.length === 0 && (
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full px-4 sm:px-6 py-8 sm:py-12 md:py-16 flex justify-center items-center relative z-10"
        >
          <div className="w-full max-w-2xl">
            <div className="card text-center">
              <div className="mb-4">
                <svg className="w-16 h-16 mx-auto text-[var(--text-tertiary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">No Projects Found</h3>
              <p className="text-[var(--text-secondary)]">Start by adding projects to your Appwrite database.</p>
            </div>
          </div>
        </motion.section>
      )}
    </div>
  );
}

export default App;
