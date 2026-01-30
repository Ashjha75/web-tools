import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import "./App.css";
import { client } from "./lib/appwrite";
import { AppwriteException } from "appwrite";
import AppwriteSvg from "/appwrite.svg";
import ReactSvg from "/react.svg";
import ThemeSwitcher from "./components/ThemeSwitcher";

function App() {
  const [detailHeight, setDetailHeight] = useState(55);
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState("idle");
  const [showLogs, setShowLogs] = useState(false);

  const detailsRef = useRef(null);

  const updateHeight = useCallback(() => {
    if (detailsRef.current) {
      setDetailHeight(detailsRef.current.clientHeight);
    }
  }, [logs, showLogs]);

  useEffect(() => {
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [updateHeight]);

  // Automatically ping the Appwrite server on app load to verify setup
  useEffect(() => {
    client.ping().catch((error) => {
      console.error("Failed to ping Appwrite server:", error);
    });
  }, []);

  useEffect(() => {
    if (!detailsRef.current) return;
    detailsRef.current.addEventListener("toggle", updateHeight);

    return () => {
      if (!detailsRef.current) return;
      detailsRef.current.removeEventListener("toggle", updateHeight);
    };
  }, []);

  async function sendPing() {
    if (status === "loading") return;
    setStatus("loading");
    try {
      const result = await client.ping();
      const log = {
        date: new Date(),
        method: "GET",
        path: "/v1/ping",
        status: 200,
        response: JSON.stringify(result),
      };
      setLogs((prevLogs) => [log, ...prevLogs]);
      setStatus("success");
    } catch (err) {
      const log = {
        date: new Date(),
        method: "GET",
        path: "/v1/ping",
        status: err instanceof AppwriteException ? err.code : 500,
        response:
          err instanceof AppwriteException
            ? err.message
            : "Something went wrong",
      };
      setLogs((prevLogs) => [log, ...prevLogs]);
      setStatus("error");
    }
    setShowLogs(true);
  }

  return (
    <main
      className="checker-background relative flex flex-col items-center min-h-screen py-12 px-4"
      style={{ marginBottom: `${detailHeight}px` }}
    >
      <ThemeSwitcher />
      
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl w-full mx-auto text-center mb-16 relative z-10"
      >
        <div className="flex justify-center items-center gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-xl">
              <img
                alt="React logo"
                src={ReactSvg}
                className="h-16 w-16 transition-transform duration-300 group-hover:rotate-180"
                width={64}
                height={64}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: status === "success" ? 1 : 0, scale: status === "success" ? 1 : 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-3"
          >
            <div className="h-[2px] w-12 bg-gradient-to-r from-pink-500 to-transparent"></div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="h-[2px] w-12 bg-gradient-to-l from-pink-500 to-transparent"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-pink-600 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-xl">
              <img
                alt="Appwrite logo"
                src={AppwriteSvg}
                className="h-16 w-16 transition-transform duration-300 group-hover:rotate-180"
                width={64}
                height={64}
              />
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {status === "loading" ? (
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-700 border-t-pink-600 rounded-full animate-spin"></div>
              </div>
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                Connecting to Appwrite...
              </p>
            </div>
          ) : status === "success" ? (
            <>
              <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Connection Successful! 🎉
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Your React app is now connected to Appwrite
              </p>
            </>
          ) : (
            <>
              <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Check Your Connection
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                Send a ping to verify the Appwrite backend connection
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={sendPing}
                className="cal-btn cal-btn-primary text-base px-8 py-3"
              >
                Send a Ping
              </motion.button>
            </>
          )}
        </motion.div>
      </motion.div>

      {/* Feature Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full mx-auto mb-12 relative z-10"
      >
        <div className="cal-card group">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Edit Your App
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Edit <code className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-pink-600 dark:text-pink-400 font-mono text-xs">src/App.jsx</code> to start building your application with React and Appwrite.
              </p>
            </div>
          </div>
        </div>

        <a
          href="https://cloud.appwrite.io"
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <div className="cal-card group h-full">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Go to Console
                  </h3>
                  <svg className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  Navigate to the Appwrite console to manage your databases, authentication, and storage.
                </p>
              </div>
            </div>
          </div>
        </a>

        <a
          href="https://appwrite.io/docs"
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <div className="cal-card group h-full">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Explore Docs
                  </h3>
                  <svg className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  Discover the full power of Appwrite by diving into our comprehensive documentation.
                </p>
              </div>
            </div>
          </div>
        </a>
      </motion.div>

      {/* Logs Panel */}
      <aside className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-2xl backdrop-blur-lg">
        <details open={showLogs} ref={detailsRef} className="w-full">
          <summary className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="font-semibold text-gray-900 dark:text-white">Activity Logs</span>
              {logs.length > 0 && (
                <span className="cal-badge cal-badge-neutral animate-scaleIn">
                  {logs.length}
                </span>
              )}
            </div>
            <svg className="w-5 h-5 text-gray-400 transform transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </summary>

          <div className="border-t border-gray-200 dark:border-gray-800">
            <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr]">
              {/* Project Info Sidebar */}
              <div className="border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-800">
                  <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Project Configuration
                  </h4>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1">
                      Endpoint
                    </label>
                    <p className="text-sm font-mono text-gray-900 dark:text-white break-all">
                      http://localhost/v1
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1">
                      Project ID
                    </label>
                    <p className="text-sm font-mono text-gray-900 dark:text-white">
                      web-tools
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1">
                      Project Name
                    </label>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      Web Tools
                    </p>
                  </div>
                </div>
              </div>

              {/* Logs Table */}
              <div className="overflow-auto max-h-80">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-900/50 sticky top-0">
                    <tr className="border-b border-gray-200 dark:border-gray-800">
                      {logs.length > 0 ? (
                        <>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Timestamp
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Method
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                            Path
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden xl:table-cell">
                            Response
                          </th>
                        </>
                      ) : (
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          No Activity Yet
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                    {logs.length > 0 ? (
                      logs.map((log, index) => (
                        <motion.tr
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600 dark:text-gray-400">
                            {log.date.toLocaleString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            {log.status >= 400 ? (
                              <span className="cal-badge cal-badge-error">
                                {log.status}
                              </span>
                            ) : (
                              <span className="cal-badge cal-badge-success">
                                {log.status}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {log.method}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-600 dark:text-gray-400 hidden lg:table-cell">
                            {log.path}
                          </td>
                          <td className="px-4 py-4 text-sm font-mono text-gray-600 dark:text-gray-400 max-w-md truncate hidden xl:table-cell">
                            {log.response}
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400 italic">
                          No logs to display. Send a ping to see activity here.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </details>
      </aside>
    </main>
  );
}

export default App;
